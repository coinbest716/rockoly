import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import ModernDatepicker from 'react-modern-datepicker';
import moment from 'moment';
import { firebase, auth } from '../../../config/firebaseConfig';
import { toastMessage, renderError, success, error } from '../../../utils/Toast';
import * as util from '../../../utils/checkEmptycondition';
import {
  getChefId,
  chefId,
  chef,
  customer,
  customerProfileExtendedId,
  getCustomerId,
} from '../../../utils/UserType';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import s from '../../profile-setup/ProfileSetup.String';
import MobileNumberVerification from '../../shared/mobile-number-verification/MobileNumberVerification';
import { createApolloClient } from '../../../apollo/apollo';
import { loginTo } from './Navigation';
import { StoreInLocal, GetValueFromLocal } from '../../../utils/LocalStorage';

//customer
const updateCustomerData = gqlTag.mutation.customer.updateBasicInfoGQLTag;
//chef
const updateChefData = gqlTag.mutation.chef.updateBasicInfoGQLTag;

//for updating customer details
const UPDATE_CUSTOMER_BASIC_INFO = gql`
  ${updateCustomerData}
`;

//for updating specialization
const UPDATE_CHEF_BASIC_INFO = gql`
  ${updateChefData}
`;

//update chef screen
const updateChefScreens = gqlTag.mutation.chef.updateScreensGQLTAG;

const UPDATE_CHEF_SCREENS = gql`
  ${updateChefScreens}
`;

//update customer screen
const updateCustomerScreens = gqlTag.mutation.customer.updateScreensGQLTAG;

const UPDATE_CUSTOMER_SCREENS = gql`
  ${updateCustomerScreens}
`;

const apolloClient = createApolloClient();

