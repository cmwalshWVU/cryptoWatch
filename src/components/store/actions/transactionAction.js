
export const recordTransaction = (transaction) => {
    return(dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const authorId = getState().firebase.auth.uid;

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