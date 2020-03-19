import React, { useState, useEffect, useContext } from 'react';
import { useLazyQuery, useSubscription } from '@apollo/react-hooks';
import moment from 'moment';
import gql from 'graphql-tag';
import Link from 'next/link';
import S from '../PaymentHistory.String';
import { toastMessage } from '../../../utils/Toast';
import * as gqlTag from '../../../common/gql';
import * as util from '../../../utils/checkEmptycondition';
import { AppContext } from '../../../context/appContext';
import { convertDate } from '../../../utils/DateTimeFormat';
import { NavigateToBookongDetail } from './Navigation';
import Loader from '../../Common/loader';
import {
  isObjectEmpty,
  hasProperty,
  isArrayEmpty,
  isStringEmpty,
} from '../../../utils/checkEmptycondition';
import {
  getDateFormat,
  getTimeOnly,
  getDateWithTime,
  getLocalTime,
  NotificationconvertDateandTime,
} from '../../../utils/DateTimeFormat';
//customer
const customerDataTag = gqlTag.query.payment.paymentByCustomerIdGQLTAG;
//for getting customer data
const GET_CUSTOMER_DATA = gql`
  ${customerDataTag}
`;

const customerPaymentSubs = gqlTag.subscription.payment.byCustomerIdGQLTAG;

const CUSTOMER_SUBSCRIPTION = gql`
  ${customerPaymentSubs}
`;

const getTotalCountTag = gqlTag.query.custom.totalCountGQLTAG;

