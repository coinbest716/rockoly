import React, { useState, useEffect, useContext, useRef } from 'react';
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import gql from 'graphql-tag';
import moment from 'moment';
import ModernDatepicker from 'react-modern-datepicker';
import TimePicker from 'react-times';
import S from './Strings';
import CreatableSelect from 'react-select/creatable';
import { toastMessage, success, renderError, error } from '../../../utils/Toast';
import Loader from '../../Common/loader';
import * as util from '../../../utils/checkEmptycondition';
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
} from '../../../utils/DateTimeFormat';
import Modal from 'react-responsive-modal';
import * as gqlTag from '../../../common/gql';
import { withApollo } from '../../../apollo/apollo';
import { getCustomerId, customer, getUserTypeRole, customerId } from '../../../utils/UserType';
import CardListModal from './CardListModal';
import { AppContext } from '../../../context/appContext';
import { NavigateToBookongDetail } from './Navigation';
import AlertModal from './AlertModal';
import { convertDateandTime,getDateWithTimeLocal } from '../../../utils/DateTimeFormat';
//Get dishes
const dishDataTag = gqlTag.query.master.dishByChefIdGQLTAG;
//for getting dish data
const GET_DISHES_DATA = gql`
  ${dishDataTag}
`;
const createDish = gqlTag.mutation.master.createDishTypeGQLTAG;
//for insert dish
const INSERT_DISH = gql`
  ${createDish}
`;

//Get commission value
const commissionValue = gqlTag.query.setting.getSettingValueGQLTAG;
const COMMISSION_VALUE = gql`
  ${commissionValue}
`;

const retryPayment = gqlTag.mutation.booking.paymentGQLTAG;
const bookingValue = gqlTag.mutation.booking.createGQLTAG;
const checkBooking = gqlTag.query.booking.checkBookingByParamsGQLTAG;

const RETRY_PAYMENT = gql`
  ${retryPayment}
`;

const BOOKING_VALUE = gql`
  ${bookingValue}
`;

const CHECK_BOOKING = gql`
  ${checkBooking}
`;

