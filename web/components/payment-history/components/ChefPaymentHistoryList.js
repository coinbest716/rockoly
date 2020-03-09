import React, { useState, useEffect, useContext } from 'react';
import { useLazyQuery, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import moment from 'moment';
import Link from 'next/link';
import S from '../PaymentHistory.String';
import { toastMessage } from '../../../utils/Toast';
import * as gqlTag from '../../../common/gql';
import * as util from '../../../utils/checkEmptycondition';
import { AppContext } from '../../../context/appContext';
import { NavigateToBookongDetail } from './Navigation';
import { convertDate } from '../../../utils/DateTimeFormat';
import Loader from '../../Common/loader';
import { isObjectEmpty, hasProperty } from '../../../utils/checkEmptycondition';
import {
  getDateFormat,
  getTimeOnly,
  getDateWithTime,
  getLocalTime,
  NotificationconvertDateandTime,
} from '../../../utils/DateTimeFormat';
//chef
const chefDataTag = gqlTag.query.payment.paymentByChefIdGQLTAG;

//for getting chef data
const GET_CHEF_DATA = gql`
  ${chefDataTag}
`;

const chefPaymentSubs = gqlTag.subscription.payment.byChefIdGQLTAG;

const CHEF_SUBSCRIPTION = gql`
  ${chefPaymentSubs}
`;
const getTotalCountTag = gqlTag.query.custom.totalCountGQLTAG;

const GET_TOTAL_COUNT = gql`
  ${getTotalCountTag}
`;

const ChefHistoryList = () => {
  const [state, setState] = useContext(AppContext);
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState('');
  const [paymentsData, setPaymentsData] = useState(null);
  const [firstParams, setFirstParams] = useState(state.firstparams ? state.firstparams : 15);
  const [chefPaymentCount, setChefPaymentCount] = useState();
  const [chefCount, setChefCount] = useState();
  //Gql query for getting chef data
  const [getChefData, customerData] = useLazyQuery(GET_CHEF_DATA, {
    variables: {
      chefId: userId,
      first: firstParams,
      offset: 0,
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  let data = {
    type: 'CHEF_PAYMENTS',
    chefId: userId,
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

  const { chefPaymentData } = useSubscription(CHEF_SUBSCRIPTION, {
    variables: { chefId: userId },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.bankTransferHistory) {
        getChefData();
      }
    },
  });

  //call gql query
  useEffect(() => {
    if (util.isObjectEmpty(state) && util.isStringEmpty(state.chefId)) {
      setUserId(state.chefId);
      getChefData();
      getTotalCount();
    }
  }, [state]);

  //get payment data
  useEffect(() => {
    if (
      util.isObjectEmpty(customerData) &&
      util.hasProperty(customerData, 'data') &&
      util.isObjectEmpty(customerData.data) &&
      util.hasProperty(customerData.data, 'allBankTransferHistories') &&
      util.isObjectEmpty(customerData.data.allBankTransferHistories) &&
      util.hasProperty(customerData.data.allBankTransferHistories, 'nodes') &&
      util.isArrayEmpty(customerData.data.allBankTransferHistories.nodes)
    ) {
      setChefCount(customerData.data.allBankTransferHistories.nodes.length);
      setPaymentsData(customerData.data.allBankTransferHistories.nodes);
      getTotalCount();
    }
  }, [customerData]);

  useEffect(() => {
    if (
      isObjectEmpty(totalCountValue) &&
      hasProperty(totalCountValue, 'data') &&
      isObjectEmpty(totalCountValue.data) &&
      hasProperty(totalCountValue.data, 'totalCountByParams')
    ) {
      setChefPaymentCount(totalCountValue.data.totalCountByParams);
    }
  }, [totalCountValue]);

  //To display the payment status
  function paymentStatus(status) {
    // if (status.trim() === S.COMPLETED || ) {
    //   return <div>{S.COMPLETED_STATUS}</div>;
    // }
    return 'WORK IN PROGRESS';
  }

  function firstParamsValue() {
    setFirstParams(firstParams + 15);
    getChefData();
  }

  //Navigate to booking detail page
  function onClickPaymentDetail(data) {
    data.chefBookingHistId = data.chefBookingHistoryByBookingHistId.chefBookingHistId;
    let newData = {};
    newData.chefBookingHistId = data.chefBookingHistId;
    newData.bookingType = '';
    NavigateToBookongDetail(newData);
  }

  //loader
  function renderLoader() {
    if (customerData.loading !== undefined && customerData.loading === true) {
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
            {chefCount > 0 && chefPaymentCount > 0 && (
              <p className="totalCount" style={{ paddingTop: '1%' }}>
                Showing {chefCount} of {chefPaymentCount} results
              </p>
            )}
            {paymentsData && util.isArrayEmpty(paymentsData) ? (
              paymentsData.map((payment, index) => {
                return (
                  <div className="container">
                    <div id={payment.bankTransferHistId} className="contentView">
                      <div className="payment-common-content row" key={payment.bankTransferHistId}>
                        <div className="col-sm-2 col-md-2 col-lg-2" id="image-view">
                          <img
                            src={
                              util.isObjectEmpty(payment.customerDetails) &&
                              util.isObjectEmpty(payment.customerDetails.nodes[0]) &&
                              util.isStringEmpty(payment.customerDetails.nodes[0].customerPicId)
                                ? payment.customerDetails.nodes[0].customerPicId
                                : S.DEFAULT_USER_IMAGE
                            }
                            alt="image"
                            className="payment-user-image"
                          />
                        </div>
                        <div
                          className="col-lg-3 col-md-3 col-sm12 products-content "
                          id="chef-info-list"
                        >
                          <span>
                            <a
                              className="chefname"
                              style={{ display: 'flex', justifyContent: 'center' }}
                            >
                              {util.isObjectEmpty(payment.customerDetails) &&
                              util.isObjectEmpty(payment.customerDetails.nodes[0]) &&
                              util.isStringEmpty(payment.customerDetails.nodes[0].fullName)
                                ? payment.customerDetails.nodes[0].fullName
                                : ''}
                            </a>
                            <p>
                              {/* {util.isStringEmpty(
                                payment.chefBookingHistoryByBookingHistId.chefBookingStatusId
                              )
                                ? paymentStatus(
                                    payment.chefBookingHistoryByBookingHistId.chefBookingStatusId
                                  )
                                :  */}
                              {S.COMPLETED_STATUS_CHEF}
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
              })
            ) : (
              <div
                class="nodata-content"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: '3%',
                }}
              >
                <img
                  src={S.noDataImage}
                  alt="image"
                  className="icon-images"
                  style={{ width: '185px', height: '185px', color: 'gray' }}
                />
                <h4 style={{ color: '#08AB93' }}>{S.NO_DATA_AVAILABLE}</h4>
              </div>
            )}
            {paymentsData && paymentsData.length === 0 && S.NO_DATA_AVAILABLE}
          </div>
          {chefPaymentCount > 0 && chefPaymentCount >= firstParams && (
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

export default ChefHistoryList;
