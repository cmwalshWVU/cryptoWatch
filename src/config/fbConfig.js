import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

var firebaseConfig = {
    apiKey: "AIzaSyCSeuITZaO0J9X_tynA1Ja5jgDFZYlmfC0",
    authDomain: "crypto-watch-dbf71.firebaseapp.com",
    databaseURL: "https://crypto-watch-dbf71.firebaseio.com",
    projectId: "crypto-watch-dbf71",
    storageBucket: "crypto-watch-dbf71.appspot.com",
    messagingSenderId: "671907255969",
    appId: "1:671907255969:web:8c860d75a176bb10"
  };

firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase;