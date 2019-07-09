const initData = [
        {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "BTC",
            price_usd: "1",
            percent_change_1h: "0",
            percent_change_24h: "0",
            percent_change_7d: "0",
        },
        {
            id: "ethereum",
            name: "Ethereum",
            symbol: "ETH",
            price_usd: "1",
            percent_change_1h: "0",
            percent_change_24h: "0",
            percent_change_7d: "0",
        },
        {
            id: "litecoin",
            name: "Litecoin",
            symbol: "LTC",
            price_usd: "1",
            percent_change_1h: "0",
            percent_change_24h: "0",
            percent_change_7d: "0",
        },
        {
            id: "ripple",
            name: "Ripple",
            symbol: "XRP",
            price_usd: "1",
            percent_change_1h: "0",
            percent_change_24h: "0",
            percent_change_7d: "0",
        },
        {
            id: "neo",
            name: "NEO",
            symbol: "NEO",
            price_usd: "1",
            percent_change_1h: "0",
            percent_change_2hh: "0",
            percent_change_7d: "0",
        },
        {
            id: "bitcoin-cash",
            name: "Bitcoin Cash",
            symbol: "BCH",
            price_usd: "1",
            percent_change_1h: "0",
            percent_change_24h: "0",
            percent_change_7d: "0",
        },
        {
            id: "eos",
            name: "EOS",
            symbol: "EOS",
            price_usd: "1",
            percent_change_1h: "0",
            percent_change_24h: "0",
            percent_change_7d: "0",
        },
        {
            id: "stellar",
            name: "Stellar",
            symbol: "XLM",
            price_usd: "1",
            percent_change_1h: "0",
            percent_change_24h: "0",
            percent_change_7d: "0",
        },
        {
            id: "tether",
            name: "Tether",
            symbol: "USDT",
            price_usd: "1",
            percent_change_1h: "0",
            percent_change_24h: "0",
            percent_change_7d: "0",
        },
        {
            id: "cardano",
            name: "Cardano",
            symbol: "ADA",
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