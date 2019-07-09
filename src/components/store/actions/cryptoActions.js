import axios from 'axios';

export function getCurrentData() {
    return(dispatch) =>{
        return axios.get("https://api.coinmarketcap.com/v1/ticker/?limit=20")
        .then(response => {
            var wanted = ["bitcoin", "ethereum", "litecoin", "ripple", "neo", "eos", "stellar"];
            var result = response.data.filter(currency => wanted.includes(currency.id));
            dispatch(updateTickerData(result));
        })
        .catch(err => console.log(err));
    }
}

export function updateTickerData(data) {
    return {
        type: 'UPDATE_TICKERS',
        data: data
    }
}