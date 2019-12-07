/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { ToastContainer } from 'react-toastify';
import { useQuery, useLazyQuery, useSubscription, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { firebase, auth,app } from '../../../config/firebaseConfig';
import * as gqlTag from '../../../common/gql';
import n from '../../../components/routings/routings';
import { menuOptions, rightSideMenuOptions } from './const/MenuOptions';
import { toastMessage, renderError, success, error } from '../../../utils/Toast';
import { StoreInLocal, GetValueFromLocal } from '../../../utils/LocalStorage';
import { AppContext } from '../../../context/appContext';
import { isStringEmpty, isObjectEmpty, hasProperty } from '../../../utils/checkEmptycondition';
import { chef, customer, getUserTypeRole } from '../../../utils/UserType';
import {
  getChefId, chefId, getCustomerId, customerId, getChefAuthData, CHEF,
  getCustomerAuthData
} from '../../../utils/UserType';
import * as util from '../../../utils/checkEmptycondition';
import S from './Strings';
import { NavigateToProfileSetup, NavigateToHome, NavigateToIntro } from './Navigation';

const chefProfilePicture = gqlTag.query.chef.profileByIdGQLTAG;
const customerProfilePicture = gqlTag.query.customer.profileByIdGQLTAG;

const CHEF_DISPLAY_PROFILE_PICTURE = gql`
  ${chefProfilePicture}
`;
const CUSTOMER_DISPLAY_PROFILE_PICTURE = gql`
  ${customerProfilePicture}
`;

const chefNotificationSubs = gqlTag.subscription.notification.byChefIdGQLTAG; // chef notification
const CHEF_NOTIFICATION = gql`
  ${chefNotificationSubs}
`;

const customerNotificationSubs = gqlTag.subscription.notification.byCustomerIdGQLTAG; //customer notification
const CUSTOMER_NOTIFICATION = gql`
  ${customerNotificationSubs}
`;
const chefProfileSubscription = gqlTag.subscription.chef.ProfileGQLTAG;
const CHEF_SUBSCRIPTION_TAG = gql`
  ${chefProfileSubscription}
  `;

const getTotalCountTag = gqlTag.query.custom.totalCountGQLTAG;

const GET_TOTAL_COUNT = gql`
  ${getTotalCountTag}
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


const MegaMenu = () => {
  // Declare a new state variable
  const [collapsed, setCollapsed] = useState(true);
  const [userRole, setUserRole] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState();
  const [chefIdValue, setChefId] = useState(null);
  const [customerIdValue, setCustomerId] = useState(null);
  const [ProfileDetails, setProfileDetails] = useState([]);
  const [customerProfileDetails, setCustomerProfileDetails] = useState([]);
  const [state, setState] = useContext(AppContext);
  const [roleType, setRoleType] = useState('');
  const [chefUnreadCount, setChefUnreadCount] = useState();
  const [customerunreadCount, setCustomerUnreadCount] = useState();
  const [loggedInType,setLoggedInType] = useState();
  // console.log('state123', state)
  const [getChefData, { data,error}] = useLazyQuery(CHEF_DISPLAY_PROFILE_PICTURE, {
    variables: { chefId: chefIdValue },
  });
  if(error){
    toastMessage('error',error)
  }

  const [getCustomer, getCustomerData] = useLazyQuery(CUSTOMER_DISPLAY_PROFILE_PICTURE, {
    variables: { customerId: customerIdValue },
  });

  const [getChefIds, chefData] = useLazyQuery(GET_PROFILE_DATA);
  const [loginAuthMutation, switchData] = useMutation(LOGIN_AUTH, {
    onCompleted: success => {
      let payload = success.switchUserByRole;
      if (util.hasProperty(payload, 'json')) {
        let jsonObj = JSON.parse(payload.json);
        if (jsonObj.role == CHEF) {
          getChefIds({
            chefId: jsonObj.chef.chefId,
          });
        }
      }
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });


  useEffect(() => {
    //get local storage value for menu highlight and loggedin status to show menu
    // console.log('localStorage.getItem', localStorage.getItem('selected_menu'))
    getUserTypeRole()
      .then(res => {
        setUserRole(res);
      })
      .catch(err => { });
    let elementId = document.getElementById('navbar');
    document.addEventListener('scroll', () => {
      if (window.scrollY > 170) {
        elementId.classList.add('is-sticky');
      } else {
        elementId.classList.remove('is-sticky');
      }
    });
    window.scrollTo(0, 0);
  }, []);

  //check and set admin user
  useEffect(() => {
    if (localStorage.getItem('loggedInAs') !== null) {
      GetValueFromLocal('loggedInAs').then((result) => {
        if (result === 'Admin') {
          setRoleType(result);
        }
      })
        .catch((err) => {
          // console.log('err', err)
        })
    }
  });

  useEffect(() => {
    if (localStorage.getItem('signInMethod') !== null) {
      GetValueFromLocal('signInMethod').then((result) => {       
          setLoggedInType(result);
      })
        .catch((err) => {
          // console.log('err', err)
        })
    }else{
      setLoggedInType('email');
    }
  },[loggedInType]);

  useEffect(() => {
    if (isObjectEmpty(Router) && isObjectEmpty(Router.router) && isStringEmpty(Router.router.route)) {
      let pathName = Router.router.pathname;
      let checkPath = false;
      if (pathName === '/register' || pathName === '/login') {
        StoreInLocal('selected_menu', pathName === '/register' ? 'register' : 'login');
        checkPath = true;
      } else {
        if (pathName === '/booking-request') {
          StoreInLocal('selected_menu', 'booking_history');
          checkPath = true;
        } else {
          menuOptions.map((res) => {
            if (res.routing === pathName) {
              StoreInLocal('selected_menu', res.keyName);
              checkPath = true;
            }
          });
        }
      }
      if (checkPath === false) {
        clearLocalStorage();
      }
    }
  }, [Router, state]);

  let totalCountData = {
    type: 'CHEF_UNREAD_COUNT',
    chefId: chefIdValue,
  };
  totalCountData = JSON.stringify(totalCountData);

  let customerTotalCountData = {
    type: 'CUSTOMER_UNREAD_COUNT',
    customerId: customerIdValue,
  };
  customerTotalCountData = JSON.stringify(customerTotalCountData);

  const [getTotalCountValue, totalCountValue] = useLazyQuery(GET_TOTAL_COUNT, {
    variables: {
      pData: userRole === chef ? totalCountData : customerTotalCountData,
    },
    fetchPolicy: 'network-only',
  });


  useEffect(() => {
    if (localStorage.getItem('selected_menu') !== null) {
      GetValueFromLocal('selected_menu').then((result) => {
        setSelectedMenu(result);
      })
        .catch((err) => {
          // console.log('err', err)
        })
    }
  }, []);


  useEffect(() => { // get chef id
    getChefId(chefId)
      .then(res => {
        setChefId(res);
        getChefData();
        getTotalCountValue();
      })
      .catch(err => { });
  }, []);
  useEffect(() => { // get customer id
    getCustomerId(customerId)
      .then(res => {
        setCustomerId(res);
        getCustomer();
        getTotalCountValue();
      })
      .catch(err => { });
  }, []);
  useEffect(() => { //check null condition of query
    if (
      util.hasProperty(data, 'chefProfileByChefId') &&
      util.isObjectEmpty(data.chefProfileByChefId)
    ) {
      let temp = JSON.parse(data.chefProfileByChefId.isDetailsFilledYn)
      setProfileDetails(data.chefProfileByChefId);
      getTotalCountValue();
    } else {
      getTotalCountValue();
      setProfileDetails(null);
    }
  }, [data]);
  useEffect(() => { //check null condition of query
    // console.log(getCustomerData)
    if (
      util.isObjectEmpty(getCustomerData) &&
      util.hasProperty(getCustomerData, 'data') &&
      util.isObjectEmpty(getCustomerData.data) &&
      util.hasProperty(getCustomerData.data, 'customerProfileByCustomerId') &&
      util.isObjectEmpty(getCustomerData.data.customerProfileByCustomerId)
    ) {
      setCustomerProfileDetails(getCustomerData.data.customerProfileByCustomerId);
      getTotalCountValue();
    } else {
      setCustomerProfileDetails(null);
      getTotalCountValue();
    }
  }, [getCustomerData]);

  const { chefNotification } = useSubscription(CHEF_NOTIFICATION, {
    variables: { chefId: chefIdValue },
    onSubscriptionData: res => {
      if (res) {
        getTotalCountValue();
      }
    },
  });

  const { customerNotification } = useSubscription(CUSTOMER_NOTIFICATION, {
    variables: { customerId: customerIdValue },
    onSubscriptionData: res => {
      if (res) {
        getTotalCountValue();
      }
    },
  });
  useEffect(() => {
    if (
      isObjectEmpty(totalCountValue) &&
      hasProperty(totalCountValue, 'data') &&
      isObjectEmpty(totalCountValue.data) &&
      hasProperty(totalCountValue.data, 'totalCountByParams')
    ) {
      if (userRole === chef) setChefUnreadCount(totalCountValue.data.totalCountByParams);
      else {
        setCustomerUnreadCount(totalCountValue.data.totalCountByParams)
      }
    }
  }, [totalCountValue]);
  function toggleNavbar() {
    setCollapsed(!collapsed);
  };

  function onChangeMenu(value) {
    StoreInLocal('selected_menu', value);
  };

  function clearLocalStorage() {
    localStorage.removeItem('selected_menu');
  };

  //Highlighting home menu initially, so storing in local storage
  useEffect(() => {
    if (typeof window == 'undefined') return;
    window.onbeforeunload = function () {
      clearLocalStorage();
      // return true;
    };
  });

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
          }, 2000);
          setUserRole(false);
        })
        .catch(error => {
          toastMessage('error', error.message);
        });
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  };

  //Switch user to chef role
  function onSwitchClick() {
    // e.preventDefault();
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
      loginAuthMutation({ variables });
    }
  }

  //update state values
  useEffect(() => {
    if (chefData && chefData.data) {
      if (
        chefData.data.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0]
          .isIntroSlidesSeenYn === false
      ) {
        NavigateToIntro();
      } else {
        NavigateToHome();
      }
    }
  }, [chefData]);

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
            toastMessage(success, S.SWITCHED_SUCCESS);
            setUserRole(customer);
            StoreInLocal('user_ids', customerRes);
            StoreInLocal('user_role', customer);
            StoreInLocal('selected_menu', 'home_page');
            NavigateToHome();
          })
          .catch(error => {
            toastMessage(renderError, error.message);
          });
      }
      //for chef login
      else {
        getChefAuthData(parseData)
          .then(chefRes => {
            toastMessage(success, S.SWITCHED_SUCCESS);
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
            NavigateToHome();
          })
          .catch(error => {
            toastMessage(renderError, error.message);
          });
      }
    }
  }

  function renderMenu(res, index) {
    return (
      <li className="nav-item p-relative" key={index}>
        <Link href={res.routing}>
          <a
            className={`nav-link ${selectedMenu === res.keyName} ? 'active' : ''`}
            id={
              selectedMenu === res.keyName ? 'selectedMenuStyle' : 'unselectedMenuStyle'
            }
            onClick={() => onChangeMenu(res.keyName)}
          >
            {res.title}
          </a>
        </Link>
        {res.subMenu && (
          <ul className="dropdown-menu" id="dropdown-view" key={index}>
            {res.subMenu.map((response, i) => {
              return (
                <li className="nav-item" key={i}>
                  <Link href={response.routing}>
                    <a className="nav-link active" id="booking-submenu" onClick={() => onChangeMenu(res.keyName)}>{response.title}</a>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  };
  const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
  const classTwo = collapsed
    ? 'navbar-toggler navbar-toggler-right collapsed'
    : 'navbar-toggler navbar-toggler-right';
  return (
    <React.Fragment>
      <ToastContainer />
      <div className="navbar-area">
        <div id="navbar" className="comero-nav">
          <div className="container" id="container-view">
            <nav className="navbar navbar-expand-md navbar-light">
              {/*logo name*/}
              {/* <Link href="/">
                <a className="navbar-brand">
                  <p className="logoName">Rockoly</p>
                </a>
              </Link> */}
              <div className="logo-header">
                <Link href="/">
                  <a className="navbar-brand" style={{ display: 'flex', width: '85px' }}>
                    <img
                      src={require("../../../images/mock-image/rockoly-logo.png")}
                      alt="image"
                      className="logo-image" style={{ width: '50%', height: '10%' }}
                    />

                    <p className="logoName">Rockoly</p>
                  </a>
                </Link>
              </div>
              {/* menu button option for mobile view */}
              <button
                onClick={toggleNavbar}
                className={classTwo}
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              {/*Menus*/}
              <div className={classOne} id="navbarSupportedContent">
                <ul className="navbar-nav" id="menu-titles">
                  {roleType !== 'Admin' && menuOptions.map((res, index) => {
                    // show menu based on chef/customer login
                    if (userRole === chef) {    //for chef login
                      if (res.isChef === true) {
                        return renderMenu(res, index);
                      }
                    } else if (userRole === customer) { //for customer login
                      if (res.isCustomer === true) {
                        return renderMenu(res, index);
                      }
                    } else {  //before loggedin
                      if (res.isCommon === true) {
                        return renderMenu(res, index);
                      }
                    }
                  })}
                </ul>
                {/* header right side menu */}
                <div className="others-option">
                  {userRole === false && roleType !== 'Admin' && (
                    <div>
                      {rightSideMenuOptions &&
                        rightSideMenuOptions.map((res, index) => {
                          return (
                            <div className="option-item" key={index}>
                              <Link href={res.routing}>
                                <a
                                  id={
                                    selectedMenu === res.keyName
                                      ? 'selectedMenuStyle'
                                      : 'unselectedMenuStyle'
                                  }
                                  onClick={() => onChangeMenu(res.keyName)}
                                >
                                  {res.title}
                                </a>
                              </Link>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
                <div className="others-option">
                  {isStringEmpty(userRole) === true && roleType === 'Admin' && (
                    <a className="option-item" id="unselectedMenuStyle" onClick={() => onLogout()}>
                      Log Out
              </a>
                  )}
                </div>
                {isStringEmpty(userRole) === true && roleType !== 'Admin' && (
                  <div className="row" id="profile-align">
                    <div id="icons">
                      {/* favorite icon */}
                      {userRole !== chef &&
                        <a href={n.FAVORITE_CHEFS_LIST} className="notificationContainer" id="icon-view">
                          <p className="far fa-heart" id="notificationIcon" onClick={() => clearLocalStorage()}></p>
                        </a>
                      }
                      {/* notification icon customerProfileDetails*/}
                      <a href={n.NOTIFICATION} className="notificationContainer" id="icon-view">
                        <p className="far fa-bell" id="notificationIcon" onClick={() => clearLocalStorage()}></p>
                        {ProfileDetails &&
                          <div className="badge badge-pill badge-primary" id="notificationBadge">
                            {chefUnreadCount > 0 ?
                              chefUnreadCount
                              : ''
                            }
                          </div>
                        }
                        {customerProfileDetails &&
                          <div className="badge badge-pill badge-primary" id="notificationBadge">
                            {customerunreadCount > 0 ?
                              customerunreadCount
                              : ''
                            }
                          </div>
                        }

                      </a>
                    </div>
                    {/*Profile dropdown menu */}
                    <div className="profile-image">
                      {ProfileDetails &&
                        <div className="row" id="profile-view">
                          <div className="col-sm-6">
                            <div className="dropdown">
                              <img
                                src={
                                  ProfileDetails.chefPicId ?
                                    ProfileDetails.chefPicId
                                    : require('../../../images/mock-image/default_chef_profile.png')
                                }
                                className="rounded-circle"
                                alt=""
                                width="52"
                                height="50"
                                data-toggle="dropdown"
                              />
                              <div className="dropdown-content" onClick={() => clearLocalStorage()}>
                                <a href={`${n.PROFILE}?fromRegister:false`}>Edit Profile</a>
                                <a href={n.SETTINGS}>Settings</a>
                                <a href={n.CHAT}>Inbox</a>
                                <a style={{ cursor: 'pointer' }} onClick={() => onSwitchClick()}
                                  className="pointer">{userRole === chef
                                    ? S.SWITCH_USER_CUSTOMER
                                    : S.SWITCH_USER_CHEF}</a>
                               {loggedInType === 'email' &&
                                  <a href={n.CHANGE_PASSWORD}>Change Password</a>
                                  }
                                <a className="logout" onClick={() => onLogout()}>
                                  Log Out
                              </a>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-3" id="userName">
                            <p >{ProfileDetails.chefFirstName}</p>
                          </div>
                        </div>
                      }
                      {customerProfileDetails &&
                        <div className="row">
                          <div className="col-sm-6">
                            <div className="dropdown">
                              <img src={
                                customerProfileDetails.customerPicId ?
                                  customerProfileDetails.customerPicId
                                  : require('../../../images/mock-image/sample_user.png')
                              }
                                alt="image"
                                className="rounded-circle"
                                alt=""
                                width="52"
                                height="53"
                                data-toggle="dropdown"
                              />
                              <div>
                              </div>
                              <div className="dropdown-content" onClick={() => clearLocalStorage()}>
                                <a href={`${n.PROFILE}?fromRegister:false`}>Edit Profile</a>
                                <a href={n.SETTINGS}>Settings</a>
                                <a href={n.CHAT}>Inbox</a>
                                <a onClick={() => onSwitchClick()} style={{ cursor: 'pointer' }} className="pointer">{userRole === chef
                                  ? S.SWITCH_USER_CUSTOMER
                                  : S.SWITCH_USER_CHEF}</a>
                                  {loggedInType === 'email' &&
                                  <a href={n.CHANGE_PASSWORD}>Change Password</a>
                                  }
                                <a className="logout" onClick={() => onLogout()}>
                                  Log Out
                              </a>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-3">
                            <p id="userName">{customerProfileDetails.customerFirstName}</p>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default MegaMenu;