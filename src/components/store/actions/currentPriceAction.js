import axios from 'axios';

export function getCurrentPrices() {
    return(dispatch) =>{
        return axios.get("https://api.coinmarketcap.com/v1/ticker/?limit=100")
            .then(response => {
                dispatch(updateCurrentPrices(response.data));
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