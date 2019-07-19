import axios from 'axios';

export function getCurrentPrices(tickers) {
    return(dispatch) =>{
        return axios.get("https://api.coinmarketcap.com/v1/ticker/?limit=100")
            .then(response => {
                var result = response.data.filter(currency => tickers.includes(currency.symbol.toUpperCase()));
                dispatch(updateCurrentPrices(result));
            })
            .catch(err => console.log(err));
    }
}

export function updateCurrentPrices(prices) {
    return {
        type: 'UPDATE_CURRENT_PRICES',
        prices: prices
    }
}