const initState = {
    authError: null,
    authSuccess: null,
    coinbaseAuth: false
};

const authReducer = ( state = initState, action ) => {
    switch (action.type) {
        case 'LOGIN_ERROR':
            console.log('Authentication Error', action.err);
            return {
                ...state,
                authError: 'Login Failed',
                authSuccess: false
            }
        case 'COINBASE_LOGIN_ERROR':
            console.log('Authentication Error', action.err);
            return {
                ...state,
            }
        case 'LOGIN_SUCCESS':
            console.log('Auth Success');
            return {
                ...state,
                authError: null,
                authSuccess: true
            }
        case 'COINBASE_LOGIN_SUCCESS':
            console.log('Coinbase Auth Success');
            return {
                ...state,
                token: action.token,
                authError: null,
                authSuccess: true,
                coinbaseAuth: true
            }
        case 'SIGNOUT_SUCCESS':
            console.log('Signout Success');
            return state;
        case 'SIGNUP_SUCCESS':
            console.log('Signup Success');
            return {
                ...state,
                authError: null
            }
        case 'SIGNUP_ERROR':
            console.log('Signup Error');
            return {
                ...state,
                authError: action.err.message
            }
        default:
            return state;
    }
}

export default authReducer;