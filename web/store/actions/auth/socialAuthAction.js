import { SOCIAL_AUTH_USER, SOCIAL_AUTH_USER_SUCCESS, SOCIAL_AUTH_USER_FAIL } from '../types';
import { toastMessage } from '../../../utils/Toast';
import { firebase } from '../../../config/firebaseConfig';

//Social login/signup
export const socialAuthUser = (data, type) => {
  return dispatch => {
    dispatch({ type: SOCIAL_AUTH_USER });
    let provider = '';
    let credential = '';
    if (type === 'facebook') {
      provider = firebase.auth.FacebookAuthProvider;
      // create a new firebase credential with the token
      credential = provider.credential(data.accessToken);
    } else if (type === 'google') {
      provider = new firebase.auth.GoogleAuthProvider();
      // create a new firebase credential with the token
      credential = provider.credential(data.tokenId, data.accessToken);
    }
    console.log('credentialcredential', credential);
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(async user => {
        console.log('loginnnn action', user);
        firebase
          .auth()
          .currentUser.getIdToken()
          .then(responseToken => {
            const currentUser = firebase.auth().currentUser;
            console.log('currentUser', firebase, currentUser, responseToken);
            if (currentUser != null) {
              socialAuthSuccess(dispatch, user);
            } else {
              socialAuthFail(dispatch, user);
            }
          });
      })
      .catch(error => {
        console.log('errorerrorerrorerror', error);
        const errorCode = error.code;
        const errorMessage = error.message;
        switch (errorCode) {
          case 'auth/invalid-email':
            // do something
            toastMessage('error', 'The email address is not valid');
            break;
          case 'auth/wrong-password':
            toastMessage('error', 'Wrong username or password');
            break;
          case 'auth/user-not-found':
            toastMessage('error', 'User not found');
            break;
          default:
            toastMessage('error', errorMessage);
          // handle other codes ...
        }
        socialAuthFail(dispatch, error);
      });
  };
};

const socialAuthSuccess = (dispatch, user) => {
  dispatch({ type: SOCIAL_AUTH_USER_SUCCESS, payload: user });
};

const socialAuthFail = (dispatch, user) => {
  dispatch({ type: SOCIAL_AUTH_USER_FAIL, payload: user });
};
