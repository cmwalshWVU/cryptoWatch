const crypto = require('crypto');
const axios = require('axios');
const cors = require('cors')({origin: true});
const qs  = require('querystring');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');


// admin.initializeApp(functions.config().firebase);

var serviceAccount = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://crypto-watch-dbf71.firebaseio.com"
  });

var FIREBASE_CONFIG = {
    credential: admin.credential.cert(serviceAccount),
    apiKey: "AIzaSyCSeuITZaO0J9X_tynA1Ja5jgDFZYlmfC0",
    authDomain: "crypto-watch-dbf71.firebaseapp.com",
    databaseURL: "https://crypto-watch-dbf71.firebaseio.com",
    projectId: "crypto-watch-dbf71",
    storageBucket: "crypto-watch-dbf71.appspot.com",
    messagingSenderId: "671907255969",
    appId: "1:671907255969:web:8c860d75a176bb10",
  };

firebase.initializeApp(FIREBASE_CONFIG);

const client_secret = "5c819ede9a48742de02964660dc0838e0ce1f4db0b260b7a066c9d6b5cedd8a5";
const client_id = "86e70b8b6417cb50024d2ced2fe2e6ca16293527e14004432bf508776fa535a3";
const redirect_uri = "https://5d897b2193b4b30007a6c919--unruffled-knuth-55967d.netlify.com/redireect";

const defaultParams = { 
    client_id, 
    client_secret,
    redirect_uri
}

// Coinbase redirect
exports.redirect = functions.https.onRequest((req, res) => {
    const base = 'https://www.coinbase.com/oauth/authorize?';

    const queryParams = { 
        ...defaultParams,
        response_type: 'code',
        scope: 'wallet:accounts:read'
    }
    const endpoint = base + qs.stringify( queryParams )
    console.log('Attempting to redirect to ');
    res.redirect(endpoint);  
});

// get coinbase auth token
exports.token = functions.https.onRequest((req, res) => {
    cors( req, res, () => { 
        console.log('calling token');
        console.log("req: " + req.body.code)
        return mintAuthToken(req)
                .then(authToken => {
                    console.log('AuthToken: ' + authToken);
                    res.json({ authToken });

                })
                .catch(err => console.log(err))

    });
});

// presist auth token
async function mintAuthToken(req) {
    const base = 'https://api.coinbase.com/oauth/token?'
    console.log('calling mint token');
    // console.log("req: " + qs.stringify(req))
    const queryParams = { 
        ...defaultParams,
        grant_type: 'authorization_code',
        code: req.body.code
    }

    const endpoint = base + qs.stringify( queryParams )
    
    console.log('calling login to URL: ' + endpoint);
    const login        = await axios.post(endpoint);
    const accessToken  = login.data.access_token
    const refreshToken = login.data.refresh_token
    
    console.log('calling get user');
    const user      = await getCoinbaseUser(accessToken)
    const uid       = 'coinbase:' + user.id

    console.log('creating custom token for user ID: ' + user.id);
    const authToken = await admin.auth().createCustomToken(uid).then(
        console.log("create sucess")
    ).catch(function(error) {
        console.log('Error creating custom token:', error);
      });;

    console.log(`putting token in db for UID: ${uid}` );
    await admin.firestore().collection('coinbase').doc(`${uid}`).set({ accessToken, refreshToken })
    // await admin.database().ref(`coinbaseTokens/${uid}`).update({ accessToken, refreshToken })
    
    return authToken
}

// Retrieve the user account data from Coinbase
async function getCoinbaseUser(accessToken) {
    const userUrl = 'https://api.coinbase.com/v2/user';
    console.log("accessToken: " + accessToken);

    const user = await axios.get(userUrl, { headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' } });
    console.log('found user');

    return user.data.data
}

// get coinbase users wallet
exports.wallet = functions.https.onRequest((req, res) => {
    cors( req, res, () => { 

        return getWallet(req)
                .then(wallets => res.json(wallets))
                .catch(err => console.log(err))

    });
});


// Get the user's wallet data from Coinbase
async function getWallet(req) {
    const endpoint = 'https://api.coinbase.com/v2/accounts';

    const uid          = await verifyUser(req)

    const accessToken  = await updateTokens(uid) 
    console.log(`getting accounts: ${accessToken}`)

    const accounts     = await axios.get(endpoint, { headers: { 'Authorization': `Bearer ${accessToken}` } })
    console.log(`got accounts: ${accounts.data.data}`)

    return accounts.data.data
}

// Validate the Firebase auth header to authenticate the user
async function verifyUser(req) {
    let authToken = req.headers.authorization;
    authToken = authToken.split('Bearer ')[1]
    console.log(`verifying user auth token: ${authToken}`)
    // console.log(`Wallet: Logging in with custom token ${authToken}`)

    // const userId = await firebase.auth().signInWithCustomToken(authToken).then(
    //     console.log("Wallet: Logged in")
    //     ).catch(function(error) {
    //         console.log('Error creating custom token:', error);
    //     });;

    const uid = await firebase.auth().signInWithCustomToken(authToken).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/invalid-custom-token') {
            console.error('The token you provided is not valid.');
        } else {
          console.error(error);
        }
      });
      const json = JSON.stringify(uid)
      console.log(`UID token signed in: ${json}`)

    const verifiedToken = await admin.auth().verifyIdToken(uid)
    console.log(`UID token verified: ${uid},  userId ${verifiedToken.uid}`)
    return verifiedToken.uid
}


