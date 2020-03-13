import axios from 'axios';

export function getCurrentData() {
    return(dispatch) =>{
        return axios.get('https://mighty-dawn-74394.herokuapp.com/top')
            .then(response => {
                var wanted = ["bitcoin", "ethereum", "litecoin", "ripple", "neo", "eos", "stellar"];
                var result = response.data.filter(currency => wanted.includes(currency.id));
                dispatch(updateTickerData(result));
            }).catch(error => console.log(error)
        );
        // return axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=5b82bdf3-bf6d-4153-855b-635c1519b7a8")
        //     .then(response => {
        //         var wanted = ["bitcoin", "ethereum", "litecoin", "ripple", "neo", "eos", "stellar"];
        //         var result = response.data.filter(currency => wanted.includes(currency.id));
        //         dispatch(updateTickerData(result));
        //     })
        //     .catch(err => console.log(err));
    }
}

export function updateTickerData(data) {
    return {
        type: 'UPDATE_TICKERS',
        data: data
    }
}