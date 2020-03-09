import React, { useState, useEffect, useContext } from 'react';
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import Modal from 'react-responsive-modal';
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import * as util from '../../../utils/checkEmptycondition';
import { priceCalculator } from '../../../utils/priceCalculator';
import { toastMessage, success, renderError, error } from '../../../utils/Toast';
import CustomerCardList from '../../payments/components/CustomerCardList';
import _ from 'lodash';

const listStoreTag = gqlTag.query.master.storeTypeGQLTAG;
//gql to get store list

const LIST_STORE = gql`
  ${listStoreTag}
`;

//chef
const chefDataTag = gqlTag.query.chef.profileByIdGQLTAG;

//for getting chef data
const GET_CHEF_DATA = gql`
  ${chefDataTag}
`;

const firstRequest = gqlTag.mutation.booking.acceptChefRequestGQLTAG;
//for insert dish
const FIRST_REQUEST = gql`
  ${firstRequest}
`;

const secondRequest = gqlTag.mutation.booking.paymentGQLTAG;
//for insert dish
const SECOND_REQUEST = gql`
  ${secondRequest}
`;

const editBooking = gqlTag.mutation.booking.createRequestGQLTAG;
//for insert dish
const EDIT_BOOKING = gql`
  ${editBooking}
`;

const createBooking = gqlTag.mutation.booking.createGQLTAG;
//for insert dish
const CREATE_BOOKING = gql`
  ${createBooking}
`;

const chefRequest = gqlTag.mutation.booking.acceptChefRequestGQLTAG;
//for chef request
const CHEF_REQUEST = gql`
  ${chefRequest}
`;

const bookingRePAyment = gqlTag.mutation.booking.paymentGQLTAG;
//for chef request
const BOOKING_RE_PAYMENT = gql`
  ${bookingRePAyment}
`;

//chef
const bookingBasedID = gqlTag.query.booking.byIdGQLTAG;

//for getting chef data
const BOOKING_DATA_ID = gql`
  ${bookingBasedID}
`;

//chef
const bookingBasedRequesrID = gqlTag.query.booking.requestedBookingByIdGQLTAG;

//for getting chef data
const BOOKING_DATA_REQUEST_ID = gql`
  ${bookingBasedRequesrID}
`;

