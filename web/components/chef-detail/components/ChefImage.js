import React, { useState, useEffect } from 'react';
import { toastMessage } from '../../../utils/Toast';
import { useLazyQuery, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import * as util from '../../../utils/checkEmptycondition';
import {
  getChefId,
  getCustomerId,
  chefId,
  chef,
  customer,
  getUserTypeRole,
  customerId,
} from '../../../utils/UserType';

//customer
const chefDataTag = gqlTag.query.chef.profileByIdGQLTAG;
//for getting customer data
const GET_CHEF_DATA = gql`
  ${chefDataTag}
`;

const chefProfileSubscription = gqlTag.subscription.chef.ProfileGQLTAG;
const CHEF_SUBSCRIPTION_TAG = gql`
  ${chefProfileSubscription}
`;

const ChefImage = props => {
  const [chefIdValue, setChefId] = useState(null);
  const [customerIdValue, setCustomerId] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [ProfileDetails, setProfileDetails] = useState([]);

  const [getChefDataByProfile, { data }] = useLazyQuery(GET_CHEF_DATA, {
    variables: { chefId: props.chefId },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  // console.log("data",data)
  //get chef id
  useEffect(() => {
    //get user role
    getUserTypeRole()
      .then(async res => {
        if (!res) {
          // console.log("res",res)
          getChefDataByProfile();
        }

        setUserRole(res);
        if (res === customer) {
          //customer user
          getCustomerId(customerId)
            .then(async customerResult => {
              await setCustomerId(customerResult);
              // console.log("customerResult",customerResult)
              // getCustomerData();
            })
            .catch(err => {});
        }
      })
      .catch(err => {});
  }, []);

  useEffect(() => {
    if (customerIdValue) {
      getChefDataByProfile();
    }
  }, customerIdValue);

  const { chefProfileSubsdata } = useSubscription(CHEF_SUBSCRIPTION_TAG, {
    variables: { chefId: props.chefId },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.chefProfile) {
        // console.log("res",res)
        getChefDataByProfile();
      }
    },
  });

  useEffect(() => {
    if (
      util.isObjectEmpty(data) &&
      // util.hasProperty(data, 'data') &&
      // util.isObjectEmpty(data.data) &&
      util.hasProperty(data, 'chefProfileByChefId') &&
      util.isObjectEmpty(data.chefProfileByChefId)
    ) {
      setProfileDetails(data.chefProfileByChefId);
    } else {
      setProfileDetails(null);
    }
  });

  try {
    return (
      <div className="col-lg-2 col-md-6" id="cheflist-content">
        <div className="comment-author vcard">
          {ProfileDetails && util.isStringEmpty(ProfileDetails.chefPicId) && (
            <img
              // src={ProfileDetails.chefPicId}
              src={ProfileDetails.chefPicId}
              className="avatar"
              alt="image"
              style={{ borderRadius: '5%', height: '150px', width: '150px !important' }}
            />
          )}
          {ProfileDetails && !util.isStringEmpty(ProfileDetails.chefPicId) && (
            <img
              // src={ProfileDetails.chefPicId}
              src={require('../../../images/mock-image/default_chef_profile.png')}
              className="avatar"
              alt="image"
              style={{ borderRadius: '5%', height: '150px', width: '150px !important' }}
            />
          )}
        </div>
      </div>
    );
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
};

export default ChefImage;
