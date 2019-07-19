import axios from 'axios';

export const recordTransaction = (transaction) => {
    return(dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const authorId = getState().firebase.auth.uid;
        if (transaction.dollarAmount != undefined) {
            axios.get("https://api.coinmarketcap.com/v1/ticker/?limit=100")
                .then(response => {
                    var currentPrice = response.data.filter(currency => transaction.coin === currency.symbol.toUpperCase())[0].price_usd;
                    console.log(currentPrice);

                    var numCoins = Number(transaction.dollarAmount) / Number(currentPrice);
                    transaction.numberOfCoins = numCoins;
            
                    firestore.collection('transactions').doc(authorId).collection('transactions').add({
                        ...transaction,
                        purchaseDate: new Date()
                    }).then(() => {
                        dispatch({ type: 'CREATE_TRANSACTION', transaction});
                    }).catch((err) => {
                        dispatch({ type: 'CREATE_TRANSACTION_ERROR', err });
                    })
                }).catch(err => console.log(err));
        }
        else {
            firestore.collection('transactions').doc(authorId).collection('transactions').add({
                ...transaction,
                purchaseDate: new Date()
            }).then(() => {
                dispatch({ type: 'CREATE_TRANSACTION', transaction});
            }).catch((err) => {
                dispatch({ type: 'CREATE_TRANSACTION_ERROR', err });
            })
        }
    }
}