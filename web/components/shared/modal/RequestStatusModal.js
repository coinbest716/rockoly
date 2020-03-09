import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import gql from 'graphql-tag';
import moment from 'moment';
import TimePicker from 'react-times';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import * as gqlTag from '../../../common/gql';
import S from './Modal.String';
import { toastMessage, renderError, success, error } from '../../../utils/Toast';
import { withApollo } from '../../../apollo/apollo';
import {
  isStringEmpty,
  isBooleanEmpty,
  isObjectEmpty,
  hasProperty,
  isArrayEmpty,
} from '../../../utils/checkEmptycondition';
import { chef, customer } from '../../../utils/UserType';
import { NavigateToFeedbackPage, NavigateToLoginPage } from './Navigation';
import { AppContext } from '../../../context/appContext';
import {
  getLocalTime,
  alterTime,
  getDateWithTimeLocalWithoutFormat,
} from '../../../utils/DateTimeFormat';
import Loader from '../../Common/loader';
import {
  initialStartTime,
  endTimeLimit,
  getTimestamp,
  getTimeOnly,
  getDate,
  getIsoDate,
  convert12to24Hours,
  convert12to24Format,
  getDateFormat,
  getTimeFormat,
  getHourFormat,
  initialBlockStartTime,
  initialBlockEndTime,
} from '../../../utils/DateTimeFormat';

//Get mins for booking cancel option
const minsTag = gqlTag.query.setting.getSettingValueGQLTAG;
const GET_MINS_FOR_BOOKING = gql`
  ${minsTag}
`;

//update booking details
const updateBookingData = gqlTag.mutation.booking.updateGQLTAG;

//for updating booking details
const UPDATE_BOOKING_DETAILS = gql`
  ${updateBookingData}
`;

//update booking details
const updateNotesData = gqlTag.mutation.notes.createNotesGQLTAG;

//for updating booking details
const UPDATE_NOTES = gql`
  ${updateNotesData}
`;

//For payment process
const paymentComplete = gqlTag.mutation.booking.completeGQLTAG;

const COMPLETE_PAYMENT = gql`
  ${paymentComplete}
`;

// save from and to time

const setTimes = gqlTag.mutation.booking.acceptBookingGQLTAG;

