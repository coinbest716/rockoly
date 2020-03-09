import { firebase } from '../config/firebaseConfig';
import { toastMessage, renderError } from './Toast';

// Check current user login or exist
export const currentUserCheck = () => {
  try {
    return new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user && user !== undefined && user !== null) {
          // User is signed in.
          // let currentUser = firebase.auth().currentUser;
          resolve(true);
        } else {
          // No user is signed in.
          resolve(false);
        }
      });
    });
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};
