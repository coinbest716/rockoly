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
import { getChefId, chefId, getUserTypeRole, getCustomerId } from '../../../../utils/UserType';
import PricingModal from '../../../shared/modal/PricingModal';
import PricingIntroModal from '../../../shared/modal/PricingIntroModal';
import BookingLocationModal from '../../../shared/modal/BookingLocationModal';
import { toastMessage, success, renderError, error } from '../../../../utils/Toast';
import {
  getCurrentDate,
  getTime,
  getTimestamp,
  getCurrentTimestamp,
  getDateFormat,
  checkFutureDate,
  fromDate,
  futureMonth,
  futureMonthReversed,
  fromDateReversed,
} from '../../../../utils/DateTimeFormat';
import BookingForm from '../../../shared/modal/BookingForm';
import { AppContext } from '../../../../context/appContext';
import CustomizeModal from '../../../shared/modal/BookingModalSecond';
import AllergyModal from '../../../shared/modal/AllergyUpdateModal';
import DietModal from '../../../shared/modal/DietUpdateModal';
import KitchenUtensilsModal from '../../../shared/modal/KitchenUtensilesUpdateModal';
import BookNowModal from '../../../shared/modal/BookNowModal';

const getChefData = gqlTag.query.availability.listChefAvailabilityByDateRangeGQLTAG; //get chef availaibity data
const updateChefData = gqlTag.mutation.chef.updateNotAvailabilityGQLTAG; //update chef availability

