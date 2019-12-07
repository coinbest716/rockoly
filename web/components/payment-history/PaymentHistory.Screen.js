import React, { useState, useEffect, useContext } from 'react';
import ChefHistoryList from './components/ChefPaymentHistoryList';
import CustomerHistoryList from './components/CustomerPaymentHistoryList';
import Page from '../shared/layout/Main';
import { toastMessage } from '../../utils/Toast';
import { chef } from '../../utils/UserType';
import { AppContext } from '../../context/appContext';
import * as util from '../../utils/checkEmptycondition';

const PaymentHistory = () => {
  const [state, setState] = useContext(AppContext);
  const [userRole, setUserRole] = useState('');

  //set user role
  useEffect(() => {
    if (util.isObjectEmpty(state) && util.isStringEmpty(state.role)) {
      setUserRole(state.role);
    }
  }, [state]);
  try {
    return (
      <React.Fragment>
        <Page>
          <div className="paymentHistory">
            <section className="cart-area ptb-60">
              <div className="cart-totals">
                {userRole === chef ? <ChefHistoryList /> : <CustomerHistoryList />}
              </div>
            </section>
          </div>
        </Page>
      </React.Fragment>
    );
  } catch (error) {
    toastMessage('renderError', error.message);
  }
};

export default PaymentHistory;
