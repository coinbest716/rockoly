import React, { useEffect, useState } from 'react';
// import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import S from '../BookingDetail.Strings';
import {
  convertDateandTime,
  NotificationconvertDateandTime,
  convertDate,
} from '../../../utils/DateTimeFormat';
import {
  chef,
  customer,
  getUserTypeRole,
  getChefId,
  getCustomerId,
  chefId,
  customerId,
} from '../../../utils/UserType';
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {
  isObjectEmpty,
  hasProperty,
  isStringEmpty,
  isArrayEmpty,
} from '../../../utils/checkEmptycondition';
import { NavigateToChatPage, NavigateToHome } from './Navigation';
// import { toastMessage, success, renderError, error } from '../../../utils/Toast';
import ChefBookingButton from '../../shared/booking-buttons/ChefBookingButton';
import CustomerBookingButton from '../../shared/booking-buttons/CustomerBookingButton';
import ChefBookingStatus from '../../shared/booking-status/ChefBookingStatus';
import CustomerBookingStatus from '../../shared/booking-status/CustomerBookingStatus';
import { priceCalculator } from '../../../utils/priceCalculator';
import * as gqlTag from '../../../common/gql';
import { toastMessage, success, renderError, error } from '../../../utils/Toast';

const stripeServiceCents = gqlTag.query.setting.getSettingValueGQLTAG;
//gql to get store list

const STRIPE_SERVICE_CENTS = gql`
  ${stripeServiceCents}
`;

const stripeServicePrecentage = gqlTag.query.setting.getSettingValueGQLTAG;
//gql to get store list

const STRIPE_SERVICE_PERCENTAGE = gql`
  ${stripeServicePrecentage}
`;

