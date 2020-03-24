import axios from 'axios';

export function getCurrentPrices2() {
    return(dispatch) =>{
        return axios.get('https://mighty-dawn-74394.herokuapp.com/top')
            .then(response => {
                dispatch(updateCurrentPrices(response.data.data));
            }).catch(error => console.log(error)
            );
        // return axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=5b82bdf3-bf6d-4153-855b-635c1519b7a8")
        //     .then(response => {
        //         dispatch(updateCurrentPrices(response.data));
        //     })
        //     .catch(err => console.log(err));
    }
}

export function updateCurrentPrices(prices) {
    return {
        type: 'UPDATE_CURRENT_PRICES',
        prices: prices
    }
}

export const getCurrentPrices = () => {
    return(dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
       
        let top20 = firestore.collection('top').doc('top20')

        let top20Doc = top20.get()
            .then(doc => {
                if (!doc.exists) {
                    return axios.get('https://mighty-dawn-74394.herokuapp.com/top')
                        .then(response => {
                            dispatch(updateCurrentPrices(response.data.data));
                        }).catch(error => console.log(error)
                    );
                } else {
                    const data = doc.data().top20
                    dispatch(updateCurrentPrices(data));
                    // dispatch({ type: 'GET_TOP_CRYPTOS_SUCCESS', data});
                }
            })
            .catch(err => {
                console.log(err)
                return axios.get('https://mighty-dawn-74394.herokuapp.com/top')
                    .then(response => {
                        dispatch(updateCurrentPrices(response.data.data));
                    }).catch(error => console.log(error)
            );            
        });
    }
}