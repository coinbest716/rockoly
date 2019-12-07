import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import { NavigateToBookingDetail, NavigateToChatList } from './Navigation';
import { toastMessage } from '../../../utils/Toast';
import {
  getChefId,
  getCustomerId,
  chefId,
  chef,
  customer,
  getUserTypeRole,
  customerId,
} from '../../../utils/UserType';
import { createApolloClient } from '../../../apollo/apollo';
import {
  convertDate,
  convertDateandTime,
  NotificationconvertDateandTime,
} from '../../../utils/DateTimeFormat';
import NotificationDismissModal from '../../shared/modal/NotificationDismissModal';
import NotificationCustomerDismissModal from '../../shared/modal/customerNotificationDismissModal';
import {
  isObjectEmpty,
  hasProperty,
  isArrayEmpty,
  isStringEmpty,
} from '../../../utils/checkEmptycondition';
import { AppContext } from '../../../context/appContext';

const chefNotificationLists = gqlTag.query.notification.filterByChefIdGQLTAG; // chef notification list

const customerNotificationListTag = gqlTag.query.notification.filterByCustomerIdGQLTAG; // customer notification list

const updateSeenNotification = gqlTag.mutation.notification.updateStatusGQLTag; // update notification as seen

const SEEN_NOTIFICATION = gql`
  ${updateSeenNotification}
`;

const chefNotificationSubs = gqlTag.subscription.notification.byChefIdGQLTAG; // chef notification
const CHEF_NOTIFICATION = gql`
  ${chefNotificationSubs}
`;

const customerNotificationSubs = gqlTag.subscription.notification.byCustomerIdGQLTAG; //customer notification
const CUSTOMER_NOTIFICATION = gql`
  ${customerNotificationSubs}
`;

const getTotalCountTag = gqlTag.query.custom.totalCountGQLTAG;

const GET_TOTAL_COUNT = gql`
  ${getTotalCountTag}
`;

const apolloClient = createApolloClient();