const ChefRequestModal = props => {
  let cardId = null;
  let cardCustomer = null;
  let payPrice = null;
  let chefIdValue = null;
  let sampleArray = [];
  const [cardDetails, setCardDetails] = useState(null);
  const [Isopen, setIsOpen] = useState(true);
  const [ProfileDetails, setProfileDetails] = useState([]);
  // const [range, setRange] = useState(null);
  const [range, setRange] = useState();
  const [additionalServices, setAdditionalServices] = useState([]);

  const [valuePrice, setValuePrice] = useState(null);
  const [storeValue, setStoreValue] = useState(null);
  const [complexityValue, setComplexity] = useState(null);
  const [otherStoreDecription, setOtherStoreDecription] = useState(null);
  const [additionalServicePrice, setAdditionalServicePrice] = useState(0);
  const [chefBookingId, setChefBookingId] = useState(null);
  const [oldBookingData, setOldBookingData] = useState(null);
  const [newBookingData, setNewBookingData] = useState(null);
  const [chefId, setChefId] = useState(null);
  const [chefProfile, setChefProfile] = useState(null);
  const [totalChargeValue, setTotalChargeValue] = useState(null);

  const [bookingSummary, setBookingSummary] = useState(null);
  // const [getStoreData, listData] = useLazyQuery(LIST_STORE);CREATE_BOOKING

  const [getBookingData, bookingDataValue] = useLazyQuery(BOOKING_DATA_ID, {
    variables: { chefBookingHistId: props.chefBookingId },
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [getBookingRequestData, bookingRequestDataValue] = useLazyQuery(BOOKING_DATA_REQUEST_ID, {
    variables: { bookingHistId: props.chefBookingId },
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [chefRequest, chefRequestCall] = useMutation(CHEF_REQUEST, {
    onCompleted: requestData => {
      let variables = {
        stripeCustomerId: cardDetails.customer,
        cardId: cardDetails.id,
        bookingHistId: props.chefBookingId,
        chefId: chefId,
        price: newBookingData.chefBookingRequestPriceValue,
        currecy: 'USD',
      };
      bookingRePayment({ variables });
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  const [bookingRePayment, bookingRePaymentCall] = useMutation(BOOKING_RE_PAYMENT, {
    onCompleted: dishData => {
      toastMessage(success, 'Payment Successful');
      closePriceModal();
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  const [bookingDataTag, bookingDataCall] = useMutation(CREATE_BOOKING, {
    onCompleted: dishData => {
      if (props.onClickNo) {
        props.onClickNo('closeAll');
      }
      closePriceModal();
      toastMessage(success, 'Booking created Successfully');
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  const [bookingRequestDataTag, requestData] = useMutation(EDIT_BOOKING, {
    onCompleted: data => {
      if (props.onClickNo) {
        props.onClickNo();
      }
      closePriceModal();
      toastMessage(success, 'Booking edited Successfully');
    },
    onError: err => {
      // toastMessage(renderError, err.message);
    },
  });

  const [getChefDataByProfile, chefData] = useLazyQuery(GET_CHEF_DATA, {
    variables: { chefId },
    fetchPolicy: 'network-only',
    onError: err => {
      // toastMessage('renderError', err);
    },
  });

  const [firstRequest, setFirstRequest] = useMutation(FIRST_REQUEST, {
    onCompleted: data => {
      // console.log('data', data);
      // if (props.onClickNo) {
      //   props.onClickNo();
      // }
      // closePriceModal();
      // toastMessage(success, 'Booking edited Successfully');
    },
    onError: err => {
      // toastMessage(renderError, err.message);
    },
  });

  useEffect(() => {
    if (props && props.bookingDetail && props.bookingDetail.chefBookingHistId) {
      setChefBookingId(props.bookingDetail.chefBookingHistId);
    }
  }, [props]);

  useEffect(() => {
    if (chefData && chefData.data && chefData.data.chefProfileByChefId)
      setChefProfile(chefData.data.chefProfileByChefId);
  }, [chefData]);

  useEffect(() => {
    if (chefId) {
      getChefDataByProfile();
    }
  }, [chefId]);

  useEffect(() => {
    if (
      bookingDataValue &&
      bookingDataValue.data &&
      bookingDataValue.data.chefBookingHistoryByChefBookingHistId
    ) {
      setOldBookingData(bookingDataValue.data.chefBookingHistoryByChefBookingHistId);
    }
  }, [bookingDataValue]);

  useEffect(() => {
    if (
      bookingRequestDataValue &&
      bookingRequestDataValue.data &&
      bookingRequestDataValue.data.allChefBookingRequestHistories &&
      bookingRequestDataValue.data.allChefBookingRequestHistories.nodes
    ) {
      setNewBookingData(bookingRequestDataValue.data.allChefBookingRequestHistories.nodes[0]);
    }
  }, [bookingRequestDataValue]);

  useEffect(() => {
    if (props.chefBookingId) {
      getBookingData();
      getBookingRequestData();
    }
  }, [props.chefBookingId]);

  useEffect(() => {
    if (oldBookingData) {
      setChefId(oldBookingData.chefId);
    }
  }, [oldBookingData]);

  useEffect(() => {
    if (newBookingData) {
    }
  }, [newBookingData]);

  function closeModal(values) {
    setCardDetails(values);
    let chefValue;
    let chefCharge;
    let baseRate = 0;
    let noOfGuests = 0;
    let complexity = 0;
    let additionalServices = 0;
    let price = 0;
    let totalCharge = 0;
    let serviceCharge = 0;
    let firstfve = 0;
    let afterFive = 0;
    let complexityCharge = 0;
    let newbaseRate = 0;
    let newnoOfGuests = 0;
    let newcomplexity = 0;
    let newadditionalServices = 0;
    let newprice = 0;
    let newtotalCharge = 0;
    let newserviceCharge = 0;
    let newfirstfve = 0;
    let newafterFive = 0;
    let newcomplexityCharge = 0;
    let totalPrice = 0;
    let bookingId = props.chefBookingId;
    let additionservicesArray = [];
    let newadditionservicesArray = [];
    let totalService = 0;
    let generatatedChefTotal = 0;

    if (
      chefProfile &&
      chefProfile.chefProfileExtendedsByChefId &&
      chefProfile.chefProfileExtendedsByChefId.nodes[0] &&
      oldBookingData
    ) {
      chefValue = chefProfile.chefProfileExtendedsByChefId.nodes[0];
      baseRate = chefValue.chefPricePerHour;
      noOfGuests = oldBookingData.chefBookingNoOfPeople;
      complexity = oldBookingData.chefBookingComplexity;
      additionalServices = oldBookingData.chefBookingAdditionalServices
        ? additionalServiceCalc(oldBookingData.chefBookingAdditionalServices, 'old')
        : 0;
      additionservicesArray = oldBookingData.chefBookingAdditionalServices
        ? JSON.parse(oldBookingData.chefBookingAdditionalServices)
        : [];
      // if (noOfGuests <= 5) {
      //   price = baseRate;
      //   price = price * noOfGuests;
      //   price = price * complexity;
      //   price = price + additionalServices;

      //   firstfve = baseRate * 5;
      //   complexityCharge = firstfve * complexity - firstfve;
      //   chefCharge = price + serviceCharge + firstfve + complexityCharge;
      //   totalCharge = price + serviceCharge;
      //   serviceCharge = (3.5 / 100) * price;
      //   totalCharge = price + (price * 3.5) / 100;
      //   firstfve = baseRate * noOfGuests;
      //   complexityCharge = firstfve * complexity - firstfve;
      //   totalCharge = price + ((price * 3.5) % 100);
      // } else if (noOfGuests > 5) {
      //   price = baseRate * 5;
      //   price = price + (noOfGuests - 5) * (baseRate / 2);
      //   price = price * complexity;
      //   price = price + additionalServices;

      //   serviceCharge = (3.5 / 100) * price;
      //   firstfve = baseRate * 5;
      //   afterFive = (noOfGuests - 5) * (baseRate / 2);
      //   complexityCharge = (firstfve + afterFive) * complexity - (firstfve + afterFive);
      //   totalCharge = price + serviceCharge;
      //   serviceCharge = (3.5 / 100) * price;
      //   totalCharge = price + ((price * 3.5) % 100);
      //   firstfve = baseRate * noOfGuests;
      //   afterFive = (noOfGuests - 5) * (baseRate / 2);
      //   complexityCharge = (firstfve + afterFive) * complexity - (firstfve + afterFive);
      // }
    }
    if (
      chefProfile &&
      chefProfile.chefProfileExtendedsByChefId &&
      chefProfile.chefProfileExtendedsByChefId.nodes[0] &&
      newBookingData
    ) {
      chefValue = chefProfile.chefProfileExtendedsByChefId.nodes[0];
      newbaseRate = chefValue.chefPricePerHour;
      newnoOfGuests = newBookingData.chefBookingRequestNoOfPeople;
      newcomplexity = newBookingData.chefBookingRequestComplexity;
      newadditionalServices =
        newBookingData && newBookingData.chefBookingRequestAdditionalServices
          ? additionalServiceCalc(newBookingData.chefBookingRequestAdditionalServices, 'new')
          : 0;
      newadditionservicesArray =
        newBookingData && newBookingData.chefBookingRequestAdditionalServices
          ? JSON.parse(newBookingData.chefBookingRequestAdditionalServices)
          : [];
      // if (newnoOfGuests <= 5) {
      //   newprice = newbaseRate;
      //   newprice = newprice * newnoOfGuests;
      //   newprice = newprice * newcomplexity;
      //   newprice = newprice + newadditionalServices;
      //   firstfve = baseRate * 5;
      //   complexityCharge = firstfve * complexity - firstfve;
      //   chefCharge = price + serviceCharge + firstfve + complexityCharge;
      //   totalCharge = price + serviceCharge;
      //   newserviceCharge = 0.3 + (3.5 / 100) * newprice;
      //   newtotalCharge = newprice + (newprice * 3.5) / 100;
      //   newfirstfve = newbaseRate * newnoOfGuests;
      //   newcomplexityCharge = newfirstfve * newcomplexity - newfirstfve;
      //   newtotalCharge = newprice + (0.3 + ((newprice * 3.5) % 100));
      //   payPrice = newprice + (0.3 + ((newprice * 3.5) % 100));
      // } else if (newnoOfGuests > 5) {
      //   newprice = newbaseRate * 5;
      //   newprice = newprice + (newnoOfGuests - 5) * (newbaseRate / 2);
      //   newprice = newprice * newcomplexity;
      //   newprice = newprice + newadditionalServices;
      //   newserviceCharge = 0.3 + (3.5 / 100) * newprice;
      //   newtotalCharge = newprice + (0.3 + ((newprice * 3.5) % 100));
      //   newfirstfve = newbaseRate * newnoOfGuests;
      //   newafterFive = (newnoOfGuests - 5) * (newbaseRate / 2);
      //   newcomplexityCharge =
      //     (newfirstfve + newafterFive) * newcomplexity - (newfirstfve + newafterFive);
      // }
    }
    setTotalChargeValue(newtotalCharge);
    if (oldBookingData && newBookingData) {
      price = oldBookingData.chefBookingPriceValue;
      newprice = newBookingData.chefBookingRequestPriceValue;
      totalPrice = price + newprice;
      serviceCharge = oldBookingData.chefBookingCommissionPriceValue;
      newserviceCharge = newBookingData.chefBookingRequestCommissionPriceValue;
      totalService = serviceCharge + newserviceCharge;
      generatatedChefTotal = totalPrice - totalService;
    }

    let variable = {
      bookingHistId: props.chefBookingId,
      bookingPriceValue: totalPrice,
      bookingCommissionPriceValue: totalService,
      bookingTotalPriceValue: generatatedChefTotal,
      bookingNoOfPeople: noOfGuests + newnoOfGuests,
      bookingComplexity: newcomplexity,
      bookingAdditionalServices: combineAdditionalService(
        additionservicesArray,
        newadditionservicesArray
      ),
      bookingServiceChargeValue: 7,
      bookingStripeCommissionPriceValue: 0.6,
    };
    let newVal = variable;
    chefRequest({
      variables: {
        pData: JSON.stringify(variable),
      },
    });
  }

  function combineAdditionalService(oldArray, newArray) {
    let val1 = oldArray;
    let val2 = newArray;
    val2.map((value, index) => {
      val1.push(value);
    });
    return val1;
  }

  function closeCardModal(values) {}

  function calculatePrice() {
    // (baseRate * 5 + ((total no of guests - 5) * (baseRate / 2))  * complexity) + additional services
    // (baseRate * no.of.guests * complexity) + additional services
    if (ProfileDetails) {
      let baseRate = ProfileDetails.chefPricePerHour;
      let guest = range;
      let complexity = complexityValue;
      let additionalServices = additionalServicePrice;
      let price = priceCalculator(baseRate, guest, complexity, additionalServices);
      setValuePrice(price);
    }
  }

  function closePriceModal() {
    setIsOpen(false);
  }

  function oldBookingDataFunction() {
    if (
      chefProfile &&
      chefProfile.chefProfileExtendedsByChefId &&
      chefProfile.chefProfileExtendedsByChefId.nodes[0] &&
      oldBookingData
    ) {
      chefIdValue = chefProfile.chefProfileExtendedsByChefId.nodes[0].chefId;
      let chefValue = chefProfile.chefProfileExtendedsByChefId.nodes[0];
      let baseRate = 0;
      let noOfGuests = 0;
      let complexity = 0;
      let additionalServices = 0;
      let price = 0;
      let totalCharge = 0;
      let serviceCharge = 0;
      let firstfve = 0;
      let afterFive = 0;
      let complexityCharge = 0;
      let chefCharge = 0;

      baseRate = chefValue.chefPricePerHour;
      noOfGuests = oldBookingData.chefBookingNoOfPeople;
      complexity = oldBookingData.chefBookingComplexity;
      additionalServices = oldBookingData.chefBookingAdditionalServices
        ? additionalServiceCalc(oldBookingData.chefBookingAdditionalServices, 'old')
        : 0;
      if (noOfGuests <= 5) {
        price = baseRate;
        price = price * noOfGuests;
        price = price * complexity;
        price = price + additionalServices;
        firstfve = baseRate * 5;
        complexityCharge = firstfve * complexity - firstfve;
        chefCharge = price + firstfve + complexityCharge;
        totalCharge = price;

        return (
          <div className="card">
            <div className="card-header">
              <h4 style={{ color: '#08AB93', fontSize: '18px' }}>Initial Booking request:</h4>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Base Rate:
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6">${baseRate.toFixed(2)} </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Number of Guest:
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6">{noOfGuests} </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Complexity:
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6">{complexity} </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Chef charge:
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6">${firstfve.toFixed(2)} </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Complexity charge:{' '}
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6">${complexityCharge.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Additional services:
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6"> ${additionalServices.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                {' '}
                Chef charge:{' '}
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6">${price.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Rockoly charge:{' '}
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6">${serviceCharge.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Total amount to pay:{' '}
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6">${totalCharge.toFixed(2)}</div>
            </div>
          </div>
        );
      } else if (noOfGuests > 5) {
        price = baseRate * 5;
        price = price + (noOfGuests - 5) * (baseRate / 2);
        price = price * complexity;
        price = price + additionalServices;
        firstfve = baseRate * 5;
        afterFive = (noOfGuests - 5) * (baseRate / 2);
        complexityCharge = (firstfve + afterFive) * complexity - (firstfve + afterFive);
        totalCharge = price;
        return (
          <div className="card">
            <div className="card-header">
              <h4 style={{ color: '#08AB93', fontSize: '18px' }}>Initial Booking</h4>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Base Rate:
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6">${baseRate.toFixed(2)} </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Number of Guest:
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6">{noOfGuests} </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Complexity:
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6">{complexity} </div>
            </div>

            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Chef charge for first 5 guests:{' '}
              </div>
              <div className="col-lg-6">${firstfve.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                {' '}
                Chef charge for after 5 guests:{' '}
              </div>
              <div className="col-lg-6">${afterFive.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Complexity charge:
              </div>
              <div className="col-lg-6"> ${complexityCharge.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Additional services:{' '}
              </div>
              <div className="col-lg-6">${additionalServices.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Chef charge:{' '}
              </div>
              <div className="col-lg-6">${price.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Rockoly charge:{' '}
              </div>
              <div className="col-lg-6">${serviceCharge.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Total amount to pay:{' '}
              </div>
              <div className="col-lg-6">${totalCharge.toFixed(2)}</div>
            </div>
          </div>
        );
      }
    }
  }

  function newBookingDataFunction() {
    if (
      chefProfile &&
      chefProfile.chefProfileExtendedsByChefId &&
      chefProfile.chefProfileExtendedsByChefId.nodes[0] &&
      newBookingData &&
      oldBookingData
    ) {
      let chefValue = chefProfile.chefProfileExtendedsByChefId.nodes[0];
      let baseRate = 0;
      let noOfGuests = 0;
      let complexity = 0;
      let additionalServices = 0;
      let price = 0;
      let totalCharge = 0;
      let serviceCharge = 0;
      let firstfve = 0;
      let afterFive = 0;
      let complexityCharge = 0;
      let chefCharge = 0;
      let newNoOfGuests =
        oldBookingData.chefBookingNoOfPeople + newBookingData.chefBookingRequestNoOfPeople;

      baseRate = chefValue.chefPricePerHour;
      noOfGuests = newBookingData.chefBookingRequestNoOfPeople;
      complexity = newBookingData.chefBookingRequestComplexity;
      additionalServices =
        newBookingData && newBookingData.chefBookingRequestAdditionalServices
          ? additionalServiceCalc(newBookingData.chefBookingRequestAdditionalServices, 'new')
          : 0;
      if (noOfGuests <= 5) {
        price = baseRate;
        price = price * noOfGuests;
        price = price * complexity;
        price = price + additionalServices;
        serviceCharge = (3.5 / 100) * price;
        firstfve = baseRate * 5;
        complexityCharge = firstfve * complexity - firstfve;
        chefCharge = price + firstfve + complexityCharge;
        totalCharge = price;
        return (
          <div className="card">
            <div className="card-header">
              <h4 style={{ color: '#08AB93', fontSize: '18px' }}>Chef Booking Request Changes</h4>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Base Rate:
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6">${baseRate.toFixed(2)} </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Additional Number of Guest:
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6">{newBookingData.chefBookingRequestNoOfPeople} </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Complexity:
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6">{complexity} </div>
            </div>

            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Additional services:
              </div>
              <div className="col-lg-6">${additionalServices.toFixed(2)}</div>
            </div>
            {/* <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Rockoly charge:
              </div>
              <div className="col-lg-6">
                {' '}
                ${newBookingData.chefBookingRequestCommissionPriceValue.toFixed(2)}
              </div>
            </div> */}
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Total amount to pay:{' '}
              </div>
              <div className="col-lg-6">
                ${newBookingData.chefBookingRequestPriceValue.toFixed(2)}
              </div>
            </div>
          </div>
        );
      } else if (noOfGuests > 5) {
        price = baseRate * 5;
        price = price + (noOfGuests - 5) * (baseRate / 2);
        price = price * complexity;
        price = price + additionalServices;

        serviceCharge = (3.5 / 100) * price;
        firstfve = baseRate * 5;
        afterFive = (noOfGuests - 5) * (baseRate / 2);
        complexityCharge = (firstfve + afterFive) * complexity - (firstfve + afterFive);
        totalCharge = price + serviceCharge;
        return (
          <div className="card">
            <div className="card-header">
              <h4 style={{ color: '#08AB93', fontSize: '18px' }}>New Price:</h4>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Base Rate:
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6">${baseRate.toFixed(2)} </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Number of Guest:
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6">{newNoOfGuests} </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Complexity:
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-6">{complexity} </div>
            </div>

            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Additional services:{' '}
              </div>
              <div className="col-lg-6">${additionalServices.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Rockoly charge:{' '}
              </div>
              <div className="col-lg-6">
                ${newBookingData.chefBookingRequestCommissionPriceValue.toFixed(2)}
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-6"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '17px',
                }}
              >
                Total amount to pay:{' '}
              </div>
              <div className="col-lg-6">
                ${newBookingData.chefBookingRequestTotalPriceValue.toFixed(2)}
              </div>
            </div>
          </div>
        );
      }
    }
  }

  function additionalServiceCalc(value, name) {
    let newVal = JSON.parse(value);

    let price = 0;
    if (name === 'old') {
      if (newVal.length > 0) {
        newVal.map((value1, index) => {
          price = price + value1.price;
        });
        return price;
      } else {
        return price;
      }
    } else {
      if (newVal.length > 0) {
        newVal.map((value1, index) => {
          price = price + parseInt(value1.price);
        });
        return price;
      } else {
        return price;
      }
    }
  }

  try {
    return (
      <div>
        <Modal
          open={Isopen}
          id="inactive"
          center
          onClose={closePriceModal}
          style={{ width: '40%' }}
          closeOnOverlayClick={false}
        >
          <div className="login-content">
            <div className="section-title" id="booking-modal-title">
              <h2>Chef request page</h2>
            </div>
            {oldBookingData && chefProfile && <div>{oldBookingDataFunction()}</div>}
            <br />
            <br />
            {newBookingData && chefProfile && <div>{newBookingDataFunction()}</div>}
            <div>
              <CustomerCardList
                type={'modal'}
                closeModal={closeModal}
                closeCardModal={closeCardModal}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  } catch (error) {
    console.log('error', error);
  }
};

export default ChefRequestModal;
