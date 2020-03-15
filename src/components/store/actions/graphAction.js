import axios from 'axios';

export function getGraphData(ticker) {
    return(dispatch) =>{
        // return axios.get('https://min-api.cryptocompare.com/data/histominute?fsym=' + ticker + '&tsym=USD&limit=100&aggregate=15&e=CCCAGG')
        axios.get(`https://mighty-dawn-74394.herokuapp.com/history?ticker=${ticker}`)
            .then(response => {
                var prices = response.data;
                dispatch(updateGraphData(prices, ticker));
            })
            .catch(err => console.log(err));
    }
}

export function updateGraphData(data, ticker) {
    return {
        type: 'UPDATE_GRAPH',
        data: data,
        ticker: ticker
    }
}