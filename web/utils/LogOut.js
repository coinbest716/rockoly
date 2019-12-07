import Router from 'next/router';
import { toastMessage, renderError, error } from './Toast';
import { StoreInLocal } from './LocalStorage';
import { firebase } from '../config/firebaseConfig';

// log out function
export const logOutUser = () => {
  try {
    return new Promise(function(resolve, reject) {
      firebase
        .auth()
        .signOut()
        .then(async () => {
          await localStorage.clear();
          await StoreInLocal('chef_loggedIn', false);
          await StoreInLocal('selected_menu', 'home_page');
          await Router.push('/');
          resolve(true);
        })
        .catch(err => {
          toastMessage(error, err.message);
          resolve(false);
        });
    });
  } catch (err) {
    toastMessage(renderError, err.message);
    resolve(false);
  }
};
