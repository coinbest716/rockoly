import React, { useState, useEffect, useRef, useContext } from 'react';
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import Modal from 'react-responsive-modal';
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import * as util from '../../../utils/checkEmptycondition';
import { priceCalculator } from '../../../utils/priceCalculator';
import { toastMessage, success, renderError, error } from '../../../utils/Toast';
import CreatableSelect from 'react-select/creatable';
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

const PricingIntroModal = props => {
  let sampleArray = [];
  const dishesRef = useRef();
  const [Isopen, setIsOpen] = useState(true);
  const [ProfileDetails, setProfileDetails] = useState([]);
  // const [range, setRange] = useState(null);
  const [rangeMinValue, setRangeMinValue] = useState(1);
  const [range, setRange] = useState();
  const [PriceRange, setPrcieRange] = useState(1);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [chefRate, setChefRate] = useState();
  const [savedService, setSavedService] = useState([]);
  const [availableService, setAvailableService] = useState([]);

  const [valuePrice, setValuePrice] = useState(null);
  const [storeValue, setStoreValue] = useState(null);
  const [complexityValue, setComplexity] = useState(null);
  const [otherStoreValue, setOtherStoreValue] = useState(false);
  const [otherStoreDecription, setOtherStoreDecription] = useState(null);
  const [isvaluePresent, setIsValuePresent] = useState([]);
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

  const [bookingSummary, setBookingSummary] = useState(null);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [selectedDishesId, setSelectedDishesId] = useState([]);
  const [chefSavedDishes, setChefSavedDishes] = useState([]);
  const [notesValue, setNotesValue] = useState('');
  const [dishesMasterList, setDishesMasterList] = useState([]);
  const [previousAdditinalServicePrice, setPreviousAdditinalServicePrice] = useState(null);
  const [showAgreement, setShowAgreement] = useState(props.screenName === 'booking' ? true : true);

  // const [getStoreData, listData] = useLazyQuery(LIST_STORE);CREATE_BOOKING

  const [getStoreData, listData] = useLazyQuery(LIST_STORE, {
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const createDish = gqlTag.mutation.master.createDishTypeGQLTAG;
  //for insert dish
  const INSERT_DISH = gql`
    ${createDish}
  `;

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
      toastMessage(success, 'Dish added');
      dishesRef.current.onInputChange();
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  useEffect(() => {
    let chefData = props.ProfileDetails;
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
  }, [props.ProfileDetails]);

  const [bookingRequestDataTag, requestData] = useMutation(EDIT_BOOKING, {
    onCompleted: data => {
      if (props.onClickNo) {
        props.onClickNo();
      }
      closePriceModal();
      if (props.onCloseModal) {
        props.onCloseModal();
      }
      toastMessage(success, 'Booking edited Successfully');
    },
    onError: err => {
      // toastMessage(renderError, err.message);
    },
  });

  const [getChefDataByProfile, chefData] = useLazyQuery(GET_CHEF_DATA, {
    variables: { chefId: props.chefId },
    fetchPolicy: 'network-only',
    onError: err => {
      // toastMessage('renderError', err);
    },
  });

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
      if (util.isArrayEmpty(props.bookingDetails.chefBookingStoreTypeId)) {
        setSavedStore(props.bookingDetails.chefBookingStoreTypeId[0]);
      }

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
        //ProfileDetails.additionalServiceDetails setAvailableService
      }
    } else {
      setProfileDetails([]);
    }
  }, [chefData]);

  useEffect(() => {
    getStoreData();
  }, [props]);

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
    if (props && props.bookingDetails && props.bookingDetails.chefBookingAdditionalServices) {
      let propsService = JSON.parse(props.bookingDetails.chefBookingAdditionalServices);
      let newValue = 0;
      propsService.map(value => {
        newValue = newValue + parseInt(value.price);
      });
      setPreviousAdditinalServicePrice(newValue);
    }
  }, []);

  useEffect(() => {
    if (ProfileDetails) {
      setRange(savedRange && savedRange > 0 ? savedRange : ProfileDetails.noOfGuestsMin);
      calculatePrice();
    }
  }, [ProfileDetails, savedRange]);

  useEffect(() => {
    if (range) {
    }
    calculatePrice();
  }, [range]);

  useEffect(() => {
    if (storeList && storeList.length > 0) {
      let newVal = [];
      newVal.push(storeList[0].storeTypeId);
      setStoreValue(newVal);
    }
  }, [storeList]);

  useEffect(() => {
    if (
      util.isObjectEmpty(listData) &&
      util.hasProperty(listData, 'data') &&
      util.isObjectEmpty(listData.data) &&
      util.hasProperty(listData.data, 'allStoreTypeMasters') &&
      util.isObjectEmpty(listData.data.allStoreTypeMasters) &&
      util.isArrayEmpty(listData.data.allStoreTypeMasters.nodes)
    ) {
      setStoreList(listData.data.allStoreTypeMasters.nodes);
    } else {
      setStoreList([]);
    }
  }, [listData]);

  function closeModal(values) {
    let stripeCustomerId,
      cardId,
      chefId,
      customerId,
      fromTime,
      toTime,
      notes,
      dishTypeId,
      summary,
      allergyTypeIds,
      otherAllergyTypes,
      dietaryRestrictionsTypesIds,
      otherDietaryRestrictionsTypes,
      kitchenEquipmentTypeIds,
      otherKitchenEquipmentTypes,
      storeTypeIds,
      otherStoreTypes,
      noOfGuests,
      locationAddress,
      locationLat,
      locationLng,
      addrLine1,
      addrLine2,
      state,
      country,
      city,
      postalCode,
      complexity = null;
    if (props.bookingValues) {
      chefId = props.bookingValues.chefId;
      customerId = props.bookingValues.customerId;
      fromTime = props.bookingValues.fromTime;
      toTime = props.bookingValues.toTime;
      dishTypeId = selectedDishesId ? selectedDishesId : null;
      notes = notesValue ? JSON.stringify(notesValue) : null;
      locationAddress = props.bookingValues.locationAddress;
      locationLat = props.bookingValues.locationLat;
      locationLng = props.bookingValues.locationLng;
      addrLine1 = props.bookingValues.addrLine1;
      addrLine2 = props.bookingValues.addrLine2;
      state = props.bookingValues.state;
      country = props.bookingValues.country;
      city = props.bookingValues.city;
      postalCode = props.bookingValues.postalCode;
      summary = props.bookingValues.bookingSummary;
    }
    if (props.dietValues) {
      dietaryRestrictionsTypesIds = props.dietValues.customerDietaryRestrictionsTypeId;
      otherDietaryRestrictionsTypes = props.dietValues.customerOtherDietaryRestrictionsTypes;
    }
    if (props.allergyValues) {
      allergyTypeIds = props.allergyValues.customerAllergyTypeId;
    }
    if (props.kitchenUtensils) {
      kitchenEquipmentTypeIds = props.kitchenUtensils.customerKitchenEquipmentTypeId;
      otherKitchenEquipmentTypes = props.kitchenUtensils.customerOtherKitchenEquipmentTypes;
    }

    noOfGuests = range !== null ? parseInt(range) : ProfileDetails.noOfGuestsMin;
    complexity = complexityValue;
    let variables = {
      stripeCustomerId: values.customer,
      cardId: values.id,
      chefId,
      customerId,
      fromTime,
      toTime,
      notes,
      dishTypeId,
      summary: props.bookingValues.bookingSummary
        ? JSON.stringify(props.bookingValues.bookingSummary)
        : null,
      allergyTypeIds,
      otherAllergyTypes: otherAllergyTypes ? JSON.stringify(otherAllergyTypes) : null,
      dietaryRestrictionsTypesIds,
      otherDietaryRestrictionsTypes: otherDietaryRestrictionsTypes
        ? JSON.stringify(otherDietaryRestrictionsTypes)
        : null,
      kitchenEquipmentTypeIds,
      otherKitchenEquipmentTypes: otherKitchenEquipmentTypes
        ? JSON.stringify(otherKitchenEquipmentTypes)
        : null,
      storeTypeIds: storeValue,
      otherStoreTypes: otherStoreDecription,
      noOfGuests,
      complexity,
      additionalServices,
      locationAddress,
      locationLat,
      locationLng,
      addrLine1,
      addrLine2,
      state,
      country,
      city,
      postalCode,
    };
    if (complexity) {
      if (storeValue && storeValue.length > 0) {
        bookingDataTag({
          variables,
        });
      } else {
        toastMessage(renderError, 'Please select a store to complete booking');
      }
    } else {
      toastMessage(renderError, 'Please select complexity to complete booking');
    }
    // setIsOpen(false);
  }

  function nextClick() {
    if (complexityValue) {
      if (storeValue && storeValue.length > 0) {
        let values = {
          noOfGuests: range !== null ? parseInt(range) : ProfileDetails.noOfGuestsMin,
          complexity: complexityValue,
          storeTypeIds: storeValue,
          otherStoreTypes: otherStoreDecription,
          additionalServices,
        };
        if (props.pricingFormCallBack) props.pricingFormCallBack(values);
      } else {
        toastMessage(renderError, 'Please select a store to complete booking');
      }
    } else {
      toastMessage(renderError, 'Please select complexity to complete booking');
    }
  }

  function setComplexityFunc(value) {
    setComplexity(value);
  }

  function closeCardModal(values) {}

  function backPricingIntroFormCallBack() {
    if (props.backPricingIntroFormCallBack) props.backPricingIntroFormCallBack();
  }

  function calculatePrice() {
    // (baseRate * 5 + ((total no of guests - 5) * (baseRate / 2))  * complexity) + additional services
    // (baseRate * no.of.guests * complexity) + additional services
    if (ProfileDetails) {
      let baseRate = ProfileDetails.chefPricePerHour;
      let guest = range;
      let complexity = complexityValue;
      let additionalServices = additionalServicePrice;
      let price = priceCalculator(
        baseRate,
        guest,
        complexity,
        additionalServices,
        previousAdditinalServicePrice
      );
      setValuePrice(price);
    }
  }

  function onSaveChanges(event) {
    let newCommissionValue1 = 0;
    event.preventDefault();
    let stripeCustomerId;
    let cardId;
    let chefId;
    let customerId;
    let fromTime;
    let toTime;
    let notes;
    let dishTypeId;
    let summary;
    let allergyTypeIds;
    let otherAllergyTypes;
    let dietaryRestrictionsTypesIds;
    let otherDietaryRestrictionsTypes;
    let otherKitchenEquipmentTypes;
    let storeTypeIds;
    let otherStoreTypes;
    let chefBookingRequestNoOfPeople;
    let chefBookingRequestComplexity;
    let chefBookingRequestAdditionalServices;
    let chefBookingRequestTotalPriceValue;
    let chefBookingRequestTotalPriceUnit;
    let chefBookingRequestCommissionPriceUnit;
    let chefBookingRequestCommissionPriceValue;
    let chefBookingRequestServiceChargePriceUnit;
    let chefBookingRequestServiceChargePriceValue;
    let kitchenEquipmentTypeIds;
    let combinedServiceCharge;
    let newChefBookingRequestTotalPriceValue;

    if (bookingData) {
      chefId = bookingData.chefId;
      customerId = bookingData.customerId;
      fromTime = bookingData.chefBookingFromTime;
      toTime = bookingData.chefBookingToTime;
      dishTypeId = bookingData.dishTypeDesc;
      summary = bookingData.chefBookingSummary;
    }
    if (bookingData.chefBookingDietaryRestrictionsTypeId) {
      dietaryRestrictionsTypesIds = bookingData.chefBookingDietaryRestrictionsTypeId;
      otherDietaryRestrictionsTypes = bookingData.chefBookingOtherDietaryRestrictionsTypes;
    }
    if (bookingData) {
      allergyTypeIds = bookingData.chefBookingAllergyTypeId;
      otherAllergyTypes = bookingData.chefBookingOtherAllergyTypes;
    }
    if (bookingData) {
      kitchenEquipmentTypeIds = bookingData.chefBookingKitchenEquipmentTypeId;
      otherKitchenEquipmentTypes = bookingData.chefBookingOtherKitchenEquipmentTypes;
    }
    chefBookingRequestNoOfPeople = parseInt(range - savedRange);
    chefBookingRequestComplexity =
      complexityValue >= savedComplexity ? complexityValue : savedComplexity;
    chefBookingRequestAdditionalServices =
      additionalServices.length > 0 ? JSON.stringify(additionalServices) : null;
    let bookingHistId = props.bookingDetails.paymentHistoriesByBookingHistId.nodes[0].bookingHistId;
    let price = valuePrice ? valuePrice : savedPrice;
    chefBookingRequestTotalPriceValue = Math.abs(price - savedPrice);
    chefBookingRequestTotalPriceValue;
    chefBookingRequestCommissionPriceValue = Math.abs(commissionAmount - savedCommision).toFixed(2);
    chefBookingRequestTotalPriceUnit = 'USD';
    combinedServiceCharge =
      parseFloat(chefBookingRequestCommissionPriceValue) +
      bookingData.chefBookingStripeCommissionPriceValue;
    newChefBookingRequestTotalPriceValue =
      chefBookingRequestTotalPriceValue - combinedServiceCharge;
    // let complexity =
    if (chefBookingRequestComplexity >= 0 && savedRange <= range) {
      let variables = {
        bookingHistId,
        chefId,
        customerId,
        chefBookingRequestNoOfPeople,
        chefBookingRequestComplexity,
        chefBookingRequestAdditionalServices,
        chefBookingRequestServiceChargePriceUnit: '%',
        chefBookingRequestServiceChargePriceValue: bookingData.chefBookingServiceChargePriceValue,
        hefBookingRequestStripeCommissionPriceUnit: 'USD',
        chefBookingRequestStripeCommissionPriceValue:
          bookingData.chefBookingStripeCommissionPriceValue,
        chefBookingRequestTotalPriceUnit,
        chefBookingRequestCommissionPriceUnit: 'USD',
        chefBookingRequestCommissionPriceValue: combinedServiceCharge,
        chefBookingRequestPriceValue: chefBookingRequestTotalPriceValue,
        chefBookingRequestPriceUnit: 'USD',
        chefBookingRequestTotalPriceUnit: 'USD',
        chefBookingRequestServiceChargePriceValue: serviceAmount,
        chefBookingRequestTotalPriceValue: newChefBookingRequestTotalPriceValue,
      };
      bookingRequestDataTag({
        variables,
      });
    } else {
      if (savedRange > range) {
        toastMessage('error', 'Number of guests should be greater than previously selected guests');
      } else
        toastMessage('error', 'Complexity should be greater than previously selecteed complexity');
    }
  }

  // function onSelectCheckbox(value, index) {
  //   let newVal = JSON.parse(ProfileDetails.chefAdditionalServices);
  //   let checkArray = additionalServices;
  //   if (checkArray.length === 0) {
  //     checkArray.push(newVal[index]);
  //     setAdditionalServices(checkArray);
  //   } else {
  //     newVal.map(value, i => {
  //       if (value.service !== newVal[index].service) {
  //         checkArray.push(value);
  //       }
  //       if (newVal.length === i - 1) {
  //         setAdditionalServices(checkArray);
  //       }
  //     });
  //   }
  // }

  function onChangeNotes(e) {
    setNotesValue(e.target.value);
  }

  function onSelectCheckbox(value, index) {
    let newVal = JSON.parse(ProfileDetails.chefAdditionalServices);
    let deleteArray = isvaluePresent;
    deleteArray[index] = !isvaluePresent[index];
    setAdditionalServices(deleteArray);

    deleteArray.map((res, index) => {
      if (res) {
        let parsePrice = parseInt(newVal[index].price);
        newVal[index].price = parsePrice;
        sampleArray.push(newVal[index]);
      }
    });
    setAdditionalServices(sampleArray);
  }

  function onChangeNotes1(e) {
    let newVal = e.target.value;
    if (newVal) {
      setOtherStoreDecription(newVal);
    } else {
      setOtherStoreDecription(null);
    }
  }

  function onChangeSummaryNotes(e) {
    let newVal = e.target.value;
    if (newVal) {
      setBookingSummary(newVal);
    } else {
      setBookingSummary(null);
    }
  }

  function selectedValue(event) {
    let storeVal = event.target.value.trim();
    if (storeVal === 'OTHERS') {
      setOtherStoreValue(true);
    } else {
      setOtherStoreValue(false);
    }
    let newVal = [];
    newVal.push(event.target.value);
    setStoreValue(newVal);
  }
  function onCheckboxClicked(value, checkbox, state, type) {
    setComplexity(value);
    if (type === 'multiple1') {
      // checkbox(!state);
      setmultiple1(true);
      setmultiple2(false);
      setmultiple3(false);
    } else if (type === 'multiple2') {
      setmultiple1(false);
      setmultiple2(true);
      setmultiple3(false);
    } else if (type === 'multiple3') {
      setmultiple1(false);
      setmultiple2(false);
      setmultiple3(true);
    }
    // checkbox(!state);
  }

  function handleDishCreateOption(value) {
    let customerId = bookingData.customerId;
    insertNewDish({
      variables: {
        dishTypeName: value,
        dishTypeDesc: value,
        chefId: null,
        customerId: customerId,
      },
    });
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

  function onClickNext() {
    //setShowAgreement(false);
    let values = {};
    props.pricingIntroFormCallBack(values);
  }

  function selectedDishesview() {
    return (
      <div className="form-group">
        <label className="label">{'DISHES'}</label>
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

  function closePriceModal() {
    setIsOpen(false);
    if (props.onCloseBookingModal) {
      props.onCloseBookingModal();
    }
  }

  function backPricingIntroFormCallBack() {
    props.backPricingIntroFormCallBack();
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
          {showAgreement === true && (
            <div>
              <section
                className={`products-collections-area ptb-40 
           ${props.screen === 'register' ? 'base-rate-info' : ''}`}
                id="sction-card-modal"
              >
                <div style={{ paddingLeft: '2%' }}>
                  <div>
                    <h5
                      style={{
                        color: '#08AB93',
                        fontSize: '20px',
                        textDecoration: 'underline',
                        paddingBottom: '1%',
                      }}
                    >
                      Pricing Model
                    </h5>
                    <p style={{ fontSize: '17px' }}>
                      At Rockoly, our goal is to provide fair, transparent pricing for the customer
                      while maintaining a trustworthy platform for consumer to chef interaction.{' '}
                      <br />
                    </p>
                    <h5
                      style={{
                        color: '#08AB93',
                        fontSize: '20px',
                        textDecoration: 'underline',
                        paddingBottom: '1%',
                      }}
                    >
                      {' '}
                      Our customer pricing is driven by:
                    </h5>
                    <ul style={{ paddingLeft: '17px' }}>
                      <li className="intro-list">Base rate. </li>
                      <li className="intro-list">Amount of people.</li>
                      <li className="intro-list">Complexity of the menu.</li>
                      <li className="intro-list">Additional services.</li>
                    </ul>
                    <p style={{ fontSize: '17px' }}>
                      We have created a pricing model that is based on the skill and creativity of
                      the chef, not on the cost of ingredients or event type. Ingredient cost is a
                      separate expense and is paid by the customer once purchasing receipts are
                      provided.
                    </p>
                    <p style={{ fontSize: '17px' }}>
                      By upholding the integrity of our unique pricing model and user friendly
                      environment, we strive to provide a gourmet, one of a kind experience for
                      everyone involved.
                    </p>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div className="backbutton-modal-view">
                      <button
                        className="btn btn-primary"
                        id="submit-modal-button"
                        onClick={() => backPricingIntroFormCallBack()}
                      >
                        Back
                      </button>
                    </div>
                    <div className="save-button-modalsss">
                      {props.screenName === 'booking' && (
                        <button
                          className="btn btn-primary"
                          id="submit-modal-button"
                          onClick={() => onClickNext()}
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </Modal>
      </div>
    );
  } catch (error) {
    console.log('error', error);
  }
};

export default PricingIntroModal;