const GET_TOTAL_COUNT = gql`
  ${getTotalCountTag}
`;
const CustomerHistoryList = () => {
  const [state, setState] = useContext(AppContext);
  const [userId, setUserId] = useState('');
  const [paymentsData, setPaymentsData] = useState(null);
  const [firstParams, setFirstParams] = useState(15);
  const [customerPaymentCount, setCustomerPaymentCount] = useState();
  const [customerCount, setCustomerCount] = useState();
  //Gql query for getting customer data
  const [getCustomerData, chefData] = useLazyQuery(GET_CUSTOMER_DATA, {
    variables: {
      paymentDoneByCustomerId: userId,
      first: firstParams,
      offset: 0,
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  let data = {
    type: 'CUSTOMER_PAYMENTS',
    customerId: userId,
  };

  const [getTotalCount, totalCountValue] = useLazyQuery(GET_TOTAL_COUNT, {
    variables: {
      pData: JSON.stringify(data),
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  //call gql query
  useEffect(() => {
    if (util.isObjectEmpty(state) && util.isStringEmpty(state.customerId)) {
      setUserId(state.customerId);
      getCustomerData();
      getTotalCount();
    }
  }, [state]);

  useEffect(() => {
    if (
      isObjectEmpty(totalCountValue) &&
      hasProperty(totalCountValue, 'data') &&
      isObjectEmpty(totalCountValue.data) &&
      hasProperty(totalCountValue.data, 'totalCountByParams')
    ) {
      setCustomerPaymentCount(totalCountValue.data.totalCountByParams);
    }
  }, [totalCountValue]);

  //get payment data

  useEffect(() => {
    //console.log('chefData', chefData);
    if (
      util.isObjectEmpty(chefData) &&
      util.hasProperty(chefData, 'data') &&
      util.isObjectEmpty(chefData.data) &&
      util.hasProperty(chefData.data, 'allPaymentHistories') &&
      util.isObjectEmpty(chefData.data.allPaymentHistories) &&
      util.hasProperty(chefData.data.allPaymentHistories, 'nodes') &&
      util.isArrayEmpty(chefData.data.allPaymentHistories.nodes)
    ) {
      getTotalCount();
      setCustomerCount(chefData.data.allPaymentHistories.nodes.length);
      setPaymentsData(chefData.data.allPaymentHistories.nodes);
    }
  }, [chefData]);
  // console.log("userId",userId)
  const { customerPaymentData } = useSubscription(CUSTOMER_SUBSCRIPTION, {
    variables: { customerId: userId },
    onSubscriptionData: res => {
      if (res) {
        getCustomerData();
        getTotalCount();
      }
    },
  });

  //To display the payment status
  function paymentStatus(status) {
    // if (status.trim() === S.COMPLETED || ) {
    //   return <div>{S.COMPLETED_STATUS}</div>;
    // }
    return 'WORK IN PROGRESS';
  }

  //Navigate to booking detail page
  function onClickPaymentDetail(data) {
    let newData = {};
    data.chefBookingHistId = data.chefBookingHistoryByBookingHistId.chefBookingHistId;
    newData.chefBookingHistId = data.chefBookingHistId;
    newData.bookingType = '';
    NavigateToBookongDetail(newData);
  }

  //loader
  function renderLoader() {
    if (chefData.loading !== undefined && chefData.loading === true) {
      return (
        <div>
          <Loader />
        </div>
      );
    }
  }

  function formatCreatedDate(date) {
    return NotificationconvertDateandTime(date) + ' ' + getTimeOnly(getLocalTime(date));
  }

  function formatBookingDate(payment) {
    if (
      util.isObjectEmpty(payment) &&
      util.hasProperty(payment, 'chefBookingHistoryByBookingHistId') &&
      util.hasProperty(payment.chefBookingHistoryByBookingHistId, 'chefBookingFromTime') &&
      util.isStringEmpty(payment.chefBookingHistoryByBookingHistId.chefBookingFromTime)
    ) {
      let bookingDate = moment(
        payment.chefBookingHistoryByBookingHistId.chefBookingFromTime
      ).format('MM-DD-YYYY');
      return bookingDate;
    } else {
      return '-';
    }
  }

  function formatBookingFromTimeDate(payment) {
    if (
      util.isObjectEmpty(payment) &&
      util.hasProperty(payment, 'chefBookingHistoryByBookingHistId') &&
      util.hasProperty(payment.chefBookingHistoryByBookingHistId, 'chefBookingFromTime') &&
      util.isStringEmpty(payment.chefBookingHistoryByBookingHistId.chefBookingFromTime)
    ) {
      let bookingFromTime = getTimeOnly(
        getLocalTime(payment.chefBookingHistoryByBookingHistId.chefBookingFromTime)
      );
      return bookingFromTime;
    } else {
      return '-';
    }
  }

  function firstParamsValue() {
    setFirstParams(firstParams + 15);
    getCustomerData();
  }

  function formatBookingToTimeDate(payment) {
    if (
      util.isObjectEmpty(payment) &&
      util.hasProperty(payment, 'chefBookingHistoryByBookingHistId') &&
      util.hasProperty(payment.chefBookingHistoryByBookingHistId, 'chefBookingToTime') &&
      util.isStringEmpty(payment.chefBookingHistoryByBookingHistId.chefBookingToTime)
    ) {
      let bookingToTime = getTimeOnly(
        getLocalTime(payment.chefBookingHistoryByBookingHistId.chefBookingToTime)
      );
      return bookingToTime;
    } else {
      return '-';
    }
  }

  try {
    return (
      <React.Fragment>
        <div className="payment-containar">
          {renderLoader()}
          <div className="payment">
            {customerCount > 0 && customerPaymentCount > 0 && (
              <p className="totalCount" style={{ paddingTop: '1%' }}>
                Showing {customerCount} of {customerPaymentCount} results
              </p>
            )}

            {paymentsData &&
              util.isArrayEmpty(paymentsData) &&
              paymentsData.map((payment, index) => {
                return (
                  <div className="container">
                    <div id={payment.paymentHistId} className="contentView">
                      <div className="payment-common-content row" key={payment.paymentHistId}>
                        <div className="col-lg-2 col-md-2 col-sm-12" id="image-view">
                          <img
                            src={
                              util.isObjectEmpty(payment.chefProfileByPaymentDoneForChefId) &&
                              util.isStringEmpty(
                                payment.chefProfileByPaymentDoneForChefId.chefPicId
                              )
                                ? payment.chefProfileByPaymentDoneForChefId.chefPicId
                                : S.DEFAULT_IMAGE
                            }
                            alt="image"
                            className="payment-user-image"
                          />
                        </div>
                        <div
                          className="col-lg-3 col-md-3 col-sm-12 products-content "
                          id="chef-info-list"
                        >
                          <span>
                            <a
                              className="chefname"
                              style={{ display: 'flex', justifyContent: 'center' }}
                            >
                              {util.isObjectEmpty(payment.chefProfileByPaymentDoneForChefId) &&
                              util.isStringEmpty(payment.chefProfileByPaymentDoneForChefId.fullName)
                                ? payment.chefProfileByPaymentDoneForChefId.fullName
                                : ''}
                            </a>
                            <p className="payment-text">
                              {util.isStringEmpty(payment.paymentStatusId) ? (
                                payment.paymentStatusId.trim() === 'REFUND' ? (
                                  <p>{S.REFUND_STATUS}</p>
                                ) : (
                                  <p>{S.COMPLETED_CUSTOMER_STATUS}</p>
                                )
                              ) : (
                                ''
                              )}
                              {/* {S.COMPLETED_CUSTOMER_STATUS} */}
                            </p>
                            <p class="booking-date-view">
                              On <b>{formatBookingDate(payment)}</b>
                            </p>
                          </span>

                          <a></a>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-12" id="payment-status">
                          <p>
                            <b>Starts On: </b>
                            {formatBookingFromTimeDate(payment)}
                          </p>
                          <p>
                            <b>Ends On: </b>
                            {formatBookingToTimeDate(payment)}
                          </p>
                          <p>
                            <b>Price: </b>$
                            {payment.chefBookingHistoryByBookingHistId.chefBookingPriceValue
                              ? payment.chefBookingHistoryByBookingHistId.chefBookingPriceValue.toFixed(
                                  2
                                )
                              : null}
                          </p>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-12" id="payment-buttons">
                          <button
                            className="btn btn-primary ViewDetail"
                            onClick={() => {
                              onClickPaymentDetail(payment);
                            }}
                          >
                            View
                          </button>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-12" id="date-format">
                          <h5 className="date">
                            <a> {formatCreatedDate(payment.createdAt)}</a>
                          </h5>
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>
                );
              })}
            {paymentsData && paymentsData.length === 0 && S.NO_DATA_AVAILABLE}
          </div>
          {customerPaymentCount > 0 && customerPaymentCount >= firstParams && (
            <div className="loadmore-view">
              <button
                className="btn btn-primary"
                id="view-details-button"
                onClick={() => firstParamsValue()}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  } catch (error) {
    toastMessage('renderError', error.message);
  }
};

export default CustomerHistoryList;