export default function BookingDetail(props) {
  let data = props.BookingDetails;
  let servicePrice = 0;
  //set state value
  const [userRole, setUserRole] = useState(customer);
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('$');
  const [status, setStatus] = useState('');
  const [fullName, setFullName] = useState('');
  const [image, setImage] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [reason, setReason] = useState('');
  const [bookingDetail, setBookingDetail] = useState({});
  const [notes, setNotes] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [requestData, setRequestData] = useState([]);
  const [baserate, setBaseRate] = useState();
  const [noOfPeople, setNoOfPeople] = useState();
  const [service, setServicePrice] = useState();
  const [complexity, setComplexity] = useState();
  const [beforeFive, setBeforeFive] = useState();
  const [halfBaseRate, setHalfBaseRate] = useState();
  const [remainingMemberCount, setRemainingCount] = useState();
  const [afterFive, setAfterFive] = useState();
  const [chefPrice, setChefPrice] = useState();
  const [savedComplexity, setSavedComplexity] = useState();
  const [serviceCentsValue, setServiceCentsValue] = useState(null);
  const [servicePercentValue, setServicePercentValue] = useState(null);


  const [serviceCent, serviceCentData] = useLazyQuery(STRIPE_SERVICE_CENTS, {
    variables: {
      pSettingName: 'STRIPE_SERVICE_CHARGE_IN_CENTS',
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [servicePercent, servicePercentData] = useLazyQuery(STRIPE_SERVICE_CENTS, {
    variables: {
      pSettingName: 'BOOKING_SERVICE_CHARGE_IN_PERCENTAGE',
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  useEffect(() => {
    if (serviceCentData && serviceCentData.data && serviceCentData.data.getSettingValue) {
      let value = serviceCentData.data.getSettingValue / 100;
      setServiceCentsValue(value);
    }
  }, [serviceCentData]);

  useEffect(() => {
    if (servicePercentData && servicePercentData.data && servicePercentData.data.getSettingValue) {
      let value = servicePercentData.data.getSettingValue;
      setServicePercentValue(value);
    }
  }, [servicePercentData]);

  useEffect(() => {
    serviceCent();
    servicePercent();
  }, []);

  useEffect(() => {
    if (props.requestedData) {
      setRequestData(props.requestedData);
    }
  }, [props.requestedData]);
  useEffect(() => {
    let bookingValue = data
      ? data.chefBookingHistoryByChefBookingHistId
        ? data.chefBookingHistoryByChefBookingHistId
        : props.BookingDetails
      : {};

    if (isObjectEmpty(bookingValue)) {
      bookingValue.chefBookingHistId = props.BookingHistory;
      setBookingDetail(bookingValue);
      setFromTime(bookingValue.chefBookingFromTime);
      setToTime(bookingValue.chefBookingToTime);
      if (
        isObjectEmpty(bookingValue.bookingNotes) &&
        isArrayEmpty(bookingValue.bookingNotes.nodes)
      ) {
        setNotes(bookingValue.bookingNotes.nodes);
      }
      if (
        bookingValue &&
        bookingValue.chefBookingStatusId &&
        bookingValue.chefBookingStatusId &&
        (bookingValue.chefBookingStatusId.trim() === S.PAYMENT_PENDING ||
          bookingValue.chefBookingStatusId.trim() === S.PAYMENT_FAILED)
      ) {
        setStatus(S.AMT_NOT_TRANSFERED_YET);
      }
      //set dishes value
      setDishes(isArrayEmpty(bookingValue.dishTypeDesc) ? bookingValue.dishTypeDesc : []);
      //get user role
      getUserTypeRole()
        .then(res => {
          setUserRole(res);
          if (res === customer) {
            //customer user
            setPrice(bookingValue.chefBookingPriceValue ? bookingValue.chefBookingPriceValue : '');
            setUnit(
              bookingValue.chefBookingTotalPriceUnit ? bookingValue.chefBookingTotalPriceUnit : '$'
            );
            if (
              isObjectEmpty(bookingValue.chefProfileByChefId) &&
              hasProperty(bookingValue.chefProfileByChefId, 'chefProfileExtendedsByChefId') &&
              isObjectEmpty(bookingValue.chefProfileByChefId.chefProfileExtendedsByChefId) &&
              hasProperty(bookingValue.chefProfileByChefId.chefProfileExtendedsByChefId, 'nodes') &&
              isObjectEmpty(bookingValue.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0])
            ) {
              const chefDetail =
                bookingValue.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0];
              setAddress(chefDetail.chefLocationAddress);
              setCity(chefDetail.chefCity)
              setState(chefDetail.chefState)
              setBaseRate(chefDetail.chefPricePerHour);
            }
            setFullName(bookingValue.chefProfileByChefId.fullName);
            setImage(bookingValue.chefProfileByChefId.chefPicId);
            if (
              bookingValue.chefBookingStatusId.trim() !== S.REFUND_AMOUNT_SUCCESS &&
              bookingValue.chefBookingStatusId.trim() !== S.REFUND_AMOUNT_FAILED
            ) {
              setReason(
                bookingValue.chefBookingChefRejectOrCancelReason
                  ? bookingValue.chefBookingChefRejectOrCancelReason
                  : ''
              );
            }
          } else {
            //chef user
            setPrice(bookingValue.chefBookingPriceValue ? bookingValue.chefBookingPriceValue : '');
            setUnit(bookingValue.chefBookingPriceUnit ? bookingValue.chefBookingPriceUnit : '$');
            if (
              isObjectEmpty(bookingValue.customerProfileByCustomerId) &&
              hasProperty(
                bookingValue.customerProfileByCustomerId,
                'customerProfileExtendedsByCustomerId'
              ) &&
              isObjectEmpty(
                bookingValue.customerProfileByCustomerId.customerProfileExtendedsByCustomerId
              ) &&
              hasProperty(
                bookingValue.customerProfileByCustomerId.customerProfileExtendedsByCustomerId,
                'nodes'
              ) &&
              isObjectEmpty(
                bookingValue.customerProfileByCustomerId.customerProfileExtendedsByCustomerId
                  .nodes[0]
              )
            ) {
              const chefDetail =
                bookingValue.customerProfileByCustomerId.customerProfileExtendedsByCustomerId
                  .nodes[0];
              setAddress(chefDetail.customerLocationAddress);
              console.log('chefDetail', chefDetail)
              setCity(chefDetail.customerCity)
              setState(chefDetail.customerState)
            }
            setFullName(bookingValue.customerProfileByCustomerId.fullName);
            setImage(bookingValue.customerProfileByCustomerId.customerPicId);
            if (
              bookingValue.chefBookingStatusId.trim() !== S.REFUND_AMOUNT_SUCCESS &&
              bookingValue.chefBookingStatusId.trim() !== S.REFUND_AMOUNT_FAILED
            ) {
              setReason(
                bookingValue.chefBookingCustomerRejectOrCancelReason
                  ? bookingValue.chefBookingCustomerRejectOrCancelReason
                  : ''
              );
            }
            if (
              isObjectEmpty(bookingValue.chefProfileByChefId) &&
              hasProperty(bookingValue.chefProfileByChefId, 'chefProfileExtendedsByChefId') &&
              isObjectEmpty(bookingValue.chefProfileByChefId.chefProfileExtendedsByChefId) &&
              hasProperty(bookingValue.chefProfileByChefId.chefProfileExtendedsByChefId, 'nodes') &&
              isObjectEmpty(bookingValue.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0])
            ) {
              const chefDetail =
                bookingValue.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0];
              // setAddress(chefDetail.chefLocationAddress);
              setBaseRate(chefDetail.chefPricePerHour);
            }
          }
        })
        .catch(err => {});
      if (
        bookingValue &&
        bookingValue.chefBookingStatusId &&
        bookingValue.chefBookingStatusId &&
        (bookingValue.chefBookingStatusId.trim() === S.REFUND_AMOUNT_SUCCESS ||
          bookingValue.chefBookingStatusId.trim() === S.REFUND_AMOUNT_FAILED)
      ) {
        let reasonData = bookingValue.chefBookingChefRejectOrCancelReason
          ? bookingValue.chefBookingChefRejectOrCancelReason
          : bookingValue.chefBookingCustomerRejectOrCancelReason;
        setReason(reasonData);
      }
    }
  }, [data]);

  useEffect(() => {
    if (props.BookingDetails) {
      if (props.BookingDetails) {
        setBookingData(props.BookingDetails.chefBookingHistoryByChefBookingHistId);
        if (props.BookingDetails.chefBookingHistoryByChefBookingHistId)
          setStatus(props.BookingDetails.chefBookingHistoryByChefBookingHistId.chefBookingStatusId);
      } else setBookingData([]);
    }
  }, [props.BookingDetails]);

  useEffect(() => {
    servicePrice = 0;
    if (isObjectEmpty(bookingData)) {
      console.log('bookingData', bookingData);
      getUserTypeRole()
        .then(res => {
          console.log('res', res);
          if (res === customer) {
            getCustomerId(customerId)
              .then(async customerIdvalue => {
                if (customerIdvalue === bookingData.customerId) {
                  if (isStringEmpty(bookingData.chefBookingAdditionalServices)) {
                    let service = JSON.parse(bookingData.chefBookingAdditionalServices);
                    service.map(data => {
                      servicePrice = servicePrice + parseInt(data.price);
                    });
                    setServicePrice(servicePrice);
                  } else {
                    setServicePrice(0);
                  }
                  if (baserate) {
                    const value = priceCalculator(
                      baserate,
                      bookingData.chefBookingNoOfPeople,
                      bookingData.chefBookingComplexity,
                      servicePrice
                    );
                    setChefPrice(value);
                    setNoOfPeople(bookingData.chefBookingNoOfPeople);
                    if (bookingData.chefBookingNoOfPeople > 5) {
                      let price = (bookingData.chefBookingNoOfPeople - 5) * (baserate / 2);
                      setAfterFive(price);
                      price = 5 * baserate;
                      setBeforeFive(price);
                    } else if (bookingData.chefBookingNoOfPeople <= 5) {
                      let price = bookingData.chefBookingNoOfPeople * baserate;
                      setBeforeFive(price);
                    }
                    if (bookingData.chefBookingNoOfPeople >= 5) {
                      let remainingCount = bookingData.chefBookingNoOfPeople - 5;
                      let halfBaseRate = baserate / 2;

                      setHalfBaseRate(halfBaseRate);
                      setRemainingCount(remainingCount);
                    }
                    if (bookingData.chefBookingComplexity > 0) {
                      setSavedComplexity(bookingData.chefBookingComplexity);
                      if (bookingData.chefBookingNoOfPeople <= 5) {
                        setComplexity(
                          baserate *
                            bookingData.chefBookingNoOfPeople *
                            bookingData.chefBookingComplexity -
                            baserate * bookingData.chefBookingNoOfPeople
                        );
                      } else {
                        let lastprice =
                          bookingData.chefBookingNoOfPeople > 5
                            ? (bookingData.chefBookingNoOfPeople - 5) * (baserate / 2)
                            : 0;
                        let firstprice = bookingData.chefBookingNoOfPeople * baserate;
                        let price = firstprice - lastprice;
                        let first = price * bookingData.chefBookingComplexity;
                        setComplexity(first - price);
                      }
                    } else {
                      setSavedComplexity(1);
                    }
                  }
                } else {
                  NavigateToHome();
                }
              })
              .catch(err => {});
          } else if (res === chef) {
            console.log('chefff', res);
            getChefId(chefId)
              .then(async chefIdvalue => {
                console.log(
                  'chefIdvalue',
                  chefIdvalue,
                  bookingData.chefId,
                  chefIdvalue === bookingData.chefId
                );
                if (chefIdvalue === bookingData.chefId) {
                  if (isStringEmpty(bookingData.chefBookingAdditionalServices)) {
                    let service = JSON.parse(bookingData.chefBookingAdditionalServices);
                    service.map(data => {
                      servicePrice = servicePrice + parseInt(data.price);
                    });
                    setServicePrice(servicePrice);
                  } else {
                    setServicePrice(0);
                  }
                  if (baserate) {
                    const value = priceCalculator(
                      baserate,
                      bookingData.chefBookingNoOfPeople,
                      bookingData.chefBookingComplexity,
                      servicePrice
                    );
                    setChefPrice(value);
                    setNoOfPeople(bookingData.chefBookingNoOfPeople);
                    if (bookingData.chefBookingNoOfPeople > 5) {
                      let price = (bookingData.chefBookingNoOfPeople - 5) * (baserate / 2);
                      setAfterFive(price);
                      price = 5 * baserate;
                      setBeforeFive(price);
                    } else if (bookingData.chefBookingNoOfPeople <= 5) {
                      let price = bookingData.chefBookingNoOfPeople * baserate;
                      setBeforeFive(price);
                    }
                    if (bookingData.chefBookingNoOfPeople >= 5) {
                      let remainingCount = bookingData.chefBookingNoOfPeople - 5;
                      let halfBaseRate = baserate / 2;

                      setHalfBaseRate(halfBaseRate);
                      setRemainingCount(remainingCount);
                    }
                    if (bookingData.chefBookingComplexity > 0) {
                      setSavedComplexity(bookingData.chefBookingComplexity);
                      if (bookingData.chefBookingNoOfPeople <= 5) {
                        setComplexity(
                          baserate *
                            bookingData.chefBookingNoOfPeople *
                            bookingData.chefBookingComplexity -
                            baserate * bookingData.chefBookingNoOfPeople
                        );
                      } else {
                        let lastprice =
                          bookingData.chefBookingNoOfPeople > 5
                            ? (bookingData.chefBookingNoOfPeople - 5) * (baserate / 2)
                            : 0;
                        let firstprice = bookingData.chefBookingNoOfPeople * baserate;
                        let price = firstprice - lastprice;
                        let first = price * bookingData.chefBookingComplexity;
                        setComplexity(first - price);
                      }
                    } else {
                      setSavedComplexity(1);
                    }
                  }
                } else {
                  NavigateToHome();
                }
              })
              .catch(err => {
                console.log('errr', err);
              });
          }
        })
        .catch(err => {});
    }
  }, [bookingData, baserate]);
  function onButtonClick() {
    let name = '';
    let pic = '';
    let status = '';
    let createdAt = '';
    if (userRole !== 'chef') {
      (name =
        props.BookingDetails.chefBookingHistoryByChefBookingHistId.chefProfileByChefId.fullName),
        (pic =
          props.BookingDetails.chefBookingHistoryByChefBookingHistId.chefProfileByChefId.chefPicId);
      status = props.BookingDetails.chefBookingHistoryByChefBookingHistId.chefBookingStatusId;
      createdAt = props.BookingDetails.chefBookingHistoryByChefBookingHistId.createdAt;
    } else {
      (name =
        props.BookingDetails.chefBookingHistoryByChefBookingHistId.customerProfileByCustomerId
          .fullName),
        (pic =
          props.BookingDetails.chefBookingHistoryByChefBookingHistId.customerProfileByCustomerId
            .customerPicId);
      status = props.BookingDetails.chefBookingHistoryByChefBookingHistId.chefBookingStatusId;
      createdAt = props.BookingDetails.chefBookingHistoryByChefBookingHistId.createdAt;
    }
    let val = {
      conversationId: props.BookingDetails.chefBookingHistoryByChefBookingHistId.conversationId,
      fullName: name,
      pic: pic,
      status: status,
      createdAt,
    };
    NavigateToChatPage(val);
  }

  function convertDateFormat(createdTime) {
    var notificationTime = convertDateandTime(createdTime);
    var dateFormat = NotificationconvertDateandTime(createdTime);
    let createdTimeLocal = notificationTime.split(',');
    return dateFormat + createdTimeLocal[1];
  }
  function getTimeOnly(from, to) {
    let fromDate = from.split(',');
    let fromtime = fromDate[1];
    let toDate = to.split(',');
    let totime = toDate[1];
    return fromtime + ' - ' + totime;
  }

  function calculateChefCharge() {
    let serviceCharge, totalCharge, firstfve, afterFive, complexityCharge;
    let price = baserate * 5;
    price = price + (noOfPeople - 5) * (baserate / 2);
    price = price * savedComplexity;
    price = price + service;
    totalCharge = price;
    firstfve = baserate * 5;
    afterFive = (noOfPeople - 5) * (baserate / 2);
    complexityCharge = (firstfve + afterFive) * complexity - (firstfve + afterFive);
    return totalCharge.toFixed(2);
  }
  function getBookingData(type) {
    if (type === 'people' && isObjectEmpty(bookingData)) {
      return bookingData.chefBookingNoOfPeople;
    } else if (type === 'complexity' && isObjectEmpty(bookingData)) {
      if (bookingData.chefBookingComplexity > 0) return bookingData.chefBookingComplexity;
      else return 1;
    } else if (
      type === 'service' &&
      isObjectEmpty(bookingData) &&
      isStringEmpty(bookingData.chefBookingAdditionalServices)
    ) {
      let service = JSON.parse(bookingData.chefBookingAdditionalServices);
      service.map(data => {
        servicePrice = servicePrice + parseInt(data.price);
      });
      return servicePrice;
      setServicePrice(servicePrice);
    }
  }

  let summary = '';
  if (isObjectEmpty(bookingData)) {
    try {
      summary = JSON.parse(bookingData.chefBookingSummary);
    } catch (e) {
      summary = bookingData.chefBookingSummary;
    }
  }

  console.log('city', city, state)
  return (
    <React.Fragment>
      <div className="row chefDetail" id="bookingLoopView">
        <div className="col-lg-2 col-md-3">
          <div className="products-page-gallery">
            <div className="comment-author vcard">
              <img
                src={
                  image
                    ? image
                    : userRole && userRole === chef
                    ? S.customerDefaultImage
                    : S.chefDefaultImage
                }
                className="avatar"
                alt="image"
                style={{ borderRadius: '5%', height: '150px', width: '150px !important' }}
              />
            </div>
          </div>
        </div>
        <br />
        <div className="col-lg-6 col-md-6 ">
          <div className="product-details-content" style={{ marginTop: '20px' }}>
            <h3>{fullName}</h3>
            {/* <div>{address}</div> */}
            {userRole && userRole === customer ? (
              <div>
                {isStringEmpty(city) || isStringEmpty(state) ?
                <p>{city}, {state}</p>
                :
                null
                }
              </div>
            ) : (
              <div>
                {address}
                </div>
            )}

            {userRole && userRole === chef ? (
              <div className="row" id="booking-row-view">
                <div id="booking-details-fullview">
                  <ChefBookingButton
                    screen={'detail'}
                    bookingDetails={bookingDetail}
                    userRole={userRole}
                  />
                  {props.BookingDetails &&
                  props.BookingDetails.chefBookingHistoryByChefBookingHistId &&
                  props.BookingDetails.chefBookingHistoryByChefBookingHistId.chefBookingStatusId ===
                    'CUSTOMER_REQUESTED                  ' ? (
                    <button
                      id="chat-button-view"
                      style={{ marginLeft: '30px', height: '41px' }}
                      onClick={() => onButtonClick()}
                      className="btn btn-primary"
                    >
                      {'Chat'}
                    </button>
                  ) : (
                    <button
                      id="chat-button-view"
                      style={{ marginLeft: '30px', height: '41px' }}
                      onClick={() => onButtonClick()}
                      className="btn btn-primary"
                    >
                      {'Chat'}
                    </button>
                  )}
                  {/* <button
                  style={{ marginLeft: '42px', height: '41px', marginTop: '18px' }}
                  onClick={() => onButtonClick()}
                  className="btn btn-primary"
                >
                  {'Chat'}
                </button> */}
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12" id="booking-details-buttons">
                  <CustomerBookingButton
                    screen={'detail'}
                    bookingDetails={bookingDetail}
                    userRole={userRole}
                  />
                  {props.BookingDetails &&
                    props.BookingDetails.chefBookingHistoryByChefBookingHistId &&
                    props.BookingDetails.chefBookingHistoryByChefBookingHistId
                      .chefBookingStatusId &&
                    props.BookingDetails.chefBookingHistoryByChefBookingHistId.chefBookingStatusId.trim() !==
                      'PAYMENT_PENDING' &&
                    props.BookingDetails.chefBookingHistoryByChefBookingHistId.chefBookingStatusId.trim() !==
                      'PAYMENT_FAILED' && (
                      <button
                        id="chat-button-view"
                        style={{ height: '41px', marginTop: '10px' }}
                        onClick={() => onButtonClick()}
                        className="btn btn-primary"
                      >
                        {'Chat'}
                      </button>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="col-lg-12 col-md-12 product-details-content chefDetail">
          <div className="product-info" id="booking-chef-details">
            <div class="card">
              <div class="card-header">
                <label id="describe-booking">Booking Details</label>
              </div>

              {bookingData &&
                isStringEmpty(bookingData.chefBookingSummary) &&
                bookingData.chefBookingSummary !== 'null' && (
                  <div className="col-lg-12" style={{ display: 'flex', paddingTop: '1%' }}>
                    <div className="col-lg-3 datials-modal" id="describe-booking">
                      Event Notes:
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">
                        {bookingData.chefBookingSummary !== 'null' && bookingData.chefBookingSummary
                          ? summary
                          : ''}
                      </a>
                    </div>
                    <br />
                    <br />
                  </div>
                )}
              <div className="col-lg-12" style={{ display: 'flex' }}>
                <div className="col-lg-3 datials-modal" id="describe-booking">
                  Booking Date:
                </div>
                <div className="col-lg-3">
                  <a className="description-content text" id="description-full-view">
                    {convertDate(fromTime)}
                  </a>
                </div>
              </div>
              <br />
              <div className="col-lg-12" style={{ display: 'flex' }}>
                <div className="col-lg-3 datials-modal" id="describe-booking">
                  Booking Time:
                </div>
                <div className="col-lg-3">
                  <a className="description-content text" id="description-full-view">
                    {getTimeOnly(convertDateandTime(fromTime), convertDateandTime(toTime))}
                  </a>
                </div>
              </div>
              <br />
              <div className="col-lg-12" style={{ display: 'flex' }}>
                <div className="col-lg-3 datials-modal" id="describe-booking">
                  Booking Address:
                </div>
                <div className="col-lg-3">
                  <a className="description-content text" id="description-full-view">
                    {bookingDetail && bookingDetail.chefBookingLocationAddress
                      ? bookingDetail.chefBookingLocationAddress
                      : '-'}
                  </a>
                </div>
              </div>
              <br />
              {/* <div className="row" style={{ paddingBottom: '8px' }}> */}
              {isArrayEmpty(notes) &&
                notes.map(res => {
                  return (
                    <div>
                      {isStringEmpty(res.chefId) && (
                        <div className="col-lg-12" style={{ display: 'flex' }}>
                          <div className="col-lg-3 datials-modal" id="describe-booking">
                            {S.CHEF_BOOKING_NOTES}
                          </div>
                          <div className="col-lg-3">
                            <a className="description-content text" id="description-full-view">
                              {res.notesDescription ? JSON.parse(res.notesDescription) : ''}
                            </a>
                          </div>
                          <br />
                          <br />
                        </div>
                      )}
                      {isStringEmpty(res.customerId) && (
                        <div
                          className="col-lg-12"
                          style={{
                            paddingBottom: '8px',
                            display: 'flex',
                          }}
                        >
                          <div className="col-lg-3 datials-modal" id="describe-booking">
                            {S.CUSTOMER_BOOKING_NOTES}
                          </div>
                          <div className="col-lg-3">
                            <a id="price-content">
                              {res.notesDescription ? JSON.parse(res.notesDescription) : ''}
                            </a>
                          </div>
                          <br />
                          <br />
                        </div>
                      )}
                    </div>
                  );
                })}
              {/* </div> */}
              <div className="col-lg-12" style={{ display: 'flex' }}>
                <div className="col-lg-3 datials-modal" id="describe-booking">
                  {S.BOOKING_STATUS}
                </div>
                <div className="col-lg-3">
                  <a className="description-content text" id="description-full-view">
                    {userRole && userRole === chef ? (
                      <ChefBookingStatus bookingDetails={bookingDetail} />
                    ) : (
                      <CustomerBookingStatus bookingDetails={bookingDetail} />
                    )}
                  </a>
                </div>
              </div>
              <br />
              {reason && (
                <div className="col-lg-12" style={{ display: 'flex' }}>
                  <div className="col-lg-3 datials-modal" id="describe-booking">
                    {S.YOUR_REASON}
                  </div>
                  <div className="col-lg-3">
                    <a className="description-content text" id="description-full-view">
                      {reason}
                    </a>
                  </div>
                  <br />
                </div>
              )}
              <div className="col-lg-12" style={{ display: 'flex' }}>
                <div className="col-lg-3 datials-modal" id="describe-booking">
                  Booking Dishes:
                </div>
                <div className="col-lg-3">
                  <a className="description-content text" id="description-full-view">
                    {isArrayEmpty(dishes) ? (
                      dishes.map(res => {
                        return (
                          <div id="desc-dish-type">
                            <a id="price-content">{res} </a>
                          </div>
                        );
                      })
                    ) : (
                      <a id="price-content">---</a>
                    )}
                  </a>
                </div>
              </div>
              <br />
            </div>
            <br />

            <div class="card">
              <div class="card-header">
                <label id="describe-booking">Pricing</label>
              </div>

              <div
                className="col-lg-12"
                style={{
                  paddingBottom: '8px',
                  display: 'flex',
                  paddingTop: '1%',
                }}
              >
                <div className="col-lg-3 datials-modal" id="describe-booking">
                  Booking Price:
                </div>
                <div className="col-lg-3">
                  <a
                    className="description-content text"
                    id="description-full-view"
                    style={{ marginLeft: '16px' }}
                  >
                    {unit.toUpperCase() === 'USD' ? '$' : unit}
                    {price !== '' ? price.toFixed(2) : '0'}
                  </a>
                </div>
                <br />
                <br />
              </div>
              {isStringEmpty(bookingData && bookingData.chefBookingNoOfPeople) && (
                <div className="col-lg-12" style={{ paddingBottom: '8px', display: 'flex' }}>
                  <div className="col-lg-3 datials-modal" id="describe-booking">
                    {S.BOOKING_NO_OF_PEOPLE}
                  </div>
                  <div className="col-lg-3">
                    <a
                      className="description-content text"
                      id="description-full-view"
                      style={{ marginLeft: '16px' }}
                    >
                      {bookingData.chefBookingNoOfPeople}
                      {/* {setNoOfPeople(bookingData.chefBookingNoOfPeople)} */}
                    </a>
                  </div>
                  <br />
                  <br />
                </div>
              )}
              {isStringEmpty(bookingData && bookingData.chefBookingComplexity) && (
                <div className="col-lg-12" style={{ display: 'flex' }}>
                  <div className="col-lg-3 datials-modal" id="describe-booking">
                    {S.BOOKING_COMPLEXITY}
                  </div>
                  <div className="col-lg-3 ">
                    <a
                      className="description-content text"
                      id="description-full-view"
                      style={{ marginLeft: '16px' }}
                    >
                      {bookingData.chefBookingComplexity}
                    </a>
                  </div>
                  <br />
                  <br />
                </div>
              )}
              {isStringEmpty(bookingData) &&
                hasProperty(bookingData, 'storeTypes') &&
                isObjectEmpty(bookingData.storeTypes) &&
                hasProperty(bookingData.storeTypes, 'nodes') &&
                isArrayEmpty(bookingData.storeTypes.nodes) && (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-3 datials-modal" id="describe-booking">
                      Booking Store:
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text row" style={{ marginLeft: '16px' }}>
                        {bookingData.storeTypes.nodes.map((data, index) => {
                          return (
                            <div>
                              {index === 0 && <a>{data.storeTypeDesc}</a>}
                              {index !== 0 && <a>,{data.storeTypeDesc}</a>}
                            </div>
                          );
                        })}
                      </a>
                    </div>
                    <br />
                    <br />
                  </div>
                )}
              {hasProperty(bookingData, 'chefBookingOtherStoreTypes') &&
                isStringEmpty(bookingData.chefBookingOtherStoreTypes) && (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-3 datials-modal" id="describe-booking">
                      Other Store:
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text row" style={{ marginLeft: '16px' }}>
                        {JSON.parse(bookingData.chefBookingOtherStoreTypes)}
                      </a>
                    </div>
                    <br />
                    <br />
                  </div>
                )}
              {isStringEmpty(bookingData) &&
                isStringEmpty(bookingData.additionalServiceDetails) &&
                isArrayEmpty(JSON.parse(bookingData.additionalServiceDetails)) && (
                  <div className="col-lg-12" style={{ paddingBottom: '8px', display: 'flex' }}>
                    <div className="col-lg-3 datials-modal" id="describe-booking">
                      Additional Service:
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text row" style={{ marginLeft: '16px' }}>
                        {JSON.parse(bookingData.additionalServiceDetails).map(service => {
                          return (
                            <div>
                              <a style={{ marginRight: '10px' }}>
                                {service.desc} - ${service.price}
                              </a>
                            </div>
                          );
                        })}
                      </a>
                    </div>
                  </div>
                )}
              <br />
            </div>
            <br />
            {/* Old price calculation */}
            {/* {isObjectEmpty(bookingData) && (
              <div class="card">
                <div class="card-header">
                  <label id="describe-booking">Booking Billing Details</label>
                </div>
                <div className="col-lg-12" style={{ display: 'flex', paddingTop: '1%' }}>
                  <div className="col-lg-2 datials-modal" id="describe-booking">
                    Chef Charge For first 5 Guests:
                  </div>
                  <div className="col-lg-3">
                    {bookingData.chefBookingNoOfPeople < 5 && (
                      <a className="description-content text">
                        $ {baserate * bookingData.chefBookingNoOfPeople}
                      </a>
                    )}
                    {bookingData.chefBookingNoOfPeople >= 5 && (
                      <a className="description-content text">$ {baserate * 5}</a>
                    )}
                  </div>
                </div>
                <br />
                {isObjectEmpty(bookingData) && bookingData.chefBookingNoOfPeople > 5 && (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-2 datials-modal" id="describe-booking">
                      Chef Charge For After 5 Guests:
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">$ {afterFive}</a>
                    </div>

                    <br />
                  </div>
                )}
                <br />
                {isObjectEmpty(bookingData) && bookingData.chefBookingNoOfPeople <= 5 && (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-2 datials-modal" id="describe-booking">
                      Complexity Charge:
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">$ {complexity}</a>
                    </div>
                    <br />
                  </div>
                )}
                {isObjectEmpty(bookingData) && bookingData.chefBookingNoOfPeople > 5 && (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-2 datials-modal" id="describe-booking">
                      Complexity Charge:
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">$ {complexity}</a>
                    </div>
                    <br />
                  </div>
                )}
                <br />
                {isObjectEmpty(bookingData) && bookingData.additionalServiceDetails && (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-2 datials-modal" id="describe-booking">
                      Additional Services:
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">$ {getBookingData('service')}</a>
                    </div>
                    <br />
                  </div>
                )}
                <br />
                {isObjectEmpty(bookingData) && bookingData.chefBookingNoOfPeople <= 5 && (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-2 datials-modal" id="describe-booking">
                      Chef Charge:
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">${chefPrice}</a>
                    </div>
                    <br />
                  </div>
                )}
                {isObjectEmpty(bookingData) && bookingData.chefBookingNoOfPeople > 5 && (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-2 datials-modal" id="describe-booking">
                      Chef Charge:
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">$ {calculateChefCharge()}</a>
                    </div>
                    <br />
                  </div>
                )}
                <br />
                {userRole === chef && (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-2 datials-modal" id="describe-booking">
                      Rockoly Charge:
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">
                        ${' '}
                        {(
                          (servicePercentValue * bookingData.chefBookingPriceValue) / 100 +
                          0.3
                        ).toFixed(2)}
                      </a>
                    </div>
                    <br />
                  </div>
                )}
                <br />
                {userRole === chef ? (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-sm-2" id="describe-booking">
                      Total amount to pay
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">
                        ${' '}
                        {(
                          parseFloat(
                            priceCalculator(
                              baserate,
                              bookingData.chefBookingNoOfPeople,
                              bookingData.chefBookingComplexity,
                              servicePrice
                            )
                          ) -
                          parseFloat(
                            (servicePercentValue * bookingData.chefBookingPriceValue) / 100
                          )
                        ).toFixed(2) - 0.3}
                      </a>
                    </div>
                    <br />
                  </div>
                ) : (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-sm-2" id="describe-booking">
                      Total amount to pay
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">
                        ${' '}
                        {parseFloat(
                          priceCalculator(
                            baserate,
                            bookingData.chefBookingNoOfPeople,
                            bookingData.chefBookingComplexity,
                            servicePrice
                          )
                        ).toFixed(2)}
                      </a>
                    </div>
                    <br />
                  </div>
                )}
              </div>
            )} */}
            <br />
            {/* New price calculation */}
            {isObjectEmpty(bookingData) && (
              <div class="card">
                <div class="card-header">
                  <label id="describe-booking">Booking Billing Details</label>
                </div>
                <div className="col-lg-12" style={{ display: 'flex', paddingTop: '1%' }}>
                  <div className="col-lg-2 datials-modal" id="describe-booking">
                    Chef base rate(${baserate}) X No.of.guests({bookingData.chefBookingNoOfPeople})
                  </div>
                  <div className="col-lg-3">
                    {(bookingData.chefBookingNoOfPeople < 5 ||
                      bookingData.chefBookingNoOfPeople >= 5) && (
                      <a className="description-content text">
                        $ {baserate * bookingData.chefBookingNoOfPeople}
                      </a>
                    )}
                    {/* {bookingData.chefBookingNoOfPeople >= 5 && (
                      <a className="description-content text">$ {baserate * 5}</a>
                    )} */}
                  </div>
                </div>
                <br />
                {isObjectEmpty(bookingData) && bookingData.chefBookingNoOfPeople > 5 && (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-3 datials-modal" id="describe-booking">
                      Discount
                    </div>
                    <div className="col-lg-3">
                      {/* <a className="description-content text"> */}
                      <a className="description-content text"> -${afterFive}</a>
                      {/* $ {(getBookingData('people') - 5) * (baserate / 2)} */}
                      {/* </a> */}
                    </div>

                    <br />
                  </div>
                )}
                <br />
                {isObjectEmpty(bookingData) && bookingData.chefBookingNoOfPeople > 5 && (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-12 datials-modal" id="describe-booking">
                      Over 5 ({remainingMemberCount}) guests half chef Base Rate ${halfBaseRate}
                    </div>
                    <br />
                  </div>
                )}

                <br />
                {isObjectEmpty(bookingData) && bookingData.chefBookingNoOfPeople <= 5 && (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-3 datials-modal" id="describe-booking">
                      Complexity Upcharge:
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">$ {complexity}</a>
                    </div>
                    {/* <a className="description-content text">$ {complexity}</a> */}
                    <br />
                  </div>
                )}
                {isObjectEmpty(bookingData) && bookingData.chefBookingNoOfPeople > 5 && (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-3 datials-modal" id="describe-booking">
                      Complexity Upcharge:
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">$ {complexity}</a>
                    </div>
                    <br />
                  </div>
                )}
                <br />
                {isObjectEmpty(bookingData) && bookingData.additionalServiceDetails && (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-3 datials-modal" id="describe-booking">
                      Additional Services:
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">$ {getBookingData('service')}</a>
                    </div>
                    <br />
                  </div>
                )}
                <br />
                {/* {isObjectEmpty(bookingData) && bookingData.chefBookingNoOfPeople <= 5 && (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-2 datials-modal" id="describe-booking">
                      Chef Charge:
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">${chefPrice}</a>
                    </div>
                    <br />
                  </div>
                )}
                {isObjectEmpty(bookingData) && bookingData.chefBookingNoOfPeople > 5 && (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-2 datials-modal" id="describe-booking">
                      Chef Charge:
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">$ {calculateChefCharge()}</a>
                    </div>
                    <br />
                  </div>
                )}
                <br /> */}
                {userRole === chef && (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-3 datials-modal" id="describe-booking">
                      Rockoly / Payment Charges:
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">
                        ${' '}
                        {(
                          (servicePercentValue * bookingData.chefBookingPriceValue) / 100 +
                          0.3
                        ).toFixed(2)}
                      </a>
                    </div>
                    {/* <a className="description-content text">
                    $ {bookingData.chefBookingCommissionPriceValue}
                  </a> */}
                    <br />
                  </div>
                )}
                <br />
                {userRole === chef ? (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-3" id="describe-booking">
                      Total amount to pay
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">
                        ${' '}
                        {(
                          parseFloat(
                            priceCalculator(
                              baserate,
                              bookingData.chefBookingNoOfPeople,
                              bookingData.chefBookingComplexity,
                              servicePrice
                            )
                          ).toFixed(2) -
                          parseFloat(
                            (servicePercentValue * bookingData.chefBookingPriceValue) / 100
                          ).toFixed(2)
                        ).toFixed(2) - 0.3}
                      </a>
                    </div>
                    <br />
                  </div>
                ) : (
                  <div className="col-lg-12" style={{ display: 'flex' }}>
                    <div className="col-lg-3" id="describe-booking">
                      Total amount to pay
                    </div>
                    <div className="col-lg-3">
                      <a className="description-content text">
                        ${' '}
                        {parseFloat(
                          priceCalculator(
                            baserate,
                            bookingData.chefBookingNoOfPeople,
                            bookingData.chefBookingComplexity,
                            servicePrice
                          )
                        ).toFixed(2)}
                      </a>
                    </div>
                    <br />
                  </div>
                )}
              </div>
              //{' '}
              // </div>
            )}
            <br />
            {/* getBookingData Chef charge = (50 * 5 + ((8-5) * (50/2)) * 1.5 + 10 = 497.5  */}
            {requestData && requestData.chefBookingRequestHistId && (
              <div>
                <div class="card">
                  <div class="card-header">
                    <label id="describe-booking">Request Pricing</label>
                  </div>
                  {requestData.chefBookingRequestTotalPriceValue && (
                    <div
                      className="col-lg-12"
                      style={{
                        paddingBottom: '8px',
                        display: 'flex',
                        paddingTop: '1%',
                      }}
                    >
                      <div className="col-lg-3 datials-modal" id="describe-booking">
                        Request Price:
                      </div>
                      <div className="col-lg-3">
                        <a className="description-content text row" style={{ marginLeft: '16px' }}>
                          {requestData.chefBookingRequestPriceValue
                            ? `$${requestData.chefBookingRequestPriceValue.toFixed(2)}`
                            : null}
                        </a>
                      </div>
                      <br />
                    </div>
                  )}
                  {isStringEmpty(requestData.chefBookingRequestNoOfPeople) &&
                    Math.abs(requestData.chefBookingRequestNoOfPeople) > 0 && (
                      <div className="col-lg-12" style={{ paddingBottom: '8px', display: 'flex' }}>
                        <div className="col-sm-3 datials-modal" id="describe-booking">
                          Request No of People:
                        </div>
                        <div className="col-lg-3">
                          <a
                            className="description-content text row"
                            style={{ marginLeft: '16px' }}
                          >
                            {Math.abs(requestData.chefBookingRequestNoOfPeople)}
                          </a>
                        </div>
                        <br />
                        <br />
                      </div>
                    )}
                  {isStringEmpty(requestData.chefBookingRequestComplexity) && (
                    <div className="col-lg-12" style={{ paddingBottom: '8px', display: 'flex' }}>
                      <div className="col-lg-3 datials-modal" id="describe-booking">
                        Request Complexity:
                      </div>
                      <div className="col-lg-3">
                        <a className="description-content text row" style={{ marginLeft: '16px' }}>
                          {requestData.chefBookingRequestComplexity}
                        </a>
                      </div>
                      <br />
                      <br />
                    </div>
                  )}
                  {requestData.additionalServiceDetails &&
                    isStringEmpty(requestData.additionalServiceDetails) &&
                    isArrayEmpty(JSON.parse(requestData.additionalServiceDetails)) && (
                      <div className="col-lg-12" style={{ paddingBottom: '8px', display: 'flex' }}>
                        <div className="col-lg-3 datials-modal" id="describe-booking">
                          Request Additional Service:
                        </div>

                        {/* {requestData.chefBookingRequestAdditionalServices} */}
                        {JSON.parse(requestData.additionalServiceDetails).map(data => {
                          return (
                            <a
                              className="description-content text row"
                              style={{ marginLeft: '16px' }}
                            >
                              <a style={{ marginRight: '10px' }}>
                                {data.desc} - ${data.price}
                              </a>
                            </a>
                          );
                        })}
                        <br />
                        <br />
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
          <br />

          {bookingData &&
            userRole === customer &&
            hasProperty(bookingData, 'paymentHistoriesByBookingHistId') &&
            isObjectEmpty(bookingData.paymentHistoriesByBookingHistId) &&
            hasProperty(bookingData.paymentHistoriesByBookingHistId, 'nodes') &&
            isArrayEmpty(bookingData.paymentHistoriesByBookingHistId.nodes) && (
              <div class="card">
                <div class="card-header">
                  <label id="describe-booking"> Payment Table</label>
                </div>
                <div
                  className="col-lg-12"
                  style={{
                    paddingBottom: '8px',
                    display: 'flex',
                    paddingTop: '1%',
                    width: '100%',
                    overflow: 'auto',
                  }}
                >
                  <table className="table">
                    <thead>
                      <tr>
                        <th style={{ width: '36%' }}>ID</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingData.paymentHistoriesByBookingHistId.nodes.map(data => {
                        return (
                          <tr>
                            <td>{data.paymentId}</td>
                            <td>{data.paymentStatusId}</td>
                            <td>
                              {data.paymentOriginalPriceUnitFormat &&
                              data.paymentOriginalPriceUnitFormat.toUpperCase() === 'USD'
                                ? '$'
                                : ''}
                              {data.paymentOriginalPriceValueFormat}
                            </td>
                            <td>{convertDateFormat(data.createdAt)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          <br />

          <div class="card">
            <div class="card-header">
              <label id="describe-booking">Others</label>
            </div>
            {isStringEmpty(bookingData) &&
              hasProperty(bookingData, 'dietaryRestrictionsTypes') &&
              isObjectEmpty(bookingData.dietaryRestrictionsTypes) &&
              hasProperty(bookingData.dietaryRestrictionsTypes, 'nodes') &&
              isArrayEmpty(bookingData.dietaryRestrictionsTypes.nodes) && (
                <div className="col-lg-12" style={{ display: 'flex', paddingTop: '1%' }}>
                  <div className="col-lg-3 datials-modal" id="describe-booking">
                    Booking Dietary:
                  </div>
                  <div className="col-lg-3">
                    <a className="description-content text row" style={{ marginLeft: '16px' }}>
                      {bookingData.dietaryRestrictionsTypes.nodes.map((data, index) => {
                        return (
                          <div>
                            {index === 0 && <a>{data.dietaryRestrictionsTypeDesc}</a>}
                            {index !== 0 && <a>,{data.dietaryRestrictionsTypeDesc}</a>}
                          </div>
                        );
                      })}
                    </a>
                  </div>
                  <br />
                  <br />
                </div>
              )}
            {hasProperty(bookingData, 'chefBookingOtherDietaryRestrictionsTypes') &&
              isStringEmpty(bookingData.chefBookingOtherDietaryRestrictionsTypes) && (
                <div className="col-lg-12" style={{ paddingBottom: '8px', display: 'flex' }}>
                  <div className="col-lg-3 datials-modal" id="describe-booking">
                    Other Dietary:
                  </div>
                  <div className="col-lg-3">
                    <a className="description-content text row" style={{ marginLeft: '16px' }}>
                      {JSON.parse(bookingData.chefBookingOtherDietaryRestrictionsTypes)}
                    </a>
                  </div>
                  <br />
                  <br />
                </div>
              )}
            {isStringEmpty(bookingData) &&
              hasProperty(bookingData, 'kitchenEquipmentTypes') &&
              isObjectEmpty(bookingData.kitchenEquipmentTypes) &&
              hasProperty(bookingData.kitchenEquipmentTypes, 'nodes') &&
              isArrayEmpty(bookingData.kitchenEquipmentTypes.nodes) && (
                <div className="col-lg-12" style={{ display: 'flex' }}>
                  <div className="col-lg-3 datials-modal" id="describe-booking">
                    Booking Kitchen Equipments:
                  </div>
                  <div className="col-lg-3">
                    <a className="description-content text row" style={{ marginLeft: '16px' }}>
                      {bookingData.kitchenEquipmentTypes.nodes.map((data, index) => {
                        return (
                          <div>
                            {index === 0 && <a>{data.kitchenEquipmentTypeDesc}</a>}
                            {index !== 0 && <a>,{data.kitchenEquipmentTypeDesc}</a>}
                          </div>
                        );
                      })}
                    </a>
                  </div>
                  <br />
                  <br />
                </div>
              )}
            <br />
            {hasProperty(bookingData, 'chefBookingOtherKitchenEquipmentTypes') &&
              isStringEmpty(bookingData.chefBookingOtherKitchenEquipmentTypes) && (
                <div className="col-lg-12" style={{ display: 'flex' }}>
                  <div className="col-lg-3 datials-modal" id="describe-booking">
                    Other Kitchen Equipments:
                  </div>
                  <div className="col-lg-2">
                    <a className="description-content text row" style={{ marginLeft: '16px' }}>
                      {JSON.parse(bookingData.chefBookingOtherKitchenEquipmentTypes)}
                    </a>
                  </div>
                  <br />
                  <br />
                </div>
              )}
            <br />
            {isStringEmpty(bookingData) &&
              hasProperty(bookingData, 'allergyTypes') &&
              isObjectEmpty(bookingData.allergyTypes) &&
              hasProperty(bookingData.allergyTypes, 'nodes') &&
              isArrayEmpty(bookingData.allergyTypes.nodes) && (
                <div className="col-lg-12" style={{ paddingBottom: '8px', display: 'flex' }}>
                  <div className="col-lg-3 datials-modal" id="describe-booking">
                    Booking Allergies:
                  </div>
                  <div className="col-lg-3">
                    <a className="description-content text row" style={{ marginLeft: '16px' }}>
                      {bookingData.allergyTypes.nodes.map((data, index) => {
                        return (
                          <div>
                            {index === 0 && <a>{data.allergyTypeDesc}</a>}
                            {index !== 0 && <a>,{data.allergyTypeDesc}</a>}
                          </div>
                        );
                      })}
                    </a>
                  </div>
                  <br />
                  <br />
                </div>
              )}
            {hasProperty(bookingData, 'chefBookingOtherAllergyTypes') &&
              isStringEmpty(bookingData.chefBookingOtherAllergyTypes) && (
                <div className="col-lg-12" style={{ paddingBottom: '8px', display: 'flex' }}>
                  <div className="col-lg-3 datials-modal" id="describe-booking">
                    Other Allergies:
                  </div>
                  <div className="col-lg-3">
                    <a className="description-content text row" style={{ marginLeft: '16px' }}>
                      {JSON.parse(bookingData.chefBookingOtherAllergyTypes)}
                    </a>
                  </div>
                  <br />
                  <br />
                </div>
              )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
