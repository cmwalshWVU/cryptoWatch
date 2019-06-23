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
        const record = rec.data();
        const type = record.isPurchase;
        const purchase = (type == "on" ? "Purchase of" : "Sale of");
        const notification = {
            content:`${record.coin} at  $${record.dollarAmount}`,
            user: purchase,
            time: admin.firestore.FieldValue.serverTimestamp()

        };
    return createNotification(notification);
        
});
