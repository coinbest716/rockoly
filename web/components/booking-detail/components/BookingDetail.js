import React, { useEffect, useState } from 'react';
// import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import S from '../BookingDetail.Strings';
import { convertDateandTime } from '../../../utils/DateTimeFormat';
import { chef, customer, getUserTypeRole, customerId } from '../../../utils/UserType';
import {
  isObjectEmpty,
  hasProperty,
  isStringEmpty,
  isArrayEmpty,
} from '../../../utils/checkEmptycondition';
import { NavigateToChatPage } from './Navigation';
// import { toastMessage, success, renderError, error } from '../../../utils/Toast';
import ChefBookingButton from '../../shared/booking-buttons/ChefBookingButton';
import CustomerBookingButton from '../../shared/booking-buttons/CustomerBookingButton';
import ChefBookingStatus from '../../shared/booking-status/ChefBookingStatus';
import CustomerBookingStatus from '../../shared/booking-status/CustomerBookingStatus';

export default function BookingDetail(props) {
  let data = props.BookingDetails;
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
  const [reason, setReason] = useState('');
  const [bookingDetail, setBookingDetail] = useState({});
  const [notes, setNotes] = useState([]);
  const [dishes, setDishes] = useState([]);
 
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
        bookingValue.chefBookingStatusId.trim() === S.PAYMENT_PENDING ||
        bookingValue.chefBookingStatusId.trim() === S.PAYMENT_FAILED
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
            setPrice(
              bookingValue.chefBookingTotalPriceValue
                ? bookingValue.chefBookingTotalPriceValue
                : '-'
            );
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
            setPrice(bookingValue.chefBookingPriceValue ? bookingValue.chefBookingPriceValue : '-');
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
          }
        })
        .catch(err => {});
      if (
        bookingValue.chefBookingStatusId.trim() === S.REFUND_AMOUNT_SUCCESS ||
        bookingValue.chefBookingStatusId.trim() === S.REFUND_AMOUNT_FAILED
      ) {
        let reasonData = bookingValue.chefBookingChefRejectOrCancelReason
          ? bookingValue.chefBookingChefRejectOrCancelReason
          : bookingValue.chefBookingCustomerRejectOrCancelReason;
        setReason(reasonData);
      }
    }
  }, [data]);

  function onButtonClick() {
    let name = '';
    let pic = '';
    let status = '';
    if (userRole !== 'chef') {
      (name =
        props.BookingDetails.chefBookingHistoryByChefBookingHistId.chefProfileByChefId.fullName),
        (pic =
          props.BookingDetails.chefBookingHistoryByChefBookingHistId.chefProfileByChefId.chefPicId);
      status = props.BookingDetails.chefBookingHistoryByChefBookingHistId.chefBookingStatusId;
    } else {
      (name =
        props.BookingDetails.chefBookingHistoryByChefBookingHistId.customerProfileByCustomerId
          .fullName),
        (pic =
          props.BookingDetails.chefBookingHistoryByChefBookingHistId.customerProfileByCustomerId
            .customerPicId);
      status = props.BookingDetails.chefBookingHistoryByChefBookingHistId.chefBookingStatusId;
    }
    let val = {
      conversationId: props.BookingDetails.chefBookingHistoryByChefBookingHistId.conversationId,
      fullName: name,
      pic: pic,
      status: status,
    };
    NavigateToChatPage(val);
  }

  return (
    <React.Fragment>
      <div className="row" id="bookingLoopView">
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
        <div className="col-lg-6 col-md-6 chefDetail">
          <div className="product-details-content">
            <h3>{fullName}</h3>
            <div>{address}</div>
            {userRole && userRole === chef ? (
              <ChefBookingButton bookingDetails={bookingDetail} userRole={userRole} />
            ) : (
              <CustomerBookingButton bookingDetails={bookingDetail} userRole={userRole} />
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="col-lg-12 col-md-12 product-details-content">
          <div className="product-info" id="booking-chef-details">
            <div className="row" style={{ paddingBottom: '8px' }}>
              <h6 className="bookingData col-lg-2 col-md-2 col-sm-2" id="booking-content">
                {S.BOOKING_PRICE}
              </h6>{' '}
              <a id="price-content">
                {unit.toUpperCase() === 'USD' ? '$' : unit}
               
                {price ? price.toFixed(2) : ''}
              </a>
            </div>
            <div className="row" style={{ paddingBottom: '8px' }}>
              <h6 className="bookingData col-md-2" id="booking-content">
                {S.FROM_TIME}
              </h6>{' '}
              <a id="price-content">{convertDateandTime(fromTime)}</a>
            </div>
            <div className="row" style={{ paddingBottom: '8px' }}>
              <h6 className="col-md-2" id="booking-content">
                {S.TO_TIME}
              </h6>{' '}
              <a id="price-content">{convertDateandTime(toTime)}</a>
            </div>
            <div>
              {isArrayEmpty(notes) &&
                notes.map(res => {
                  return (
                    <div>
                      {isStringEmpty(res.chefId) && (
                        <div className="row" style={{ paddingBottom: '8px' }}>
                          <h6 className="col-md-2" id="booking-content">
                            {S.CHEF_BOOKING_NOTES}
                          </h6>
                          <a id="price-content">
                            {res.notesDescription ? JSON.parse(res.notesDescription) : ''}
                          </a>
                        </div>
                      )}
                      {isStringEmpty(res.customerId) && (
                        <div className="row" style={{ paddingBottom: '8px' }}>
                          <h6 className="col-md-2" id="booking-content">
                            {S.CUSTOMER_BOOKING_NOTES}
                          </h6>
                          <a id="price-content">
                            {res.notesDescription ? JSON.parse(res.notesDescription) : ''}
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
            <div className="row" style={{ paddingBottom: '8px' }}>
              <h6 className="col-md-2" id="booking-content" style={{ fontWeight: 'bolder' }}>
                {S.BOOKING_STATUS}
              </h6>{' '}
              {/* <a>{status ? status : '---'}</a> */}
              <a>
                {' '}
                {userRole && userRole === chef ? (
                  <ChefBookingStatus bookingDetails={bookingDetail} />
                ) : (
                  <CustomerBookingStatus bookingDetails={bookingDetail} />
                )}
              </a>
            </div>
            {reason && (
              <div className="row" style={{ paddingBottom: '8px' }}>
                <h6 className="col-md-2" id="booking-content" style={{ fontWeight: 'bolder' }}>
                  {S.YOUR_REASON}
                </h6>{' '}
                <a className="details-style">{reason}</a>
              </div>
            )}
            <div className="row" style={{ paddingBottom: '8px' }}>
              <h6 className="col-md-2" id="booking-content">
                {S.DISHES}
              </h6>
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
            </div>
          </div>
        </div>
      </div>
      {/* {openCardList === true && <CardListModal closeCardModal={closeCardModal} />} */}
      <button onClick={() => onButtonClick()} className="btn btn-primary" id="saveButton">
        <span>
          <img
            id="chat-icon-view"
            src={require('../../../images/mock-image/open-chat.png')}
            alt="image"
            style={{ width: '30px' }}
          />
        </span>
        {'CHAT'}
      </button>
    </React.Fragment>
  );
}
