import React, { useState, useEffect, useRef } from 'react';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { firebase } from '../../../config/firebaseConfig';
import MobileNumberVerification from '../mobile-number-verification/MobileNumberVerification';
import * as gqlTag from '../../../common/gql';
import {
  getChefId,
  getCustomerId,
  chefId,
  chef,
  customer,
  getUserTypeRole,
  customerId,
} from '../../../utils/UserType';
import * as util from '../../../utils/checkEmptycondition';

//customer
const customerDataTag = gqlTag.query.customer.profileByIdGQLTAG;
//for getting customer data
const GET_CUSTOMER_DATA = gql`
  ${customerDataTag}
`;

//chef
const chefDataTag = gqlTag.query.chef.profileByIdGQLTAG;

//for getting chef data
const GET_CHEF_DATA = gql`
  ${chefDataTag}
`;

//customer
const updateCustomerData = gqlTag.mutation.customer.updateBasicInfoGQLTag;

//for updating customer details
const UPDATE_CUSTOMER_BASIC_INFO = gql`
  ${updateCustomerData}
`;
const MobileVerification = props => {
  const childRef = useRef();
  const [chefIdValue, setChefId] = useState(null);
  const [customerIdValue, setCustomerId] = useState(null);
  const [userId, setUserId] = useState();
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [salutation, setSalutation] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [userRole, setUserRole] = useState('');

  const [getCustomerData, { data }] = useLazyQuery(GET_CUSTOMER_DATA, {
    variables: { customerId: customerIdValue },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [getChefDataByProfile, chefData] = useLazyQuery(GET_CHEF_DATA, {
    variables: { chefId: chefIdValue },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [updateCustomerBasicInfo, { customerData }] = useMutation(UPDATE_CUSTOMER_BASIC_INFO, {
    onCompleted: customerData => {
      toastMessage(success, s.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(error, err.message);
    },
  });

  useEffect(() => {
    //get user role
    getUserTypeRole()
      .then(async res => {
        setUserRole(res);
        if (res === customer) {
          //customer user
          getCustomerId(customerId)
            .then(customerResult => {
              setCustomerId(customerResult);
            })
            .catch(err => {});
        } else {
          //chef user
          getChefId(chefId)
            .then(async chefResult => {
              await setChefId(chefResult);
            })
            .catch(err => {});
        }
      })
      .catch(err => {});
  }, []);

  useEffect(() => {
    if (chefIdValue) {
      getChefDataByProfile();
    }
  }, chefIdValue);

  useEffect(() => {
    if (customerIdValue) {
      getCustomerData();
    }
  }, customerIdValue);

  useEffect(() => {
    if (
      util.isObjectEmpty(data) &&
      util.hasProperty(data, 'customerProfileByCustomerId') &&
      util.isObjectEmpty(data.customerProfileByCustomerId)
    ) {
      setMobileNumber(
        data.customerProfileByCustomerId.customerMobileNumber
          ? data.customerProfileByCustomerId.customerMobileNumber
          : ''
      );
      setCountryCode(
        data.customerProfileByCustomerId.customerMobileCountryCode
          ? data.customerProfileByCustomerId.customerMobileCountryCode
          : ''
      );
      setEmail(
        data.customerProfileByCustomerId.customerEmail
          ? data.customerProfileByCustomerId.customerEmail
          : ''
      );
      setUserId(
        data.customerProfileByCustomerId.userId ? data.customerProfileByCustomerId.userId : ''
      );
      setSalutation(
        data.customerProfileByCustomerId.customerSalutation
          ? data.customerProfileByCustomerId.customerSalutation
          : ''
      );
      setFirstName(
        data.customerProfileByCustomerId.customerFirstName
          ? data.customerProfileByCustomerId.customerFirstName
          : ''
      );
      setLastName(
        data.customerProfileByCustomerId.customerLastName
          ? data.customerProfileByCustomerId.customerLastName
          : ''
      );
      setGender(
        data.customerProfileByCustomerId.customerGender
          ? data.customerProfileByCustomerId.customerGender
          : ''
      );
      setDob(
        data.customerProfileByCustomerId.customerDob
          ? data.customerProfileByCustomerId.customerDob
          : ''
      );
    } else {
    }
  }, [data]);

  useEffect(() => {
    if (
      util.isObjectEmpty(chefData) &&
      util.hasProperty(chefData, 'data') &&
      util.hasProperty(chefData.data, 'chefProfileByChefId') &&
      util.isObjectEmpty(chefData.data.chefProfileByChefId)
    ) {
      let chefDetails = chefData.data.chefProfileByChefId;
      setMobileNumber(chefDetails.chefMobileNumber ? chefDetails.chefMobileNumber : '');
      setCountryCode(chefDetails.chefMobileCountryCode ? chefDetails.chefMobileCountryCode : '');
      setEmail(chefDetails.chefEmail ? chefDetails.chefEmail : '');
      setUserId(chefDetails.userId ? chefDetails.userId : '');
      setSalutation(chefDetails.chefSalutation ? chefDetails.chefSalutation : '');
      setFirstName(chefDetails.chefFirstName ? chefDetails.chefFirstName : '');
      setLastName(chefDetails.customerLastName ? chefDetails.customerLastName : '');
      setGender(chefDetails.chefGender ? chefDetails.chefGender : '');
      setDob(chefDetails.chefDob ? chefDetails.chefDob : '');
    }
  }, [chefData]);

  try {
    return (
      <section className="products-collections-area ptb-60 ProfileSetup">
        <form className="login-form">
          <div className="section-title" id="title-content">
            <h2>Mobile Verification</h2>
          </div>
          <MobileNumberVerification
            id={customerIdValue ? customerIdValue : chefIdValue ? chefIdValue : ''}
            salutation={salutation}
            firstName={firstName}
            lastName={lastName}
            gender={gender}
            dob={dob}
            mobileNumber={mobileNumber}
            countryCode={countryCode}
            email={email}
            pageType={'Basic Informatiom'}
            screen={props.screen ? props.screen : 'register'}
            userId={userId}
            role={userRole}
            nextStep={props.nextStep}
          />
          {/* <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth firebaseAuth={firebase.auth()}/>
      </div> */}
        </form>
      </section>
    );
  } catch (error) {}
};

export default MobileVerification;
