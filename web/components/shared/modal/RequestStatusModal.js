import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import gql from 'graphql-tag';
import moment from 'moment';
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
import { getLocalTime } from '../../../utils/DateTimeFormat';
import Loader from '../../Common/loader';

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

const RequestStatusModal = props => {
  // console.log('propsprops', props);
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
  const [isDisabled,setIsDisabled] = useState(false);
  const [paymentComplete, { paymentData }] = useMutation(COMPLETE_PAYMENT, {
    onCompleted: paymentData => {
      toastMessage(success, S.BOOKING_COMPLETED);
    },
    onError: err => {
      toastMessage(renderError, err.message);
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
      toastMessage(success, toastContent);
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
        // console.log("props",props.userRole,data.chefBookingStatusId,props.type);
        if (props.userRole === chef) {
          if (data.chefBookingStatusId.trim() === S.CUSTOMER_REQUESTED && props.type === S.ACCEPT) {
            setUpdatedStatus(S.CHEF_ACCEPTED);
            setToastContent('You accepted the request');
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

  //On submit update function
  async function onSubmitBooking() {
    const variables = {
      chefBookingHistId: historyId,
      chefBookingStatusId: updatedStatus,
      chefBookingCompletedByCustomerYn: completedByCustomer,
      chefBookingCompletedByChefYn: completedByChef,
      chefBookingChefRejectOrCancelReason: reasonByChef,
      chefBookingCustomerRejectOrCancelReason: reasonByCustomer,
    };
    // console.log('onSubmitBookingonSubmitBooking', variables);
    await updateBookingInfo({
      variables,
    });
  }

  //To get value fro alert modal
  function completeFunction() {
    if (isStringEmpty(props.bookingDetail.chefProfileByChefId.defaultStripeUserId)) {
      // let bookingDate = getLocalTime(props.bookingDetail.chefBookingFromTime);
      // let currentDate = getLocalTime(new Date());
      // const diffValue = moment(bookingDate).diff(moment(currentDate), 'minutes');
      // if (diffValue <= 0) {
      completeBooking();
      // } else {
      //   toastMessage(renderError, S.COMPLETED_VALIDATION);
      // }
    } else {
      toastMessage(renderError, S.STRIPEID_MISSING_MSG);
    }
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

  function notesAdd() {
    return (
      <div>
        {props &&
          props.bookingDetail &&
          props.bookingDetail.chefBookingStatusId.trim() === S.CUSTOMER_REQUESTED && (
            <div>
              {isObjectEmpty(state) && state.role === chef ? (
                <div>
                  {loading &&
                    <Loader />
                  }
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
                  <label className="comment" id="labelStyle">
                    {S.CUSTOMER_NOTES}
                  </label>
                  {customerNotes ? <div className="notesStyle">{customerNotes}</div> : S.NO_NOTES}
                  <div className="form-group">
                    <label className="comment" id="labelStyle">
                      {S.ENTER_NOTES}
                    </label>
                    <textarea
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
          <button type="submit" className="btn btn-success" disabled={isDisabled} onClick={onClickYes}>
            {isObjectEmpty(state) && state.currentUser === false ? S.CONTINUE_LOGIN : S.YES}
          </button>{' '}
          {isObjectEmpty(state) && state.currentUser === true && (
            <div>
              <button type="button" className="btn btn-danger" disabled={isDisabled} onClick={closeModal}>
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
