import Router from 'next/router';
import { toastMessage, renderError, error } from './Toast';
import { StoreInLocal } from './LocalStorage';
import { firebase } from '../config/firebaseConfig';

// log out function
export const logOutUser = name => {
  try {
    return new Promise(function(resolve, reject) {
      firebase
        .auth()
        .signOut()
        .then(async () => {
          if(name == 'intialAdmin'){
             localStorage.removeItem("user_role");
            //  localStorage.removeItem("current_user_token");
             localStorage.removeItem("selected_menu");
             localStorage.removeItem("user_ids");
             localStorage.removeItem("SharedProfileScreens");

            await StoreInLocal('chef_loggedIn', false);
            await StoreInLocal('selected_menu', 'home_page');
            resolve(true);

          }else{
            let bookingId = localStorage.getItem('bookingId');
            await localStorage.clear();
            await StoreInLocal('bookingId', bookingId);
            await StoreInLocal('chef_loggedIn', false);
            await StoreInLocal('selected_menu', 'home_page');
            if (name && name !== 'intialAdmin') {
              await Router.push('/');
            }
            if (name === 'shared-profile') {
              await Router.push('/');
              toastMessage('success', 'Logged out Successfully');
            }
            resolve(true);
          }
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
