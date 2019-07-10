const initData = [
        {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "BTC",
            price_usd: "1",
            percent_change_1h: "0",
            percent_change_24h: "0",
            percent_change_7d: "0",
        }
    ]


const cryptoReducer = ( state = initData, action ) => {
    switch (action.type) {
        case 'UPDATE_TICKERS':
            return {
                ...state,
                tickerData: action.data
            }
        default:
            return {
                ...state
            }
    }
}

export default cryptoReducer;