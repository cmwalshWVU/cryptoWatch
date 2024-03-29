
export const forgotPassword = (credentials) => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        firebase.auth().sendPasswordResetEmail(
            credentials.email
        ).then(() => {
            dispatch({ type: 'PASSWORD_RESET_EMAIL_RESET_SENT'});
        }).catch((err) => {
            dispatch({ type: 'PASSWORD_RESET_EMAIL_RESET_ERROR', err });
        })
    }
}

export const signIn = (credentials) => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();

        firebase.auth().signInWithEmailAndPassword(
            credentials.email,
            credentials.password
        ).then(() => {
            dispatch({ type: 'LOGIN_SUCCESS'});
        }).catch((err) => {
            dispatch({ type: 'LOGIN_ERROR', err });
        })
    }
}


export const signInWithCustomToken = (token) => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        firebase.auth().signInWithCustomToken(token).then((response) => {
            const accessToken = JSON.parse(JSON.stringify(response.user)).stsTokenManager.accessToken
            dispatch({ type: 'COINBASE_LOGIN_SUCCESS', token: accessToken});
        }).catch((err) => {
            dispatch({ type: 'COINBASE_LOGIN_ERROR', err });
        })
    }
}


export const signOut = () => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();

        firebase.auth().signOut().then(() => {
            dispatch({ type: 'SIGNOUT_SUCCESS' });
        })
    }
}

export const signUp = ( newUser ) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        firebase.auth().createUserWithEmailAndPassword(
            newUser.email,
            newUser.password
        ).then((resp) => {
            return firestore.collection('users').doc(resp.user.uid).set({
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                initials: newUser.firstName[0] + newUser.lastName[0]
            })
        }).then(() => {
            dispatch({ type: 'SIGNUP_SUCCESS'});
        }).catch((err) => {
            dispatch({ type: 'SIGNUP_ERROR', err });
        })
    }
}