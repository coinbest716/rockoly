import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import _ from 'lodash';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
// import 'react-toastify/dist/ReactToastify.css';
import PhoneInput, { formatPhoneNumberIntl } from 'react-phone-number-input';
import SmartInput from 'react-phone-number-input/smart-input';
// import 'react-phone-number-input/style.css';
import { firebase } from '../../../config/firebaseConfig';
import s from './Strings';
import { toastMessage } from '../../../utils/Toast';
import { isNumberEmpty, isObjectEmpty } from '../../../utils/checkEmptycondition';
import Loader from '../../Common/loader';
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import { createApolloClient } from '../../../apollo/apollo';
import { StoreInLocal, GetValueFromLocal } from '../../../utils/LocalStorage';

//customer
const updateCustomerData = gqlTag.mutation.customer.updateBasicInfoGQLTag;

//for updating customer details
const UPDATE_CUSTOMER_BASIC_INFO = gql`
  ${updateCustomerData}
`;

//chef
const updateChefData = gqlTag.mutation.chef.updateBasicInfoGQLTag;

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

const saveVerifyMobile = gqlTag.mutation.chef.updateIsMobileNoVerifiedYnGQLTAG;

const UPDATE_VERFICATION = gql`
  ${saveVerifyMobile}
`;
const MobileNumberVerification = forwardRef((props, ref) => {
  const apolloClient = createApolloClient();
  // Declare a new state variable
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileCallBackValue, setMobileCallBackValue] = useState('');
  const [otpSend, setOtpSend] = useState(false);
  const [mobileNumberEnable, setMobileNumberEnable] = useState(false);
  const [loader, setLoader] = useState(false);
  const [country, setCountry] = useState('US');
  const [countryCode, setCountryCode] = useState('+1');
  const [mobileNumberValue, setMobileNumberValue] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [afterVerified, setAfterVerified] = useState(false);
  const [chefIdValue, setChefId] = useState();
  const [storedData, setStoredData] = useState();
  const [verificationId, setVerificationId] = useState(null);
  const [isPhoneNoConfirmFormEnabledYN, setIsPhoneNoConfirmFormEnabledYN] = useState(true);
  const [isOTPConfirmFormEnabledYN, setIsOTPConfirmFormEnabledYN] = useState(false);
  const [otpCode, setOtpCode] = useState(null);

  const [updateCustomerBasicInfo, { customerData }] = useMutation(UPDATE_CUSTOMER_BASIC_INFO, {
    onCompleted: customerData => {
      toastMessage('success', 'Mobile verified successfully');
      setIsOTPConfirmFormEnabledYN(false);
      setIsPhoneNoConfirmFormEnabledYN(true);
      setIsVerified(true);
      if (props.screen === 'register') {
        // To get the updated screens value
        let screensValue = [];
        GetValueFromLocal('SharedProfileScreens')
          .then(result => {
            if (result && result.length > 0) {
              screensValue = result;
            }

            screensValue.push('MOBILE_VERIFICATION');
            screensValue = _.uniq(screensValue);

            let variables;
            if (props.role === 'customer') {
              variables = {
                customerId: props.id,
                customerUpdatedScreens: screensValue,
              };
            }
            StoreInLocal('SharedProfileScreens', screensValue);
            updateCustomerScrrenTag({ variables });
          })
          .catch(err => {
            //console.log('err', err);
          });
      }
    },
    onError: err => {
      toastMessage('error', err.message);
    },
  });

  const [updateChefBasicInfo, { chefData }] = useMutation(UPDATE_CHEF_BASIC_INFO, {
    onCompleted: chefData => {
      console.log('updateChefBasicInfo', props);
      // setStoredData(chefData);
      toastMessage('success', 'Mobile verified successfully');
      setIsOTPConfirmFormEnabledYN(false);
      setIsPhoneNoConfirmFormEnabledYN(true);
      setIsVerified(true);
      if (props.screen === 'register') {
        // To get the updated screens value
        let screensValue = [];
        GetValueFromLocal('SharedProfileScreens')
          .then(result => {
            if (result && result.length > 0) {
              screensValue = result;
            }

            screensValue.push('MOBILE_VERIFICATION');
            screensValue = _.uniq(screensValue);
            let variables = {
              chefId: props.id,
              chefUpdatedScreens: screensValue,
            };
            StoreInLocal('SharedProfileScreens', screensValue);
            updateChefScrrenTag({ variables });
          })
          .catch(err => {
            //console.log('err', err);
          });
      }
    },
    onError: err => {
      toastMessage('error', err.message);
    },
  });

  const [updateChefScrrenTag, data] = useMutation(UPDATE_CHEF_SCREENS, {
    onCompleted: data => {
      // props.nextStep();
    },
    onError: err => {},
  });

  const [updateCustomerScrrenTag, datas] = useMutation(UPDATE_CUSTOMER_SCREENS, {
    onCompleted: datas => {
      // props.nextStep();
    },
    onError: err => {},
  });

  // const [updateIsNumberVerified, savedNumber] = useMutation(UPDATE_VERFICATION, {
  //   onCompleted: data => {},
  //   onError: err => {
  //     toastMessage('error', err.message);
  //   },
  // });
  useEffect(() => {
    if (firebase.auth().currentUser && firebase.auth().currentUser.phoneNumber !== null) {
      const user = firebase.auth().currentUser.phoneNumber;
      if (user) {
        setIsVerified(true);
      }
    }
  }, [firebase.auth()]);
  useEffect(() => {
    if (isObjectEmpty(props)) {
      setMobileNumber(props.countryCode + ' ' + props.mobileNumber);
      setMobileCallBackValue(props.countryCode + ' ' + props.mobileNumber);
    }
  }, [props.mobileNumber]);

  useEffect(() => {
    if (props.id) {
      setChefId(props.id);
    }
  }, [props.id]);

  useEffect(() => {
    if (storedData && storedData.updateChefProfileByChefId) {
      let variables = {
        chefId: chefIdValue,
        isMobileNoVerifiedYn: true,
      };
      updateIsNumberVerified(variables);
    }
  }, [storedData]);
  async function checkMobileAndEmailDataExistsOrNot(emailData, mobileData, userId) {
    //Query for check mobile number exist or not

    let data = {
      pEmail: null,
      pMobileNo: mobileData ? mobileData : '',
      pUserId: userId,
    };

    //get value form db
    const mobileValueCheckTag = gqlTag.query.auth.checkEmailAndMobileNoExistsUsingUserIdGQLTAG;

    let output = await apolloClient
      .query({
        query: gql`
          ${mobileValueCheckTag}
        `,
        variables: data,
      })
      .then(result => {
        return true;
      })
      .catch(error => {
        toastMessage('renderError', error.message);
        return false;
      });
    return output;
  }

  function skipFunction(e) {
    e.preventDefault();
    // To get the updated screens value
    let screensValue = [];
    console.log('skipFunction', props);
    GetValueFromLocal('SharedProfileScreens')
      .then(result => {
        if (result && result.length > 0) {
          screensValue = result;
        }
        if (result && !_.includes(result, 'MOBILE_VERIFICATION')) {
          screensValue.push('MOBILE_VERIFICATION');
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
        //console.log('err', err);
      });
  }

  async function phoneVerify() {
    const checkMobileNumberAndEmail = await checkMobileAndEmailDataExistsOrNot(
      props.email,
      countryCode + mobileNumberValue,
      props.userId
    );
    if (checkMobileNumberAndEmail) {
      try {
        if (isNumberEmpty(mobileNumber)) {
          setLoader(true);
          // if (!isObjectEmpty(window.recaptchaVerifier)) {
          //   // 'recaptcha-container' is the ID of an element in the DOM.
          window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            size: 'invisible',
            // other options
          });
          // }
          if (isObjectEmpty(window.recaptchaVerifier)) {
            setOtpSend(true);
            const provider = new firebase.auth.PhoneAuthProvider();
            provider
              .verifyPhoneNumber(mobileNumber, window.recaptchaVerifier)
              .then(verificationId => {
                setMobileCallBackValue(mobileNumber);
                setVerificationId(verificationId);
                setIsPhoneNoConfirmFormEnabledYN(false);
                setIsOTPConfirmFormEnabledYN(true);
                setLoader(false);
              })
              .catch(error => {
                setLoader(false);
                setMobileCallBackValue('');
                toastMessage('error', error.message);
              });
          } else {
            setLoader(false);
            setMobileCallBackValue('');
            toastMessage('error', 'Please verify your Capcha');
          }
        } else {
          setLoader(false);
          setMobileCallBackValue('');
          toastMessage('error', 'Please enter your mobile number');
        }
      } catch (error) {
        setLoader(false);
        setMobileCallBackValue('');
        toastMessage('renderError', error.message);
      }
    } else {
      // toastMessage('renderError','MOBILE_NO_IS_ALREADY_EXISTS')
    }
  }

  //when saving data
  try {
    // The component instance will be extended
    // with whatever you return from the callback passed
    // as the second argument
    useImperativeHandle(ref, () => ({
      getMobileNumberValue() {
        let variable = {
          mobileNumber: mobileNumber === undefined ? '' : mobileNumber,
          mobileCallBackValue: mobileNumber === undefined ? '' : mobileCallBackValue,
          mobileNumberValue: mobileNumberValue === undefined ? '' : mobileNumberValue,
          countryCode: countryCode === undefined ? '' : countryCode,
        };
        return variable;
      },
    }));
  } catch (error) {
    toastMessage('renderError', error);
  }

  //loader
  function renderLoader() {
    if (loader === true) {
      return (
        <div>
          <Loader />
        </div>
      );
    }
  }

  //Set countrycode
  useEffect(() => {
    let data = mobileNumber.split(' ');
    let mobileNumberArray = [];
    data.map(res => {
      if (_.startsWith(res, '+')) {
        setCountryCode(res);
      } else {
        mobileNumberArray.push(res);
      }
    });
    setMobileNumberValue(mobileNumberArray.join(''));
  }, [mobileNumber, country]);

  async function updateMobileNumber(event) {
    console.log('updateMobileNumber', event);
    event.preventDefault();
    if (
      mobileNumberValue !== '' &&
      mobileNumberValue !== null &&
      mobileNumberValue &&
      countryCode &&
      countryCode != null &&
      countryCode != ''
    ) {
      if (mobileNumber === mobileCallBackValue && props.role === 'customer') {
        try {
          let variables = {
            customerId: props.id,
            customerSalutation: props.salutation ? props.salutation : null,
            customerFirstName: props.firstName,
            customerLastName: props.lastName,
            customerGender: null,
            customerDob: props.dob ? props.dob : null,
            customerMobileNumber: mobileNumberValue,
            customerMobileCountryCode: countryCode,
          };
          await updateCustomerBasicInfo({
            variables,
          });
        } catch (error) {
          toastMessage('renderError', error.message);
        }
      } else if (props.role === 'customer') {
        toastMessage('error', 'Please verify your mobile number');
      }
    }
    if (
      mobileNumberValue !== '' &&
      mobileNumberValue !== null &&
      mobileNumberValue &&
      countryCode &&
      countryCode != null &&
      countryCode != ''
    ) {
      if (mobileNumber === mobileCallBackValue && props.role === 'chef') {
        try {
          let variables = {
            chefId: props.id,
            chefSalutation:
              props.salutation === '' || props.salutation === null ? null : props.salutation,
            chefFirstName: props.firstName,
            chefLastName: props.lastName,
            chefGender: props.gender === '' || props.gender === null ? null : props.gender,
            chefDob: props.dob ? props.dob : null,
            chefMobileNumber: mobileNumberValue,
            chefMobileCountryCode: countryCode,
          };
          await updateChefBasicInfo({
            variables,
          });
        } catch (error) {
          toastMessage('renderError', error.message);
        }
      } else if (props.role === 'chef') {
        toastMessage('error', 'Please verify your mobile number');
      }
    }
  }

  //unlink the existing phone number
  function unlinkMobileNumber(event) {
    if (firebase.auth().currentUser) {
      if (firebase.auth().currentUser.phoneNumber) {
        firebase
          .auth()
          .currentUser.unlink('phone')
          .then(() => {
            linkMobile(event);
          })
          .catch(error => {
            setMobileCallBackValue('');
            toastMessage('error', error.message);
          });
      } else {
        linkMobile(event);
      }
    } else {
      setMobileCallBackValue('');
      toastMessage('error', 'Current user is not available');
    }
  }

  //Link the mobile number
  function linkMobile(event) {
    setLoader(true);
    if (otpCode != null && otpCode != '') {
      let phoneCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, otpCode);
      if (phoneCredential) {
        firebase
          .auth()
          .currentUser.linkWithCredential(phoneCredential)
          .then(res => {
            setLoader(false);
            updateMobileNumber(event);
            setOtpSend(false);
            setMobileNumberEnable(true);
          })
          .catch(error => {
            setLoader(false);
            setMobileCallBackValue('');
            toastMessage('error', error.message);
          });
      } else {
        setLoader(false);
        setMobileCallBackValue('');
      }
    } else {
      setLoader(false);
      toastMessage('error', 'OTP Code is not submitted');
    }
  }

  function confirmOTP(event) {
    console.log('confirmOTP', event);
    try {
      unlinkMobileNumber(event);

      // setLoader(true);
      // if (otpCode != null && otpCode != '') {
      //   let phoneCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, otpCode);
      //   if (phoneCredential) {
      //     firebase
      //       .auth()
      //       .signInWithCredential(phoneCredential)
      //       .then(auth => {
      //         console.log('confirmOTP', auth);
      //         setLoader(true);
      //         unlinkMobileNumber(phoneCredential);
      //       })
      //       .catch(err => {
      //         setLoader(false);
      //         console.log(err);
      //         toastMessage('renderError', err.message);
      //       });
      //   } else {
      //     setLoader(false);
      //     setMobileCallBackValue('');
      //   }
      // } else {
      //   setLoader(false);
      //   toastMessage('error', 'OTP Code is not submitted');
      // }
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }

  console.log(
    'isVerified',
    isVerified,
    props.screen,
    props.screen !== 'register1',
    props.screen !== 'basic'
  );

  return (
    <React.Fragment>
      <div>
        {/* Phone No Enter Form */}
        {isPhoneNoConfirmFormEnabledYN == true && isOTPConfirmFormEnabledYN == false && (
          <div className="form-group Verification" id="number-verification">
            <label>{s.MOBILE_NUMBER}</label>
            {/* <div className="row"> */}
            <PhoneInput
              placeholder="Enter mobile number"
              required
              className="flag-image"
              country="US"
              inputComponent={SmartInput}
              displayInitialValueAsLocalNumber={false}
              value={formatPhoneNumberIntl(mobileNumber)}
              onChange={phone => {
                setMobileNumber(formatPhoneNumberIntl(phone));
              }}
              onCountryChange={code => {
                setCountry(code);
              }}
            />
            <br />
            {renderLoader()}
            {props.screen !== 'register1' && isVerified === false && (
              <div
                className="form-group"
                class="verificaton-button-view"
                style={{ display: 'flex', justifycontent: 'center' }}
              >
                <button
                  id="recaptcha-container"
                  type="button"
                  className="btn btn-primary"
                  onClick={phoneVerify}
                >
                  Verify Mobile Number
                </button>
              </div>
            )}
          </div>
        )}

        {/* OTP Confirm Form */}
        {isPhoneNoConfirmFormEnabledYN == false && isOTPConfirmFormEnabledYN == true && (
          <div className="form-group Verification" id="number-verification">
            <input
              type="text"
              className="form-control  inputView"
              placeholder="Enter OTP Code"
              required
              value={otpCode}
              onChange={event => {
                setOtpCode(event.target.value);
              }}
            />
            <br />
            {renderLoader()}
            <div className="form-group" class="verificaton-button-view">
              <button
                type="button"
                id="recaptcha-container"
                className="btn btn-primary"
                onClick={event => confirmOTP(event)}
              >
                Confirm OTP
              </button>
            </div>
            <br />
            <div className="form-group" class="verificaton-button-view">
              <button
                id="recaptcha-container"
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setIsOTPConfirmFormEnabledYN(false);
                  setIsPhoneNoConfirmFormEnabledYN(true);
                }}
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}
        {props.screen &&
          props.screen !== 'register1' &&
          props.screen !== 'basic' &&
          isVerified === true && (
            <div className="basicInfoSave col-sm-2">
              <button
                onClick={event => skipFunction(event)}
                className="btn btn-primary"
                id="shared-next-button"
                style={{ width: 'fit-content' }}
              >
                Next
              </button>
              <br />
            </div>
          )}
      </div>
    </React.Fragment>
  );
});

export default MobileNumberVerification;