const customerDataTag = gqlTag.query.customer.profileByIdGQLTAG;
//for getting customer data
const GET_CUSTOMER_DATA = gql`
  ${customerDataTag}
`;

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
  const [customerIdValue, setCustomerId] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({});
  const [BookingformData, setBookingFormData] = useState(null);
  const [utilsData, setUtilsData] = useState(null);
  const [pricingData, setPricingData] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showAllergyForm, setshowAllergyForm] = useState(false);
  const [showDietForm, setShowDietForm] = useState(false);
  const [showKitchenUtensilsForm, setShowKitchenUtensilsForm] = useState(false);
  const [showPricingForm, setShowPricingForm] = useState(false);
  const [response, setResponse] = useState(null);
  const [modalController, setModalController] = useState({
    bookingForm: false,
    allergyForm: false,
    dietForm: false,
    kitchenUtensils: false,
    pricingIntroForm: false,
    pricingForm: false,
    bookNowForm: false,
  });
  const [bookingValues, setBookingValues] = useState(null);
  const [allergyValues, setAllergyValues] = useState(null);
  const [dietValues, setDietValues] = useState(null);
  const [kitchenUtensils, setKitchenUtensils] = useState(null);
  const [pricingForm, setPricingForm] = useState(null);
  const [pricingIntroForm, setPricingIntroForm] = useState(null);
  const [bookingLocation, setBookingLocation] = useState(null);
  const [isSameDate, setIsSameDate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  //update chef availability
  const [updateChefAvailability] = useMutation(UPDATE_CHEF_AVAILABILITY, {
    onCompleted: data => {
      toastMessage(success, s.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(renderError, err);
    },
  });

  const [getCustomerData, customerData] = useLazyQuery(GET_CUSTOMER_DATA, {
    variables: { customerId: customerIdValue },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  // useEffect(() => {
  //   console.log('useEffect', props);
  //   if (util.isObjectEmpty(state)) {
  //     setAlertModal(!state.currentUser);
  //   }
  // });

  useEffect(() => {
    setIsEdit(props.isEdit);
  }, [props.isEdit]);
  useEffect(() => {}, [bookingValues]);
  useEffect(() => {}, [allergyValues]);
  useEffect(() => {}, [dietValues]);
  useEffect(() => {}, [kitchenUtensils]);
  useEffect(() => {}, [pricingForm]);
  useEffect(() => {}, [pricingIntroForm]);
  useEffect(() => {
    // console.log('useEffect', props);
    if (util.isObjectEmpty(state)) {
      setAlertModal(!state.currentUser);
    }
  });
  //getting chef availaibity data
  const [getChefAvailabilityData, { data }] = useLazyQuery(GET_CHEF_AVAILABILITY, {
    variables: {
      chefId: util.isStringEmpty(props.currentChefIdValue) ? props.currentChefIdValue : undefined,
      fromDate: fromDate(),
      toDate: futureMonth(),
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  useEffect(() => {
    if (customerIdValue) getCustomerData();
  }, [customerIdValue]);

  useEffect(() => {
    if (
      customerData.data &&
      customerData.data.customerProfileByCustomerId &&
      customerData.data.customerProfileByCustomerId.customerUpdatedScreens &&
      customerData.data.customerProfileByCustomerId.customerUpdatedScreens.length !== 0
    ) {
    } else {
    }
    setCustomerDetails(customerData.data);
  }, [customerData]);
  //get chef id
  useEffect(() => {
    console.log('getCurrentDate', getCurrentDate);
    updateTimes(getCurrentDate, 'month'); //set month start and end date
  }, []);

  //requery to get chef availability based on date ,when calendar month start/end date changed
  useEffect(() => {
    console.log('currentMonthStartDate', currentMonthStartDate, currentMonthEndDate);
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

  useEffect(() => {
    //get user role
    getUserTypeRole()
      .then(async res => {
        // setUserRole(res);
        if (res === 'customer') {
          //customer user
          getCustomerId('customerId')
            .then(async customerResult => {
              await setCustomerId(customerResult);
            })
            .catch(err => {
              //console.log('error', err);
            });
        } else {
          //chef user
          getChefId(chefId)
            .then(async chefResult => {
              await setChefId(chefResult);
            })
            .catch(err => {});
        }
      })
      .catch(err => {});
  }, []);

  //set chef data after getting from backend
  useEffect(() => {
    console.log('avilableData', data);
    if (
      util.isObjectEmpty(data) &&
      util.isObjectEmpty(data.listChefAvailabilityByDateRange) &&
      util.isArrayEmpty(data.listChefAvailabilityByDateRange.nodes)
    ) {
      let chefData = [];
      let details = data.listChefAvailabilityByDateRange.nodes;
      console.log('details', details);
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
          toastMessage(error, 'Please select a future date');
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
        let checkDate =
          new Date() <= event.start ||
          (moment(new Date()).format('MM-DD-YYYY') == moment(event.start).format('MM-DD-YYYY') &&
            moment(new Date()).format('HH:mm:ss') > event.fromTime,
          moment(new Date()).format('HH:mm:ss') < event.toTime);

        if (checkDate === true) {
          setSelectedEvent(event);

          if (moment(new Date()).format('MM-DD-YYYY') == moment(event.start).format('MM-DD-YYYY')) {
            setIsSameDate(true);
          } else {
            setIsSameDate(false);
          }
          // setOpenCustomerBookingForm(true);
          setModalController({
            bookingForm: props.showBookingModalOrNot === true ? false : true,
            allergyForm: false,
            dietForm: false,
            kitchenUtensils: false,
            pricingIntroForm: false,
            pricingForm: false,
            bookNowForm: false,
          });
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
      setOpenCustomerBookingForm(false);
      setModalController({
        bookingForm: false,
        bookingLocation: false,
        allergyForm: false,
        dietForm: false,
        kitchenUtensils: false,
        pricingIntroForm: false,
        pricingForm: false,
        bookNowForm: false,
      });
      if (util.isObjectEmpty(propsValue)) {
        setChefIdValue(
          util.isStringEmpty(propsValue.currentChefIdValue) ? propsValue.currentChefIdValue : ''
        );
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  function bookingFormCallBack(values, response) {
    setResponse(response.createOrSaveBooking.data);
    setBookingValues(values);
    setIsEdit(false);
    setModalController({
      bookingForm: false,
      bookingLocation: false,
      allergyForm: false,
      dietForm: false,
      kitchenUtensils: false,
      pricingIntroForm: true,
      pricingForm: false,
      bookNowForm: false,
    });
  }
  function bookingLocationCallBack(values, response) {
    setResponse(response.createOrSaveBooking.data);
    setIsEdit(false);
    setBookingLocation(values);
    setModalController({
      bookingForm: false,
      bookingLocation: false,
      allergyForm: true,
      dietForm: false,
      kitchenUtensils: false,
      pricingIntroForm: false,
      pricingForm: false,
      bookNowForm: false,
    });
  }
  function AllergyFormCallBack(values, response) {
    setResponse(response.createOrSaveBooking.data);
    setIsEdit(false);
    setAllergyValues(values);
    setModalController({
      bookingForm: false,
      bookingLocation: false,
      allergyForm: false,
      dietForm: true,
      kitchenUtensils: false,
      pricingIntroForm: false,
      pricingForm: false,
      bookNowForm: false,
    });
  }
  function DietFormCallBack(values, response) {
    setResponse(response.createOrSaveBooking.data);
    setIsEdit(false);
    setModalController({
      bookingForm: false,
      bookingLocation: false,
      allergyForm: false,
      dietForm: false,
      kitchenUtensils: true,
      pricingIntroForm: false,
      pricingForm: false,
      bookNowForm: false,
    });
    setDietValues(values);
  }
  function kitchenUtensilsFormCallBack(values, response) {
    setResponse(response.createOrSaveBooking.data);
    setIsEdit(false);
    setModalController({
      bookingForm: false,
      bookingLocation: false,
      allergyForm: false,
      dietForm: false,
      kitchenUtensils: false,
      pricingIntroForm: false,
      pricingForm: true,
      bookNowForm: false,
    });
    setKitchenUtensils(values);
  }
  function pricingIntroFormCallBack(values) {
    setModalController({
      bookingForm: false,
      bookingLocation: true,
      allergyForm: false,
      dietForm: false,
      kitchenUtensils: false,
      pricingIntroForm: false,
      pricingForm: false,
      bookNowForm: false,
    });
    setPricingIntroForm(values);
  }
  function pricingFormCallBack(values, response) {
    setResponse(response.createOrSaveBooking.data);
    setIsEdit(false);
    setModalController({
      bookingForm: false,
      bookingLocation: false,
      allergyForm: false,
      dietForm: false,
      kitchenUtensils: false,
      pricingForm: false,
      pricingIntroForm: false,
      bookNowForm: true,
    });
    setPricingForm(values);
  }

  function backBookingFormCallBack() {
    setModalController({
      bookingForm: false,
      bookingLocation: false,
      allergyForm: false,
      dietForm: false,
      kitchenUtensils: false,
      pricingForm: false,
      pricingIntroForm: false,
      bookNowForm: false,
    });
  }
  function backBookingLocationCallBack() {
    setModalController({
      bookingForm: false,
      bookingLocation: false,
      allergyForm: false,
      dietForm: false,
      kitchenUtensils: false,
      pricingForm: false,
      pricingIntroForm: true,
      bookNowForm: false,
    });
  }
  function backAllergyFormCallBack() {
    setModalController({
      bookingForm: false,
      bookingLocation: true,
      allergyForm: false,
      dietForm: false,
      kitchenUtensils: false,
      pricingForm: false,
      pricingIntroForm: false,
      bookNowForm: false,
    });
  }
  function backDietFormCallBack() {
    setModalController({
      bookingForm: false,
      bookingLocation: false,
      allergyForm: true,
      dietForm: false,
      kitchenUtensils: false,
      pricingForm: false,
      pricingIntroForm: false,
      bookNowForm: false,
    });
  }
  function backKitchenUtensilsFormCallBack() {
    setModalController({
      bookingForm: false,
      bookingLocation: false,
      allergyForm: false,
      dietForm: true,
      kitchenUtensils: false,
      pricingForm: false,
      pricingIntroForm: false,
      bookNowForm: false,
    });
  }
  function backPricingIntroFormCallBack() {
    setModalController({
      bookingForm: true,
      bookingLocation: false,
      allergyForm: false,
      dietForm: false,
      kitchenUtensils: false,
      pricingForm: false,
      pricingIntroForm: false,
      bookNowForm: false,
    });
  }
  function backPricingFormCallBack() {
    setModalController({
      bookingForm: false,
      bookingLocation: false,
      allergyForm: false,
      dietForm: false,
      kitchenUtensils: true,
      pricingForm: false,
      pricingIntroForm: false,
      bookNowForm: false,
    });
  }
  function backbookNowFormCallBack() {
    setModalController({
      bookingForm: false,
      bookingLocation: false,
      allergyForm: false,
      dietForm: false,
      kitchenUtensils: false,
      pricingForm: true,
      pricingIntroForm: false,
      bookNowForm: false,
    });
  }

  return (
    <React.Fragment>
      <div>
        {calendarFor === s.CHEF_EDIT_PROFILE && (
          <p className="nonAvailabilityCloseLabel" onClick={() => closeCalendar()}>
            Close
          </p>
        )}
        {props.screen !== 'draft' && (
          <Calendar
            className="availabilityCalendar"
            events={chefAvailabilityList}
            startAccessor="start"
            endAccessor="end"
            defaultDate={new Date()}
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
        )}
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
      {(modalController.bookingForm === true || isEdit) && (
        <BookingForm
          isSameDate={isSameDate}
          currentChefIdValue={chefIdValue}
          openModal={openModal}
          open={setOpenCustomerBookingForm}
          selectedEvent={selectedEvent}
          bookingFormCallBack={bookingFormCallBack}
          backBookingFormCallBack={backBookingFormCallBack}
          chefDetails={props.chefDetails ? props.chefDetails : {}}
          details={customerDetails}
          customerId={customerIdValue}
          role={'customer'}
          screen={'register'}
          bookingDetail={props.bookingDetail ? props.bookingDetail : {}}
          onCloseBookingModal={props.onCloseBookingModal}
        />
      )}
      {modalController.bookingLocation === true && (
        <BookingLocationModal
          currentChefIdValue={chefIdValue}
          openModal={openModal}
          response={response}
          open={setOpenCustomerBookingForm}
          selectedEvent={selectedEvent}
          bookingLocationCallBack={bookingLocationCallBack}
          backBookingLocationCallBack={backBookingLocationCallBack}
          chefDetails={props.chefDetails ? props.chefDetails : {}}
          details={customerDetails}
          customerId={customerIdValue}
          role={'customer'}
          screen={'booking'}
          bookingDetail={props.bookingDetail ? props.bookingDetail : {}}
          onCloseBookingModal={props.onCloseBookingModal}
        />
      )}
      {modalController.allergyForm === true && (
        <AllergyModal
          screenName={'booking'}
          response={response}
          AllergyFormCallBack={AllergyFormCallBack}
          customerIdValue={customerIdValue}
          customerDetails={customerDetails}
          backAllergyFormCallBack={backAllergyFormCallBack}
          bookingDetail={props.bookingDetail ? props.bookingDetail : {}}
          onCloseBookingModal={props.onCloseBookingModal}
        />
      )}
      {modalController.dietForm === true && (
        <DietModal
          screenName={'booking'}
          response={response}
          DietFormCallBack={DietFormCallBack}
          customerIdValue={customerIdValue}
          customerDetails={customerDetails}
          backDietFormCallBack={backDietFormCallBack}
          bookingDetail={props.bookingDetail ? props.bookingDetail : {}}
          onCloseBookingModal={props.onCloseBookingModal}
        />
      )}
      {modalController.kitchenUtensils === true && (
        <KitchenUtensilsModal
          response={response}
          screenName={'booking'}
          kitchenUtensilsFormCallBack={kitchenUtensilsFormCallBack}
          customerIdValue={customerIdValue}
          customerDetails={customerDetails}
          backKitchenUtensilsFormCallBack={backKitchenUtensilsFormCallBack}
          bookingDetail={props.bookingDetail ? props.bookingDetail : {}}
          onCloseBookingModal={props.onCloseBookingModal}
        />
      )}
      {modalController.pricingIntroForm === true && (
        <PricingIntroModal
          screenName={'booking'}
          chefId={props.currentChefIdValue}
          ProfileDetails={props.chefDetails ? props.chefDetails : {}}
          pricingIntroFormCallBack={pricingIntroFormCallBack}
          backPricingIntroFormCallBack={backPricingIntroFormCallBack}
          bookingValues={bookingValues}
          allergyValues={allergyValues}
          dietValues={dietValues}
          kitchenUtensils={kitchenUtensils}
          bookingDetail={props.bookingDetail ? props.bookingDetail : {}}
          onCloseBookingModal={props.onCloseBookingModal}
        />
      )}
      {modalController.pricingForm === true && (
        <PricingModal
          screenName={'booking'}
          chefId={props.currentChefIdValue}
          response={response}
          ProfileDetails={props.chefDetails ? props.chefDetails : {}}
          pricingFormCallBack={pricingFormCallBack}
          backPricingFormCallBack={backPricingFormCallBack}
          bookingValues={bookingValues}
          allergyValues={allergyValues}
          dietValues={dietValues}
          kitchenUtensils={kitchenUtensils}
          bookingDetail={props.bookingDetail ? props.bookingDetail : {}}
          onCloseBookingModal={props.onCloseBookingModal}
        />
      )}
      {modalController.bookNowForm === true && (
        <BookNowModal
          screenName={'booking'}
          response={response}
          chefId={props.currentChefIdValue}
          ProfileDetails={props.chefDetails ? props.chefDetails : {}}
          backbookNowFormCallBack={backbookNowFormCallBack}
          bookingValues={bookingValues}
          bookingLocation={bookingLocation}
          allergyValues={allergyValues}
          dietValues={dietValues}
          kitchenUtensils={kitchenUtensils}
          pricingForm={pricingForm}
          bookingDetail={props.bookingDetail ? props.bookingDetail : {}}
          onCloseBookingModal={props.onCloseBookingModal}
        />
      )}
    </React.Fragment>
  );
};

export default AvailabilityCalendar;
