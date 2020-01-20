
export const updateCoinbaseHolding = (holding) => {
    return(dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const authorId = getState().firebase.auth.uid;

        firestore.collection('cbHoldings').doc(authorId).collection('cbHoldings').doc(holding.currency).set({ holding }).then(() => {
            dispatch({ 
                type: 'CB_HOLDING_UPDATED', 
                holding: holding.amount});
        }).catch((err) => {
            dispatch({ type: 'CB_HOLDING_UPDATE_FAILED', err });
        })
    }
}