const UserEmail = props => {
  // In order to gain access to the child component instance,
  // you need to assign it to a `ref`, so we call `useRef()` to get one
  const childRef = useRef();
  const [startDate, setstartDate] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [salutation, setSalutation] = useState('MR');
  const [salutationValue, setSalutationValue] = useState(0);
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [customerExtendedId, setCustomerExtendedId] = useState('');
  const [chefId, setChefId] = useState('');
  const [mobileNumberExist, setMobileNumberExist] = useState(false);
  const [gender, setGender] = useState('');
  const [userId, setUserId] = useState();
  const [mobileDate, seMobileData] = useState();
  const [sendOTP, setSendOTP] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  //Customer
  const [updateCustomerBasicInfo, { customerData }] = useMutation(UPDATE_CUSTOMER_BASIC_INFO, {
    onCompleted: customerData => {
      toastMessage(success, s.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(error, err.message);
    },
  });

  //Chef
  const [updateChefBasicInfo, { chefData }] = useMutation(UPDATE_CHEF_BASIC_INFO, {
    onCompleted: chefData => {
      // console.log("chefData", chefData)
      toastMessage(success, s.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(error, err.message);
    },
  });

  const [updateChefScrrenTag, data] = useMutation(UPDATE_CHEF_SCREENS, {
    onCompleted: data => {
      props.nextStep();
    },
    onError: err => {},
  });

  const [updateCustomerScrrenTag, datas] = useMutation(UPDATE_CUSTOMER_SCREENS, {
    onCompleted: datas => {
      props.nextStep();
    },
    onError: err => {},
  });

  // //Query for check mobile number exist or not
  // let data = {
  //   pEmail: email,
  //   pMobileNo: mobileNumber,
  // };
  // console.log('getMobileValueCheck1', data);
  // //get value form db
  // const mobileValueCheck = gqlTag.query.auth.checkEmailAndMobileNoExistsGQLTAG;
  // const MOBILE_VALUE_CHECK = gql`
  //   ${mobileValueCheck}
  // `;
  // let getMobileValueCheck = useQuery(MOBILE_VALUE_CHECK, {
  //   variables: data,
  // }); //get cuisine data

  // console.log('getMobileValueCheck', getMobileValueCheck, mobileNumberExist);

  // useEffect(() => {
  //   if (
  //     util.isObjectEmpty(getMobileValueCheck) &&
  //     util.hasProperty(getMobileValueCheck, 'data') &&
  //     util.isObjectEmpty(getMobileValueCheck.data) &&
  //     util.hasProperty(getMobileValueCheck.data, 'checkEmailAndMobileNoExists') &&
  //     util.isObjectEmpty(getMobileValueCheck.data.checkEmailAndMobileNoExists)
  //   ) {
  //     setMobileNumberExist(getMobileValueCheck.data.checkEmailAndMobileNoExists.success);
  //   } else {
  //     setMobileNumberExist(false);
  //   }
  // }, [getMobileValueCheck]);

  //Check email and mobile number verified or not
  useEffect(() => {
    if (firebase.auth().currentUser && firebase.auth().currentUser.emailVerified) {
      let email = firebase.auth().currentUser.emailVerified;
      setEmailVerified(email);
    }
  }, []);

  function handleConfirm() {
    // e.preventDefault();
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        if (firebase.auth().currentUser) {
          firebase.auth().currentUser.reload();
          let userData = firebase.auth().currentUser;
          if (userData.emailVerified) {
            setEmailVerified(true);
          }
        }
      } else {
        toastMessage(error, 'Please verify the email');
      }
    });
  }
  //set cuisine list data
  useEffect(() => {
    if (props.role === customer) {
      let customerData = props.details;

      if (
        util.isObjectEmpty(customerData) &&
        util.hasProperty(customerData, 'customerProfileByCustomerId') &&
        util.isObjectEmpty(customerData.customerProfileByCustomerId)
      ) {
        getCustomerId(customerProfileExtendedId)
          .then(res => {
            setCustomerExtendedId(res);
          })
          .catch(error => {
            toastMessage(renderError, error.message);
          });
        let data = customerData.customerProfileByCustomerId;
        setFirstName(util.isStringEmpty(data.customerFirstName) ? data.customerFirstName : '');
        setLastName(util.isStringEmpty(data.customerLastName) ? data.customerLastName : '');
        setEmail(util.isStringEmpty(data.customerEmail) ? data.customerEmail : '');
        setDob(
          util.isStringEmpty(data.customerDob)
            ? moment(new Date(data.customerDob)).format('MM-DD-YYYY')
            : ''
        );
        setMobileNumber(
          util.isStringEmpty(data.customerMobileNumber) ? data.customerMobileNumber : ''
        );
        setCountryCode(
          util.isStringEmpty(data.customerMobileCountryCode) ? data.customerMobileCountryCode : ''
        );
        setUserId(data.userId);
        setGender(util.isStringEmpty(data.customerGender) ? data.customerGender : '');
        setSalutation(util.isStringEmpty(data.customerSalutation) ? data.customerSalutation : '');
      }
    } else if (props.role === chef) {
      let chefData = props.chefDetails;
      if (
        util.isObjectEmpty(chefData)
        // && util.hasProperty(chefData, 'chefProfileByChefId')
        // util.isObjectEmpty(chefData.chefProfileByChefId)
      ) {
        let data = chefData;
        // console.log("Data", data)
        setFirstName(util.isStringEmpty(data.chefFirstName) ? data.chefFirstName : '');
        setLastName(util.isStringEmpty(data.chefLastName) ? data.chefLastName : '');
        setEmail(util.isStringEmpty(data.chefEmail) ? data.chefEmail : '');
        // console.log('data', data);
        setDob(
          util.isStringEmpty(data.chefDob)
            ? moment(new Date(data.chefDob)).format('MM-DD-YYYY')
            : ''
        );
        setMobileNumber(util.isStringEmpty(data.chefMobileNumber) ? data.chefMobileNumber : '');
        setCountryCode(
          util.isStringEmpty(data.chefMobileCountryCode) ? data.chefMobileCountryCode : ''
        );
        setSalutation(util.isStringEmpty(data.chefSalutation) ? data.chefSalutation : '');
        setGender(util.isStringEmpty(data.chefGender) ? data.chefGender : '');
      }
    }
  }, [props.details]);

  //when saving data
  async function handleSubmit() {
    let emailVerified;
    let user = firebase.auth().currentUser;
    if (user) {
      user
        .sendEmailVerification()
        .then(res => {
          toastMessage(success, 'Verification email sent successfully!');
          if (props.screen === 'register') {
            // To get the updated screens value
            let screensValue = [];
            GetValueFromLocal('SharedProfileScreens')
              .then(result => {
                if (result && result.length > 0) {
                  screensValue = result;
                }
                screensValue.push('EMAIL_VERIFICATION');
                screensValue = _.uniq(screensValue);
                let variables;
                if (props.role === 'chef') {
                  variables = {
                    chefId: props.id,
                    chefUpdatedScreens: screensValue,
                  };
                  updateChefScrrenTag({ variables });
                } else if (props.role === 'customer') {
                  variables = {
                    customerId: props.id,
                    customerUpdatedScreens: screensValue,
                  };
                  updateCustomerScrrenTag({ variables });
                }
                StoreInLocal('SharedProfileScreens', screensValue);
              })
              .catch(err => {
                console.log('err', err);
              });
          }
          setSendOTP(true);
        })
        .catch(error => {
          toastMessage(renderError, error.message);
        });
    }
  }

  function emailSkipFunc() {
    // To get the updated screens value
    let screensValue = [];
    GetValueFromLocal('SharedProfileScreens')
      .then(result => {
        if (result && result.length > 0) {
          screensValue = result;
        }
        if (result && !_.includes(result, 'EMAIL_VERIFICATION')) {
          screensValue.push('EMAIL_VERIFICATION');
          screensValue = _.uniq(screensValue);
          StoreInLocal('SharedProfileScreens', screensValue);
          let variables;
          if (props.role === 'chef') {
            variables = {
              chefId: props.id,
              chefUpdatedScreens: screensValue,
            };
            updateChefScrrenTag({ variables });
          } else if (props.role === 'customer') {
            variables = {
              customerId: props.id,
              customerUpdatedScreens: screensValue,
            };
            updateCustomerScrrenTag({ variables });
          }
        }
        props.nextStep();
      })
      .catch(err => {
        console.log('err', err);
      });
  }

  try {
    return (
      <React.Fragment>
        <section className="products-collections-area  ProfileSetup" id="login-container">
          <form className="login-form">
            <div className="row">
              <div className="col-sm-12">
                <div className="login-content" id="basicInfoContainer">
                  <div className="container">
                    <div className="signup-content">
                      <div className="section-title" id="title-content">
                        <h2>Verify Email address</h2>
                      </div>

                      <div className="form-group">
                        <label>Email</label>
                        <input
                          disabled={true}
                          type="email"
                          className="form-control"
                          placeholder="Enter your email"
                          id="email"
                          name="email"
                          required={true}
                          data-error="Please enter your email"
                          value={email}
                          onChange={event => onChangeValue(event, setEmail)}
                        />
                        <div className="help-block with-errors"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-sm-2"> */}
            {sendOTP === false && emailVerified !== true && (
              <div className="basicInfoSave col-sm-2">
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="btn btn-primary"
                  style={{ width: 'fit-content' }}
                >
                  Verify
                </button>
                <br />
              </div>
            )}
            {sendOTP === true && emailVerified !== true && (
              <div className="basicInfoSave col-sm-2">
                <button
                  type="button"
                  onClick={() => handleConfirm()}
                  className="btn btn-primary"
                  style={{ width: 'fit-content' }}
                >
                  Confirm
                </button>
                <br />
              </div>
            )}
            {emailVerified === true && props.screen !== 'basic' && (
              <div className="basicInfoSave col-sm-2">
                <button
                  type="button"
                  onClick={() => emailSkipFunc()}
                  className="btn btn-primary"
                  style={{ width: 'fit-content' }}
                >
                  Next
                </button>
                <br />
              </div>
            )}
          </form>
        </section>
      </React.Fragment>
    );
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

export default UserEmail;
