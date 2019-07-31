export function getNewsData() {
    return(dispatch) =>{
        return fetch('https://mighty-dawn-74394.herokuapp.com/live')
            .then(response => response.json())
            .then(articles => {
                dispatch(updateNewsData(articles));
            }).catch(error => console.log(error)
        );
    }
}

export function updateNewsData(data) {
    return {
        type: 'UPDATE_NEWS_ARTICLES',
        articles: data
    }
}