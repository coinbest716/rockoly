import React, { useEffect, useState } from 'react';
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import AddsModal from '../../shared/modal/RequestStatusModal';
import S from '../BookingHistory.String';
import _ from 'lodash';
import gql from 'graphql-tag';
import {
  isObjectEmpty,
  hasProperty,
  isArrayEmpty,
  isStringEmpty,
} from '../../../utils/checkEmptycondition';
import { chef, customer } from '../../../utils/UserType';
import { NavigateToBookongDetail } from './Navigation';
import {
  getDateFormat,
  getTimeOnly,
  getDateWithTime,
  getLocalTime,
  NotificationconvertDateandTime,
} from '../../../utils/DateTimeFormat';
import { toastMessage, success, renderError, error } from '../../../utils/Toast';
import * as gqlTag from '../../../common/gql';
import { from } from 'zen-observable';
import ChefBookingButton from '../../shared/booking-buttons/ChefBookingButton';
import CustomerBookingButton from '../../shared/booking-buttons/CustomerBookingButton';
import ChefBookingStatus from '../../shared/booking-status/ChefBookingStatus';
import CustomerBookingStatus from '../../shared/booking-status/CustomerBookingStatus';

const retryPayment = gqlTag.mutation.booking.paymentGQLTAG;

const RETRY_PAYMENT = gql`
  ${retryPayment}
`;

