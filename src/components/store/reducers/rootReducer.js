import authReducer from './authReducer';
import cryptoReducer from './cryptoReducer';
import CurrentPriceReducer from './CurrentPriceReducer';
import graphReducer from './graphReducer';
import newsReducer from './newsReducer';
import projectReducer from './projectReducer';
import transactionReducer from './transactionReducer';
import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';
import coinbaseReducer from './coinbaseReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    coinbase: coinbaseReducer,
    crypto: cryptoReducer,
    currentPrices: CurrentPriceReducer,
    graph: graphReducer,
    news: newsReducer,
    project: projectReducer,
    transaction: transactionReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer
});

export default rootReducer;