const BookingForms = props => {
  const dishesRef = useRef();
  // Declare a new state variable
  const [bookingDate, setBookingDate] = useState('');
  const [pricePerHour, setPricePerHour] = useState(1);
  const [hoursCount, setHoursCount] = useState(1);
  const [startMin, setStartMin] = useState(1);
  const [endMin, setEndMin] = useState(2);
  const [priceUnit, setPriceUnit] = useState('$');
  const [servicePercentage, setServicePercentage] = useState('1%');
  const [commissionAmount, setCommissionAmountAmount] = useState(0);
  const [chefCost, setChefCost] = useState(hoursCount * pricePerHour);
  const [totalAmount, setTotalAmount] = useState(commissionAmount + chefCost);
  const [bookingFromTime, setBookingFromTime] = useState(initialStartTime);
  const [bookingToTime, setBookingToTime] = useState(endTimeLimit);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(true);
  const [currentChefIdValue, setChefId] = useState(
    util.isStringEmpty(props.currentChefIdValue) ? props.currentChefIdValue : ''
  );
  const [customerIds, setCustomerIds] = useState('');
  const [fixedStartTime, setFixedStartTime] = useState(initialStartTime);
  const [fixedEndTime, setFixedEndTime] = useState(endTimeLimit);
  const [cardModal, setCardModal] = useState(false);
  const [stripeId, setStripeId] = useState('');
  const [customerCardId, setCustomerCardId] = useState('');
  const [paymentModalEditable, setpaymentModalEditable] = useState(false);
  const [notesValue, setNotesValue] = useState('');
  const [paymentButtonEnable, setPaymentButtonEnable] = useState(false);
  const [retryPaymentHistoryId, setretryPaymentHistoryId] = useState('');
  const [enblePayment, setEnablePayment] = useState(false);
  const [bookedTime, setbookedTime] = useState([]);
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [selectedDishesId, setSelectedDishesId] = useState([]);
  const [dishesMasterList, setDishesMasterList] = useState([]);
  const [chefSavedDishes, setChefSavedDishes] = useState([]);
  const [state, setState] = useContext(AppContext);
  const [avaialableTime, setAvaialableTime] = useState('');
  const [alertModalOption, setAlertModalOption] = useState(false);
  const [hideSubmit, setHideSubmit] = useState(false);
  const [minNoofHours, setMinNoofHours] = useState(0);

  // console.log('selectedDishes', selectedDishes);
  // console.log('selectedDishes111', selectedDishesId);
  // console.log('selectedDishes222', dishesMasterList);

  const getDishesData = useQuery(GET_DISHES_DATA, {
    // getting image gallery based on chef id
    variables: { pChefId: currentChefIdValue },
    onError: err => {
      toastMessage('renderError', err);
    },
  }); //get dishes data

  //Get commission value query
  const commissionData = useQuery(COMMISSION_VALUE, {
    variables: {
      pSettingName: S.COMMISSION_STRING,
    },
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [retryPaymentData, { retryData }] = useMutation(RETRY_PAYMENT, {
    onCompleted: retryData => {
      toastMessage(success, S.PAYMENT_COMPLETED);
      closeModal();
      setHideSubmit(false);
    },
    onError: err => {
      toastMessage(renderError, err.message);
      setHideSubmit(false);
    },
  });

  //mutation query

  const [bookingData, { data }] = useMutation(BOOKING_VALUE, {
    onCompleted: data => {
      // currently hiding this, adding retry in booking history screen.
      // if (data.createBooking.data.chef_booking_status_id.trim() !== 'PAYMENT_PENDING') {
      toastMessage(success, S.SUCCESS_MSG);
      let bookingDetail = data.createBooking.data;
      NavigateToBookongDetail(bookingDetail);
      closeModal();
      setHideSubmit(false);
      // } else {
      //   console.log('sddfsdfsdfsdf', data.createBooking.data.chef_booking_status_id);
      //   toastMessage(error, S.RETRY_PAYMENT_SMALL);
      //   setretryPaymentHistoryId(data.createBooking.data.chef_booking_hist_id);
      //   paymentFailedModal();
      // }
    },
    onError: err => {
      toastMessage(renderError, err.message);
      setHideSubmit(false);
    },
  });

  const [insertNewDish, { dishData }] = useMutation(INSERT_DISH, {
    onCompleted: dishData => {
      let masterValue = dishData.createDishTypeMaster.dishTypeMaster;
      let dishList = [];
      dishList = dishesMasterList;
      let option = {
        label: masterValue.dishTypeName,
        value: masterValue.dishTypeId,
      };
      dishList.push(option);
      setDishesMasterList(dishList);
      //set selected items
      let selectedItems = [];
      selectedItems = selectedDishes;
      selectedItems.push(option);
      setSelectedDishes(selectedItems);
      //set selected item's id
      let selectedIds = [];
      selectedIds = selectedDishesId;
      selectedIds.push(masterValue.dishTypeId);
      setSelectedDishesId(selectedIds);
      toastMessage(success, S.DISHES_SUCCESS_MSG);
      dishesRef.current.onInputChange();
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  //getting chef availaibity data
  const [checkBookingData, checkData] = useLazyQuery(CHECK_BOOKING, {
    variables: {
      pChefId: currentChefIdValue,
      pFromTime: getDate(bookingDate, bookingFromTime),
      pToTime: getDate(bookingDate, bookingToTime),
      pGmtFromTime: getIsoDate(bookingDate, bookingFromTime),
      pGmtToTime: getIsoDate(bookingDate, bookingToTime),
    },
    // onError: err => {
    //   toastMessage('renderError', err);
    // },
  });

  //get bookingHistory value
  const bookingHistoryValue = gqlTag.query.booking.listWithFiltersGQLTAG({
    pFromTime: bookingDate + ' 00:00:00',
    pToTime: bookingDate + ' 23:59:59',
    first: 100,
    chefId: currentChefIdValue,
    chefBookingStatusId: 'CHEF_ACCEPTED',
  });
  const BOOKING_HISTORY_VALUE = gql`
    ${bookingHistoryValue}
  `;
  const [bookingHistoryDataValue, historyData] = useLazyQuery(BOOKING_HISTORY_VALUE, {
    fetchPolicy: 'network-only',
    // onError: err => {
    //   toastMessage('renderError', err);
    // },
  });
//getting chef profile detail
  useEffect(() => {
    let chefData = props.chefDetails;
    if (
      util.isObjectEmpty(chefData) &&
      util.hasProperty(chefData, 'chefSpecializationProfilesByChefId') &&
      util.isObjectEmpty(chefData.chefSpecializationProfilesByChefId) &&
      util.isArrayEmpty(chefData.chefSpecializationProfilesByChefId.nodes) &&
      util.isObjectEmpty(chefData.chefSpecializationProfilesByChefId.nodes[0])
    ) {
      let data = chefData.chefSpecializationProfilesByChefId.nodes[0];
      setChefSavedDishes(util.isArrayEmpty(data.chefDishTypeId) ? data.chefDishTypeId : []);
      // setSelectedDishesId(util.isArrayEmpty(data.chefDishTypeId) ? data.chefDishTypeId : []);
    }
  }, [props.chefDetails]);

  //getting chef profile detail
  useEffect(() => {
    if (
      historyData &&
      historyData.data &&
      historyData.data.listBookingByDateRange &&
      historyData.data.listBookingByDateRange.nodes &&
      historyData.data.listBookingByDateRange.nodes.length > 0
    ) {
      // bookedTime
      let fromToTime = [];
      historyData.data.listBookingByDateRange.nodes.map((res, key) => {
        if (res) {
          let startDate1 = getTimeOnly(res.chefBookingFromTime);
          //Set fixed end date
          let endDate1 = getTimeOnly(res.chefBookingToTime);
         
          let combineTime = getTimeOnly(getDateWithTimeLocal(res.chefBookingFromTime)) + ' - ' + getTimeOnly(getDateWithTimeLocal(res.chefBookingToTime));
          fromToTime.push(combineTime);
          if (historyData.data.listBookingByDateRange.nodes.length - 1 === key) {
            setbookedTime(fromToTime);
          }
        }
      });
    }
  }, [historyData]);

  //getting dishes list from master table
  useEffect(() => {
    if (
      util.isObjectEmpty(getDishesData) &&
      util.hasProperty(getDishesData, 'data') &&
      util.isObjectEmpty(getDishesData.data) &&
      util.hasProperty(getDishesData.data, 'getDishTypes') &&
      util.isObjectEmpty(getDishesData.data.getDishTypes) &&
      util.isArrayEmpty(getDishesData.data.getDishTypes.nodes)
    ) {
      let data = [];
      getDishesData.data.getDishTypes.nodes.map((res, key) => {
        if (res) {
          let option = {
            label: res.dishTypeDesc,
            value: res.dishTypeId,
          };
          data.push(option);
        }
      });

      // setDishesMasterList(getDishesData.data.allDishTypeMasters.nodes);
    }
  }, [getDishesData]);
  //set dish data based on alreay stored data
  // useEffect(() => {
  //   if (util.isArrayEmpty(dishesMasterList) && util.isArrayEmpty(chefSavedDishes)) {
  //     let data = chefSavedDishes;
  //     let dishData = [];

  //     dishesMasterList.map((res, key) => {
  //       let index = data.indexOf(res.value);
  //       if (index > -1) {
  //         let option = {
  //           label: res.label,
  //           value: res.value,
  //         };
  //         dishData.push(option);
  //       }
  //     });
  //     setSelectedDishes(dishData);
  //   } else {
  //     setSelectedDishes([]);
  //   }
  // }, [dishesMasterList, chefSavedDishes]);

  //set chef data after getting from backend
  useEffect(() => {
    if (checkData.error !== undefined) {
      setHideSubmit(false);
      if (
        checkData.error &&
        checkData.error.graphQLErrors &&
        checkData.error.graphQLErrors.length > 0 &&
        checkData.error.graphQLErrors[0].message
      ) {
        if (checkData.error.graphQLErrors[0].message === 'CHEF_HAS_BOOKING_ON_THIS_DATETIME') {
          toastMessage(renderError, 'CHEF_HAS_BOOKING_ON_THIS_DATETIME');
        } else if (checkData.error.graphQLErrors[0].message === 'CHEF_NOT_AVAILABLE_ON_THIS_TIME') {
          toastMessage(renderError, 'CHEF_NOT_AVAILABLE_ON_THIS_TIME');
        } else if (checkData.error.graphQLErrors[0].message === 'CHEF_NOT_AVAILABLE_ON_THIS_DATE') {
          toastMessage(renderError, 'CHEF_NOT_AVAILABLE_ON_THIS_DATE');
        }
      }
    } else if (checkData.data !== undefined) {
      try {
        if (startMin < endMin) {
          if (util.isStringEmpty(stripeId) && util.isStringEmpty(customerCardId)) {
            if (paymentButtonEnable === false) {
              const variables = {
                stripeCustomerId: stripeId,
                cardId: customerCardId,
                chefId: currentChefIdValue,
                customerId: customerIds,
                fromTime: getIsoDate(bookingDate, bookingFromTime),
                toTime: getIsoDate(bookingDate, bookingToTime),
                notes: notesValue ? JSON.stringify(notesValue) : null,
                dishTypeId: selectedDishesId ? selectedDishesId : null,
              };
              bookingData({
                variables,
              });
            } else {
              try {
                let variables = {
                  stripeCustomerId: stripeId,
                  cardId: customerCardId,
                  bookingHistId: retryPaymentHistoryId,
                };
                retryPaymentData({
                  variables,
                });
              } catch (error) {
                toastMessage(renderError, error.message);
              }
            }
          } else {
            toastMessage(renderError, S.CARD_AVAIALABLE);
          }
        } else {
          toastMessage(renderError, S.DATE_AVAILABLE);
        }
      } catch (error) {
        toastMessage(renderError, error.message);
      }
    }
  }, [checkData]);

  //Get commission value
  useEffect(() => {
    if (
      util.isObjectEmpty(commissionData) &&
      util.isObjectEmpty(commissionData.data) &&
      util.isStringEmpty(commissionData.data.getSettingValue)
    ) {
      let servicePercentage = parseFloat(commissionData.data.getSettingValue);
      let servicePercentageString = `${commissionData.data.getSettingValue} %`;
      setServicePercentage(servicePercentageString);
      let commissionCost = (servicePercentage / 100) * chefCost;
      setCommissionAmountAmount(commissionCost.toFixed(2));
    }
  }, [commissionData, chefCost]);

  useEffect(() => {
    //get user role
    getUserTypeRole()
      .then(res => {
        if (res === customer) {
          //customer user
          getCustomerId(customerId)
            .then(customerResult => {
              setCustomerIds(customerResult);
            })
            .catch(err => {
              toastMessage(renderError, err);
            });
        }
      })
      .catch(err => {
        toastMessage(renderError, err);
      });

    let chefDetails = props.chefDetails;
    if (
      util.isObjectEmpty(chefDetails) &&
      util.hasProperty(chefDetails, 'chefProfileExtendedsByChefId') &&
      util.isObjectEmpty(chefDetails.chefProfileExtendedsByChefId) &&
      util.hasProperty(chefDetails.chefProfileExtendedsByChefId, 'nodes') &&
      util.isObjectEmpty(chefDetails.chefProfileExtendedsByChefId.nodes[0])
    ) {
      let data = chefDetails.chefProfileExtendedsByChefId.nodes[0];
      setPricePerHour(util.isNumberEmpty(data.chefPricePerHour) ? data.chefPricePerHour : 1);
      setPriceUnit(
        util.isStringEmpty(data.chefPriceUnit)
          ? data.chefPriceUnit.toUpperCase() === 'USD'
            ? '$'
            : data.chefPriceUnit
          : '$'
      );
      setMinNoofHours(
        data.minimumNoOfMinutesForBooking ? data.minimumNoOfMinutesForBooking / 60 : 0
      );
    }
  }, []);

  //calculate total price
  useEffect(() => {
    if (util.isObjectEmpty(props.selectedEvent)) {
      let dateFormat = props.selectedEvent;
      let bookingDate = getDateFormat(dateFormat.start);
      setBookingDate(bookingDate);
      setBookingFromTime(dateFormat.fromTime);
      setBookingToTime(dateFormat.toTime);
      setStartMin(calcluateMin(dateFormat.fromTime));
      setEndMin(calcluateMin(dateFormat.toTime));
      //Set fixed start date
      let startDate = `${convert12to24Hours(dateFormat.fromTime, 'Hours')}:${convert12to24Hours(
        dateFormat.fromTime,
        'Mins'
      )}`;
      setFixedStartTime(startDate);
      //Set fixed end date
      let endDate = `${convert12to24Hours(dateFormat.toTime, 'Hours')}:${convert12to24Hours(
        dateFormat.toTime,
        'Mins'
      )}`;
      setFixedEndTime(endDate);
      setHoursCount((calcluateMin(dateFormat.toTime) - calcluateMin(dateFormat.fromTime)) / 60);
      setAvaialableTime(dateFormat.title);
      bookingHistoryDataValue();
    }
  }, [props.selectedEvent]);

  //calculate mins
  function calcluateMin(value) {
    let hour = convert12to24Hours(value, 'Hours');
    let min = convert12to24Hours(value, 'Mins');
    let totalMins = parseInt(hour) * 60 + parseInt(min);
    return totalMins;
  }

  useEffect(() => {
    if (endMin <= startMin) {
      toastMessage(error, S.TIME_AVAILABLE);
    } else {
      setHoursCount((endMin - startMin) / 60);
    }
  }, [bookingFromTime, bookingToTime]);

  //calculate chef price
  useEffect(() => {
    let chefCost = hoursCount * pricePerHour;
    setChefCost(chefCost.toFixed(2));
  }, [hoursCount, pricePerHour]);

  //calculate total price
  useEffect(() => {
    setTotalAmount(parseFloat(chefCost) + parseFloat(commissionAmount));
  }, [chefCost, commissionAmount]);

  //render time picker (start and end time picker)
  function renderTimePicker(value, stateAssign, type) {
    try {
      return (
        <TimePicker
          theme="classic"
          time={value}
          withoutIcon={true}
          timeConfig={{
            from: fixedStartTime,
            to: fixedEndTime,
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
        setBookingToTime(toTime);
        setStartMin(startMin);
        setEndMin(endMin);
      }
      //if end time
      else if (type === 'end') {
        stateValue(fromTime);
        setEndMin(startMin);
      }
      // //add 1 hour for end time
      // if (type === 'start') {
      //   //convert 12 hours format time to 24 hours
      //   let startMin = calcluateMin(`${hour}:${minute} ${meridiem}`);
      //   setStartMin(startMin);
      //   // setEndMin(parseInt(startMin) + 1);
      //   // let convertedTime1 = convert12to24Format(`${parseInt(hour) + 1}:${minute} ${meridiem}`);
      //   // setBookingToTime(convertedTime1);
      // } else {
      //   //convert 12 hours format time to 24 hours
      //   let endMin = calcluateMin(`${hour}:${minute} ${meridiem}`);
      //   setEndMin(endMin);
      // }
    } catch (err) {
      toastMessage(renderError, err.message);
    }
  }

  //loader
  function renderLoader() {
    if (loader && loader === true) {
      return (
        <div>
          <Loader />
        </div>
      );
    }
  }

  //when changing booking date
  function onChangeBookingDate(event) {
    try {
      if (util.isObjectEmpty(event)) {
        setBookingDate(event);
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  // //onclicking submit button
  // async function onSubmit(e) {
  //   try {
  //     e.preventDefault();
  //     if (startMin < endMin) {
  //       const variables = {
  //         chefId: currentChefIdValue,
  //         customerId: customerIds,
  //         chefBookingFromTime: getDate(bookingDate, bookingFromTime),
  //         chefBookingToTime: getDate(bookingDate, bookingToTime),
  //         chefBookingPriceValue: totalAmount,
  //         chefBookingPriceUnit: 'USD',
  //       };
  //       console.log('variablesvariables', variables);
  //       await bookingData({
  //         variables,
  //       });
  //     } else {
  //       toastMessage(renderError, S.DATE_AVAILABLE);
  //     }
  //   } catch (error) {
  //     toastMessage(renderError, error.message);
  //   }
  // }
  //onclicking submit button
  function onSubmit(e) {
    try {
      if (minNoofHours) {
        if (minNoofHours <= hoursCount) {
          setAlertModalOption(true);
          setHideSubmit(true);
        } else {
          let hourData = minNoofHours === 1 ? S.HOUR : S.HOURS;
          let alert = S.MINIMUM_MINUTES_ALERT + ' ' + minNoofHours + ' ' + hourData;
          toastMessage(renderError, alert);
        }
      } else {
        setAlertModalOption(true);
        setHideSubmit(true);
      }
      e.preventDefault();
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  function paymentFailedModal() {
    setCardModal(false);
    setEnablePayment(true);
    setPaymentButtonEnable(true);
  }

  //when closing modal
  function closeModal() {
    if (props.openModal) {
      props.openModal(props);
      setOpen(false);
    }
  }

  function retryPayment(e) {
    try {
      setAlertModalOption(true);
      setHideSubmit(true);
      e.preventDefault();
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  //When close card modal
  async function closeCardModal(value) {
    if (
      util.isObjectEmpty(value) &&
      util.hasProperty(value, 'customer') &&
      util.hasProperty(value, 'id')
    ) {
      if (util.isStringEmpty(value.customer) && util.isObjectEmpty(value.id)) {
        setStripeId(value.customer);
        setCustomerCardId(value.id);
        if (startMin < endMin) {
          const variables = {
            pChefId: currentChefIdValue,
            pFromTime: getDate(bookingDate, bookingFromTime),
            pToTime: getDate(bookingDate, bookingToTime),
            pGmtFromTime: getIsoDate(bookingDate, bookingFromTime),
            pGmtToTime: getIsoDate(bookingDate, bookingToTime),
          };
          await checkBookingData({
            variables,
          });
        } else {
          toastMessage(renderError, S.DATE_AVAILABLE);
        }
      }
    } else {
      setHideSubmit(false);
    }
    setCardModal(false);
  }

  function onChangeNotes(e) {
    setNotesValue(e.target.value);
  }

  function handleChange(value, stateAssign, stateAssignForId) {
    let data = [];
    if (util.isArrayEmpty(value)) {
      value.map(res => {
        data.push(res.value);
      });
      stateAssign(value);
      stateAssignForId(data);
    } else {
      stateAssign([]);
      stateAssignForId([]);
    }
  }
  function handleDishCreateOption(value) {
    let customerId = state.customerId;
    insertNewDish({
      variables: {
        dishTypeName: value,
        dishTypeDesc: value,
        chefId: null,
        customerId: customerId,
      },
    });
  }

  //To get value fro alert modal
  function alertModal(value) {
    if (value === S.YES) {
      setCardModal(true);
      setAlertModalOption(false);
    } else if (value === S.NO) {
      setAlertModalOption(false);
      setHideSubmit(false);
    }
  }

  function selectedDishesview() {
    return (
      <div className="form-group">
        <label className="label">{S.DISHES}</label>
        <CreatableSelect
          ref={dishesRef}
          isMulti={true}
          isSearchable={true}
          value={selectedDishes}
          onChange={value => handleChange(value, setSelectedDishes, setSelectedDishesId)}
          options={dishesMasterList}
          onCreateOption={value => handleDishCreateOption(value)}
          placeholder="Select Dish"
        />
      </div>
    );
  }

  function viewAvailableTime() {
   
    return bookedTime.map((res, key) => {  
      return <div>{res}</div>;
    });
  }
  //.inactive {
  // pointer-events: none; // pointer-events not supported below IE11
  // position: fixed;
  // }
  return (
    <div>
      <Modal
        open={open}
        onClose={closeModal}
        id="inactive"
        center
        style={{ width: '40%' }}
        closeOnOverlayClick={false}
      >
        <div>
          {renderLoader()}
          <div className="login-content">
            <div className="section-title" id="booking-modal-title">
              <h2>{S.BOOKING_NOW}</h2>
            </div>

            <form
              className="signup-form"
              onSubmit={enblePayment === false ? onSubmit : retryPayment}
            >
              <div className="form-group">
                <label className="label">{S.BOOKING_DATE}</label>
                <input
                  type="text"
                  disabled={true}
                  className="form-control"
                  id="name"
                  name="name"
                  required={true}
                  placeholder={S.BOOKING_DATE_PLACE_HOLDER}
                  value={bookingDate}
                  data-error="Please enter booking date"
                />
              </div>
              <div className="row form-group" id="bookingDetail">
                <label className="label">{S.AVAIALABLE_TIME}</label>
                <div>{avaialableTime}</div>
              </div>
              {bookedTime && bookedTime.length > 0 && (
                <div className="row form-group" id="bookingDetail">
                  <label className="label">{'Booked Time:'}</label>
                  <div>{viewAvailableTime()}</div>
                </div>
              )}
              <div className="row form-group" id="bookingDetail">
                <label className="label">{S.MINIMUM_BOOKING_HOUR}</label>
                <div>{minNoofHours}</div>
              </div>
              <div className="form-group">
                <label className="label">{S.BOOKING_TIME}</label>
                <div className="row">
                  <div className="col-sm-6">
                    {renderTimePicker(bookingFromTime, setBookingFromTime, 'start')}
                  </div>
                  <div className="col-sm-6">
                    {renderTimePicker(bookingToTime, setBookingToTime, 'end')}
                  </div>
                </div>
              </div>
              <div className="row form-group" id="bookingDetail">
                <label className="label">{S.PRICE}</label>
                <div>
                  = {priceUnit}
                  {pricePerHour}
                </div>
              </div>
              <div className="row form-group" id="bookingDetail">
                <label className="label">{S.TOTAL_HOURS_PRICE}</label>
                <div>
                  {hoursCount} hours X {pricePerHour} = {priceUnit}
                  {chefCost}
                </div>
              </div>
              <div className="row form-group" id="bookingDetail">
                <label className="label">{S.SERVICE_CHARGE}</label>
                <div>
                  {servicePercentage} X {chefCost} = {priceUnit}
                  {commissionAmount}
                </div>
              </div>
              <div className="row form-group" id="bookingDetail">
                <label className="label">{S.TOTAL_PRICE}</label>
                <div>
                  {chefCost} + {commissionAmount} = {priceUnit}
                  {totalAmount}
                </div>
              </div>
              {/* dishes */}
              {selectedDishesview()}
              <div className="form-group">
                <label className="label">{S.NOTES}</label>
                <textarea
                  type="text"
                  disabled={paymentModalEditable}
                  className="form-control booking_notes"
                  placeholder={S.NOTES_PLACE_HOLDER}
                  rows="4"
                  id="notes"
                  name="notes"
                  required={false}
                  value={notesValue}
                  onChange={e => onChangeNotes(e)}
                  data-error="Please enter notes"
                />
              </div>
              {hideSubmit === false && (
                <div>
                  {paymentButtonEnable === false && (
                    <button type="submit" className="btn btn-primary" id="saveButton">
                      {S.SUBMIT}
                    </button>
                  )}
                  {paymentButtonEnable === true && (
                    <button type="submit" className="btn btn-primary" id="saveButton">
                      {S.RETRY_PAYMENT}
                    </button>
                  )}
                </div>
              )}
            </form>
            <a onClick={closeModal} className="bts-popup-close" id="closeButton"></a>
          </div>
        </div>
      </Modal>
      {/* </div> */}
      <div>{cardModal === true && <CardListModal closeCardModal={closeCardModal} />}</div>
      <div>
        {alertModalOption === true && (
          <AlertModal alertModal={alertModal} content={S.SUBMIT_ALERT} />
        )}
      </div>
    </div>
  );
};
// export default BookingForms;
export default withApollo(BookingForms);
