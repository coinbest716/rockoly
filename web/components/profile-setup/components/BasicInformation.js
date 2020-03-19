import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import ModernDatepicker from 'react-modern-datepicker';
import moment from 'moment';
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
import s from '../ProfileSetup.String';
import MobileNumberVerification from '../../shared/mobile-number-verification/MobileNumberVerification';
import { createApolloClient } from '../../../apollo/apollo';

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

const apolloClient = createApolloClient();

const BasicInformation = props => {
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
  const [mobileDate, setMobileData] = useState();
  const [invalidDate, setInvalidDate] = useState(false);

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
            ? moment(new Date(data.customerDob)).format('MM/DD/YYYY')
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
      let chefData = props.details;
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

        setDob(
          util.isStringEmpty(data.chefDob)
            ? moment(new Date(data.chefDob)).format('MM/DD/YYYY')
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

  //when onchaning value of fields
  function onChangeValue(event, stateAssign) {
    try {
      if (util.isObjectEmpty(event)) {
        stateAssign(event.target.value);
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  function onChangeDate(date, startAssign) {
    try {
      startAssign(date);
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }
  async function checkMobileAndEmailDataExistsOrNot(emailData, mobileData, userId) {
    //Query for check mobile number exist or not

    let data = {
      pEmail: emailData ? emailData : '',
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

  //when saving data
  async function handleSubmit(e) {
    e.preventDefault();
    if (invalidDate === false) {
      let sliceDate = moment(dob).format('YYYY');
      let dobSlice = moment(new Date()).format('YYYY');
      if (util.isStringEmpty(dob) && sliceDate && dobSlice) {
        if (parseInt(dobSlice) - parseInt(sliceDate) >= 18) {
          try {
            e.preventDefault();

            // const mobileData = await childRef.current.getMobileNumberValue();

            //setMobileNumber(mobileData.mobileNumberValue);

            // if (gender !== '') {
            // if (salutationValue !== 0) {
            // if (mobileData.mobileNumber === mobileData.mobileCallBackValue) {
            // const checkMobileNumberAndEmail = await checkMobileAndEmailDataExistsOrNot(
            //   email,
            //   mobileData.countryCode + ' ' + mobileData.mobileNumberValue,
            //   userId
            // );
            if (props.role === customer) {
              customerUserSubmit();
              // customerUserSubmit()
            } else if (props.role === chef) {
              updateChefBasicInfo({
                variables: {
                  chefId: props.id,
                  chefSalutation: null,
                  chefFirstName: firstName,
                  chefLastName: lastName ? lastName : null,
                  chefGender: null,
                  chefDob: util.isStringEmpty(dob) ? moment(dob, 'MM/DD/YYYY').format() : null,
                  // chefMobileNumber: mobileData.mobileNumberValue,
                  // chefMobileCountryCode: mobileData.countryCode,
                },
              });
            } else {
              toastMessage(error, 'MOBILE_NO_IS_ALREADY_EXISTS');
            }
            // } else {
            //   toastMessage(error, 'Please verify your phone number');
            // }
            // } else {
            //   toastMessage('error', 'Enter gender to submit');
            // }
          } catch (error) {
            // console.log('toastMessage', error);
            toastMessage(error, error);
          }
          //
        } else {
          toastMessage('error', 'AGE_LIMIT');
        }
      } else {
        try {
          e.preventDefault();
          if (props.role === customer) {
            customerUserSubmit();
            // customerUserSubmit()
          } else if (props.role === chef) {
            updateChefBasicInfo({
              variables: {
                chefId: props.id,
                chefSalutation: null,
                chefFirstName: firstName,
                chefLastName: lastName ? lastName : null,
                chefGender: null,
                chefDob: util.isStringEmpty(dob) ? moment(dob, 'MM/DD/YYYY').format() : null,
              },
            });
          } else {
            toastMessage(error, 'MOBILE_NO_IS_ALREADY_EXISTS');
          }
        } catch (error) {
          // console.log('toastMessage', error);
          toastMessage(error, error);
        }
      }
    } else if (invalidDate === true) {
      toastMessage(error, 'Please enter valid date format');
    }
  }
  //mobileData
  async function customerUserSubmit() {
    try {
      await updateCustomerBasicInfo({
        variables: {
          customerId: props.id,
          customerSalutation: null,
          customerFirstName: firstName,
          customerLastName: lastName ? lastName : null,
          customerGender: null,
          customerDob: util.isStringEmpty(dob) ? moment(dob, 'MM/DD/YYYY').format() : null,
          // customerMobileNumber: mobileData.mobileNumberValue,
          // customerMobileCountryCode: mobileData.countryCode,
        },
      });
    } catch (error) {
      toastMessage(renderError, error.message);
      //console.log(error.message);
    }
  }
  function onSelectSalutation(event) {
    if (event.target.selectedIndex === 0) {
      setSalutation('MR');
    } else if (event.target.selectedIndex === 1) {
      setSalutation('MISS');
    } else if (event.target.selectedIndex === 2) {
      setSalutation('MRS');
    } else {
      setSalutation('');
    }
  }
  function selectGender(selectedValue) {
    // console.log(selectedValue)
    setGender(selectedValue);
  }

  //Check the dob format
  useEffect(() => {
    let dobDateValue = new Date(dob);
    if (dobDateValue && dob) {
      console.log('dobDateValue', dobDateValue, dob);
      if (dob.match(/^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/)) {
        const dateStr = dobDateValue.toString().split('/');
        if (dateStr && dateStr[0] === 'Invalid Date') {
          setInvalidDate(true);
        } else {
          setInvalidDate(false);
        }
      } else if (!dob.match(/^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/)) {
        setInvalidDate(true);
      }
    }
  }, [dob]);

  try {
    return (
      <React.Fragment>
        <section className="products-collections-area  ProfileSetup">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-10">
                <div className="login-content" id="basicInfoContainer">
                  <div className="container">
                    <div className="signup-content">
                      <div className="section-title" id="title-content">
                        <h2>Basic Profile</h2>
                      </div>
                      {/* {props.role === chef && (
                        <div className="form-group">
                          <label>Salutation</label>
                          <div>
                            {salutation === 'MR' && (
                              <select
                                id="selectID"
                                className="form-control-radio"
                                onChange={() => onSelectSalutation(event)}
                              >
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                              </select>
                            )}
                            {salutation === 'MISS' && (
                              <select
                                id="selectID"
                                className="form-control-radio"
                                onChange={() => onSelectSalutation(event)}
                              >
                                <option value="Mr">Mr</option>
                                <option value="Ms" selected="selected">
                                  Ms
                                </option>
                                <option value="Mrs">Mrs</option>
                              </select>
                            )}
                            {salutation === 'MRS' && (
                              <select
                                id="selectID"
                                className="form-control-radio"
                                onChange={() => onSelectSalutation(event)}
                              >
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs" selected="selected">
                                  Mrs
                                </option>
                              </select>
                            )}
                            {(salutation === '' || salutation === null) && (
                              <select
                                id="selectID"
                                className="form-control-radio"
                                onChange={() => onSelectSalutation(event)}
                              >
                                <option value="Select Salutation">Select Salutation</option>
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                              </select>
                            )}
                          </div>
                        </div>
                      )} */}
                      <div className="form-group">
                        <label>First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your name"
                          id="fname"
                          name="fname"
                          required={true}
                          data-error="Please enter your first name"
                          value={firstName}
                          onChange={event => onChangeValue(event, setFirstName)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your last name"
                          id="lname"
                          name="lname"
                          data-error="Please enter your last name"
                          value={lastName}
                          onChange={event => onChangeValue(event, setLastName)}
                        />
                      </div>
                      {/* {props.role === chef && (
                        <div className="gender">
                          <div>
                            <label>GENDER</label>
                            {gender === 'MALE' && (
                              <div className="radiobuttons">
                                <p>
                                  <input
                                    type="radio"
                                    checked
                                    name="radio-group"
                                    onClick={() => selectGender('MALE')}
                                  />
                                  MALE
                                </p>
                                <p>
                                  <input
                                    type="radio"
                                    name="radio-group"
                                    onClick={() => selectGender('FEMALE')}
                                  />
                                  FEMALE
                                </p>
                              </div>
                            )}
                            {gender === 'FEMALE' && (
                              <div className="radiobuttons">
                                <p>
                                  <input
                                    type="radio"
                                    name="radio-group"
                                    onClick={() => selectGender('MALE')}
                                  />
                                  MALE
                                </p>
                                <p>
                                  <input
                                    type="radio"
                                    checked
                                    name="radio-group"
                                    onClick={() => selectGender('FEMALE')}
                                  />
                                  FEMALE
                                </p>
                              </div>
                            )}
                            {gender === '' && (
                              <div className="radiobuttons">
                                <p>
                                  <input
                                    type="radio"
                                    name="radio-group"
                                    onClick={() => selectGender('MALE')}
                                  />
                                  MALE
                                </p>
                                <p>
                                  <input
                                    type="radio"
                                    name="radio-group"
                                    onClick={() => selectGender('FEMALE')}
                                  />
                                  FEMALE
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )} */}
                      {/* <div className="form-group">
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
                      </div> */}

                      <div className="form-group">
                        <label>Date Of Birth</label>
                        <br />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your data of birth (MM/DD/YYYY)"
                          id="dob"
                          name="dob"
                          data-error="Please enter your dob"
                          value={dob}
                          onChange={date => onChangeDate(date.target.value, setDob)}
                        />
                        {/* <ModernDatepicker
                          date={dob}
                          format={'MM-DD-YYYY'}
                          showBorder
                          maxDate={new Date()}
                          onChange={date => onChangeDate(date, setDob)}
                          placeholder={'Select a date'}
                          color={'#d9b44a'}
                          data-error="Please enter your email"
                        /> */}
                      </div>
                      {/* <MobileNumberVerification
                        ref={childRef}
                        mobileNumber={mobileNumber}
                        countryCode={countryCode}
                        email = {email}
                        pageType={'Basic Informatiom'}
                        userId = {userId}
                      /> */}
                      {/* {props.role === customer && <CommonLocation ref={childRef} props={props} />} */}
                      {/* </form> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-sm-2"> */}
            <div className="basicInfoSave col-sm-2">
              <button
                type="submit"
                onClick={event => handleSubmit(event)}
                className="btn btn-primary"
                id="shared-next-button"
                style={{ width: 'fit-content' }}
              >
                Save
              </button>
              <br />
            </div>
            {/* </div> */}
          </form>
        </section>
      </React.Fragment>
    );
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

export default BasicInformation;
