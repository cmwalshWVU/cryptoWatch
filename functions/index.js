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

            if (doc.data()) {
                var newHoldings = Number(doc.data().dollarHoldings) + (isBuy * Number(record.dollarAmount));
                newHoldings = (newHoldings >= 0) ? newHoldings : 0;
                console.log('Updating holdings document for  ' + record.coin);
                console.log('coin ', doc.data().coin);
                console.log('Old Amount ', doc.data().dollarHoldings);
                console.log('New Amount ', newHoldings);
                admin.firestore().collection('holdings').doc(context.params.userId).collection('holdings').doc(record.coin).update({
                    dollarHoldings: newHoldings,
                    lastUpdated: new Date()

                  });
            }
            else {
                console.log('No holdings document exists for ' + record.coin + ' creating new doc');
                var holdings = (Number((record.dollarAmount) * isBuy) <= 0 ? 0 : Number(record.dollarAmount));
                admin.firestore().collection('holdings').doc(context.params.userId).collection('holdings').doc(record.coin).set({
                    coin: record.coin,
                    dollarHoldings: holdings,
                    lastUpdated: new Date()
                  });
            }
        }).catch(reason => {
            console.log('error ', reason)
        });

        const type = record.isPurchase;
        const purchase = (type == "on" ? "Purchase of" : "Sale of");
        const notification = {
            content:`${record.coin} at  $${record.dollarAmount}`,
            user: purchase,
            time: admin.firestore.FieldValue.serverTimestamp()

        };
        
    return createNotification(notification);     
});

