import React, { useState, useEffect, useRef, useContext } from 'react';
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import Modal from 'react-responsive-modal';
import gql from 'graphql-tag';
import * as gqlTag from '../../../../common/gql';
import * as util from '../../../../utils/checkEmptycondition';
import { priceCalculator } from '../../../../utils/priceCalculator';
import { toastMessage, success, renderError, error } from '../../../../utils/Toast';
import _ from 'lodash';

//chef
const chefDataTag = gqlTag.query.chef.profileByIdGQLTAG;

//for getting chef data
const GET_CHEF_DATA = gql`
  ${chefDataTag}
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

//Get commission value
const commissionValue = gqlTag.query.setting.getSettingValueGQLTAG;
const COMMISSION_VALUE = gql`
  ${commissionValue}
`;

//Get dishes
const dishDataTag = gqlTag.query.master.dishByChefIdGQLTAG;
//for getting dish data
const GET_DISHES_DATA = gql`
  ${dishDataTag}
`;

const savePriceTag = gqlTag.mutation.chef.updateChefPriceCalculatorGQLTAG;

const SAVE_PRICE = gql`
  ${savePriceTag}
`;
const CalculatePrice = props => {
  let sampleArray = [];
  const dishesRef = useRef();
  const [Isopen, setIsOpen] = useState(true);
  const [ProfileDetails, setProfileDetails] = useState([]);
  // const [range, setRange] = useState(null);
  const [rangeMinValue, setRangeMinValue] = useState(1);
  const [range, setRange] = useState();
  const [PriceRange, setPrcieRange] = useState(1);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [chefRate, setChefRate] = useState();
  const [savedService, setSavedService] = useState([]);
  const [availableService, setAvailableService] = useState([]);

  const [valuePrice, setValuePrice] = useState(null);
  const [complexityValue, setComplexity] = useState(null);
  const [additionalServicePrice, setAdditionalServicePrice] = useState(0);

  const [multiple1, setmultiple1] = useState(false);
  const [multiple2, setmultiple2] = useState(false);
  const [multiple3, setmultiple3] = useState(false);

  const [savedRange, setSavedRange] = useState();
  const [savedComplexity, setSavedComplexity] = useState();
  const [savedPrice, setSavedPrice] = useState();
  const [savedCommision, setSavedCommision] = useState();
  const [savedStore, setSavedStore] = useState();

  const [servicePercentage, setServicePercentage] = useState('1%');
  const [commissionAmount, setCommissionAmount] = useState(0);
  const [serviceAmount, setServiceAmount] = useState();

  const [savedDetails, setSavedDetails] = useState({});

  // const [getStoreData, listData] = useLazyQuery(LIST_STORE);CREATE_BOOKING

  const getDishesData = useQuery(GET_DISHES_DATA, {
    // getting image gallery based on chef id
    variables: { pChefId: props.chefId ? props.chefId : '' },
    onError: err => {
      toastMessage('renderError', err);
    },
  }); //get dishes data

  const [getChefDataByProfile, chefData] = useLazyQuery(GET_CHEF_DATA, {
    variables: { chefId: props.chefId },
    fetchPolicy: 'network-only',
    onError: err => { },
  });

  const [savePriceData, { data }] = useMutation(SAVE_PRICE, {
    onCompleted: data => {
      toastMessage('success', 'Values Saved Successfully');
    },
    onError: err => {
      toastMessage('error', err);
    },
  });
  //

  //Get commission value query
  const commissionData = useQuery(COMMISSION_VALUE, {
    variables: {
      pSettingName: 'BOOKING_SERVICE_CHARGE_IN_PERCENTAGE',
    },
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  useEffect(() => {
    if (
      util.isObjectEmpty(commissionData) &&
      util.isObjectEmpty(commissionData.data) &&
      util.isStringEmpty(commissionData.data.getSettingValue)
    ) {
      let servicePercentage = parseFloat(commissionData.data.getSettingValue);
      setServiceAmount(servicePercentage);
      let servicePercentageString = `${commissionData.data.getSettingValue} %`;
      setServicePercentage(servicePercentageString);
      if (valuePrice) {
        let commissionCost = (servicePercentage / 100) * valuePrice;
        setCommissionAmount(commissionCost.toFixed(2));
      } else {
        let commissionCost = (servicePercentage / 100) * savedPrice;
        setCommissionAmount(commissionCost.toFixed(2));
      }
    }
  }, [commissionData, savedPrice, valuePrice]);

  useEffect(() => {
    let data = [];
    if (props.bookingDetails) {
      setBookingData(props.bookingDetails);
      setRange(props.bookingDetails.chefBookingNoOfPeople);
      setSavedRange(props.bookingDetails.chefBookingNoOfPeople);
      if (
        util.hasProperty(props.bookingDetails, 'additionalServiceDetails') &&
        util.isStringEmpty(props.bookingDetails.additionalServiceDetails)
      ) {
        JSON.parse(props.bookingDetails.additionalServiceDetails).map(value => {
          data.push(value.id);
        });
        setSavedService(data);
      }
      setSavedComplexity(props.bookingDetails.chefBookingComplexity);
      setSavedCommision(props.bookingDetails.chefBookingCommissionPriceValue);
      setValuePrice(props.bookingDetails.chefBookingPriceValue);
      setSavedPrice(props.bookingDetails.chefBookingPriceValue);
      setSavedStore(props.bookingDetails.chefBookingStoreTypeId[0]);
      if (props.bookingDetails.chefBookingComplexity === 1) {
        setSavedComplexity(1);
        setComplexity(1);
        setmultiple1(true);
        setmultiple2(false);
        setmultiple3(false);
      } else if (props.bookingDetails.chefBookingComplexity === 1.5) {
        setSavedComplexity(1.5);
        setComplexity(1.5);
        setmultiple2(true);
        setmultiple1(false);
        setmultiple3(false);
      } else if (props.bookingDetails.chefBookingComplexity === 2) {
        setSavedComplexity(2);
        setComplexity(2);
        setmultiple1(false);
        setmultiple2(false);
        setmultiple3(true);
      }
    } else {
      setBookingData([]);
    }
  }, [props]);

  useEffect(() => {
    if (
      util.isObjectEmpty(chefData) &&
      util.hasProperty(chefData, 'data') &&
      util.isObjectEmpty(chefData.data) &&
      util.hasProperty(chefData.data, 'chefProfileByChefId') &&
      util.isObjectEmpty(chefData.data.chefProfileByChefId)
    ) {
      let detail = chefData.data.chefProfileByChefId;
      if (
        util.hasProperty(detail, 'chefProfileExtendedsByChefId') &&
        util.hasProperty(detail.chefProfileExtendedsByChefId, 'nodes')
      ) {
        setProfileDetails(detail.chefProfileExtendedsByChefId.nodes[0]);
        if (
          util.hasProperty(
            detail.chefProfileExtendedsByChefId.nodes[0],
            'additionalServiceDetails'
          ) &&
          util.isStringEmpty(detail.chefProfileExtendedsByChefId.nodes[0].additionalServiceDetails)
        ) {
          setAvailableService(
            JSON.parse(detail.chefProfileExtendedsByChefId.nodes[0].additionalServiceDetails)
          );
        } else {
          setAvailableService([]);
        }
      }
    } else {
      setProfileDetails([]);
    }
  }, [chefData]);

  useEffect(() => {
    if (props.chefId) {
      getChefDataByProfile();
    }
  }, [props.chefId]);
  useEffect(() => {
    calculatePrice();
  }, [additionalServicePrice]);

  useEffect(() => {
    if (ProfileDetails) {
      calculatePrice();
    }
  }, [complexityValue]);

  useEffect(() => {
    let newValue = 0;
    additionalServices.map(value => {
      newValue = newValue + parseInt(value.price);
    });
    setAdditionalServicePrice(newValue);
  }, [additionalServices]);

  useEffect(() => {
    if (ProfileDetails) {
      setRange(ProfileDetails.noOfGuestsMin);
      calculatePrice();
    }
  }, [ProfileDetails]);

  function calculatePrice() {
    if (ProfileDetails) {
      let baseRate = ProfileDetails ? ProfileDetails.chefPricePerHour : null;
      let guest = range;
      let complexity = complexityValue;
      let additionalServices = additionalServicePrice;
      let price = priceCalculator(baseRate, guest, complexity, additionalServices);
      setValuePrice(price);
    }
  }

  function additionalServiceCalc(value, name) {
    let newVal = value;

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

  function onSave(event) {
    event.preventDefault();
    let chefDetail;
    if (
      props.ProfileDetails &&
      props.ProfileDetails.chefProfileExtendedsByChefId &&
      props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0]
    ) {
      chefDetail = props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0];
    } else if (props.ProfileDetails) {
      chefDetail = props.ProfileDetails;
    }
    if (chefDetail) {
      let saveObj = {
        pChefId: props.chefId,
        pNoOfGuestsMin: chefDetail.noOfGuestsMin,
        pNoOfGuestsMax: chefDetail.noOfGuestsMax,
        pChefPricePerHour: chefDetail.chefPricePerHour,
        pChefComplexity: JSON.parse(chefDetail.chefComplexity),
        pChefAdditionalServices: chefDetail.chefAdditionalServices ?
          JSON.parse(chefDetail.chefAdditionalServices) : chefDetail.chefAdditionalServices
      }
      let variables = {
        pData: JSON.stringify(saveObj)
      }
      savePriceData({
        variables
      })
      console.log("chefDetailchefDetailprops", JSON.stringify(saveObj));

    }
  }
  function pricingDetails() {
    let chefDetail;
    if (
      props.ProfileDetails &&
      props.ProfileDetails.chefProfileExtendedsByChefId &&
      props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0]
    ) {
      chefDetail = props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0];
      setSavedDetails(chefDetail);
    } else if (props.ProfileDetails) {
      chefDetail = props.ProfileDetails;
    }
    if (chefDetail) {
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
      let remainingMemberCount = 0;
      let halfOfBaseRate = 0;
      let chefCharge = 0;
      let totalAmount = 0;
      let chefValue = chefDetail;
      baseRate = chefValue ? chefValue.chefPricePerHour : null;
      noOfGuests = props.pricingForm ? props.pricingForm.noOfGuests : props.guest;
      complexity = props.complexity;

      console.log('props', props);

      additionalServices = props.additionalServices
        ? props.additionalServices
          ? additionalServiceCalc(props.additionalServices, 'old')
          : 0
        : 0;

      if (noOfGuests <= 5) {
        // price = baseRate;
        // price = price * noOfGuests;
        // price = price * complexity;
        // price = price + additionalServices;

        // firstfve = baseRate * 5;
        // chefCharge = price + serviceCharge + firstfve + complexityCharge;
        // totalCharge = price + serviceCharge;
        firstfve = baseRate * noOfGuests;
        complexityCharge = complexity && complexity !== null ? firstfve * complexity - firstfve : 0;
        totalCharge = firstfve + complexityCharge + additionalServices;
        serviceCharge = (serviceAmount / 100) * totalCharge + 0.3;
        totalAmount = totalCharge - serviceCharge;

        return (
          <div className="card">
            <div className="card-header">
              <h4 style={{ color: '#08AB93', fontSize: '18px' }}>
              What customer will pay
              </h4>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef Base Rate
              </div>
              <div className="col-lg-2">${baseRate ? baseRate.toFixed(2) : ''}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                No of guests
              </div>
              <div className="col-lg-2">{noOfGuests ? noOfGuests : '-'}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Complexity
              </div>
              <div className="col-lg-2">{complexity}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Additional services
              </div>
              <div className="col-lg-2">${additionalServices.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid  #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef base rate(${baseRate}) X No.of.guests({noOfGuests})
              </div>
              <div className="col-lg-2">${firstfve.toFixed(2)} </div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Complexity Upcharge
              </div>
              <div className="col-lg-2">
                {complexityCharge >= 0 ? `$${complexityCharge.toFixed(2)}` : null}
              </div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  display: 'flex',
                  fontSize: '17px',
                  borderRight: '1px solid #D3D3D3',
                }}
              >
                Rockoly / Payment Charges:
              </div>
              <div className="col-lg-2"> ${serviceCharge.toFixed(2)}</div>
            </div>
            {/* <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef charge
              </div>
              <div className="col-lg-2">${price.toFixed(2)}</div>
            </div> */}

            <div
              style={{
                display: 'flex',
              }}
            >
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  fontSize: '17px',
                  borderRight: '1px solid #D3D3D3',
                }}
              >
                Total amount to pay
              </div>
              <div
                className="col-lg-2"
                style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
              >
                ${totalAmount.toFixed(2)}
              </div>
            </div>
            {props.screen == 'profile' &&
              <div className="saveCalculateButton" style={{ paddingRight: '2%' }}>
                <button className="btn btn-primary" onClick={(event) => onSave(event)}>
                  Save and Apply
              </button>
              </div>
            }

          </div>
        );
      } else if (noOfGuests > 5) {
        // price = baseRate * 5;
        // price = price + (noOfGuests - 5) * (baseRate / 2);
        // price = price * complexity;
        // price = price + additionalServices;

        firstfve = baseRate * noOfGuests;
        afterFive = (noOfGuests - 5) * (baseRate / 2);

        price = firstfve - afterFive;
        complexityCharge = price * complexity - price;
        // price = price + complexityCharge;
        // price = price + additionalServices;
        totalCharge = price + complexityCharge + additionalServices;

        serviceCharge = (serviceAmount / 100) * totalCharge + 0.3;
        remainingMemberCount = noOfGuests - 5;
        halfOfBaseRate = baseRate / 2;
        totalAmount = totalCharge - serviceCharge;
        return (
          <div>
            <h4 style={{ color: '#08AB93', fontSize: '18px' }}>What customer will pay</h4>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef Base Rate
              </div>
              <div className="col-lg-2">${baseRate.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                No of guests
              </div>
              <div className="col-lg-2">{noOfGuests}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Complexity
              </div>
              <div className="col-lg-2">{complexity}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Additional services
              </div>
              <div className="col-lg-2">${additionalServices.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef base rate(${baseRate}) X {noOfGuests}
              </div>
              <div className="col-lg-2">${firstfve.toFixed(2)}</div>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Discount
              </div>
              <div className="col-lg-2">-${afterFive.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-12"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  // justifyContent: 'flex-end',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Over 5 ({remainingMemberCount}) guests half chef Base Rate (${halfOfBaseRate})
              </div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Complexity Upcharge:
              </div>
              <div className="col-lg-2">
                {' '}
                {complexityCharge >= 0 ? `$${complexityCharge.toFixed(2)}` : null}
              </div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Rockoly / Payment Charges:
              </div>
              <div className="col-lg-2">${serviceCharge.toFixed(2)}</div>
            </div>
            {/* <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef charge:{' '}
              </div>
              <div className="col-lg-2">${price.toFixed(2)}</div>
            </div> */}
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  // justifyContent: 'flex-end',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Total amount to pay:{' '}
              </div>
              <div className="col-lg-2">${totalAmount.toFixed(2)}</div>
            </div>
            {props.screen == 'profile' &&
              <div className="saveCalculateButton" style={{ paddingRight: '2%' }}>
                <button className="btn btn-primary" onClick={(event) => onSave(event)}>
                  Save and Apply
                      </button>
              </div>
            }
          </div>
        );
      }
    }
  }

  function SecondPricingDetails() {
    let chefDetail;
    if (
      props.ProfileDetails &&
      props.ProfileDetails.chefProfileExtendedsByChefId &&
      props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0]
    ) {
      chefDetail = props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0];
    } else if (props.ProfileDetails) {
      chefDetail = props.ProfileDetails;
    }
    if (chefDetail) {
      let baseRate = 0;
      let noOfGuests = 0;
      let complexity = 0;
      let additionalServices = 0;
      let price = 0;
      let totalCharge = 0;
      let serviceCharge = 0;
      let firstfve = 0;
      let afterFive = 0;
      let complexityCharge = 0,
        chefCharge = 0;
      let chefValue = chefDetail;
      baseRate = chefValue.chefPricePerHour;
      noOfGuests = props.pricingForm ? props.pricingForm.noOfGuests : props.guest;
      complexity = 1.5;

      additionalServices = props.additionalServices
        ? props.additionalServices
          ? additionalServiceCalc(props.additionalServices, 'old')
          : 0
        : 0;

      if (noOfGuests <= 5) {
        price = baseRate;
        price = price * noOfGuests;
        price = price * complexity;
        price = price + additionalServices;
        firstfve = baseRate * 5;
        complexityCharge = complexity ? firstfve * complexity - firstfve : null;
        chefCharge = price + serviceCharge + firstfve + complexityCharge;
        totalCharge = price + serviceCharge;
        serviceCharge = (serviceAmount / 100) * price + 0.3;
        totalCharge = price;
        firstfve = baseRate * noOfGuests;
        complexityCharge = firstfve * complexity - firstfve;
        return (
          <div className="card">
            <div className="card-header">
              <h4 style={{ color: '#08AB93', fontSize: '18px' }}>
                Calculated Details complexity 1.5
              </h4>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef Base Rate
              </div>
              <div className="col-lg-2">${baseRate.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                No of guests
              </div>
              <div className="col-lg-2">{noOfGuests ? noOfGuests : '-'}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Complexity
              </div>
              <div className="col-lg-2">{complexity ? complexity : '-'}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Additional services
              </div>
              <div className="col-lg-2">${additionalServices.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid  #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef charge
              </div>
              <div className="col-lg-2">${firstfve.toFixed(2)} </div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Complexity charge
              </div>
              <div className="col-lg-2">
                $ {complexityCharge > 0 ? complexityCharge.toFixed(2) : '-'}
              </div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  display: 'flex',
                  fontSize: '17px',
                  borderRight: '1px solid #D3D3D3',
                }}
              >
                Additional services
              </div>
              <div className="col-lg-2"> ${additionalServices.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef charge
              </div>
              <div className="col-lg-2">${price.toFixed(2)}</div>
            </div>
            <div
              style={{
                display: 'flex',
              }}
            >
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  fontSize: '17px',
                  borderRight: '1px solid #D3D3D3',
                }}
              >
                Total amount to pay
              </div>
              <div
                className="col-lg-2"
                style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
              >
                ${totalCharge.toFixed(2)}
              </div>
            </div>
          </div>
        );
      } else if (noOfGuests > 5) {
        price = baseRate * 5;
        price = price + (noOfGuests - 5) * (baseRate / 2);
        price = price * complexity;
        price = price + additionalServices;
        serviceCharge = (serviceAmount / 100) * price + 0.3;
        totalCharge = price;
        firstfve = baseRate * 5;
        afterFive = (noOfGuests - 5) * (baseRate / 2);
        complexityCharge = (firstfve + afterFive) * complexity - (firstfve + afterFive);
        return (
          <div>
            <h4 style={{ color: '#08AB93', fontSize: '18px' }}>Calculated Details Details:</h4>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef Base Rate
              </div>
              <div className="col-lg-2">${baseRate.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                No of guests
              </div>
              <div className="col-lg-2">{noOfGuests}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Complexity
              </div>
              <div className="col-lg-2">{complexity}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Additional services
              </div>
              <div className="col-lg-2">${additionalServices.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef charge for first 5 guests
              </div>
              <div className="col-lg-2">${firstfve.toFixed(2)}</div>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef charge for after 5 guests
              </div>
              <div className="col-lg-2">${afterFive.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Complexity charge:
              </div>
              <div className="col-lg-2"> ${complexityCharge.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Additional services:
              </div>
              <div className="col-lg-2">${additionalServices.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef charge:{' '}
              </div>
              <div className="col-lg-2">${price.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  // justifyContent: 'flex-end',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Total amount to pay:{' '}
              </div>
              <div className="col-lg-2">${totalCharge.toFixed(2)}</div>
            </div>
          </div>
        );
      }
    }
  }
  function ThirdPricingDetails() {
    let chefDetail;
    if (
      props.ProfileDetails &&
      props.ProfileDetails.chefProfileExtendedsByChefId &&
      props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0]
    ) {
      chefDetail = props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0];
    } else if (props.ProfileDetails) {
      chefDetail = props.ProfileDetails;
    }
    if (chefDetail) {
      let baseRate = 0;
      let noOfGuests = 0;
      let complexity = 0;
      let additionalServices = 0;
      let price = 0;
      let totalCharge = 0;
      let serviceCharge = 0;
      let firstfve = 0;
      let afterFive = 0;
      let complexityCharge = 0,
        chefCharge = 0;
      let chefValue = chefDetail;
      baseRate = chefValue.chefPricePerHour;
      noOfGuests = props.pricingForm ? props.pricingForm.noOfGuests : props.guest;
      complexity = 2;

      additionalServices = props.additionalServices
        ? props.additionalServices
          ? additionalServiceCalc(props.additionalServices, 'old')
          : 0
        : 0;

      if (noOfGuests <= 5) {
        price = baseRate;
        price = price * noOfGuests;
        price = price * complexity;
        price = price + additionalServices;
        firstfve = baseRate * 5;
        complexityCharge = firstfve * complexity - firstfve;
        chefCharge = price + serviceCharge + firstfve + complexityCharge;
        totalCharge = price + serviceCharge;
        serviceCharge = (serviceAmount / 100) * price + 0.3;
        totalCharge = price;
        firstfve = baseRate * noOfGuests;
        complexityCharge = firstfve * complexity - firstfve;
        return (
          <div className="card">
            <div className="card-header">
              <h4 style={{ color: '#08AB93', fontSize: '18px' }}>
                Calculated Details complexity 2
              </h4>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef Base Rate
              </div>
              <div className="col-lg-2">${baseRate.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                No of guests
              </div>
              <div className="col-lg-2">{noOfGuests ? noOfGuests : '-'}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Complexity
              </div>
              <div className="col-lg-2">{complexity ? complexity : '-'}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Additional services
              </div>
              <div className="col-lg-2">${additionalServices.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid  #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef charge
              </div>
              <div className="col-lg-2">${firstfve.toFixed(2)} </div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Complexity charge
              </div>
              <div className="col-lg-2">
                $ {complexityCharge > 0 ? complexityCharge.toFixed(2) : '-'}
              </div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  display: 'flex',
                  fontSize: '17px',
                  borderRight: '1px solid #D3D3D3',
                }}
              >
                Additional services
              </div>
              <div className="col-lg-2"> ${additionalServices.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef charge
              </div>
              <div className="col-lg-2">${price.toFixed(2)}</div>
            </div>
            <div
              style={{
                display: 'flex',
              }}
            >
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  fontSize: '17px',
                  borderRight: '1px solid #D3D3D3',
                }}
              >
                Total amount to pay
              </div>
              <div
                className="col-lg-2"
                style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
              >
                ${totalCharge.toFixed(2)}
              </div>
            </div>
          </div>
        );
      } else if (noOfGuests > 5) {
        price = baseRate * 5;
        price = price + (noOfGuests - 5) * (baseRate / 2);
        price = price * complexity;
        price = price + additionalServices;
        serviceCharge = (serviceAmount / 100) * price + 0.3;
        totalCharge = price;
        firstfve = baseRate * 5;
        afterFive = (noOfGuests - 5) * (baseRate / 2);
        complexityCharge = (firstfve + afterFive) * complexity - (firstfve + afterFive);
        return (
          <div>
            <h4 style={{ color: '#08AB93', fontSize: '18px' }}>Calculated Details Details:</h4>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef Base Rate
              </div>
              <div className="col-lg-2">${baseRate.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                No of guests
              </div>
              <div className="col-lg-2">{noOfGuests}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Complexity
              </div>
              <div className="col-lg-2">{complexity}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Additional services
              </div>
              <div className="col-lg-2">${additionalServices.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef charge for first 5 guests
              </div>
              <div className="col-lg-2">${firstfve.toFixed(2)}</div>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef charge for after 5 guests
              </div>
              <div className="col-lg-2">${afterFive.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Complexity charge:
              </div>
              <div className="col-lg-2"> ${complexityCharge.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Additional services:
              </div>
              <div className="col-lg-2">${additionalServices.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef charge:{' '}
              </div>
              <div className="col-lg-2">${price.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  // justifyContent: 'flex-end',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Total amount to pay:{' '}
              </div>
              <div className="col-lg-2">${totalCharge.toFixed(2)}</div>
            </div>
          </div>
        );
      }
    }
  }
  try {
    return (
      <div>
        <div className="login-content">
          <form className="signup-form">
            {pricingDetails()}
            <br />
            {/* {SecondPricingDetails()}
              <br />
              {ThirdPricingDetails()} */}
          </form>
        </div>
      </div>
    );
  } catch (error) {
    //console.log('error', error);
  }
};

export default CalculatePrice;
