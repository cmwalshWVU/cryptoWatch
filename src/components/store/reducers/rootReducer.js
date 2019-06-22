import authReducer from './authReducer';
import projectReducer from './projectReducer';
import transactionReducer from './transactionReducer';
import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';

const rootReducer = combineReducers({
    auth: authReducer,
    project: projectReducer,
    transaction: transactionReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer
});

export default rootReducer;