export default function HistoryList(props) {
  //Initial set value
  const [userRole, setUserRole] = useState(customer);
  const [bookingType, setBookingType] = useState(S.ALL);
  const [bookingArray, setBookingArray] = useState([]);
  const [bookingDetail, setBookingDetail] = useState({});
  const [openCardList, setOpenCardList] = useState(false);
  const [stripeId, setStripeId] = useState('');
  const [customerCardId, setCustomerCardId] = useState('');
  const [chefBookingHistoryId, setChefBookingHistoryId] = useState('');

  const [retryPaymentData, { retryData }] = useMutation(RETRY_PAYMENT, {
    onCompleted: retryData => {
      toastMessage(success, S.PAYMENT_COMPLETED);
      closeRetryPayment();
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  //Set initial props value
  useEffect(() => {
    setBookingType(props.bookingType);
    setBookingArray(props.bookingDetails);
    setUserRole(props.userRole);
  }, [props]);

  function closeRetryPayment(e) {
    try {
      setOpenCardList(false);
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  //Navigate to booking detail page
  function onClickBookingDetail(data) {
    let newData = {};
    newData.chefBookingHistId = data.chefBookingHistId;
    newData.bookingType = data.bookingType;
    NavigateToBookongDetail(newData);
  }

  function payNowModal(data) {
    if (data && data.chefBookingHistId) {
      setChefBookingHistoryId(data.chefBookingHistId);
      setOpenCardList(true);
    }
  }

  function triggerSubscription() {
    if (props.triggerHistorySubscription) {
      props.triggerHistorySubscription();
    }
  }
  //When close card modal
  function closeCardModal(value) {
    setStripeId(value.customer);
    setCustomerCardId(value.id);
    let variables = {
      stripeCustomerId: value.customer,
      cardId: value.id,
      bookingHistId: chefBookingHistoryId,
    };
    retryPaymentData({
      variables,
    });
  }

  function chefBookingTime(data) {
    // console.log("data.chefBookingFromTime",data.chefBookingFromTime)
    let bookingFromTime = getTimeOnly(getLocalTime(data.chefBookingFromTime));
    let bookingToTime = getTimeOnly(getLocalTime(data.chefBookingToTime));
    // console.log("bookingFromTime",bookingFromTime)
    return bookingFromTime + ' - ' + bookingToTime;
  }

  function changingSalutation(data) {
    // console.log('changingSalutation data', data);
    // var str = data.split(' ');
    // console.log('changingSalutation str', str);
    // let sal = str[0] === 'MISS' ? 'Miss' : str[0] === 'MRS' ? 'Mrs' : 'Mr';
    // console.log('changingSalutation sal', sal);
    // let name = sal + ' ' + str[0] + ' ' + str[1];
    return data;
  }

  return (
    <React.Fragment>
      <div className="list-group" id="booking-history-list">
        {props.bookingDetails.length > 0 && props.bookingCount > 0 && (
          <p className="totalCount" style={{ width: '100%', fontSize: '16px' }}>
            Showing {props.bookingDetails.length} of {props.bookingCount} results
          </p>
        )}
        {isArrayEmpty(bookingArray) ? (
          bookingArray.map((res, index) => {
            return (
              <div className="row" id="list-content" style={{ width: '100%' }} key={index}>
                <div className="col-lg-2 col-md-2 col-sm-12" id="image-view">
                  <a onClick={() => onClickBookingDetail(res)}>
                    <img
                      src={
                        userRole === customer
                          ? res && res.chefProfileByChefId && res.chefProfileByChefId.chefPicId
                            ? res.chefProfileByChefId.chefPicId
                            : S.chefDefaultImage
                          : res &&
                            res.customerProfileByCustomerId &&
                            res.customerProfileByCustomerId.customerPicId
                          ? res.customerProfileByCustomerId.customerPicId
                          : S.customerDefaultImage
                      }
                      className="imageStyle"
                      alt="image"
                      width="200"
                      height="100"
                    />
                  </a>
                </div>

                <div className="products-content col-lg-2 col-md-3 col-sm-12" id="chef-info-list">
                  <span className="nameText">
                    <a onClick={() => onClickBookingDetail(res)}>
                      {userRole === customer
                        ? res && res.chefProfileByChefId && res.chefProfileByChefId.fullName
                          ? changingSalutation(res.chefProfileByChefId.fullName)
                          : ''
                        : res &&
                          res.customerProfileByCustomerId &&
                          res.customerProfileByCustomerId.fullName
                        ? changingSalutation(res.customerProfileByCustomerId.fullName)
                        : ''}
                    </a>
                  </span>
                  <div>
                    <h6 className="text-address-view">
                      <a
                        className="addressText"
                        id="address-modal-container"
                        onClick={() => onClickBookingDetail(res)}
                      >
                        {userRole === customer
                          ? res &&
                            res.chefProfileByChefId &&
                            res.chefProfileByChefId.chefProfileExtendedsByChefId &&
                            res.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0] &&
                            res.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0]
                              .chefCity &&
                              res.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0]
                              .chefState
                            ? `${res.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0]
                                .chefCity}, ${res.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0]
                                .chefState}`
                            : ''
                          : res &&
                            res.customerProfileByCustomerId &&
                            res.customerProfileByCustomerId.customerProfileExtendedsByCustomerId &&
                            res.customerProfileByCustomerId.customerProfileExtendedsByCustomerId
                              .nodes[0] &&
                            res.customerProfileByCustomerId.customerProfileExtendedsByCustomerId
                              .nodes[0].customerLocationAddress 
                          ? res.customerProfileByCustomerId.customerProfileExtendedsByCustomerId
                          .nodes[0].customerLocationAddress
                          : ''}
                      </a>
                    </h6>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12" id="notification-status">
                  <p>
                    <b>Date:</b> {NotificationconvertDateandTime(res.chefBookingFromTime)}
                  </p>
                  <p>
                    <b>Time:</b>
                    {chefBookingTime(res)}
                  </p>
                  <p>
                    <b>Price:</b>
                    {userRole === customer
                      ? res && res.chefBookingTotalPriceUnit
                        ? res.chefBookingTotalPriceUnit.toUpperCase() === 'USD'
                          ? '$'
                          : res.chefBookingTotalPriceUnit
                        : '$'
                      : res && res.chefBookingPriceUnit
                      ? res.chefBookingPriceUnit.toUpperCase() === 'USD'
                        ? '$'
                        : res.chefBookingPriceUnit
                      : '$'}
                    {userRole === customer
                      ? res && res.chefBookingPriceValue
                        ? res.chefBookingPriceValue.toFixed(2)
                        : '-'
                      : res && res.chefBookingTotalPriceValue
                      ? res.chefBookingTotalPriceValue.toFixed(2)
                      : '-'}
                  </p>
                </div>
                {bookingType === S.ALL && (
                  <div className="col-lg-3 col-md-3 col-sm-12" id="button-type-list">
                    {userRole && userRole === chef ? (
                      <ChefBookingStatus bookingDetails={res} />
                    ) : (
                      <CustomerBookingStatus bookingDetails={res} />
                    )}
                  </div>
                )}

                {/* <div className="col-lg-2 col-md-2 col-sm-12" id="history-button-view">
                  {userRole && userRole === chef ? (
                    <ChefBookingButton
                      triggerSubscription={triggerSubscription}
                      bookingDetails={res}
                      userRole={userRole}
                    />
                  ) : (
                    <CustomerBookingButton
                      triggerSubscription={triggerSubscription}
                      bookingDetails={res}
                      userRole={userRole}
                    />
                  )}
                </div> */}

                {/* <div className="col-md-2" id="date-format"> */}
                {/* <h3 className="date"> */}
                {/* <a> {getDateWithTime(res.createdAt)}</a> */}
                {/* </h3>{' '} */}
                {/* </div> */}
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
      </div>
      {props.bookingCount > props.firstParams && (
        <div className="loadmore-view">
          <button
            className="btn btn-primary"
            id="view-details-button"
            onClick={() => props.firstParamsValue()}
          >
            Load More
          </button>
        </div>
      )}
      {/* {openCardList === true && <CardListModal closeCardModal={closeCardModal} />} */}
    </React.Fragment>
  );
}
