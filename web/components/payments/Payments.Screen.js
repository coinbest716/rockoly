import React, { useEffect, useState, useContext } from 'react';
import Page from '../shared/layout/Main';
import { toastMessage } from '../../utils/Toast';
import { StripeProvider, Elements, CardElement } from 'react-stripe-elements';
import CardForm from './components/CardForm';
import ChefCardList from './components/ChefCardList';
import CustomerCardList from './components/CustomerCardList';
import { withApollo } from '../../apollo/apollo';
import { AppContext } from '../../context/appContext';
import * as utils from '../../utils/checkEmptycondition';
import { OmitProps } from 'antd/lib/transfer/renderListBody';

const PaymentsScreen = (props) => {
  const [state, setState] = useContext(AppContext);
  const [userRole, setUserRole] = useState('');
  const [isCardAddedYn, setIsCardAddedYn] = useState(false);
  useEffect(() => {
    if (utils.isObjectEmpty(state) && utils.isStringEmpty(state.role)) {
      setUserRole(state.role);
    }
  });

  function addedCustomerCard() {
    setIsCardAddedYn(!isCardAddedYn);
  }
  return (
    <React.Fragment>
      {props.screen && props.screen == 'profile' ?
        <section className="cart-area ptb-60">
          <div className="cart-totals">
            {userRole === 'chef' ? (
              <ChefCardList />
            ) : (
                userRole === 'customer' && (
                  <CustomerCardList
                    type={'page'}
                    addedCustomerCard={addedCustomerCard}
                    isCardAddedYn={isCardAddedYn}
                  />
                )
              )}
          </div>
        </section>
        :
        <Page>
          <section className="cart-area ptb-60">
            <div className="cart-totals">
              {userRole === 'chef' ? (
                <ChefCardList />
              ) : (
                  userRole === 'customer' && (
                    <CustomerCardList
                      type={'page'}
                      addedCustomerCard={addedCustomerCard}
                      isCardAddedYn={isCardAddedYn}
                    />
                  )
                )}
            </div>
          </section>
        </Page>
      }

    </React.Fragment>
  );
};

export default withApollo(PaymentsScreen);