// Used to update tokens for an authenticated user.
async function updateTokens(uid) {
    console.log(`Updating token for UID: ${uid}`)

    const base = 'https://api.coinbase.com/oauth/token?';

    const oldRefreshToken = await admin.database()
                                       .ref(`coinbaseTokens/${uid}`)
                                       .once('value')
                                       .then(data => data.val().refreshToken)
                                       
    const queryParams = { 
        ...defaultParams,
        refresh_token: oldRefreshToken,
        grant_type: 'refresh_token'
    }

    console.log(`got old refresh token ${oldRefreshToken}`)

    
    const endpoint = base + qs.stringify( queryParams ) 

    
    const response = await axios.post(endpoint)

    const accessToken  = response.data.access_token
    const refreshToken = response.data.refresh_token
    console.log(`got new token and updating: ${accessToken}`)

    await admin.firestore().collection('coinbase').doc(`${uid}`).set({ accessToken, refreshToken })
    console.log(`updated token: ${accessToken}`)

    return accessToken
}

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

const createNotification = (notification => {
    return admin.firestore().collection('notifications')
        .add(notification)
        .then(doc =>   console.log('notification added', doc));
})

const createHolding = ((holding, uid) => {
    return admin.firestore().collection('holdings').doc(uid).collection('holdings')
        .add(holding)
        .then(doc =>   console.log('holding added', doc));
})

const updateHolding = ((holding, uid) => {
    return admin.firestore().collection('holdings').doc(uid).collection('holdings').doc(holding.token)
        .update(holding)
        .then(doc =>   console.log('holding updated', doc));
})

exports.projectCreated = functions.firestore
    .document('projects/{projectId}')
    .onCreate(doc => {
        const project = doc.data();
        const notification = {
            content: 'Added a new project',
            user: `${project.authorFirstName} ${project.authorLastName}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        };
    return createNotification(notification);
        
});

exports.userJoined = functions.auth.user()
    .onCreate(user => {

    return admin.firestore().collection('users')
        .doc(user.uid).get().then(doc => {
            const newUser = doc.data();
            const notification = {
                content: 'Joined the Party',
                user: `${newUser.firstName} ${newUser.lastName}`,
                time: admin.firestore.FieldValue.serverTimestamp()
            };
        return createNotification(notification);
        });
});

exports.transactionRecorded = functions.firestore
    .document('transactions/{userId}/transactions/{transactionId}')
    .onCreate((rec, context) => {
        console.log('userID ', context.params.userId)
        const record = rec.data();
        admin.firestore().collection('holdings').doc(context.params.userId).collection('holdings').doc(record.coin).get().then(doc => {
            var isBuy = (record.isPurchase == "on" ? 1 : -1);

            if (doc.data() && record.dollarHoldings != undefined && record.numberOfCoins == undefined) {
                var newHoldings = Number(doc.data().dollarHoldings) + (isBuy * Number(record.dollarAmount));
                newHoldings = (newHoldings >= 0) ? newHoldings : 0;
                console.log('BLOCK 1');
                console.log('Updating holdings document for  ' + record.coin);
                console.log('coin ', doc.data().coin);
                console.log('Old Amount ', doc.data().dollarHoldings);
                console.log('New Amount ', newHoldings);
                admin.firestore().collection('holdings').doc(context.params.userId).collection('holdings').doc(record.coin).update({
                    dollarHoldings: newHoldings,
                    lastUpdated: new Date()
                  });
            }
            else if (doc.data() && record.numberOfCoins != undefined) {
                var newHoldings = Number(doc.data().numberOfCoins) + (isBuy * Number(record.numberOfCoins));
                newHoldings = (newHoldings >= 0) ? newHoldings : 0;
                console.log('BLOCK 2');
                console.log('Updating holdings document for  ' + record.coin);
                console.log('coin ', doc.data().coin);
                console.log('Old Amount ', doc.data().numberOfCoins);
                console.log('New Amount ', newHoldings);
                admin.firestore().collection('holdings').doc(context.params.userId).collection('holdings').doc(record.coin).update({
                    numberOfCoins: newHoldings,
                    lastUpdated: new Date()

                  });
            }
            else if (record.dollarHoldings != undefined) {
                console.log('BLOCK 3');

                console.log('No holdings document exists for ' + record.coin + ' creating new doc');
                var holdings = (Number((record.dollarAmount) * isBuy) <= 0 ? 0 : Number(record.dollarAmount));
                admin.firestore().collection('holdings').doc(context.params.userId).collection('holdings').doc(record.coin).set({
                    coin: record.coin,
                    dollarHoldings: holdings,
                    lastUpdated: new Date()
                  });
            }
            else if (record.numberOfCoins != undefined) {
                console.log('BLOCK 4');

                console.log('No holdings document exists for ' + record.coin + ' creating new doc');
                var holdings = (Number((record.numberOfCoins) * isBuy) <= 0 ? 0 : Number(record.numberOfCoins));
                console.log('New Amount ', holdings);

                admin.firestore().collection('holdings').doc(context.params.userId).collection('holdings').doc(record.coin).set({
                    coin: record.coin,
                    numberOfCoins: holdings,
                    lastUpdated: new Date()
                  });
            }
        }).catch(reason => {
            console.log('error ', reason)
        });

        const type = record.isPurchase;
        let purchase;
        let content;
        if (record.dollarAmount != undefined) {
            purchase = (type == "on" ? "Purchase of" : "Sale of");
            content = `${record.coin} at $${record.dollarAmount}`;
        }
        else {
            purchase = (type == "on" ? "Purchase:" : "Sale:");
            content = `${record.numberOfCoins} ${record.coin}`;
        }
        const notification = {
            content: content,
            user: purchase,
            time: admin.firestore.FieldValue.serverTimestamp()
        };
        return createNotification(notification); 
});

