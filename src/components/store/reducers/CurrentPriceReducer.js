const initData = [
];

const currentPriceReducer = ( state = initData, action ) => {
switch (action.type) {
    case 'UPDATE_CURRENT_PRICES':
        return {
            ...state,
            currentPrices: action.prices
        }
    default:
        return {
            ...state
        }
    }
}

export default currentPriceReducer;