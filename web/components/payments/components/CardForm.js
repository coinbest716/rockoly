import React, { useState, useContext, useEffect } from 'react';
import {
  injectStripe,
  CardElement,
  CardExpiryElement,
  CardNumberElement,
  CardCvcElement,
  PaymentRequestButtonElement,
} from 'react-stripe-elements';
import * as gqlTag from '../../../common/gql';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { toastMessage, success, renderError } from '../../../utils/Toast';
import { AppContext } from '../../../context/appContext';
import * as utils from '../../../utils/checkEmptycondition';
import Loader from '../../Common/loader';
import { Back } from './Navigation';

const updateChefData = gqlTag.mutation.stripe.attachCardToCustomerTAG;

//for updating specialization
const UPDATE_CHEF_SPECIALIZATION = gql`
  ${updateChefData}
`;

const handleBlur = () => {
  // console.log('[blur]');
};
const handleChange = change => {
  // console.log('[change]', change);
};
const handleClick = () => {
  // console.log('[click]');
};
const handleFocus = () => {
  // console.log('[focus]');
};
const handleReady = () => {
  // console.log('[ready]');
};

const CardForm = props => {
  const [cardName, setCardName] = useState(null);
  const [state, setState] = useContext(AppContext);
  const [emailId, setEmailId] = useState('');
  const [stripeId, setStripeId] = useState(null);
  // const paymentRequest = props.stripe.paymentRequest({
  //   country: 'US',
  //   currency: 'usd',
  //   total: {
  //     label: 'Demo total',
  //     amount: 1000,
  //   },
  // });

  const [updateChefSpecialization, { data, loading, error }] = useMutation(
    UPDATE_CHEF_SPECIALIZATION,
    {
      onCompleted: data => {
        // console.log('handleSubmit123 payload data', data);
        // console.log('dsakjhkjhkhkjh123123', data.stripeAttachCardToCustomer.data.customer);
        toastMessage(success, 'Card Added successfully');
        //For closing modal
        if (props.closeAddCardModal) {
          props.closeAddCardModal(data.stripeAttachCardToCustomer.data.customer);
        } else {
          Back();
        }
      },
      onError: err => {
        // console.log('handleSubmit123 payload err', err);
        toastMessage(renderError, err.message);
      },
    }
  );
  if (error) {
    toastMessage('error', error);
  }
  //set email and strip data
  useEffect(() => {
    if (
      utils.isObjectEmpty(state) &&
      utils.isObjectEmpty(state.customerProfile) &&
      utils.isStringEmpty(state.customerProfile.customerEmail)
    ) {
      setEmailId(state.customerProfile.customerEmail);
      if (
        utils.hasProperty(state.customerProfile, 'customerProfileExtendedsByCustomerId') &&
        utils.isObjectEmpty(state.customerProfile.customerProfileExtendedsByCustomerId) &&
        utils.hasProperty(state.customerProfile.customerProfileExtendedsByCustomerId, 'nodes') &&
        utils.isObjectEmpty(state.customerProfile.customerProfileExtendedsByCustomerId.nodes[0])
      ) {
        let stripDetails =
          state.customerProfile.customerProfileExtendedsByCustomerId.nodes[0]
            .customerStripeCustomerId;
        setStripeId(stripDetails);
      }
    }
  }, [state]);

  function handleSubmit(ev) {
    ev.preventDefault();
    if (props.stripe) {
      props.stripe.createToken().then(payload => {
        if (payload && payload.token && payload.token.id) {
          updateChefSpecialization({
            variables: {
              email: emailId,
              customerId: stripeId,
              cardToken: payload.token.id,
            },
          });
        } else {
          toastMessage(error, 'Failed to add card');
        }
      });
    } else {
      // console.log('handleSubmit123 error');
      // console.log("Stripe.js hasn't loaded yet.");
    }
  }

  const createOptions = (fontSize, padding) => {
    return {
      style: {
        base: {
          fontSize,
          color: '#424770',
          letterSpacing: '0.025em',
          fontFamily: 'Source Code Pro, monospace',
          '::placeholder': {
            color: '#aab7c4',
          },
          ...(padding ? { padding } : {}),
        },
        invalid: {
          color: '#9e2146',
        },
      },
    };
  };

  //loader
  function renderLoader() {
    if (loading !== undefined && loading === true) {
      return (
        <div>
          <Loader />
        </div>
      );
    }
  }

  return (
    <React.Fragment>
      <div className="formContainer">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <h2>Add Card</h2>
        </div>
        <div className="customer-addcard">
          <form onSubmit={handleSubmit} className="col-12">
            <div>
              <label className="paymentLabel">
                Card number
                <CardNumberElement
                  onBlur={handleBlur}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onReady={handleReady}
                  {...createOptions(14)}
                />
              </label>
            </div>

            <label className="paymentLabel">
              Expiration date
              <CardExpiryElement
                onBlur={handleBlur}
                onChange={handleChange}
                onFocus={handleFocus}
                onReady={handleReady}
                {...createOptions(14)}
                value="774"
              />
            </label>

            <label className="paymentLabel">
              CVC
              <CardCvcElement
                onBlur={handleBlur}
                onChange={handleChange}
                onFocus={handleFocus}
                onReady={handleReady}
                {...createOptions(14)}
              />
            </label>
            <label className="paymentLabel">
              Name
              <input
                value={cardName}
                name="name"
                type="text"
                placeholder="Enter card name"
                onChange={event => setCardName(event.target.value)}
                // required
                className="paymentNameLabel"
              />
            </label>

            {renderLoader()}
            {/* <div> */}

            {/* </div> */}
          </form>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              id="payButton"
              className="btn btn-primary"
              onClick={event => handleSubmit(event)}
              type="submit"
            >
              Add Card
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default injectStripe(CardForm);
