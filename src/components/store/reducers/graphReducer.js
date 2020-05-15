const initData = [
    {
        open: false,
        ticker: undefined
    }
]

const graphReducer = ( state = initData, action ) => {
    switch (action.type) {
        case 'UPDATE_GRAPH':
            return {
                ...state,
                [action.ticker]: action.data
            }
        case 'SET_GRAPH_MODAL':
            return {
                ...state,
                ticker: action.ticker,
                open: action.open
            }
        default:
            return {
                ...state
            }
    }
}

export default graphReducer;