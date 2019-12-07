import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOG_OUT_USER,
  LOG_OUT_USER_SUCCESS,
  LOG_OUR_USER_FAIL,
} from '../types';
import { toastMessage } from '../../../utils/Toast';
import { firebase } from '../../../config/firebaseConfig';

export const loginUser = (email, password) => dispatch => {
  dispatch({ type: LOGIN_USER });
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      // console.log('loginnnn action', user);
      firebase
        .auth()
        .currentUser.getIdToken()
        .then(responseToken => {
          const currentUser = firebase.auth().currentUser;
          // console.log('currentUser', firebase, currentUser, responseToken);
          if (currentUser != null) {
            loginUserSuccess(dispatch, user);
          } else {
            loginUserFail(dispatch, user);
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
      loginUserFail(dispatch, error);
    });
};

const loginUserSuccess = (dispatch, user) => {
  dispatch({ type: LOGIN_USER_SUCCESS, payload: user });
};

const loginUserFail = (dispatch, user) => {
  dispatch({ type: LOGIN_USER_FAIL, payload: user });
};

export const LogoutUser = () => dispatch => {
  dispatch({ type: LOG_OUT_USER });
  firebase
    .auth()
    .signOut()
    .then(async () => {
      await localStorage
        .multiRemove(['user_ids', 'selected_menu'])
        .then(() => {
          logoutUserSuccess(dispatch);
        })
        .catch(error => {
          loginoutUserFail(dispatch, error);
        });
    })
    .catch(error => {
      loginoutUserFail(dispatch, error);
    });
};

const logoutUserSuccess = dispatch => {
  dispatch({ type: LOG_OUT_USER_SUCCESS });
};

const loginoutUserFail = (dispatch, error) => {
  dispatch({ type: LOG_OUR_USER_FAIL, payload: error });
};
