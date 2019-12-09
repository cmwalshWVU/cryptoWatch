import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA5yLc27B1PKMYaCgWbj0NgvdUELWts4nQ",
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