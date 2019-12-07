import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import gql from 'graphql-tag';
import { useMutation, useLazyQuery, useSubscription } from '@apollo/react-hooks';
import AvailabilityModal from './AvailabilityModal';
import AddsModal from '../../../shared/modal/RequestStatusModal';
import s from '../../ProfileSetup.String';
import * as gqlTag from '../../../../common/gql';
import * as util from '../../../../utils/checkEmptycondition';
import { getChefId, chefId } from '../../../../utils/UserType';
import { toastMessage, success, renderError, error } from '../../../../utils/Toast';
import {
  getCurrentDate,
  getTime,
  getTimestamp,
  getDateFormat,
  checkFutureDate,
  fromDate,
  futureMonth,
} from '../../../../utils/DateTimeFormat';
import BookingForm from '../../../shared/modal/BookingForm';
import { AppContext } from '../../../../context/appContext';

const getChefData = gqlTag.query.availability.listChefAvailabilityByDateRangeGQLTAG; //get chef availaibity data
const updateChefData = gqlTag.mutation.chef.updateNotAvailabilityGQLTAG; //update chef availability

//get chef availaibity data
const GET_CHEF_AVAILABILITY = gql`
  ${getChefData}
`;

//update chef availability
const UPDATE_CHEF_AVAILABILITY = gql`
  ${updateChefData}
`;

const availabilitySubscription = gqlTag.subscription.chef.availabilityGQLTAG;
const AVAILABILITY_SUBSCRIPTION = gql`
  ${availabilitySubscription}
`;
//for big calendar
const localizer = momentLocalizer(moment);

