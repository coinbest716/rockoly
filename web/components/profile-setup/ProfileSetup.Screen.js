// TOdo-cr-si remove unused code
import React, { useRef, useEffect, useState, useContext } from 'react';
import { useQuery, useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Router from 'next/router';
// import Page from '../shared/layout/Main';
import Navbar from '../shared/layout/Navbar';
import Footer from '../shared/layout/Footer';
import LeftSidebar from '../shared/sidebar/LeftSidebar';
import MobileVerification from '../shared/mobile-number/MobileNumberVerification';
import Description from './components/Description';
import Specialization from './components/Specialization';
import Availability from './components/availability/Availability';
import UploadFile from './components/UploadFile';
import BasicInformation from './components/BasicInformation';
import CurrentLocation from './components/Location';
import Preference from '../shared/preferences/Preference';
import BaserateScreen from '../shared/chef-profile/base-rate/BaseRate.Screen';
import ChefPreference from '../shared/chef-profile/chef-preference/ChefPreference';
import ImageGallery from '../shared/chef-profile/image-gallery/ImageGallery';
import LicenseUpload from '../shared/chef-profile/license-upload/LicenseUpload';
import AllergyUpdate from '../shared/preferences/components/AllergyUpdate';
import FavoriteCuisine from '../shared/preferences/components/FavouriteCuisine';
import DietaryRestrictions from '../shared/preferences/components/DietaryrestrictionsUpdate';
import KitchenUtensilsUpdate from '../shared/preferences/components/KitchenUtensilUpdate';
import PriceCalculator from '../shared/chef-profile/pricing-page/PriceCalculator';
import UserEmail from '../shared/email/UserEmail';
import * as gqlTag from '../../common/gql';
import Link from 'next/link';
import Loader from '../Common/loader';
import {
  getChefId,
  getCustomerId,
  chefId,
  chef,
  customer,
  getUserTypeRole,
  customerId,
  getCustomerAuthData,
  getChefAuthData
} from '../../utils/UserType';
import { firebase } from '../../config/firebaseConfig';
import * as util from '../../utils/checkEmptycondition';
import { toastMessage } from '../../utils/Toast';
import S from './ProfileSetup.String';
import { GetValueFromLocal } from '../../utils/LocalStorage';
import SharedProfile from '../shared-profile/Sharedprofile.Screen';
import ProfilePictureUpload from '../shared/profile-picture/ProfilePicture';
import Complexity from '../shared/chef-profile/complexity/Complexity.Screen';
import PersonalInformationScreen from '../shared/chef-profile/personal-info/PersonalInformation.Screen';
import n from '../routings/routings';
import PaymentsScreen from '../payments/Payments.Screen';
import ChangePassword from '../auth/change-password/ChangePassword.screen';
import TermsConditions from '../terms-and-conditions/TermsConditions.Screens';
import PrivacyAndPolicy from '../privacy-policy/PrivacyPolicy.Screens';
import { AppContext } from '../../context/appContext';
import { NavigateToRequest, NavigateToHome, NavigateToChangePassword } from './components/Navigation';
import { StoreInLocal } from '../../utils/LocalStorage';



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

// update profile data submit for chef
const updateChefProfileSubmit = gqlTag.mutation.chef.submitForReviewGQLTAG;
const UPDATE_CHEF_PROFILE_SUBMIT = gql`
  ${updateChefProfileSubmit}
`;

// gql for subscription for chef
const chefProfileSubscription = gqlTag.subscription.chef.ProfileGQLTAG;
const CHEF_SUBSCRIPTION_TAG = gql`
  ${chefProfileSubscription}
`;

// gql for subscription for chef specialization
const chefSpecializationSubscription = gqlTag.subscription.chef.specializationGQLTAG;
const SPECIALIZATION_SUBSCRIPTION = gql`
  ${chefSpecializationSubscription}
`;
// for chef location
const chefLocationSubscription = gqlTag.subscription.chef.profileExtendedGQLTAG;
const CHEF_LOCATION_SUBS = gql`
  ${chefLocationSubscription}
`;

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

const unAvailabilitySubs = gqlTag.subscription.chef.notAvailabilityGQLTAG;
const UNAVAILABILITY_SUBSCRIPTION = gql`
  ${unAvailabilitySubs}
`;

//Update notification for chef
const updateNotificationChefTag = gqlTag.mutation.chef.updateNotificationGQLTAG;

const UPDATE_NOTIFICATION_CHEF = gql`
  ${updateNotificationChefTag}
`
//Update notification for customer
const updateNotificationCustomerTag = gqlTag.mutation.customer.updateNotificationGQLTAG;

const UPDATE_NOTIFICATION_CUSTOMER = gql`
  ${updateNotificationCustomerTag}
`;

//login auth qgl tag
const updateAuthentication = gqlTag.mutation.auth.switchRoleGQLTAG;

const LOGIN_AUTH = gql`
  ${updateAuthentication}
`;

// Get GQL Tags
const chefProfileGQLTAG = gqlTag.query.chef.profileByIdGQLTAG;

const GET_PROFILE_DATA = gql`
  ${chefProfileGQLTAG}
`;

const ProfileSetupScreen = props => {
  const childRef = useRef();
  const [keys, setkeys] = useState(parseInt(props.keyValuue));
  // console.log("props.keyValue", parseInt(props.keyValue));
  // const [keys, setkeys] = useState(2);
  const [ProfileDetails, setProfileDetails] = useState([]);
  const [customerProfileDetails, setCustomerProfileDetails] = useState([]);
  const [isFromRegister, setisFromRegister] = useState(props.isFromRegister);
  const [chefDetails, setChefDetails] = useState({});
  const [customerDetails, setCustomerDetails] = useState({});
  const [chefIdValue, setChefId] = useState(null);
  const [customerIdValue, setCustomerId] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [chefStatusId, setChefStatusId] = useState('');
  const [isFilledYn, setIsFilledYn] = useState(false);
  const [load, setLoading] = useState(false);
  const [roleType, setRoleType] = useState('');
  const [reason, setReason] = useState('');
  const [isRegistrationCompletedYn, setIsRegistrationCompletedYn] = useState(false);
  const [mobileNumberVerified, setMobileNumberVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [notification, setNotification] = useState(false);
  const [state, setState] = useContext(AppContext);

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

  const { chefProfileSubsdata } = useSubscription(CHEF_SUBSCRIPTION_TAG, {
    variables: { chefId: chefIdValue },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.chefProfile) {
        getChefDataByProfile();
      }
    },
  });

  const { chefSpecializationSubsdata } = useSubscription(SPECIALIZATION_SUBSCRIPTION, {
    variables: { chefId: chefIdValue },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.chefSpecializationProfile) {
        getChefDataByProfile();
      }
    },
  });
  const { chefLocationSubs } = useSubscription(CHEF_LOCATION_SUBS, {
    variables: { chefId: chefIdValue },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.chefProfileExtended) {
        getChefDataByProfile();
      }
    },
  });

  const { SubscriptionCustomerdata } = useSubscription(CUSTOMER_SUBSCRIPTION_TAG, {
    variables: { customerId: customerIdValue },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.customerProfile) {
        getCustomerData();
      }
    },
  });
  const { customerLocationSubs } = useSubscription(CUSTOMER_LOCATION_SUBS, {
    variables: { customerId: customerIdValue },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.customerProfileExtended) {
        getCustomerData();
      }
    },
  });

  console.log("UPDATE_CHEF_PROFILE_SUBMIT", UPDATE_CHEF_PROFILE_SUBMIT)
  const [updateChefProfileSubmit, responseForProfileSubmit] = useMutation(
    UPDATE_CHEF_PROFILE_SUBMIT,
    {
      onCompleted: responseForProfileSubmit => {
        toastMessage('success', 'Submitted successfully');
        setRemoveModal(false);
      },
      onError: err => {
        toastMessage('error', err);
      },
    }
  );

  //Update notification for chef
  const [updateNotificationChef] = useMutation(UPDATE_NOTIFICATION_CHEF, {
    onCompleted: () => {
      toastMessage("success", S.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  //Update notification for customer
  const [updateNotificationCustomer] = useMutation(UPDATE_NOTIFICATION_CUSTOMER, {
    onCompleted: () => {
      toastMessage("success", S.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });


  // update profile data submit for chef

  async function onClickSubmit() {
    if (emailVerified === true && mobileNumberVerified === true) {
      let variables = {
        pChefId: chefIdValue,
      };
      await updateChefProfileSubmit({
        variables,
      });
    } else {
      toastMessage('error', S.VERIFIED_ALERT);
    }
  }

  //get chef id
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
              getCustomerData();
            })
            .catch(err => { });
        } else {
          //chef user
          getChefId(chefId)
            .then(async chefResult => {
              await setChefId(chefResult);
            })
            .catch(err => { });
        }
      })
      .catch(err => { });
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

  //set user data
  useEffect(() => {
    if (userRole === customer) {
      setCustomerDetails(data);
    } else {
      setChefDetails(data);
    }
  }, [data]);

  useEffect(() => {
    // getting chef's details
    if (
      util.isObjectEmpty(chefData) &&
      util.hasProperty(chefData, 'data') &&
      util.isObjectEmpty(chefData.data) &&
      util.hasProperty(chefData.data, 'chefProfileByChefId') &&
      util.isObjectEmpty(chefData.data.chefProfileByChefId)
    ) {
      let chefDetails = chefData.data.chefProfileByChefId;
      setIsRegistrationCompletedYn(chefDetails.isRegistrationCompletedYn);
      setProfileDetails(chefDetails);
      setChefStatusId(chefDetails.chefStatusId.trim());
      let data = JSON.parse(chefDetails.isDetailsFilledYn);
      setIsFilledYn(data.isFilledYn);
      let reason = chefDetails.chefRejectOrBlockReason ? chefDetails.chefRejectOrBlockReason : '';
      setReason(reason);
    } else {
      setProfileDetails(null);
    }
  }, [chefData]);

  useEffect(() => {
    // getting customer's details
    if (
      util.isObjectEmpty(data) &&
      util.hasProperty(data, 'customerProfileByCustomerId') &&
      util.isObjectEmpty(data.customerProfileByCustomerId)
    ) {
      setCustomerProfileDetails(data.customerProfileByCustomerId);
    } else {
      setCustomerProfileDetails(null);
    }
  }, [data]);

  //when changing sidebar menu
  function onChangeMenu(key) {
    setkeys(key);
  }

  useEffect(() => {
    setkeys(parseInt(props.keyValue))
  }, [props.keyValue])

  //check and set admin user
  useEffect(() => {
    if (localStorage.getItem('loggedInAs') !== null) {
      GetValueFromLocal('loggedInAs')
        .then(result => {
          if (result === 'Admin') {
            setRoleType(result);
          }
        })
        .catch(err => {
          //console.log('err', err);
        });
    }
  });

  //Check email and mobile number verified or not
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        if (user.phoneNumber) {
          setMobileNumberVerified(true);
        }
        if (user.emailVerified) {
          setEmailVerified(true);
        }
      }
    });
  });

  //update state values
  useEffect(() => {
    if (state && state.role === chef) {
      if (util.isObjectEmpty(state.chefProfile) && state.chefProfile.isNotificationYn) {
        setNotification(state.chefProfile.isNotificationYn);
      }
    } else {
      if (util.isObjectEmpty(state.customerProfile) && state.customerProfile.isNotificationYn) {
        setNotification(state.customerProfile.isNotificationYn);
      }
    }
  }, [state]);


  const [getChefIds, chefDatas] = useLazyQuery(GET_PROFILE_DATA);
  const [loginAuthMutation, switchData] = useMutation(LOGIN_AUTH, {
    onCompleted: success => {
      let payload = success.switchUserByRole;
      if (util.hasProperty(payload, 'json')) {
        let jsonObj = JSON.parse(payload.json);
        if (jsonObj.role == "CHEF") {
          // getChefIds({
          //   chefId: jsonObj.chef.chefId,
          // });
          setChefId(jsonObj.chef.chefId);
          getChefDataByProfile();
        }
        else {
          getCustomerData();
        }
      }
    },
    // onError: err => {
    //   toastMessage(renderError, err.message);
    // },
  });

  //get & set user id's in local storage after getting firebase token and calling mutation
  useEffect(() => {
    try {
      if (switchData && switchData.data && switchData.data.switchUserByRole && switchData.data.switchUserByRole.json) {
        setAuthData(switchData.data.switchUserByRole.json);
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }, [switchData]);

  async function setAuthData(data) {
    if (data !== undefined) {
      let parseData = JSON.parse(data);
      //for customer login
      if (util.isObjectEmpty(state) && state.role === chef) {
        getCustomerAuthData(parseData)
          .then(customerRes => {
            toastMessage("success", 'Switched User Succesfully');
            setUserRole(customer);
            StoreInLocal('user_ids', customerRes);
            StoreInLocal('user_role', customer);
            StoreInLocal('selected_menu', 'home_page');
            if (window.location.pathname === '/') {
              window.location.reload();
            }
            else {
              NavigateToHome();
            }
          })
          .catch(error => {
            toastMessage("renderError", error.message);
          });
      }
      //for chef login
      else {
        getChefAuthData(parseData)
          .then(chefRes => {
            toastMessage("success", 'Switched User Succesfully');
            setUserRole(chef);
            StoreInLocal('user_ids', chefRes);
            StoreInLocal('user_role', chef);
            StoreInLocal('selected_menu', 'home_page');
            const variables = {
              chefId: chefRes.chefId,
            };
            getChefIds({
              variables,
            });
            if (window.location.pathname === '/') {
              window.location.reload();
            }
            else {
              NavigateToHome();
            }
          })
          .catch(error => {
            toastMessage("renderError", error.message);
          });
      }
    }
  }

  // const [getChefIds, {switchChefData}] = useLazyQuery(GET_PROFILE_DATA);



  function onCloseModal() {
    try {
      setRemoveModal(false);
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }

  //call on Change Notification
  async function onChangeNotification() {
    setNotification(!notification);
    if (state.role === chef) {
      let variables = {
        chefId: state.chefId,
        isNotificationYn: !notification,
      };
      await updateNotificationChef({
        variables,
      });
    } else {
      let variables = {
        customerId: state.customerId,
        isNotificationYn: !notification,
      };
      await updateNotificationCustomer({
        variables,
      });
    }
  }


  //Switch user to chef role
  function onSwitchClick(e) {

    e.preventDefault();
    if (
      (util.isObjectEmpty(state) &&
        util.isObjectEmpty(state.customerProfile) &&
        util.isStringEmpty(state.customerProfile.customerEmail)) ||
      (util.isObjectEmpty(state) &&
        util.isObjectEmpty(state.chefProfile) &&
        util.isStringEmpty(state.chefProfile.chefEmail))
    ) {
      let variables = {
        pEmail:
          util.isObjectEmpty(state) && state.role === customer
            ? state.customerProfile
              ? state.customerProfile.customerEmail
              : ''
            : state.chefProfile
              ? state.chefProfile.chefEmail
              : '',
        pSwitchFrom: util.isObjectEmpty(state) && state.role === customer ? 'CUSTOMER' : 'CHEF',
        pSwitchTo: util.isObjectEmpty(state) && state.role === customer ? 'CHEF' : 'CUSTOMER',
      };
      console.log("variables", variables)
      loginAuthMutation({ variables });
    }
  }

  async function onLogout() {
    try {
      firebase
        .auth()
        .signOut()
        .then(async () => {
          // let keysToRemove = ['user_ids', 'selected_menu'];
          await localStorage.clear();
          toastMessage('success', 'Logged out Successfully');
          setTimeout(async function () {
            await StoreInLocal('chef_loggedIn', false);
            await StoreInLocal('selected_menu', 'home_page');
            await Router.push(n.HOME);
          }, 1000);
          setUserRole(false);
        })
        .catch(error => {
          toastMessage('error', error.message);
        });
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  };
  return (
    <React.Fragment>
      <Navbar />
      <section className="cart-area ptb-60 ProfileSetup">
        <div className="dashboard" style={{ width: '100%', overflowX: 'hidden' }}>
          {userRole === customer ? (
            <div className="row">
              <div className="col-sm-12 col-md-12  col-lg-3 siderbar-color" id="sidebar">
                <ProfilePictureUpload
                  details={customerDetails}
                  id={customerIdValue}
                  role={customer}
                />
                <LeftSidebar onChangeMenu={onChangeMenu} selectedMenuKey={keys} role={'customer'} />
              </div>
              <div className="col-lg-8 col-md-12 col-sm-12">
                {keys === 0 && (
                  <BasicInformation
                    details={customerDetails}
                    id={customerIdValue}
                    role={customer}
                  />
                )}
                {keys === 1 && (
                  <MobileVerification
                    screen={'basic'}
                    details={customerDetails}
                    id={customerIdValue}
                    role={customer}
                  />
                )}
                {keys === 2 && (
                  <UserEmail
                    screen={'basic'}
                    details={customerDetails}
                    id={customerIdValue}
                    role={customer}
                  />
                )}
                {keys === 3 && (
                  // <CommonLocation UserEmail details={customerDetails} ref={childRef} props={props} />
                  <CurrentLocation
                    details={customerDetails}
                    customerId={customerIdValue}
                    role={customer}
                  />
                )}
                {keys === 4 && (
                  <AllergyUpdate
                    details={customerDetails}
                    customerId={customerIdValue}
                    role={customer}
                  />
                )}
                {keys === 5 && (
                  <DietaryRestrictions
                    details={customerDetails}
                    customerId={customerIdValue}
                    role={customer}
                  />
                )}{' '}
                {keys === 6 && (
                  <KitchenUtensilsUpdate
                    details={customerDetails}
                    customerId={customerIdValue}
                    role={customer}
                  />
                )}{' '}
                {keys === 7 && (
                  < PaymentsScreen screen={'profile'} />
                )}
                {keys == 8 &&
                  <section className="cart-area ptb-60">
                    <div className="notification">
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <span>
                            <h6>Notification</h6>
                            <label className="switch">
                              <input
                                type="checkbox"
                                onClick={() => onChangeNotification()}
                                checked={notification}
                              />
                              <span
                                className="slider round"
                                style={{ width: '100%', height: '91%' }}
                              ></span>
                            </label>
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>
                }
                {keys == 9 &&
                  <div className="notification">
                    Under Development
                </div>
                }
                {keys == 10 &&
                  <div>
                    <button className="btn btn-primary buttonSwitch" onClick={(event) => onSwitchClick(event)}>
                      Switch To Chef
                  </button>
                  </div>
                }{keys == 11 &&
                  <ChangePassword screen={'profile'} />
                }{keys == 12 &&
                  <div className="notification">
                    Under Development
                </div>
                }
                {keys == 13 &&
                  < TermsConditions screen={'profile'} />
                }
                {keys == 14 &&
                  < PrivacyAndPolicy screen={'profile'} />
                }
                {keys == 15 &&
                  <div>
                    <button className="btn btn-primary buttonSwitch" onClick={(event) => onLogout()}>
                      Log Out
                  </button>
                  </div>
                }
              </div>{' '}
            </div>
          ) : (
              userRole === chef && (
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-lg-3 siderbar-color" id="sidebar">
                    <ProfilePictureUpload details={ProfileDetails} id={chefIdValue} role={chef} />
                    <LeftSidebar onChangeMenu={onChangeMenu} selectedMenuKey={keys} role={'chef'} />
                  </div>
                  <div className="col-lg-8 col-md-12-col-sm-12 " id="serviceView-containar">
                    <div>
                      {/* {keys !== 4 &&
                        <div id="status-content-view">
                          {chefStatusId === S.PENDING && (
                            <div>
                              <div className="statusMsg">
                                {S.PROFILE_STATUS}
                                <div className="response-view" style={{ paddingLeft: 5 }}>
                                  {' '}
                                  {' ' + S.REVIEW_PENDING}
                                </div>
                              </div>

                              <div className="statusMsg" id="failed">
                                <div className="response-view">{S.REVIEW_PENDING_MSG}</div>
                              </div>
                              {isRegistrationCompletedYn === true && (
                                <div className="basicInfoSubmit">
                                  <button
                                    type="submit"
                                    onClick={() => setRemoveModal(true)}
                                    className="btn btn-primary"
                                  >
                                    {S.SUBMIT}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                          {chefStatusId === S.REJECTED && (
                            <div>
                              <div className="statusMsg">
                                {S.PROFILE_STATUS}
                                <div className="response-view" style={{ paddingLeft: 5 }}>
                                  {S.REVIEW_REJECTED}
                                </div>
                              </div>
                              {isRegistrationCompletedYn === true && (
                                <div className="basicInfoSubmit">
                                  <button
                                    type="submit"
                                    onClick={() => setRemoveModal(true)}
                                    className="btn btn-primary"
                                  >
                                    {S.SUBMIT}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                          {chefStatusId === S.SUBMITTED_FOR_REVIEW && (
                            <div>
                              <div className="statusMsg">
                                {S.PROFILE_STATUS}
                                <div className="response-view" style={{ paddingLeft: 5 }}>
                                  {S.SUBMIT_FOR_REVIEW}
                                </div>
                              </div>
                            </div>
                          )}
                          {chefStatusId === S.APPROVED && (
                            <div>
                              <div className="statusMsg">
                                {S.PROFILE_STATUS}
                                <div className="response-view">{S.PROFILE_VERIFIED}</div>
                              </div>
                            </div>
                          )}
                          {util.isStringEmpty(reason) && (
                            <div className="statusMsg">
                              {S.REASON}
                              <div className="response-view">{reason}</div>
                            </div>
                          )}
                        </div>
                      } */}
                      <div className="adminStatus" id="status-full-view">

                        {keys === 0 && (
                          <BasicInformation details={ProfileDetails} id={chefIdValue} role={chef} />
                        )}
                        {keys === 1 && (
                          <MobileVerification
                            screen={'basic'}
                            details={ProfileDetails}
                            id={chefIdValue}
                            role={chef}
                          />
                        )}
                        {keys === 2 && (
                          <UserEmail
                            screen={'basic'}
                            chefDetails={ProfileDetails}
                            chefId={chefIdValue}
                            role={chef}
                          />
                        )}
                        {keys === 3 && (
                          <CurrentLocation
                            chefDetails={ProfileDetails}
                            chefId={chefIdValue}
                            role={chef}
                          />
                        )}
                        {keys === 4 && (
                          <PriceCalculator ProfileDetails={ProfileDetails} chefId={chefIdValue} />
                        )}
                        {keys === 5 && (
                          <BaserateScreen chefDetails={ProfileDetails} chefId={chefIdValue} />
                        )}
                        {console.log("keyskeyskeys", keys)}
                        {keys === 6 && (
                          <ChefPreference chefDetails={ProfileDetails} chefId={chefIdValue} />
                        )}
                        {keys === 7 && (
                          <Complexity isFromRegister={isFromRegister} chefId={chefIdValue} />
                        )}
                        {keys === 8 && (
                          <Specialization
                            isFromRegister={isFromRegister}
                            chefDetails={ProfileDetails}
                            chefId={chefIdValue}
                          />
                        )}
                        {/* {keys === 6 && <LicenseUpload chefId={chefIdValue} />} */}
                        {keys === 9 && <PersonalInformationScreen chefId={chefIdValue} />}
                        {keys === 10 && <Availability chefId={chefIdValue} />}
                        {keys === 11 && <ImageGallery chefId={chefIdValue} />}
                        {keys === 12 && <UploadFile chefId={chefIdValue} />}
                        {keys === 13 && (
                          < PaymentsScreen screen={'profile'} />
                        )}
                        {keys == 14 &&
                          <section className="cart-area ptb-60">
                            <div className="notification">
                              <div className="row">
                                <div className="col-lg-6 col-md-6">
                                  <span>
                                    <h6>Notification</h6>
                                    <label className="switch">
                                      <input
                                        type="checkbox"
                                        onClick={() => onChangeNotification()}
                                        checked={notification}
                                      />
                                      <span
                                        className="slider round"
                                        style={{ width: '100%', height: '91%' }}
                                      ></span>
                                    </label>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </section>
                        }{keys == 15 &&
                          <div className="notification">
                            Under Development
                        </div>
                        }{keys == 17 &&
                          <div>
                            <button className="btn btn-primary buttonSwitch" onClick={(event) => onSwitchClick(event)}>
                              Switch To Customer
                          </button>
                          </div>
                        }{keys == 18 &&
                          <div className="notification">
                            Under Development
                </div>
                        }
                        {keys == 19 &&
                          < TermsConditions screen={'profile'} />
                        }
                        {keys == 20 &&
                          < PrivacyAndPolicy screen={'profile'} />
                        }
                        {keys == 21 &&
                          <div>
                            <button className="btn btn-primary buttonSwitch" onClick={(event) => onLogout()}>
                              Log Out
                  </button>
                          </div>
                        }
                      </div>
                      {/* BaseRate PersonalInformationScreen*/}
                    </div>
                  </div>
                </div>
              )
            )}
        </div>
        {removeModal === true && (
          <div className={`bts-popup ${open ? 'is-visible' : ''}`} role="alert">
            <div className="bts-popup-container">
              <h6>Ready to submit your profile for review ?</h6>
              <p>You will be notified of your registration status within 48 hours.</p>
              <button type="submit" className="btn btn-success" onClick={() => onCloseModal()}>
                Cancel
              </button>{' '}
              <button type="button" className="btn btn-danger" onClick={() => onClickSubmit()}>
                Ok
              </button>
              <Link href="#">
                <a onClick={() => onCloseModal()} className="bts-popup-close"></a>
              </Link>
            </div>
          </div>
        )}
      </section>
      {roleType !== 'Admin' && <Footer />}
    </React.Fragment>
  );
};

export default ProfileSetupScreen;
