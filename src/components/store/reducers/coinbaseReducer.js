const initState = {
    transactions: [
        {amount:'0', currency: 'BTC'},
        {amount:'0', currency: 'ETH'},
        {amount:'0', currency: 'LTC'}
    ]
};


const coinbaseReducer = ( state = initState, action ) => {
    switch (action.type) {
        case 'CB_HOLDING_UPDATED':
            console.log('updated cb holding', action.holding);
            return state;
        case 'CB_HOLDING_UPDATE_FAILED':
            console.log('Record Transaction Error', action.err);
            return state;
        default:
            return state;
    }
}

export default coinbaseReducer;