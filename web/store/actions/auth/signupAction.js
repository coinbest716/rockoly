import {
  SIGNUP,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
} from '../types';
import { toastMessage } from '../../../utils/Toast';
import { firebase } from '../../../config/firebaseConfig';

export const signupUser = (email, password) => dispatch => {
  dispatch({ type: SIGNUP });
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(user => {
      firebase
        .auth()
        .currentUser.getIdToken()
        .then(responseToken => {
          const currentUser = firebase.auth().currentUser;
          if (currentUser != null) {
            signupUserSuccess(dispatch, user);
          } else {
            signupUserFail(dispatch, user);
          }
        });
    })
    .catch(error => {
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
      signupUserFail(dispatch, error);
    });
};

const signupUserSuccess = (dispatch, user) => {
  dispatch({ type: SIGNUP_SUCCESS, payload: user });
};

const signupUserFail = (dispatch, user) => {
  dispatch({ type: SIGNUP_FAIL, payload: user });
};

export const forgotPassword = email => dispatch => {
  dispatch({ type: FORGOT_PASSWORD });
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(user => {
      forgotPasswordSuccess(dispatch, user);
    })
    .catch(error => {
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
      forgotPasswordFail(dispatch, error);
    });
};

const forgotPasswordSuccess = (dispatch, user) => {
  dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: user });
};

const forgotPasswordFail = (dispatch, user) => {
  dispatch({ type: FORGOT_PASSWORD_FAIL, payload: user });
};
