import React, { useState, useEffect, useContext } from 'react';
import { ToastContainer, Slide } from 'react-toastify';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import n from '../../routings/routings';
import Link from 'next/link';
import {
  NavigateToProfileSetup,
  NavigateToHome,
  NavigateToIntro,
  NavigateToBookingRequest,
} from './Navigation';
import {
  chef,
  CHEF,
  customer,
  getChefAuthData,
  getCustomerAuthData,
} from '../../../utils/UserType';
import * as gqlTag from '../../../common/gql';
import { firebase } from '../../../config/firebaseConfig';
import { toastMessage, success, renderError, error } from '../../../utils/Toast';
import { StoreInLocal } from '../../../utils/LocalStorage';
import Loader from '../../Common/loader';
import { AppContext } from '../../../context/appContext';
import * as util from '../../../utils/checkEmptycondition';
import S from '../Settings.String';

//Update notification for chef
const updateNotificationChefTag = gqlTag.mutation.chef.updateNotificationGQLTAG;

const UPDATE_NOTIFICATION_CHEF = gql`
  ${updateNotificationChefTag}
`;

// Get GQL Tags
const chefProfileGQLTAG = gqlTag.query.chef.profileByIdGQLTAG;

const GET_PROFILE_DATA = gql`
  ${chefProfileGQLTAG}
`;

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

const Settings = () => {
  const [state, setState] = useContext(AppContext);
  const [notification, setNotification] = useState(false);

  //getting chef availaibity data
  const [getChefId, chefData] = useLazyQuery(GET_PROFILE_DATA, {
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [loginAuthMutation, { data, loading }] = useMutation(LOGIN_AUTH, {
    onCompleted: success => {
      let payload = success.switchUserByRole;
      if (util.hasProperty(payload, 'json')) {
        let jsonObj = JSON.parse(payload.json);
        if (jsonObj.role == CHEF) {
          getChefId({
            chefId: jsonObj.chef.chefId,
          });
        }
      }
      toastMessage(success, S.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  //Update notification for chef
  const [updateNotificationChef] = useMutation(UPDATE_NOTIFICATION_CHEF, {
    onCompleted: () => {
      toastMessage(success, S.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  //Update notification for customer
  const [updateNotificationCustomer] = useMutation(UPDATE_NOTIFICATION_CUSTOMER, {
    onCompleted: () => {
      toastMessage(success, S.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
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

  //update state values
  useEffect(() => {
    if (chefData && chefData.error) {
      toastMessage('error', error);
    }
    if (chefData && chefData.data) {
      if (
        chefData.data.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0]
          .isIntroSlidesSeenYn === false
      ) {
        // NavigateToIntro();
      } else {
        NavigateToBookingRequest();
      }
    }
  }, [chefData]);

  //get & set user id's in local storage after getting firebase token and calling mutation
  useEffect(() => {
    try {
      if (data && data.switchUserByRole && data.switchUserByRole.json) {
        setAuthData(data.switchUserByRole.json);
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }, [data]);

  async function setAuthData(data) {
    if (data !== undefined) {
      let parseData = JSON.parse(data);
      //for customer login
      if (util.isObjectEmpty(state) && state.role === chef) {
        getCustomerAuthData(parseData)
          .then(customerRes => {
            toastMessage(success, S.SWITCHED_SUCCESS);
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
            StoreInLocal('user_ids', chefRes);
            StoreInLocal('user_role', chef);
            StoreInLocal('selected_menu', 'home_page');
            const variables = {
              chefId: chefRes.chefId,
            };
            getChefId({
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
      loginAuthMutation({ variables });
    }
  }

  function onSelectAvailability(response) {
    if (response) {
      let details = {
        key: 10,
      };
      NavigateToProfileSetup(details);
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

  //loader
  function renderLoader() {
    if (loading !== undefined && loading === true) {
      return (
        <div>
          <Loader />
        </div>
      );
    }
  }

  return (
    <section className="cart-area ptb-60">
      <ToastContainer transition={Slide} />
      {renderLoader()}
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <form>
              <div className="cart-totalsSettings">
                <h3>{S.SETTINGS}</h3>

                <ul>
                  {util.isObjectEmpty(state) && state.role === chef && (
                    <div>
                      <li
                        className="listItem"
                        onClick={() => {
                          onSelectAvailability(4);
                        }}
                      >
                        {S.MANAGE_AVAILABILITY}
                        {/* <i className="fas fa-angle-up"></i> */}
                        <img
                          src={require('../../../images/mock-image/arrow-icon.png')}
                          alt="image"
                          // className="icon-images"
                          style={{ width: '5%', color: 'gray', marginLeft: '68%' }}
                        />
                      </li>
                    </div>
                  )}
                  <Link href={n.PAYMENTS}>
                    <li className="listItem">
                      {S.MANAGE_PAYMENT}
                      <img
                        src={require('../../../images/mock-image/arrow-icon.png')}
                        alt="image"
                        // className="icon-images"
                        style={{ width: '5%', color: 'gray', marginLeft: '49%' }}
                      />
                    </li>
                  </Link>

                  <li>
                    {S.NOTIFICATION}
                    <span>
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
                  </li>
                  <li>
                    <div className="login-button">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={e => onSwitchClick(e)}
                      >
                        {util.isObjectEmpty(state) && state.role === chef
                          ? S.SWITCH_USER_CUSTOMER
                          : S.SWITCH_USER_CHEF}
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Settings;
