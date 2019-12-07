import React, { useEffect, useState } from 'react';
import { StripeProvider, Elements, CardElement } from 'react-stripe-elements';
import CardForm from './CardForm';
import { withApollo } from '../../../apollo/apollo';
import Page from '../../shared/layout/Main';

const StripeWrapper = props => {
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    // for SSR
    if (typeof window == 'undefined') return;
    // for browser
    if (window.Stripe) {
      setStripe(window.Stripe('pk_test_0aMu8HkW68jT4m4zzaSSLlM200tcceSCDW'));
    } else {
      const stripeScript = document.querySelector('#stripe-js');
      stripeScript.onload = () => {
        setStripe(window.Stripe('pk_test_0aMu8HkW68jT4m4zzaSSLlM200tcceSCDW'));
      };
    }
  }, []);

  return (
    <StripeProvider stripe={stripe}>
      <Elements>
        <CardForm closeAddCardModal={props.closeAddCardModal} />
      </Elements>
    </StripeProvider>
  );
};

const AddCard = props => (
  <React.Fragment>
    <section className="cart-area ptb-60">
      <div className="cart-totals" style={{ height: '520px', width: '101%' }}>
        <StripeWrapper closeAddCardModal={props.closeAddCardModal} />
      </div>
    </section>
  </React.Fragment>
);

export default withApollo(AddCard);
