import React, { useContext,useEffect,useState } from 'react';
import NotificationList from './components/NotificationList';
import Page from '../shared/layout/Main';
import { toastMessage } from '../../utils/Toast';
import {Appcontext} from '../../context/appContext';
import {
  getChefId,
  getCustomerId,
  chefId,
  chef,
  customer,
  getUserTypeRole,
  customerId,
} from '../../utils/UserType';

 const NotificationScreen = () =>{
  
    try {
      return (
        <React.Fragment>
          <Page>
            <div className="notification">
              <section className="cart-area ptb-60">
                <div className="cart-totals">
                  <NotificationList />
                </div>
              </section>
            </div>
          </Page>
        </React.Fragment>
      );
    } catch (error) {
      const errorMessage = error.message;
      toastMessage('renderError', errorMessage);
    }
}

export default NotificationScreen;