const SET_FROM_TO_TIME = gql`
  ${setTimes}
`;
const RequestStatusModal = props => {
  //Initial set value
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [historyId, setHistoryId] = useState('');
  const [status, setStatus] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [completedByChef, setCompletedByChef] = useState(false);
  const [completedByCustomer, setCompletedByCustomer] = useState(false);
  const [reasonByChef, setReasonByChef] = useState('');
  const [reasonByCustomer, setReasonByCustomer] = useState('');
  const [userRole, setUserRole] = useState(customer);
  const [name, setName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [chefId, setChefId] = useState('');
  const [state, setState] = useContext(AppContext);
  const [toastContent, setToastContent] = useState('');
  const [notes, setNotes] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [tablePkId, setTablePkId] = useState('');
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [fixedStartTime, setFixedStartTime] = useState(initialStartTime);
  let blockedStart;
  let blockedEnd;
  const [fixedEndTime, setFixedEndTime] = useState(endTimeLimit);
  const [fromTime, setFromTime] = useState(initialStartTime);
  const [toTime, setToTime] = useState(endTimeLimit);
  const [startMin, setStartMin] = useState(1);
  const [endMin, setEndMin] = useState(2);
  const [bookedDate, setBookedDate] = useState();
  const [saveFromTime, setSaveFromTime] = useState(null);
  const [saveToTime, setSaveToTime] = useState(null);
  const [initalTimeInterval, setInitalTimeInterval] = useState(2);
  const [initialTime, setInitialTime] = useState(2);
  const [endTime, setEndTime] = useState(2);
  const [startTimeWithoutFormat, setStartTimeWithoutFormat] = useState(null);
  const [endTimeWithoutFormat, setEndTimeWithoutFormat] = useState(null);
  const [paymentComplete, { paymentData }] = useMutation(COMPLETE_PAYMENT, {
    onCompleted: paymentData => {
      toastMessage(success, S.BOOKING_COMPLETED);
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  const [setTimeGql, { setTime }] = useMutation(SET_FROM_TO_TIME, {
    onCompleted: paymentData => {
      toastMessage(success, toastContent);
    },
    onError: err => {
      // toastMessage(renderError, err.message);
    },
  });

  //Get mins for booking cancel option
  const [getMinsData, minsData] = useLazyQuery(GET_MINS_FOR_BOOKING, {
    variables: {
      pSettingName: S.NO_OF_MINUTES_FOR_BOOKING_CANCEL,
    },
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  //updateBookingInfo
  const [updateBookingInfo, { chefBookingHistory }] = useMutation(UPDATE_BOOKING_DETAILS, {
    onCompleted: chefBookingHistory => {
      // if (props.type === S.Complete) {
      //   let data = {
      //     historyId,
      //     name,
      //     chefId,
      //     customerId,
      //   };
      //   NavigateToFeedbackPage(data);
      // }
      closeModal();
    },
    onError: err => {
      toastMessage(renderError, err.message);
      closeModal();
    },
  });

  //updateBookingInfo
  const [updateNotesInfo, { data }] = useMutation(UPDATE_NOTES, {
    onCompleted: chefBookingHistory => {
      toastMessage(success, S.NOTES_ADDED_SUCCESS);
      setLoading(false);
      // setIsDisabled(false);
    },
    onError: err => {
      toastMessage(renderError, err.message);
      closeModal();
    },
  });

  useEffect(() => {
    calculateTime();
  }, []);

  useEffect(() => {
    if (initalTimeInterval) {
      calculateTime();
    }
  }, [initalTimeInterval]);

  //Calculate the mins for cancel option
  useEffect(() => {
    if (
      isObjectEmpty(minsData) &&
      hasProperty(minsData, 'data') &&
      isObjectEmpty(minsData.data) &&
      hasProperty(minsData.data, 'getSettingValue') &&
      isStringEmpty(minsData.data.getSettingValue)
    ) {
      let chefMinutes = parseInt(minsData.data.getSettingValue);
      let bookingDate = getLocalTime(props.bookingDetail.chefBookingFromTime);
      let currentDate = getLocalTime(new Date());
      const diffValue = moment(bookingDate).diff(moment(currentDate), 'minutes');

      if (chefMinutes < diffValue) {
        onSubmitBooking();
      } else {
        toastMessage(renderError, S.CANCEL_ALERT_MESSAGE);
      }
    }
  }, [minsData]);

  useEffect(() => {
    setOpen(true);
    setContent(props.content);
    if (isObjectEmpty(props.bookingDetail)) {
      let data = props.bookingDetail;
      if (props.userRole === customer) {
        let name =
          data && data.chefProfileByChefId && data.chefProfileByChefId.fullName
            ? data.chefProfileByChefId.fullName
            : '';
        setName(name);
      } else {
        let name =
          data && data.customerProfileByCustomerId && data.customerProfileByCustomerId.fullName
            ? data.customerProfileByCustomerId.fullName
            : '';
        setName(name);
      }
      setChefId(data.chefId);
      setCustomerId(data.customerId);
      setDishes(isArrayEmpty(data.dishTypeDesc) ? data.dishTypeDesc : []);
      setHistoryId(isStringEmpty(data.chefBookingHistId) ? data.chefBookingHistId : '');
      setStatus(
        isStringEmpty(data.chefBookingStatusId.trim()) ? data.chefBookingStatusId.trim() : ''
      );
      setCompletedByCustomer(
        isBooleanEmpty(data.chefBookingCompletedByCustomerYn)
          ? data.chefBookingCompletedByCustomerYn
          : false
      );
      setCompletedByChef(
        isBooleanEmpty(data.chefBookingCompletedByChefYn)
          ? data.chefBookingCompletedByChefYn
          : false
      );
      setReasonByChef(
        isStringEmpty(data.chefBookingChefRejectOrCancelReason)
          ? data.chefBookingChefRejectOrCancelReason
          : ''
      );
      setReasonByCustomer(
        isStringEmpty(data.chefBookingCustomerRejectOrCancelReason)
          ? data.chefBookingCustomerRejectOrCancelReason
          : ''
      );
      if (isStringEmpty(props.userRole)) {
        setUserRole(props.userRole);
        if (props.userRole === chef) {
          if (data.chefBookingStatusId.trim() === S.CUSTOMER_REQUESTED && props.type === S.ACCEPT) {
            let bookingDate = getLocalTime(data.chefBookingFromTime);
            let currentDate = getLocalTime(new Date());
            const diffValue = moment(bookingDate).diff(moment(currentDate), 'minutes');
            if (diffValue >= 0) {
              setUpdatedStatus(S.CHEF_ACCEPTED);
              setToastContent('You accepted the request');
            } else {
              toastMessage(renderError, "You can't accept previous date booking");
            }
          } else if (props.type === S.Reject) {
            setUpdatedStatus(S.CHEF_REJECTED);
          }

          if (data.chefBookingStatusId.trim() === S.CHEF_ACCEPTED && props.type === S.CANCEL) {
            setToastContent('You cancelled the request');
            setUpdatedStatus(S.CANCELLED_BY_CHEF);
          } else if (props.type === S.Complete) {
            setUpdatedStatus(S.CHEF_ACCEPTED);
            setToastContent('You completed the request');
            setCompletedByCustomer(true);
          }
        } else if (props.userRole === customer) {
          if (data.chefBookingStatusId.trim() === S.CUSTOMER_REQUESTED && props.type === S.CANCEL) {
            setToastContent('You cancelled the request');
            setUpdatedStatus(S.CANCELLED_BY_CUSTOMER);
          }
          if (data.chefBookingStatusId.trim() === S.CHEF_ACCEPTED && props.type === S.CANCEL) {
            setToastContent('You cancelled the request');
            setUpdatedStatus(S.CANCELLED_BY_CUSTOMER);
          } else if (props.type === S.Complete) {
            setUpdatedStatus(S.CHEF_ACCEPTED);
            setToastContent('You completed the request');
            setCompletedByChef(true);
          }
        }
      }
    }
  }, []);

  //set notes
  useEffect(() => {
    if (
      isObjectEmpty(props) &&
      isObjectEmpty(props.bookingDetail) &&
      isObjectEmpty(props.bookingDetail.bookingNotes) &&
      isObjectEmpty(props.bookingDetail.bookingNotes.nodes[0]) &&
      isStringEmpty(props.bookingDetail.bookingNotes.nodes[0].notesDescription)
    ) {
      let notesData = props.bookingDetail.bookingNotes.nodes[0].notesDescription;
      let notesValue = notesData ? JSON.parse(notesData) : '';
      setCustomerNotes(notesValue);

      // let tableId = props.bookingDetail.bookingNotes.nodes[0].tablePkId;
      // setTablePkId(tableId);
    }
    if (
      isObjectEmpty(props) &&
      isObjectEmpty(props.bookingDetail) &&
      isStringEmpty(props.bookingDetail.chefBookingFromTime)
    ) {
      setBookedDate(props.bookingDetail.chefBookingFromTime);
    }
  }, [props]);

  //On submit update function
  async function onSubmitNotes() {
    const variables = {
      notesDescription: isStringEmpty(notes) ? JSON.stringify(notes) : null,
      tablePkId: historyId ? historyId : null,
      chefId: userRole === chef ? chefId : null,
      customerId: userRole === customer ? customerId : null,
    };
    await updateNotesInfo({
      variables,
    });
  }

  function calculateTime() {
    if (props && props.bookingDetail && props.bookingDetail.chefBookingFromTime) {
      if (props && props.bookingDetail && props.bookingDetail.chefBookingFromTime) {
        let fromTime = getDateWithTimeLocalWithoutFormat(props.bookingDetail.chefBookingFromTime);
        fromTime = alterTime(fromTime, initalTimeInterval, 'sub');
        // fromTime = getTimeOnly(fromTime);
        setInitialTime(fromTime);

        let toTime = getDateWithTimeLocalWithoutFormat(props.bookingDetail.chefBookingToTime);
        toTime = alterTime(toTime, initalTimeInterval, 'add');
        setEndTime(toTime);
        // toTime = getTimeOnly(toTime);
      }
      // toTime = getTimeOnly(toTime);
    }
  }

  //On submit update function
  async function onSubmitBooking() {
    if (
      initialTime &&
      endTime &&
      new Date(endTime) > new Date(initialTime) &&
      updatedStatus === 'CHEF_ACCEPTED'
    ) {
      let variables = {
        chefBookingHistId: historyId,
        chefBookingStatusId: updatedStatus,
        chefBookingCompletedByCustomerYn: completedByCustomer,
        chefBookingCompletedByChefYn: completedByChef,
        chefBookingChefRejectOrCancelReason: reasonByChef,
        chefBookingCustomerRejectOrCancelReason: reasonByCustomer,
      };
      await updateBookingInfo({
        variables,
      });
      // setTime({

      variables = {
        chefBookingHistId: historyId,
        chefBookingStatusId: 'CHEF_ACCEPTED',
        chefBookingBlockFromTime: moment(initialTime)
          .utc()
          .format(),
        chefBookingBlockToTime: moment(endTime)
          .utc()
          .format(),
      };
      await setTimeGql({
        variables,
      }).then(data => {});
    } else {
      setLoading(false);
      if (new Date(fromTime) > new Date(toTime) && updatedStatus === 'CHEF_ACCEPTED') {
        toastMessage('error', 'To time should be greater');
      } else if ((fromTime === null || toTime === null) && updatedStatus === 'CHEF_ACCEPTED') {
        toastMessage('error', 'Select both from and to time');
      } else if (updatedStatus !== 'CHEF_ACCEPTED') {
        let variables = {
          chefBookingHistId: historyId,
          chefBookingStatusId: updatedStatus,
          chefBookingCompletedByCustomerYn: completedByCustomer,
          chefBookingCompletedByChefYn: completedByChef,
          chefBookingChefRejectOrCancelReason: reasonByChef,
          chefBookingCustomerRejectOrCancelReason: reasonByCustomer,
        };
        await updateBookingInfo({
          variables,
        });
      }
    }
  }

  //To get value fro alert modal
  function completeFunction() {
    // if (
    //   isObjectEmpty(props.bookingDetail) &&
    //   isStringEmpty(props.bookingDetail.chefProfileByChefId.defaultStripeUserId)
    // ) {
    //   let bookingDate = getLocalTime(props.bookingDetail.chefBookingFromTime);
    //   let currentDate = getLocalTime(new Date());
    //   const diffValue = moment(bookingDate).diff(moment(currentDate), 'minutes');
    //   if (diffValue <= 0) {
    completeBooking();
    //   } else {
    //     toastMessage(renderError, S.COMPLETED_VALIDATION);
    //   }
    // } else {
    //   toastMessage(renderError, S.STRIPEID_MISSING_MSG);
    // }
  }
  //check validation for chef complete the booking
  function completeBooking() {
    let variables = {
      bookingHistId: props.bookingDetail.chefBookingHistId,
      chefId: props.bookingDetail.chefProfileByChefId.chefId,
      chefStripeUserId: props.bookingDetail.chefProfileByChefId.defaultStripeUserId,
    };
    paymentComplete({
      variables,
    });
  }
  function onClickYes() {
    setLoading(true);

    if (isObjectEmpty(state) && state.currentUser === true) {
      if (props.type === S.Complete) {
        if (props.onCloseModal) {
          props.onCloseModal();
        }
        completeFunction();
      } else {
        bookNow();
      }
    } else if (state.currentUser === false) {
      let data = {
        chefId: props.chefId,
      };
      NavigateToLoginPage(data);
    }
  }
  function bookNow() {
    if (props.type === S.Reject || props.type === S.CANCEL) {
      if (isStringEmpty(reasonByChef) || isStringEmpty(reasonByCustomer)) {
        setIsDisabled(true);
        if (props.type === S.Reject) {
          setToastContent('You rejected the request');
        }
        if (
          props.type === S.CANCEL &&
          props.bookingDetail.chefBookingStatusId.trim() === S.CHEF_ACCEPTED
        ) {
          getMinsData();
        } else {
          onSubmitBooking();
        }
      } else {
        toastMessage(renderError, S.REQUIRED_REASON);
      }
    } else {
      if (
        props &&
        props.bookingDetail &&
        props.bookingDetail.chefBookingStatusId.trim() === S.CUSTOMER_REQUESTED
      ) {
        if (isStringEmpty(notes)) {
          onSubmitNotes();
        }
        onSubmitBooking();
      } else {
        onSubmitBooking();
      }
    }
  }

  function closeModal() {
    if (props.onCloseModal) {
      props.onCloseModal();
    }
  }

  //when onchaning value of fields
  function onChangeValue(event) {
    try {
      if (isObjectEmpty(event)) {
        if (userRole === chef) {
          setReasonByChef(event.target.value);
        } else {
          setReasonByCustomer(event.target.value);
        }
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  function renderTimePicker(value, stateAssign, type) {
    try {
      return (
        <TimePicker
          theme="classic"
          time={value}
          withoutIcon={true}
          timeConfig={{
            from: blockedStart,
            to: blockedEnd,
            step: 30,
          }}
          timeMode="12"
          timeFormatter={({ hour, minute, meridiem }) => {
            if (hour == '00') {
              return `12:${minute} ${meridiem}`;
            } else {
              return `${hour}:${minute} ${meridiem}`;
            }
          }}
          onTimeChange={event => onChangeAvailabilityTime(event, stateAssign, type)}
        />
      );
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  function calcluateMin(value) {
    let hour = convert12to24Hours(value, 'Hours');
    let min = convert12to24Hours(value, 'Mins');
    let totalMins = parseInt(hour) * 60 + parseInt(min);
    return totalMins;
  }

  //when changing times in picker
  function onChangeAvailabilityTime(event, stateValue, type) {
    try {
      const { hour, minute, meridiem } = event;
      //convert 12 hours format time to 24 hours format
      let fromTime = convert12to24Format(`${hour}:${minute} ${meridiem}`);
      let startMin = calcluateMin(`${hour}:${minute} ${meridiem}`);

      //if start time
      if (type === 'start') {
        let toTime = null;
        let endMin = null;
        if (minute == '30') {
          if (hour == '11' && meridiem == 'AM') {
            toTime = convert12to24Format(`${parseInt(hour) + 1}:${parseInt(minute) - 30} PM`);
            endMin = calcluateMin(`${parseInt(hour) + 1}:${parseInt(minute) - 30} PM`);
          } else if (hour == '11' && meridiem == 'PM') {
            toTime = convert12to24Format(`${parseInt(hour) + 1}:${parseInt(minute) - 30} AM`);
            endMin = calcluateMin(`${parseInt(hour) + 1}:${parseInt(minute) - 30} AM`);
          } else {
            toTime = convert12to24Format(
              `${parseInt(hour) + 1}:${parseInt(minute) - 30} ${meridiem}`
            );
            endMin = calcluateMin(`${parseInt(hour) + 1}:${parseInt(minute) - 30} ${meridiem}`);
          }
        } else {
          toTime = convert12to24Format(`${parseInt(hour)}:${parseInt(minute) + 30} ${meridiem}`);
          endMin = calcluateMin(`${parseInt(hour)}:${parseInt(minute) + 30} ${meridiem}`);
        }

        stateValue(fromTime);
        setToTime(toTime);
        setStartMin(startMin);
        setEndMin(endMin);
        let date = getDateFormat(new Date(bookedDate));
        let gmtDate = getIsoDate(date, fromTime);
        let dateFormaat = new Date(gmtDate);
        setSaveFromTime(dateFormaat);
      }
      //if end time
      else if (type === 'end') {
        stateValue(fromTime);
        setEndMin(startMin);
        let date = getDateFormat(new Date(bookedDate));
        let gmtDate = getIsoDate(date, fromTime);
        let dateFormaat = new Date(gmtDate);
        setSaveToTime(dateFormaat);
      }
    } catch (err) {
      toastMessage(renderError, err.message);
    }
  }

  function notesAdd() {
    return (
      <div>
        {props &&
          props.bookingDetail &&
          props.bookingDetail.chefBookingStatusId.trim() === S.CUSTOMER_REQUESTED && (
            <div>
              {isObjectEmpty(state) && state.role === chef ? (
                <div>
                  {loading && <Loader />}
                  <label className="comment" id="labelStyle">
                    {S.DISHES}
                  </label>
                  <div className="row" id="rowStyle">
                    {isArrayEmpty(dishes) ? (
                      dishes.map(res => {
                        return (
                          <div id="desc-dish-type">
                            <a id="price-details">{res} </a>
                          </div>
                        );
                      })
                    ) : (
                      <a id="price-details">---</a>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="label">
                      How many hours do you want to block on your calendar before and after booking?
                    </label>
                    <div>
                      <div className="col-sm-12">
                        {/* {renderTimePicker(fromTime, setFromTime, 'start')} */}
                        <input
                          style={{ width: '20%', textAlign: 'center' }}
                          value={initalTimeInterval}
                          onChange={event => setInitalTimeInterval(event.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="label">BLOCK BOOKINGS</label>
                    <div className="row">
                      <div className="col-sm-6">
                        {/* {renderTimePicker(fromTime, setFromTime, 'start')} */}
                        {getTimeOnly(initialTime)}
                      </div>
                      <div className="col-sm-6">{getTimeOnly(endTime)}</div>
                    </div>
                  </div>
                  <label className="comment" id="labelStyle">
                    {S.CUSTOMER_NOTES}
                  </label>
                  {customerNotes ? <div className="notesStyle">{customerNotes}</div> : S.NO_NOTES}
                  <div className="form-group">
                    <label className="comment" id="labelStyle">
                      {S.ENTER_NOTES}
                    </label>
                    <textarea
                      style={{ border: '1px solid' }}
                      className="form-control booking_notes"
                      rows="6"
                      placeholder={S.GIVE_YOUR_NOTES}
                      required={true}
                      value={notes}
                      onChange={event => setNotes(event.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label className="comment">{S.ENTER_NOTES}</label>
                  <textarea
                    style={{ border: '1px solid' }}
                    className="form-control booking_notes"
                    rows="6"
                    placeholder={S.GIVE_YOUR_NOTES}
                    required={true}
                    value={notes}
                    onChange={event => setNotes(event.target.value)}
                  />
                </div>
              )}
            </div>
          )}
      </div>
    );
  }

  return (
    <div className={`bts-popup ${open ? 'is-visible' : ''}`} role="alert">
      <div className="bts-popup-container">
        <h6>{content}</h6>
        {props.type === S.Reject || props.type === S.CANCEL ? (
          <div className="form-group">
            <label className="comment">{S.REASON}</label>
            <textarea
              style={{ border: '1px solid' }}
              className="form-control"
              rows="6"
              placeholder={S.REASON_PLACE_HOLDER}
              required={true}
              value={userRole === chef ? reasonByChef : reasonByCustomer}
              onChange={event => onChangeValue(event)}
            />
          </div>
        ) : (
          <div>{notesAdd()}</div>
        )}
        <div className="row" id="buttonContainer">
          <button
            type="submit"
            className="btn btn-success"
            disabled={isDisabled}
            onClick={onClickYes}
          >
            {isObjectEmpty(state) && state.currentUser === false ? S.CONTINUE_LOGIN : S.YES}
          </button>{' '}
          {isObjectEmpty(state) && state.currentUser === true && (
            <div>
              <button
                type="button"
                className="btn btn-danger"
                disabled={isDisabled}
                onClick={closeModal}
              >
                {S.NO}
              </button>
              {/* <Link href="#"> */}
              <a onClick={closeModal} className="bts-popup-close"></a>
              {/* </Link> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withApollo(RequestStatusModal);