const AvailabilityCalendar = props => {
  // console.log('propsprops', props);
  const [isOpenAvailabiltyModal, setIsOpenAvailabiltyModal] = useState(false);
  const [selectedSlotData, setSelectedSlotData] = useState({});
  const [chefAvailabilityList, setChefAvailabilityList] = useState([]);
  const [chefIdValue, setChefIdValue] = useState(
    util.isStringEmpty(props.currentChefIdValue) ? props.currentChefIdValue : null
  );
  const [calendarFor, setCalendarFor] = useState(
    util.isStringEmpty(props.calendarFrom) ? props.calendarFrom : null
  );
  const [currentMonthStartDate, setCurrentMonthStartDate] = useState(props.chefId);
  const [currentMonthEndDate, setCurrentMonthEndDate] = useState(props.chefId);
  const [openCustomerBookingForm, setOpenCustomerBookingForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [alertModal, setAlertModal] = useState(true);
  const [state, setState] = useContext(AppContext);

  //update chef availability
  const [updateChefAvailability] = useMutation(UPDATE_CHEF_AVAILABILITY, {
    onCompleted: data => {
      toastMessage(success, s.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(renderError, err);
    },
  });

  // useEffect(() => {
  //   console.log('useEffect', props);
  //   if (util.isObjectEmpty(state)) {
  //     setAlertModal(!state.currentUser);
  //   }
  // });
  //getting chef availaibity data
  const [getChefAvailabilityData, { data }] = useLazyQuery(GET_CHEF_AVAILABILITY, {
    variables: {
      chefId: util.isStringEmpty(props.currentChefIdValue) ? props.currentChefIdValue : null,
      fromDate: fromDate(),
      toDate: futureMonth(),
    },
    onError: err => {
      toastMessage('renderError', err);
    },
  });
  //get chef id
  useEffect(() => {
    updateTimes(getCurrentDate, 'month'); //set month start and end date
  }, []);

  //requery to get chef availability based on date ,when calendar month start/end date changed
  useEffect(() => {
    getChefAvailabilityData();
  }, [currentMonthStartDate, currentMonthEndDate]);

  const { customerAvailabilitySubs } = useSubscription(AVAILABILITY_SUBSCRIPTION, {
    variables: { chefId: props.currentChefIdValue ? props.currentChefIdValue : null },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.chefAvailabilityProfile) {
        getChefAvailabilityData();
      }
    },
  });

  //set chef data after getting from backend
  useEffect(() => {
    if (
      util.isObjectEmpty(data) &&
      util.isObjectEmpty(data.listChefAvailabilityByDateRange) &&
      util.isArrayEmpty(data.listChefAvailabilityByDateRange.nodes)
    ) {
      let chefData = [];
      let details = data.listChefAvailabilityByDateRange.nodes;
      //pushed data based on calendar objects
      details.map((res, index) => {
        if (
          util.isObjectEmpty(res) &&
          util.isStringEmpty(res.fromTime) &&
          util.isStringEmpty(res.toTime) &&
          util.isStringEmpty(res.status) &&
          res.status === 'AVAILABLE'
        ) {
          let startTime = getTime(res.date, res.fromTime);
          let endTime = getTime(res.date, res.toTime);
          let option = {
            id: index,
            title: `${startTime} - ${endTime}`,
            start: getTimestamp(res.date),
            end: getTimestamp(res.date),
            status: res.status,
            fromTime: res.fromTime,
            toTime: res.toTime,
          };
          chefData.push(option);
        }
      });
      setChefAvailabilityList(chefData);
    }
  }, [data]);

  //open modal when slecting time slot in calendar
  useEffect(() => {
    if (util.isObjectEmpty(selectedSlotData)) {
      setIsOpenAvailabiltyModal(true);
    }
  }, [selectedSlotData]);

  //when calendar month view changed
  function updateTimes(date, view) {
    try {
      let start = moment(date).startOf(view);
      let end = moment(date).endOf(view);
      setCurrentMonthStartDate(getDateFormat(start));
      setCurrentMonthEndDate(getDateFormat(end));
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  // Appointment title view(text inside appt)
  function EventView({ event }) {
    try {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="row" className="titleColumn">
            <strong>{event.title}</strong>
          </div>
        </div>
      );
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  //when selecting time slot in calendar, get start and end time
  function selectedTimeSlot(slotInfo) {
    try {
      if (util.isObjectEmpty(slotInfo)) {
        let currentDate = checkFutureDate(new Date().toString());
        let eventStart = checkFutureDate(`${slotInfo.start}`);
        let isFutureDate = moment(eventStart).isSameOrAfter(currentDate, 'minutes'); // true

        //if selected time slot is future
        if (isFutureDate === true) {
          let options = {
            startTime: `${slotInfo.start}`,
            endTime: `${slotInfo.end}`,
          };
          setSelectedSlotData(options);
        } else {
          //if selected time slot is past
          toastMessage(error, 'Please select future date');
        }
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  //when saving availability
  function onSaveAvailability(selectedDate, startTime, endTime, notes) {
    try {
      //update chef availity
      updateChefAvailability({
        variables: {
          pChefId: chefIdValue,
          pDate: selectedDate,
          pFromTime: startTime,
          pToTime: endTime,
          pNotes: notes,
          pFrequency: null,
          pType: 'ADD',
        },
      });

      setIsOpenAvailabiltyModal(false); //close the modal
      // toastMessage(success, 'Saved Successfully');
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  //when closing modal
  function onCloseModal() {
    try {
      setIsOpenAvailabiltyModal(false);
      setAlertModal(false);
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  function gettingAvailabilityEventDetails(event) {
    try {
      if (
        util.isObjectEmpty(event) &&
        event.status === 'AVAILABLE' &&
        calendarFor === s.CHEF_DETAIL
      ) {
        let checkDate = new Date() < event.start;
        if (checkDate === true) {
          setSelectedEvent(event);
          console.log('setSelectedEvent', event);

          setOpenCustomerBookingForm(true);
        } else {
          toastMessage(error, s.DATE_AVAILABLE);
        }
      } else {
        toastMessage(error, s.DATE_NOT_AVAILABLE);
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  function eventStyleGetter(event) {
    // console.log('eventStyleGetter123', event);

    if (util.isStringEmpty(event.status)) {
      let apptStatus = event.status.trim();
      let color;
      switch (apptStatus) {
        case 'NOT_AVAILABLE':
          color = 'red';
          break;
        case 'AVAILABLE':
          color = '#08AB93';
          break;
        default:
          color = '';
          break;
      }
      let style = {
        backgroundColor: color,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '1px solid #fff',
        width: '98%',
        fontSize: 11,
      };
      return {
        style: apptStatus === 'AVAILABLE' && style,
      };
    }
  }

  //when closing calendar
  function closeCalendar() {
    if (props.onCloseCalendar) {
      props.onCloseCalendar();
    }
  }

  function openModal(propsValue) {
    try {
      // console.log('propsValue', propsValue);
      setOpenCustomerBookingForm(false);
      if (util.isObjectEmpty(propsValue)) {
        setChefIdValue(
          util.isStringEmpty(propsValue.currentChefIdValue) ? propsValue.currentChefIdValue : ''
        );
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  return (
    <React.Fragment>
      <div>
        {calendarFor === s.CHEF_EDIT_PROFILE && (
          <p className="nonAvailabilityCloseLabel" onClick={() => closeCalendar()}>
            Close
          </p>
        )}
        <Calendar
          className="availabilityCalendar"
          events={chefAvailabilityList}
          startAccessor="start"
          endAccessor="end"
          defaultDate={moment().toDate()}
          min={fromDate()}
          max={fromDate()}
          localizer={localizer}
          onSelectSlot={slotInfo =>
            calendarFor === s.CHEF_EDIT_PROFILE ? selectedTimeSlot(slotInfo) : ''
          }
          onSelectEvent={event => gettingAvailabilityEventDetails(event)}
          selectable={true}
          views={['month']}
          components={{
            month: {
              event: EventView,
            },
          }}
          onNavigate={(date, view) => updateTimes(date, view)}
          eventPropGetter={eventStyleGetter}
        />
      </div>
      {/* availability modal */}
      {isOpenAvailabiltyModal === true && (
        <AvailabilityModal
          onSaveAvailability={onSaveAvailability}
          isOpenAvailabiltyModal={isOpenAvailabiltyModal}
          onCloseModal={onCloseModal}
          selectedSlotData={selectedSlotData}
        />
      )}

      {/* Non-login user alert message */}
      {util.isObjectEmpty(state) && state.currentUser === false && alertModal === true && (
        <AddsModal
          chefId={props.currentChefIdValue}
          onCloseModal={onCloseModal}
          // content="Please login to booking Chef!"
        />
      )}
      {openCustomerBookingForm === true && (
        <BookingForm
          currentChefIdValue={chefIdValue}
          openModal={openModal}
          open={setOpenCustomerBookingForm}
          selectedEvent={selectedEvent}
          chefDetails={props.chefDetails ? props.chefDetails : {}}
        />
      )}
    </React.Fragment>
  );
};

export default AvailabilityCalendar;
