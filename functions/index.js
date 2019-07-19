const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

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

