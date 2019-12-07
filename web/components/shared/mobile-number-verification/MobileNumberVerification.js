import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import _ from 'lodash';
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

  useEffect(() => {
    if (isObjectEmpty(props)) {
      setMobileNumber(props.countryCode + ' ' + props.mobileNumber);
      setMobileCallBackValue(props.countryCode + ' ' + props.mobileNumber);
    }
  }, [props.mobileNumber]);

  async function checkMobileAndEmailDataExistsOrNot(emailData, mobileData, userId) {
    //Query for check mobile number exist or not

    let data = {
      pEmail: null,
      pMobileNo: mobileData ? mobileData : '',
      pUserId: null,
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


  async function phoneVerify() {


    const checkMobileNumberAndEmail = await checkMobileAndEmailDataExistsOrNot(
      props.email,
      props.countryCode + props.mobileNumber,
      props.userId
    );
    if(checkMobileNumberAndEmail){
    try {
      if (isNumberEmpty(mobileNumber)) {
        setLoader(true);
        if (!isObjectEmpty(window.recaptchaVerifier)) {
          // 'recaptcha-container' is the ID of an element in the DOM.
          window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            size: 'invisible',
            // other options
          });
        }
        if (isObjectEmpty(window.recaptchaVerifier)) {
          setOtpSend(true);
          const provider = new firebase.auth.PhoneAuthProvider();
          provider
            .verifyPhoneNumber(mobileNumber, window.recaptchaVerifier)
            .then(verificationId => {
              setLoader(false);
              const verificationCode = window.prompt(
                'Please enter the verification ' + 'code that was sent to your mobile device.'
              );
              return firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
            })
            .then(function(phoneCredential) {
              return firebase.auth().signInWithCredential(phoneCredential);
            })
            .then(() => {
              setOtpSend(false);
              setMobileNumberEnable(true);
              toastMessage('success', 'Mobile number verified Successfully');
              setMobileCallBackValue(mobileNumber);
            })
            .catch(error => {
              setLoader(false);
              setMobileCallBackValue('');
              // toastMessage('error', error.message);
            });
        } else {
          setLoader(false);
          setMobileCallBackValue('');
          // toastMessage('error', 'Please verify your Capcha');
        }
      } else {
        setLoader(false);
        setMobileCallBackValue('');
        toastMessage('error', 'Please enter your mobile number');
      }
    } catch (error) {
      setLoader(false);
      setMobileCallBackValue('');
      // toastMessage('renderError', error.message);
    }}
    else{
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

  // console.log('countryCode', countryCode, mobileNumberValue);
  return (
    <React.Fragment>
      <div className="form-group Verification">
        <label>{s.MOBILE_NUMBER}</label>
        <PhoneInput
          disabled={mobileNumberEnable}
          placeholder="Enter mobile number"
          required
          // className={s.FORM_CONTROL}
          className="flag-image"
          country="US"
          inputComponent={SmartInput}
          displayInitialValueAsLocalNumber={false}
          value={formatPhoneNumberIntl(mobileNumber)}
          onChange={phone => setMobileNumber(formatPhoneNumberIntl(phone))}
          onCountryChange={code => setCountry(code)}
        />
      </div>
      {renderLoader()}
      {props.pageType &&
        props.pageType === 'Basic Informatiom' &&
        mobileNumber &&
        mobileNumberEnable === false && (
          <div className="form-group">
            <button
              id="recaptcha-container"
              type="button"
              className="btn btn-primary"
              onClick={phoneVerify}
            >
              {otpSend === true ? 'Resend OTP' : 'Verify Mobile Number'}
            </button>
          </div>
        )}
    </React.Fragment>
  );
});

export default MobileNumberVerification;
