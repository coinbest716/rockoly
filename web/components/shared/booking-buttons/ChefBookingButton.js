import React, { useEffect, useState } from 'react';
import moment from 'moment';
import S from './BookingButtons.String';
import * as util from '../../../utils/checkEmptycondition';
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import AddsModal from '../modal/RequestStatusModal';
import CompleteConfirmModal from '../modal/CompleteConfirmModal';
import Loader from '../../Common/loader';
import { NavigateToFeedbackPage } from './Navigation';
import PricingModal from '../modal/PricingModal';
import { toastMessage, success, renderError, error } from '../../../utils/Toast';
import { getLocalTime } from '../../../utils/DateTimeFormat';
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import {
  isObjectEmpty,
  hasProperty,
  isStringEmpty,
  isArrayEmpty,
} from '../../../utils/checkEmptycondition';

//Get mins for booking cancel option
const minsTag = gqlTag.query.setting.getSettingValueGQLTAG;
const GET_MINS_FOR_BOOKING = gql`
  ${minsTag}
`;

const ChefBookingButton = props => {
  //Initial set value
  const [bookingData, setBookingData] = useState({});
  const [status, setStatus] = useState('');
  const [userRole, setUserRole] = useState('customer');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRejectVisible, setModalRejectVisible] = useState(false);
  const [modalCancelVisible, setModalCancelVisible] = useState(false);
  const [modalCompleteVisible, setModalCompleteVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [modalCompletedVisible, setModalCompletedVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [isDateExceed, setIsDateExceed] = useState(false);

  const [getMinsData, minsData] = useLazyQuery(GET_MINS_FOR_BOOKING, {
    variables: {
      pSettingName: S.NO_OF_MINUTES_FOR_BOOKING_CANCEL,
    },
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  useEffect(() => {
    if (util.isObjectEmpty(props) && util.isObjectEmpty(props.bookingDetails)) {
      setBookingData(props.bookingDetails);
      let status = props.bookingDetails.chefBookingStatusId
        ? props.bookingDetails.chefBookingStatusId.trim()
        : '';
      setStatus(status);
      setUserRole(props.userRole);
      setBookingId(props.bookingDetails.chefBookingHistId);
    }
  }, [props]);

  //Calculate the mins for cancel option
  useEffect(() => {
    if (
      isObjectEmpty(minsData) &&
      hasProperty(minsData, 'data') &&
      isObjectEmpty(minsData.data) &&
      hasProperty(minsData.data, 'getSettingValue') &&
      isStringEmpty(minsData.data.getSettingValue) &&
      util.isObjectEmpty(bookingData)
    ) {
      let chefMinutes = parseInt(minsData.data.getSettingValue);
      let bookingDate = getLocalTime(bookingData.chefBookingFromTime);
      let currentDate = getLocalTime(new Date());
      const diffValue = moment(bookingDate).diff(moment(currentDate), 'minutes');

      console.log('chefMinutes', chefMinutes, diffValue);
      if (chefMinutes < diffValue) {
        onClickModel(modalCancelVisible, setModalCancelVisible);
      } else {
        toastMessage(renderError, S.CANCEL_ALERT_MESSAGE);
      }
    }
  }, [minsData]);

  useEffect(() => {
    if (util.isObjectEmpty(bookingData)) {
      let bookingDate = getLocalTime(bookingData.chefBookingFromTime);
      let currentDate = getLocalTime(new Date());
      const diffValue = moment(currentDate).diff(moment(bookingDate), 'hours');
      if (bookingDate < currentDate) {
        setIsDateExceed(false);
      } else {
        setIsDateExceed(true);
      }
    }
  }, [props]);

  function onCloseModal() {
    if (props.triggerSubscription) {
      props.triggerSubscription();
    }
    setLoading(false);
    setModalVisible(false);
    setModalRejectVisible(false);
    setModalCancelVisible(false);
    setModalCompleteVisible(false);
    setModalCompletedVisible(false);
    setModalEditVisible(false);
  }

  function onClickModel(value, setState) {
    setLoading(true);
    setState(!value);
  }

  //on click feedback buttton
  function onClickFeedback(res) {
    let data = {
      historyId: res.chefBookingHistId ? res.chefBookingHistId : '',
      name:
        res.customerProfileByCustomerId && res.customerProfileByCustomerId.fullName
          ? res.customerProfileByCustomerId.fullName
          : '',
      chefId: res.chefId ? res.chefId : '',
      customerId: res.customerId ? res.customerId : '',
    };
    NavigateToFeedbackPage(data);
  }

  function onClickCompleteEdtit(value, setState, screenVal) {
    if (screenVal === 'edit') {
      if (
        bookingData &&
        bookingData.chefProfileByChefId &&
        bookingData.chefProfileByChefId.defaultStripeUserId
      ) {
        console.log('bookingData', bookingData);
        let bookingDate = getLocalTime(bookingData.chefBookingFromTime);
        let currentDate = getLocalTime(new Date());
        const diffValue = moment(bookingDate).diff(moment(currentDate), 'minutes');
        console.log('diffValue', diffValue);
        if (diffValue < 0 || diffValue === 0) {
          onClickModel(value, setState);
        }
      } else {
        toastMessage(renderError, 'Please add a new Bank/Account details in Manage Payments');
      }
    } else if (screenVal === 'complete') {
      // if (
      //   bookingData &&
      //   bookingData.chefProfileByChefId &&
      //   bookingData.chefProfileByChefId.defaultStripeUserId
      // ) {
      //   onClickModel(value, setState);
      // } else {
      //   toastMessage(renderError, 'Please add a new Bank/Account details in Manage Payments');
      // }

      if (
        util.isObjectEmpty(bookingData) &&
        util.isStringEmpty(bookingData.chefProfileByChefId.defaultStripeUserId)
      ) {
        let bookingDate = getLocalTime(bookingData.chefBookingToTime);
        let currentDate = getLocalTime(new Date());
        const diffValue = moment(bookingDate).diff(moment(currentDate), 'minutes');
        if (diffValue <= 0) {
          onClickModel(value, setState);
        } else {
          toastMessage(renderError, S.COMPLETED_VALIDATION);
        }
      } else {
        toastMessage(renderError, S.STRIPEID_MISSING_MSG);
      }
    }
  }

  function onCancelPress() {
    getMinsData();
  }

  let diffValue;

  if (util.isObjectEmpty(bookingData)) {
    let bookingDate = getLocalTime(bookingData.chefBookingFromTime);
    let currentDate = getLocalTime(new Date());
    diffValue = moment(bookingDate).diff(moment(currentDate), 'minutes');
  }

  console.log('diffValue', diffValue);

  return (
    <React.Fragment>
      <div className="" id="all-button-view">
        <div style={{ height: '100%' }}>
          <div className="row">
            {status === S.CUSTOMER_REQUESTED && isDateExceed && (
              <div className="booking-button">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => onClickModel(modalVisible, setModalVisible)}
                  id="buttonText"
                  style={{ width: '120px' }}
                >
                  {S.ACCEPT}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => onClickModel(modalRejectVisible, setModalRejectVisible)}
                  id="buttonText-danger"
                  style={{ width: '120px' }}
                >
                  {S.REJECT}
                </button>
              </div>
            )}
            {status === S.CUSTOMER_REQUESTED && !isDateExceed && (
              <div className="booking-button">
                <label>
                  <b>Booking Expired</b>
                </label>
              </div>
            )}
            {status === S.CHEF_ACCEPTED &&
              bookingData.chefBookingCompletedByCustomerYn === false &&
              bookingData.chefBookingCompletedByChefYn === false && (
                <div className="booking-button">
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => onCancelPress()}
                    id="cancel-button-style"
                  >
                    {S.CANCEL}{' '}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      onClickCompleteEdtit(
                        modalCompleteVisible,
                        setModalCompletedVisible,
                        'complete'
                      )
                    }
                    id="cancel-button-style"
                    style={{ marginTop: '10px', color: '#fff' }}
                  >
                    {S.COMPLETE}{' '}
                  </button>
                  {diffValue === 0 ||
                    (diffValue < 0 && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          onClickCompleteEdtit(modalEditVisible, setModalEditVisible, 'edit')
                        }
                        id="cancel-button-styl"
                        style={{ marginTop: '10px', color: '#fff',marginRight: '19px' }}
                      >
                        {S.EDIT}
                      </button>
                    ))}
                </div>
              )}
            {(status === 'AMOUNT_TRANSFER_SUCCESS' || status === 'COMPLETED') &&
              bookingData.chefBookingCompletedByChefYn === false && (
                <div
                  className="addressText"
                  id="message-text"
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => onClickFeedback(bookingData)}
                    style={{ marginTop: '10px',marginRight: '19px' }}
                    id="buttonTextCompleted"
                  >
                    {S.SUBMIT_FEEDBACK}
                  </button>
                </div>
              )}
            {(status === 'AMOUNT_TRANSFER_SUCCESS' || status === 'COMPLETED') &&
              bookingData.chefBookingCompletedByChefYn === true && (
                <div
                  className="addressText"
                  id="message-text"
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <div>{'Reviewed'}</div>
                </div>
              )}
          </div>
        </div>
      </div>
      {modalVisible === true && (
        <AddsModal
          content={S.ACCEPT_ALERT}
          onCloseModal={onCloseModal}
          bookingDetail={bookingData}
          userRole={userRole}
          type={S.ACCEPT}
        />
      )}
      {modalRejectVisible === true && (
        <AddsModal
          visible={modalVisible}
          onCloseModal={onCloseModal}
          content={S.REJECT_ALERT}
          bookingDetail={bookingData}
          userRole={userRole}
          type={S.REJECT}
        />
      )}
      {modalCancelVisible === true && (
        <AddsModal
          onCloseModal={onCloseModal}
          content={S.CANCEL_ALERT}
          bookingDetail={bookingData}
          userRole={userRole}
          type={S.CANCEL}
        />
      )}
      {modalCompleteVisible === true && (
        <CompleteConfirmModal
          onCloseModal={onCloseModal}
          id={bookingId}
          content="Are you want to edit booking details?"
          bookingDetail={bookingData}
          userRole={userRole}
          type={S.COMPLETE}
        />
      )}
      {modalCompletedVisible && (
        <AddsModal
          onCloseModal={onCloseModal}
          content="Are you sure you want to Complete?"
          bookingDetail={bookingData}
          userRole={userRole}
          type="Complete"
        />
      )}
      {modalEditVisible && (
        <PricingModal
          bookingDetails={bookingData}
          chefId={bookingData.chefId}
          onCloseModal={onCloseModal}
          screen="request"
        />
      )}
    </React.Fragment>
  );
};

export default ChefBookingButton;
