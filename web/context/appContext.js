import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';
import { createApolloClient } from '../apollo/apollo';

import {
  getUserTypeRole,
  getChefId,
  getCustomerId,
  customer,
  chef,
  chefId,
  customerId,
} from '../utils/UserType';
import { currentUserCheck } from '../utils/checkCurrentUser';
import { firebase } from '../config/firebaseConfig';
import { StoreInLocal } from '../utils/LocalStorage';
import * as utils from '../utils/checkEmptycondition';

import * as gqlTag from '../common/gql';

// Create apollo client
const apolloClient = createApolloClient();

// Create app context
const AppContext = React.createContext([{}, () => {}]);

// Get GQL Tags
const chefProfileGQLTAG = gqlTag.query.chef.profileByIdGQLTAG;
const customerProfileGQLTAG = gqlTag.query.customer.profileByIdGQLTAG;

// gql for subscription for customer
const customerProfileSubscription = gqlTag.subscription.customer.profileGQLTAG;
const CUSTOMER_SUBSCRIPTION_TAG = gql`
  ${customerProfileSubscription}
`;
// fro customer location
const customerLocationSubscription = gqlTag.subscription.customer.profileExtendedGQLTAG;
const CUSTOMER_LOCATION_SUBS = gql`
  ${customerLocationSubscription}
`;

const AppProvider = props => {
  const [state, setState] = useState({});
  const [tokenId, setTokenId] = useState('');

  //Get token id from firebase
  useEffect(() => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser !== null) {
      //get firebase token and call qgl tag
      currentUser
        .getIdToken(true)
        .then(data => {
          setTokenId(data);
        })
        .catch(error => {});
    }
  });

  //Set token id to local storage
  useEffect(() => {
    if (utils.isStringEmpty(tokenId)) {
      // console.log('currentUser getIdToken', tokenId);
      StoreInLocal('current_user_token', tokenId);
    }
  }, [tokenId]);

  useEffect(() => {
    (() => {
      fetchData();
    })();
  }, []);

  async function fetchData() {
    let roleRes = null;
    let customerIdRes = null;
    let chefIdRes = null;
    let chefProfileRes = {};
    let customerProfileRes = {};
    let customerData = {};
    let chefData = {};
    let currentUser = null;
    let firstparams = 15;

    // To check current user
    currentUser = await currentUserCheck()
      .then(res => {
        return res;
      })
      .catch(err => {});

    // Get role
    roleRes = await getUserTypeRole()
      .then(res => {
        return res;
      })
      .catch(err => {});

    // get id based on role
    if (roleRes === customer) {
      // Get customer id
      customerIdRes = await getCustomerId(customerId)
        .then(res => {
          return res;
        })
        .catch(err => {});

      customerData = await apolloClient
        .query({
          query: gql`
            ${customerProfileGQLTAG}
          `,
          variables: { customerId: customerIdRes },
          fetchPolicy: 'network-only',
        })
        .then(result => {
          return result;
        });

      if (customerData != null) {
        if (customerData.hasOwnProperty('data')) {
          if (customerData.data.hasOwnProperty('customerProfileByCustomerId')) {
            customerProfileRes = customerData.data.customerProfileByCustomerId;
          }
        }
      }
    } else if (roleRes === chef) {
      // 3:1 get customer id
      chefIdRes = await getChefId(chefId)
        .then(res => {
          return res;
        })
        .catch(err => {});

      chefData = await apolloClient
        .query({
          query: gql`
            ${chefProfileGQLTAG}
          `,
          variables: { chefId: chefIdRes },
          fetchPolicy: 'network-only',
        })
        .then(result => {
          return result;
        });

      if (chefData != null) {
        if (chefData.hasOwnProperty('data')) {
          if (chefData.data.hasOwnProperty('chefProfileByChefId')) {
            chefProfileRes = chefData.data.chefProfileByChefId;
          }
        }
      }
    }
    //if res is null
    else {
      roleRes = null;
      customerIdRes = null;
      chefIdRes = null;
      chefProfileRes = {};
      customerProfileRes = {};
      customerData = {};
      chefData = {};
      currentUser = false;
      firstparams = 15;
    }

    setState({
      currentUser: currentUser,
      role: roleRes,
      chefId: chefIdRes,
      customerId: customerIdRes,
      chefProfile: chefProfileRes,
      customerProfile: customerProfileRes,
      firstparams: 15,
    });
  }

  // const {
  //   SubscriptionCustomerdata
  // } = useSubscription(CUSTOMER_SUBSCRIPTION_TAG,
  //   {
  //     variables: { customerId: state.customerId ? state.customerId : '' },
  //     onSubscriptionData: (res) => {
  //       if (res.subscriptionData.data.customerProfile) {
  //         fetchData();
  //       }
  //     },
  //   });
  // const { customerLocationSubs } = useSubscription(CUSTOMER_LOCATION_SUBS,
  //   {
  //     variables: { customerId: state.customerId ? state.customerId : '' },
  //     onSubscriptionData: (res) => {
  //       if (res.subscriptionData.data.customerProfileExtended) {
  //         console.log("res",res.subscriptionData.data.customerProfileExtended)
  //         fetchData();
  //       }
  //     },
  //   });

  return <AppContext.Provider value={[state, setState]}>{props.children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
