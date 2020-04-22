/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import { useQuery, useLazyQuery, useSubscription, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import { firebase, auth, app } from '../../../config/firebaseConfig';
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
import {
  NavigateToProfileSetup, NavigateToHome, NavigateToIntro, NavigateToRequest,
  NavigateToRegisterScreen, NavigateToLogin
} from './Navigation';
import { createBrowserHistory } from 'history';

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

const bookingRequestSubs = gqlTag.query.booking.byIdGQLTAG;

const BOOKING_REQUEST_GQL = gql`
  ${bookingRequestSubs}
`;

const MegaMenu = () => {
  // Declare a new state variable
  const [isUIRendered, setIsUIRendered] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
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
  const [loggedInType, setLoggedInType] = useState();
  const [url, setUrl] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);


  const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
  const classTwo = collapsed
    ? 'navbar-toggler navbar-toggler-right collapsed'
    : 'navbar-toggler navbar-toggler-right';

  const [getChefData, { data, error }] = useLazyQuery(CHEF_DISPLAY_PROFILE_PICTURE, {
    variables: { chefId: chefIdValue },
    fetchPolicy: 'network-only',
  });
  if (error) {
    toastMessage('error', error)
  }

  const [getCustomer, getCustomerData] = useLazyQuery(CUSTOMER_DISPLAY_PROFILE_PICTURE, {
    variables: { customerId: customerIdValue },
    fetchPolicy: 'network-only',
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
        else {
          getCustomer();
        }
      }
    },
    // onError: err => {
    //   toastMessage(renderError, err.message);
    // },
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

        let windows = window.location;
        let user_role = localStorage.getItem('user_role');

        if (localStorage.getItem('logRole') !== null && localStorage.getItem('logRole') == '"CHEFLOGGED"'
          && localStorage.getItem('redirected_path') !== null && localStorage.getItem('redirected_path') != null
          && user_role == '"customer"' && windows.pathname === '/') {
          onSwitchClick();
        }

        if (localStorage.getItem('logRole') !== null && 
        localStorage.getItem('logRole') == '"CUSTOMERLOGGED"'
          && localStorage.getItem('redirected_path') !== null && 
          localStorage.getItem('redirected_path') != null
          && user_role == '"customer"' && windows.pathname === '/') {
          let redirect_url = localStorage.getItem('redirected_path');
          if (redirect_url) {
            let temp = 0;
            let url = `${'/booking-detail' + redirect_url}`;
            url = url.replace(/['"]+/g, '');
            if (url) {
              localStorage.removeItem('logRole');
              localStorage.removeItem('redirected_path');
              temp = 1;
            }
            if ( temp == 1){
              Router.push(url);
            }
          }
        }
        setLoggedInType(result);
      })
        .catch((err) => {
          // console.log('err', err)
        })
    } else {
      setLoggedInType('email');
    }
  }, [loggedInType, state]);

  useEffect(() => {
    if (isObjectEmpty(Router) && isObjectEmpty(Router.router) && isStringEmpty(Router.router.route)) {
      let pathName = Router.router.pathname;
      let checkPath = false;
      if (pathName === '/register' || pathName === '/login') {
        StoreInLocal('selected_menu', pathName === '/register' ? 'register' : 'login');
        checkPath = true;
      } else {
        if (pathName === '/booking-request') {
          StoreInLocal('selected_menu', 'booking_request');
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
      setIsUIRendered(true);
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
      if (data !== undefined) {
        if (data && data.chefProfileByChefId === null) {
          onDataLogout();
        }
      } else {
        getTotalCountValue();
        setProfileDetails(null);
      }
    }
  }, [data]);
  useEffect(() => { //check null condition of query

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
      if (getCustomerData && getCustomerData.data !== undefined) {
        if (getCustomerData && getCustomerData.data && getCustomerData.data.customerProfileByCustomerId === null) {
          onDataLogout();
        }
      } else {
        setCustomerProfileDetails(null);
        getTotalCountValue();
      }
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

  const [getBookingRequestData, Requestdata] = useLazyQuery(BOOKING_REQUEST_GQL, {
    variables: {
      chefBookingHistId: bookingId ? bookingId : null,
    },
    fetchPolicy: 'network-only',
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

  useEffect(() => {
    if (localStorage.getItem("bookingId") !== null
      && localStorage.getItem("bookingId") !== undefined &&
      localStorage.getItem("bookingId")) {
      setBookingId(localStorage.getItem('bookingId') ?
        JSON.parse(localStorage.getItem('bookingId')) : '');
    }
  });
  useEffect(() => {
    if (
      isObjectEmpty(Requestdata) &&
      hasProperty(Requestdata, 'data')
      &&
      isObjectEmpty(Requestdata.data) &&
      hasProperty(Requestdata.data, 'chefBookingHistoryByChefBookingHistId')
    ) {
      // bookingDetails, setBookingDetails
      setBookingDetails(Requestdata.data.chefBookingHistoryByChefBookingHistId)
    } else {
      setBookingDetails();
    }
  }, [Requestdata]);

  useEffect(() => {

    if (bookingId !== null) {
      getBookingRequestData();
    }
  }, [bookingId]);
  // watch the field values 
  useEffect(() => {

    if (userRole === chef) {
      if (ProfileDetails !== null) {
        // Get saved screens from db

        if (ProfileDetails.hasOwnProperty('chefUpdatedScreens')) {
          let screensValue =
            ProfileDetails.chefUpdatedScreens &&
              ProfileDetails.chefUpdatedScreens.length > 0 ?
              ProfileDetails.chefUpdatedScreens : [];
          StoreInLocal('SharedProfileScreens', screensValue);
        }
        if (ProfileDetails.hasOwnProperty('isRegistrationCompletedYn')) {
          if (ProfileDetails.isRegistrationCompletedYn == false && roleType !== 'Admin') {
            NavigateToRegisterScreen();
          }
        }
      }
    } else {
      if (customerProfileDetails !== null) {
        // Get saved screens from db
        if (customerProfileDetails.hasOwnProperty('customerUpdatedScreens')) {
          let screensValue =
            customerProfileDetails.customerUpdatedScreens &&
              customerProfileDetails.customerUpdatedScreens.length > 0 ?
              customerProfileDetails.customerUpdatedScreens : [];
          StoreInLocal('SharedProfileScreens', screensValue);
        }
        if (customerProfileDetails.hasOwnProperty('isRegistrationCompletedYn')) {
          if (customerProfileDetails.isRegistrationCompletedYn == false && roleType !== 'Admin') {
            NavigateToRegisterScreen();
          }
        }
      }
    }
  }, [ProfileDetails, customerProfileDetails]);

  //Get url data for check admin flow
  useEffect(() => {

    let user_role = localStorage.getItem('user_role');
    let redirect_url = localStorage.getItem('redirected_path');
    let windows = window.location;
    let url = window.location.href;
    if (user_role === null || user_role === undefined) {
      if (windows.pathname === '/booking-detail') {
        StoreInLocal('redirected_path', windows.search);
        NavigateToLogin();
      }
    } else if (user_role == '"chef"') {
      if (windows.pathname === '/' && localStorage.getItem('logRole') == '"CHEFLOGGED"'
        && user_role == '"chef"' && bookingDetails
      ) {
        let temp = 0;
        if (bookingDetails.chefId == chefIdValue) {
          let redirect_url = localStorage.getItem('redirected_path');
          if (redirect_url) {
            let url = `${'/booking-detail' + redirect_url}`;
            url = url.replace(/['"]+/g, '');
            if (url) {
              localStorage.removeItem('logRole');
              localStorage.removeItem('redirected_path');
              temp = 1;
            }
            if (localStorage.getItem('logRole') == null)
              Router.push(url);
          }
        } else {
          Router.push('/');
        }

      }
    } else if (user_role == '"customer"') {
      if (windows.pathname === '/booking-detail' && 
      localStorage.getItem('logRole') == '"CUSTOMERLOGGED"'
        && user_role == '"customer"' && bookingDetails
      ) {
        let temp = 0;
        if (bookingDetails.customerId == customerIdValue) {
          let redirect_url = localStorage.getItem('redirected_path');
          if (redirect_url) {
            let url = `${'/booking-detail' + redirect_url}`;
            url = url.replace(/['"]+/g, '');
            if (url) {
              localStorage.removeItem('logRole');
              localStorage.removeItem('redirected_path');
              temp = 1;
            }
            if (localStorage.getItem('logRole') == null)
              Router.push(url);
          }
        } else {
          localStorage.removeItem('logRole');
          localStorage.removeItem('redirected_path');
          Router.push('/');
        }

      }
    }

    if (url) {
      setUrl(url);
    }
    const history = createBrowserHistory();
    const path = (/#!(\/.*)$/.exec(window.location) || [])[1];
    if (path) {
      Router.replace(path);
    }
  }, [bookingDetails]);

  useEffect(() => {
    let user_role = localStorage.getItem('user_role');

    let windows = window.location;
    if (localStorage.getItem('logRole') == '"CHEFLOGGED"'
      && localStorage.getItem('redirected_path') != null
      && user_role == '"customer"' && windows.pathname === '/booking-detail'
      && bookingDetails) {
      onSwitchClick();
    }
  }, [state]);

  useEffect(() => {
    if (state.role === customer) {
      GetValueFromLocal('user_ids')
        .then(result => {
          if (isObjectEmpty(result)) {
            if (firebase.auth().currentUser) {
              getCustomerId(customerId)
                .then(res => {
                  if (res) {
                    getCustomer()
                  }
                }).catch((error) => {
                  console.log('error', error);
                })
            }
          }
        }).catch(err => {
          console.log('err', err);
        });
    } else if (state.role === chef) {
      GetValueFromLocal('user_ids')
        .then(result => {
          if (isObjectEmpty(result)) {
            if (firebase.auth().currentUser) {
              getChefId(chefId)
                .then(res => {
                  if (res) {
                    getChefData()
                  }
                }).catch((error) => {
                  console.log('error', error);
                })
            }
          }
        }).catch(err => {
          console.log('err', err);
        });
    }
  }, [customerId, chefId, state])

  useEffect(() => {
    if ((url === 'http://localhost:3000/' || url === 'https://webdev.neosme.com/') &&
      roleType === 'Admin') {
      onLogout();
    }
  }, [url, roleType]);


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
          if ((url === 'http://localhost:3000/' || url === 'https://webdev.neosme.com/') &&
            roleType === 'Admin') {
            setRoleType('');
          } else {
            toastMessage('success', 'Logged out Successfully');
          }
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



  async function onDataLogout() {
    try {
      firebase
        .auth()
        .signOut()
        .then(async () => {
          // let keysToRemove = ['user_ids', 'selected_menu'];
          await localStorage.clear();
          if ((url === 'http://localhost:3000/' || url === 'https://webdev.neosme.com/') &&
            roleType === 'Admin') {
            setRoleType('');
          } else {
            // No display toast ... because is an automatic logout
            // toastMessage('success', 'Logged out Successfully');
          }
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
        // NavigateToIntro();
        // reload();
      } else {
        NavigateToRequest();
        // reload();
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
            if (window.location.pathname === '/') {
              window.location.reload();
            }
            else {
              NavigateToHome();
            }
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
            if (window.location.pathname === '/') {
              window.location.reload();
            }
            else {
              NavigateToHome();
            }
          })
          .catch(error => {
            toastMessage(renderError, error.message);
          });
      }
    }
  }

  function renderMenu(res, index) {
    // <h1>{selectedMenu === res.keyName}</h1>

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

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="navbar-area">
        <div className="col-lg-12 col-md-12 col-sm-12" id="header-content">
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
                    <a className="navbar-brand" id="logo-view-container" style={{ display: 'flex', width: '110px' }}>
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
                {isUIRendered === true && (
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
                )}
                {/*Menus*/}
                {isUIRendered === true && (
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
                                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <div className="dropdown-content" onClick={() => clearLocalStorage()}>
                                      <a href={`${n.PROFILE}?fromRegister:false`}>Edit Profile</a>
                                      <a href={n.SETTINGS}>Settings</a>
                                      <a href={n.CHAT}>Inbox</a>
                                      <a style={{ cursor: 'pointer' }} onClick={(e) => onSwitchClick()}
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
                              </div>
                              <div className="col-lg-3 col-md-12 col-sm-12" id="userName">
                                <p >{ProfileDetails.chefFirstName}</p>
                              </div>
                            </div>
                          }
                          {customerProfileDetails &&
                            <div className="row">
                              <div className="col-lg-6">
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
                                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <div className="dropdown-content" onClick={() => clearLocalStorage()}>
                                      <a href={`${n.PROFILE}?fromRegister:false`}>Edit Profile</a>
                                      <a href={n.SETTINGS}>Settings</a>
                                      <a href={n.FAVORITE_CHEFS_LIST}>Favorite Chefs</a>
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
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default MegaMenu;