const NotificationList = props => {
  const [state, setState] = useContext(AppContext);
  const [userRole, setUserRole] = useState('');
  const [chefIdValue, setChefId] = useState();
  const [customerIdValue, setCustomerId] = useState();
  const [content, setContent] = useState('');
  const [chefNotifications, setchefnotifications] = useState([]);
  const [customerNotificationList, setCustomerNotificationList] = useState([]);
  const [dismissModal, setDismissModal] = useState(false);
  const [notificationData, setNotificationData] = useState({});
  const [firstParams, setFirstParams] = useState(state.firstparams ? state.firstparams : 15);
  const [customerModal, setCustomerModal] = useState(false);
  const [chefCount, setChefCount] = useState();
  const [customerCount, setCustomerCount] = useState();
  const [chefNotificationCount, setChefNotificationCount] = useState();
  const [customerNotificationCount, setCustomerNotificationCount] = useState();

  const [markNotificationSeen, { data }] = useMutation(SEEN_NOTIFICATION, {
    onCompleted: data => {
      // toastMessage('success',"yes")
    },
    onError: err => {
      toastMessage('error', err);
    },
  });

  useEffect(() => {
    //get user's role
    getUserTypeRole()
      .then(res => {
        setUserRole(res);
        if (res === chef) {
          getChefId(chefId).then(chefResult => {
            setChefId(chefResult);
            fetchData(chefResult, firstParams);
          });
        }
        if (res === customer) {
          getCustomerId(customerId).then(customerResult => {
            setCustomerId(customerResult);
            fetchCustomerData(customerResult, firstParams);
          });
        }
      })
      .catch(err => {});
  }, []);

  let totalCountData = {
    type: 'CHEF_NOTIFICATION',
    chefId: chefIdValue,
  };
  totalCountData = JSON.stringify(totalCountData);

  let customerTotalCountData = {
    type: 'CUSTOMER_NOTIFICATION',
    customerId: customerIdValue,
  };
  customerTotalCountData = JSON.stringify(customerTotalCountData);

  const [getTotalCountValue, totalCountValue] = useLazyQuery(GET_TOTAL_COUNT, {
    variables: {
      pData: userRole === chef ? totalCountData : customerTotalCountData,
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });
  // if(error){
  //   toastMessage('error',error)
  // }
  useEffect(() => {
    if (hasProperty(totalCountValue, 'error') && isStringEmpty(totalCountValue.error)) {
      toastMessage('error', totalCountValue.error);
    }
    if (
      isObjectEmpty(totalCountValue) &&
      hasProperty(totalCountValue, 'data') &&
      isObjectEmpty(totalCountValue.data) &&
      hasProperty(totalCountValue.data, 'totalCountByParams')
    ) {
      if (userRole === chef) setChefCount(totalCountValue.data.totalCountByParams);
      else {
        setCustomerCount(totalCountValue.data.totalCountByParams);
      }
    }
  }, [totalCountValue]);

  async function fetchData(chefResult, firstParams) {
    await apolloClient
      .query({
        query: gql`
          ${chefNotificationLists}
        `,
        variables: {
          chefId: chefResult,
          first: firstParams,
          offset: 0,
        },
        fetchPolicy: 'network-only',
      })
      .then(async result => {
        if (
          result &&
          result.data &&
          result.data.allNotificationHistories &&
          result.data.allNotificationHistories.nodes
        ) {
          setchefnotifications(result.data.allNotificationHistories.nodes);
          setChefNotificationCount(result.data.allNotificationHistories.nodes.length);
          getTotalCountValue();
        } else {
          setchefnotifications([]);
          getTotalCountValue();
        }
      });
  }

  async function fetchCustomerData(customerresult, firstParams) {
    await apolloClient
      .query({
        query: gql`
          ${customerNotificationListTag}
        `,
        variables: {
          customerId: customerresult,
          first: firstParams,
          offset: 0,
        },
        fetchPolicy: 'network-only',
      })
      .then(async result => {
        if (
          result &&
          result.data &&
          result.data.allNotificationHistories &&
          result.data.allNotificationHistories.nodes
        ) {
          setCustomerNotificationList(result.data.allNotificationHistories.nodes);
          setCustomerNotificationCount(result.data.allNotificationHistories.nodes.length);
          getTotalCountValue();
        } else {
          setCustomerNotificationList([]);
          getTotalCountValue();
        }
      });
  }

  const { chefNotification } = useSubscription(CHEF_NOTIFICATION, {
    variables: { chefId: chefIdValue },
    onSubscriptionData: res => {
      if (res) {
        fetchData(chefIdValue, firstParams);
      }
    },
  });
  //CUSTOMER_NOTIFICATION

  const { customerNotification } = useSubscription(CUSTOMER_NOTIFICATION, {
    variables: { customerId: customerIdValue },
    onSubscriptionData: res => {
      if (res) {
        fetchCustomerData(customerIdValue, firstParams);
      }
    },
  });
  function dismissAllChefNotification() {
    setDismissModal(true);
    setContent('Are you sure you want to dismiss all notifications ?');
    // setCustomerModal(true);
  }
  function dismissAllCustomerNotification() {
    setNotificationData(null);
    setContent('Are you sure you want to dismiss all notifications ?');
    setCustomerModal(true);
  }
  convertToString;
  function convertToString(stringifiedObject, type) {
    var stringify = JSON.parse(stringifiedObject);
    if (stringify.chef !== null && type === 'booking') {
      return stringify.chef.name;
    } else {
      if (stringify.details !== null && type === 'message') {
        return stringify.details.name;
      }
    }
  }
  function CustomerconvertToString(stringifiedObject, type) {
    var stringify = JSON.parse(stringifiedObject);

    if (stringify.customer !== null && type === 'booking') {
      return stringify.customer.name;
    } else {
      if (stringify.details !== null && type === 'message') {
        return stringify.details.name;
      }
    }
  }
  function convertDateFormat(dateFormat) {
    var newDate = new Date(dateFormat);
    return newDate.toUTCString();
  }
  function dismissChefFunction(data) {
    setNotificationData(data);
    setContent('Are you sure you want to dismiss this notification?');
    setDismissModal(true);
  }
  function dismissCustomerFunction(data) {
    setNotificationData(data);
    setContent('Are you sure you want to dismiss this notification?');
    setCustomerModal(true);
  }
  function makingChefNotificationSeen(dataValue, type) {
    setNotificationData(dataValue);
    let unStringifyObject = JSON.parse(dataValue.notificationDetails);
    if (unStringifyObject.chef !== null && type === 'booking') {
      markNotificationSeen({
        // marking notification as read
        variables: {
          pChefId: unStringifyObject.chef.chef_id,
          pCustomerId: null,
          pAdminId: null,
          pStatusId: 'SEEN',
          pNotificationId: dataValue.notificationHistId,
        },
      }).then(data => {
        let bookingType = 'Upcoming';
        unStringifyObject.bookingType = bookingType;
        NavigateToBookingDetail(unStringifyObject.booking);
      });
    } else {
      markNotificationSeen({
        variables: {
          pChefId: chefIdValue,
          pCustomerId: null,
          pAdminId: null,
          pStatusId: 'SEEN',
          pNotificationId: dataValue.notificationHistId,
        },
      }).then(data => {
        NavigateToChatList({
          conversationId: unStringifyObject.message.conversation_hist_id,
          fullName: unStringifyObject.details.name,
          pic: unStringifyObject.details.pic,
          status: unStringifyObject.booking.chef_booking_status_id.trim(),
        });
      });
    }
  }

  function makingCustomerNotificationSeen(dataValue, type) {
    setNotificationData(dataValue);

    let unStringifyObject = JSON.parse(dataValue.notificationDetails);
    if (unStringifyObject.customer !== null && type === 'booking') {
      markNotificationSeen({
        variables: {
          pChefId: null,
          pCustomerId: unStringifyObject.customer.customer_id,
          pAdminId: null,
          pStatusId: 'SEEN',
          pNotificationId: dataValue.notificationHistId,
        },
      }).then(data => {
        let bookingType = 'All';
        unStringifyObject.bookingType = bookingType;
        NavigateToBookingDetail(unStringifyObject.booking);
      });
    } else if (type === 'message') {
      markNotificationSeen({
        variables: {
          pChefId: null,
          pCustomerId: customerIdValue,
          pAdminId: null,
          pStatusId: 'SEEN',
          pNotificationId: dataValue.notificationHistId,
        },
      }).then(data => {
        NavigateToChatList({
          conversationId: unStringifyObject.message.conversation_hist_id,
          fullName: unStringifyObject.details.name,
          pic: unStringifyObject.details.pic,
          status: unStringifyObject.booking.chef_booking_status_id.trim(),
        });
      });
    }
  }

  function onCloseModal() {
    setDismissModal(false);
    setCustomerModal(false);
  }
  function firstParamsValue(type) {
    if (type === 'chef') fetchData(chefIdValue, firstParams + 15);
    else fetchCustomerData(customerIdValue, firstParams + 15);

    setFirstParams(firstParams + 15);
  }
  function ChefProfilePicture(data, type) {
    if(data){
    let parsedData = JSON.parse(data);
    if (type === 'booking') {
      if (parsedData.chef !== null) {
        return parsedData.chef.chef_pic;
      } else return null;
    }} else {
      if (parsedData.details !== null) {
        return parsedData.details.pic;
      }
     else{
       return null;
     }
    }
  }
  function ParseChefAddress(data, type) {
    if(data){
    let parsedData = JSON.parse(data);
    if (parsedData.chef !== null && type === 'booking') return parsedData.chef.address2;
    // else if (type === 'message' && parsedData.details !== null) return 'address';
     } else return null;
  }
  function chefBookData(data, type) {
    if(data){
    let parsedData = JSON.parse(data);

    if (parsedData.booking !== null) {
      var bookingStarttime = new Date(parsedData.booking.chef_booking_from_time);
      let bookingTime = moment(bookingStarttime).format('MM-DD-YYYY');
      return convertDate(parsedData.booking.chef_booking_from_time);
    } }else {
      return null;
    }
  }
  function chefBookingTime(data, type) {
    if(data){
    let parsedData = JSON.parse(data);
    if (parsedData.booking !== null) {
      //converting GMT to local time and splitting time from it
      var startTime = convertDateandTime(parsedData.booking.chef_booking_from_time);
      let fromTime = startTime.split(',');

      var endTime = convertDateandTime(parsedData.booking.chef_booking_to_time);
      let toTime = endTime.split(',');

      return fromTime[1] + ' - ' + toTime[1];
    }} else return null;
  }

  function chefBookPrice(data, type) {
    if(data){
      let parsedData = JSON.parse(data);
      if (parsedData.booking !== null) {
        let bookingPriceUnit = parsedData.booking.chef_booking_price_unit
          ? '$'
          : parsedData.booking.chef_booking_price_unit;
        return bookingPriceUnit + parsedData.booking.chef_booking_price_value.toFixed(2);
      }
    }
     else {
      return null;
    }
  }
  function customerBookPrice(data, type) {
    if(data){
    let parsedData = JSON.parse(data);
    if (parsedData.booking !== null) {
      let bookingPriceUnit = parsedData.booking.chef_booking_price_unit
        ? '$'
        : parsedData.booking.chef_booking_price_unit;
      return bookingPriceUnit + parsedData.booking.chef_booking_total_price_value.toFixed(2);
    }} else {
      return null;
    }
  }
  function CustomerProfilePicture(data, type) {
    if(data){
    let parsedData = JSON.parse(data);
    if (type === 'booking') {
      if (parsedData.customer !== null) {
        return parsedData.customer.customer_pic;
      } else return null;
    }} else {
      if (parsedData.details !== null) {
        return parsedData.details.pic;
      }
      else{
        return null;
      }
    }
  }

  function ParseCustomerAddress(data, type) {
    if(data){
    let parsedData = JSON.parse(data);
    if (parsedData.customer !== null && type === 'booking') {
      return parsedData.customer.address2 ? parsedData.customer.address2 : null;
    }} else return null;
  }

  function changeNotificationTime(createdTime) {
    var notificationTime = convertDateandTime(createdTime);
    var dateFormat = NotificationconvertDateandTime(createdTime);
    let createdTimeLocal = notificationTime.split(',');
    return dateFormat + createdTimeLocal[1];
  }

  try {
    return (
      <React.Fragment>
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {userRole === customer &&
              customerNotificationList &&
              customerNotificationList.length > 0 && (
                <button
                  className="btn btn-danger"
                  id="dismiss-all-button"
                  onClick={() => {
                    dismissAllCustomerNotification();
                  }}
                >
                  Dismiss All
                </button>
              )}
            {userRole === chef && chefNotifications && chefNotifications.length > 0 && (
              <button
                className="btn btn-danger"
                id="dismiss-all-button"
                onClick={() => {
                  dismissAllChefNotification();
                }}
              >
                Dismiss All
              </button>
            )}
          </div>
          <br />
          <div className="notification">
            {userRole && userRole === customer && (
              <div>
                {customerNotificationCount > 0 && customerCount > 0 && (
                  <p>
                    Showing {customerNotificationCount} of {customerCount} results
                  </p>
                )}

                {customerNotificationList && customerNotificationList.length > 0 ? (
                  customerNotificationList.map(notification => {
                    return (
                      <div
                        id={notification.notificationHistId}
                        className={`row ${
                          notification.notificationStatusId.trim() === 'SENT'
                            ? 'contentViewSent'
                            : 'contentViewSeen'
                        }`}
                      >
                        <div
                          className="notification-common-content row"
                          key={notification.notificationHistId}
                        >
                          <div className="col-md-2" id="image-view">
                            <img
                              src={
                                notification.notificationAreaType === 'NEW_MESSAGE'
                                  ? ChefProfilePicture(notification.notificationDetails, 'message')
                                    ? ChefProfilePicture(
                                        notification.notificationDetails,
                                        'message'
                                      )
                                    : require('../../../images/mock-image/default_chef_profile.png')
                                  : ChefProfilePicture(notification.notificationDetails, 'booking')
                                  ? ChefProfilePicture(notification.notificationDetails, 'booking')
                                  : require('../../../images/mock-image/default_chef_profile.png')
                              }
                              alt="image"
                              className="notification-user-image"
                            />
                          </div>
                          <div className="products-content col-md-2" id="chef-info-list">
                            <span>
                              <a className="chefname">
                                {notification.notificationAreaType === 'NEW_MESSAGE'
                                  ? convertToString(notification.notificationDetails, 'message')
                                  : convertToString(notification.notificationDetails, 'booking')}
                              </a>

                              <p>
                                {notification.notificationAreaType === 'NEW_MESSAGE'
                                  ? ParseChefAddress(notification.notificationDetails, 'message')
                                  : ParseChefAddress(notification.notificationDetails, 'booking')}
                              </p>
                            </span>
                          </div>
                          <div className="col-md-3" id="notification-status">
                            <a>
                              <b>{notification.notificationTitle}</b>
                            </a>
                            <p>
                              <b>Date: </b>{' '}
                              {notification.notificationAreaType === 'NEW_MESSAGE'
                                ? chefBookData(notification.notificationDetails, 'message')
                                : chefBookData(notification.notificationDetails, 'booking')}
                            </p>
                            <p>
                              <b>Time:</b>
                              {notification.notificationAreaType === 'NEW_MESSAGE'
                                ? chefBookingTime(notification.notificationDetails, 'message')
                                : chefBookingTime(notification.notificationDetails, 'booking')}
                            </p>
                             <p style={{ display: 'flex', justifyContent: 'center' }}>
                              <b>Price:</b>
                              {notification.notificationAreaType === 'NEW_MESSAGE'
                                ? customerBookPrice(notification.notificationDetails, 'message')
                                : customerBookPrice(notification.notificationDetails, 'booking')}
                            </p>
                          </div>
                          <div className="col-md-3" id="notification-buttons">
                            <button
                              className="btn btn-danger"
                              id="dismiss-details-button"
                              onClick={() => {
                                dismissCustomerFunction(notification);
                              }}
                            >
                              Dismiss
                            </button>
                            <button
                              className="btn btn-primary ViewDetail"
                              onClick={() => {
                                makingCustomerNotificationSeen(
                                  notification,
                                  notification.notificationAreaType === 'NEW_MESSAGE'
                                    ? 'message'
                                    : 'booking'
                                );
                              }}
                            >
                              View
                            </button>
                          </div>
                       
                          <div className="col-md-2" id="date-format">
                            <h5 className="date">
                              <a> {changeNotificationTime(notification.createdAt)}</a>
                              {/* changeNotificationTime moment(notification.createdAt).format('MM-DD-YYYY h:mm a') */}
                            </h5>{' '}
                          </div>
                        </div>
                        <br />
                      </div>
                    );
                  })
                ) : (
                  <div className="no_data_container">
                    <img
                      src={require('../../../images/mock-image/no-data.png')}
                      alt="image"
                      className="no_data_container images"
                      style={{ width: '20%', color: 'gray' }}
                    />
                    <p className="no_data_message">No data available</p>
                  </div>
                )}
              </div>
            )}

            {userRole === chef && (
              <div>
                {chefNotificationCount > 0 && chefCount > 0 && (
                  <p>
                    Showing {chefNotificationCount} of {chefCount} results
                  </p>
                )}
                {chefNotifications && chefNotifications.length > 0 ? (
                  chefNotifications.map(notification => {
                    return (
                      <div
                        id={notification.notificationHistId}
                        className={`row ${
                          notification.notificationStatusId.trim() === 'SENT'
                            ? 'contentViewSent'
                            : 'contentViewSeen'
                        }`}
                      >
                        <div
                          className="notification-common-content row"
                          key={notification.notificationHistId}
                        >
                          <div className="col-md-2" id="image-view">
                            <img
                              src={
                                notification.notificationAreaType === 'NEW_MESSAGE'
                                  ? CustomerProfilePicture(
                                      notification.notificationDetails,
                                      'message'
                                    )
                                    ? CustomerProfilePicture(
                                        notification.notificationDetails,
                                        'message'
                                      )
                                    : require('../../../images/mock-image/sample_user.png')
                                  : CustomerProfilePicture(
                                      notification.notificationDetails,
                                      'booking'
                                    )
                                  ? CustomerProfilePicture(
                                      notification.notificationDetails,
                                      'booking'
                                    )
                                  : require('../../../images/mock-image/sample_user.png')
                              }
                              alt="image"
                              className="notification-user-image"
                            />
                          </div>
                          <div className="products-content col-md-2" id="chef-info-list">
                            <span>
                              <a className="chefname">
                                {notification.notificationAreaType === 'NEW_MESSAGE'
                                  ? CustomerconvertToString(
                                      notification.notificationDetails,
                                      'message'
                                    )
                                  : CustomerconvertToString(
                                      notification.notificationDetails,
                                      'booking'
                                    )}
                              </a>

                              <p>
                                {notification.notificationAreaType === 'NEW_MESSAGE'
                                  ? ParseCustomerAddress(
                                      notification.notificationDetails,
                                      'message'
                                    )
                                  : ParseCustomerAddress(
                                      notification.notificationDetails,
                                      'booking'
                                    )}
                              </p>
                            </span>
                          </div>

                          <div className="col-md-3" id="notification-status">
                            <a>
                              <b>{notification.notificationTitle}</b>
                            </a>
                            <div>
                              <p>
                                <p>
                                  <b>Date: </b>
                                  {notification.notificationAreaType === 'NEW_MESSAGE'
                                    ? chefBookData(notification.notificationDetails, 'message')
                                    : chefBookData(notification.notificationDetails, 'booking')}
                                </p>
                              </p>
                              <p>
                                <b>Time:</b>
                                {notification.notificationAreaType === 'NEW_MESSAGE'
                                  ? chefBookingTime(notification.notificationDetails, 'message')
                                  : chefBookingTime(notification.notificationDetails, 'booking')}
                              </p>
                              <p>
                                <b>Price:</b>
                                {notification.notificationAreaType === 'NEW_MESSAGE'
                                  ? chefBookPrice(notification.notificationDetails, 'message')
                                  : chefBookPrice(notification.notificationDetails, 'booking')}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-3" id="notification-buttons">
                            <button
                              className="btn btn-danger"
                              id="dismiss-details-button"
                              onClick={() => {
                                dismissChefFunction(notification);
                              }}
                            >
                              Dismiss
                            </button>
                            <button
                              className="btn btn-primary ViewDetail"
                              onClick={() => {
                                makingChefNotificationSeen(
                                  notification,
                                  notification.notificationAreaType === 'NEW_MESSAGE'
                                    ? 'message'
                                    : 'booking'
                                );
                              }}
                            >
                              View
                            </button>
                          </div>
                          <div className="col-md-2" id="date-format">
                            <h5 className="date">
                              <a> {changeNotificationTime(notification.createdAt)}</a>
                              {/* changeNotificationTime moment(notification.createdAt).format('MM-DD-YYYY h:mm a') */}
                            </h5>{' '}
                          </div>
                        </div>
                        <br />
                      </div>
                    );
                  })
                ) : (
                  <div className="no_data_container">
                    <img
                      src={require('../../../images/mock-image/no-data.png')}
                      alt="image"
                      className="no_data_container images"
                      style={{ width: '35%', color: 'gray' }}
                    />
                    <p className="no_data_message">No data available</p>
                  </div>
                )}
              </div>
            )}

            {userRole === 'chef' && chefCount > firstParams && (
              <div className="load-more-button">
                <a
                  className="btn btn-primary"
                  id="view-details-button"
                  onClick={() => firstParamsValue('chef')}
                >
                  Load More
                </a>
              </div>
            )}
            {userRole === 'customer' && customerCount > firstParams && (
              <div className="load-more-button">
                <a
                  className="btn btn-primary"
                  id="view-details-button"
                  onClick={() => firstParamsValue('customer')}
                >
                  Load More
                </a>
              </div>
            )}
            {dismissModal && (
              <NotificationDismissModal
                content={content}
                chefId={chefIdValue}
                notificationData={notificationData}
                onCloseModal={onCloseModal}
              />
            )}
            {customerModal && (
              <NotificationCustomerDismissModal
                content={content}
                customerId={customerIdValue}
                notificationData={notificationData}
                onCloseModal={onCloseModal}
              />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
};

export default NotificationList;
