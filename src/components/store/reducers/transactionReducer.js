const initState = {
    transactions: [
        {id:'1', coin: 'title 1', dollarAmount: '1'},
        {id:'2', coin: 'title 2', dollarAmount: '2'},
        {id:'3', coin: 'title 3', dollarAmount: '3'}
    ]
};


const transactionReducer = ( state = initState, action ) => {
    switch (action.type) {
        case 'CREATE_TRANSACTION':
            console.log('recorded transaction', action.transaction);
            return state;
        case 'CREATE_TRANSACTION_ERROR':
            console.log('Record Transaction Error', action.err);
            return state;
        default:
            return state;
    }
}

export default transactionReducer;