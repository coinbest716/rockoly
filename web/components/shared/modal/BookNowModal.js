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
import { NavigateToBookongDetail } from './Navigation';
import moment from 'moment';
import { getLocalTime } from '../../../utils/DateTimeFormat';
import { createApolloClient } from '../../../apollo/apollo';

const listStoreTag = gqlTag.query.master.storeTypeGQLTAG;
//gql to get store list

const LIST_STORE = gql`
  ${listStoreTag}
`;

//chef
const chefDataTag = gqlTag.query.chef.profileByIdGQLTAG;
const checkBooking = gqlTag.query.booking.checkBookingByParamsGQLTAG;

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

const createOrSaveBooking = gqlTag.mutation.booking.createOrSaveBookingGQLTAG;
const CREATE_OR_STORE_BOOKING = gql`
  ${createOrSaveBooking}
`;

//Get dishes
const dishDataTag = gqlTag.query.master.dishByChefIdGQLTAG;
//for getting dish data
const GET_DISHES_DATA = gql`
  ${dishDataTag}
`;

// Create apollo client
const apolloClient = createApolloClient();

const BookNowModal = props => {
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
  const [notesValue, setNotesValue] = useState(null);
  const [dishesMasterList, setDishesMasterList] = useState([]);

  const [stripeId, setStripeId] = useState();
  const [customerCardId, setCardId] = useState();
  const [bookingDetail, setBookingDetail] = useState({});

  // const [getStoreData, listData] = useLazyQuery(LIST_STORE);CREATE_BOOKING

  const getDishesData = useQuery(GET_DISHES_DATA, {
    // getting image gallery based on chef id
    variables: { pChefId: props.chefId ? props.chefId : '' },
    onError: err => {
      toastMessage('renderError', err);
    },
  }); //get dishes data

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

  useEffect(() => {
    let val = [];
    let data = props.bookingDetail;
    if (util.isObjectEmpty(data)) {
      setBookingDetail(data);
    }
  }, [props.bookingDetail]);

  const [createOrStore, response] = useMutation(CREATE_OR_STORE_BOOKING, {
    onCompleted: response => {
      response = response.createOrSaveBooking.data;
      if (props.onClickNo) {
        props.onClickNo('closeAll');
      }
      closePriceModal();
      toastMessage(success, 'Booking created Successfully');
      let bookingDetail = response;
      NavigateToBookongDetail(bookingDetail);
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
      let bookingDetail = dishData.createBookingTest.data;
      NavigateToBookongDetail(bookingDetail);
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
        setDishesMasterList(data);
      });

      // setDishesMasterList(getDishesData.data.allDishTypeMasters.nodes);
    }
  }, [getDishesData]);

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
    if (ProfileDetails) {
      setRange(ProfileDetails.noOfGuestsMin);
      calculatePrice();
    }
  }, [ProfileDetails]);

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

  async function checkBookingExists(value) {
    let istFromTime = moment(getLocalTime(value.fromTime)).format();
    let istToTime = moment(getLocalTime(value.toTime)).format();

    const data = {
      pChefId: value.chefId,
      pFromTime: istFromTime,
      pToTime: istToTime,
      pGmtFromTime: value.fromTime,
      pGmtToTime: value.toTime,
    };

    //get value form db
    await apolloClient
      .query({
        query: gql`
          ${checkBooking}
        `,
        variables: data,
      })
      .then(result => {
        if (
          result &&
          result.data &&
          result.data.checkBookingByParams &&
          result.data.checkBookingByParams.message === 'No Booking On this Date'
        ) {
          // return true;
          createOrStore({
            variables: value,
          });
        }
      })
      .catch(error => {
        toastMessage('renderError', error);
      });
  }

  async function closeModal(values) {
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
      notes = notesValue != null ? JSON.stringify(notesValue) : null;
    }
    if (props.bookingLocation) {
      locationAddress = props.bookingLocation.locationAddress;
      locationLat = props.bookingLocation.locationLat;
      locationLng = props.bookingLocation.locationLng;
      addrLine1 = props.bookingLocation.addrLine1;
      addrLine2 = props.bookingLocation.addrLine2;
      state = props.bookingLocation.state;
      country = props.bookingLocation.country;
      city = props.bookingLocation.city;
      postalCode = props.bookingLocation.postalCode;
      summary = props.bookingLocation.bookingSummary;
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
    setStripeId(values.customer);
    setCardId(values.id);
    let variables = {
      stripeCustomerId: values.customer,
      cardId: values.id,
      chefId: props.response.chef_id ? props.response.chef_id : null,
      customerId: props.response.customer_id ? props.response.customer_id : null,
      locationAddress: props.response.chef_booking_location_address
        ? props.response.chef_booking_location_address
        : null,
      locationLat: props.response.chef_booking_location_lat
        ? props.response.chef_booking_location_lat
        : null,
      locationLng: props.response.chef_booking_location_lng
        ? props.response.chef_booking_location_lng
        : null,
      addrLine1: props.response.chef_booking_addr_line_1
        ? props.response.chef_booking_addr_line_1
        : null,
      addrLine2: props.response.chef_booking_addr_line_2
        ? props.response.chef_booking_addr_line_2
        : null,
      city: props.response.chef_booking_city ? props.response.chef_booking_city : null,
      state: props.response.chef_booking_state ? props.response.chef_booking_state : null,
      country: props.response.chef_booking_country ? props.response.chef_booking_country : null,
      postalCode: props.response.chef_booking_postal_code
        ? props.response.chef_booking_postal_code
        : null,
      bookingHistId: props.response.chef_booking_hist_id,
      dishTypeId: props.response.selectedDishesId ? props.response.selectedDishesId : null,
      fromTime: props.response.chef_booking_from_time
        ? props.response.chef_booking_from_time
        : null,
      toTime: props.response.chef_booking_to_time ? props.response.chef_booking_to_time : null,
      isDraftYn: false,
      summary: props.response.chef_booking_summary ? props.response.chef_booking_summary : null,
      allergyTypeIds: props.response.chef_booking_allergy_type_id
        ? props.response.chef_booking_allergy_type_id
        : null,
      otherAllergyTypes: props.response.chef_booking_other_allergy_types
        ? JSON.stringify(props.response.chef_booking_other_allergy_types)
        : null,
      dietaryRestrictionsTypesIds: props.response.chef_booking_dietary_restrictions_type_id
        ? props.response.chef_booking_dietary_restrictions_type_id
        : null,
      otherDietaryRestrictionsTypes: props.response.chef_booking_other_dietary_restrictions_types
        ? JSON.stringify(props.response.chef_booking_other_dietary_restrictions_types)
        : null,
      kitchenEquipmentTypeIds: props.response.chef_booking_kitchen_equipment_type_id
        ? props.response.chef_booking_kitchen_equipment_type_id
        : null,
      otherKitchenEquipmentTypes: props.response.chef_booking_other_kitchen_equipment_types
        ? JSON.stringify(props.response.chef_booking_other_kitchen_equipment_types)
        : null,
      noOfGuests: props.response.chef_booking_no_of_people
        ? props.response.chef_booking_no_of_people
        : null,
      complexity: props.response.chef_booking_complexity
        ? props.response.chef_booking_complexity
        : null,
      storeTypeIds: props.response.chef_booking_store_type_id
        ? props.response.chef_booking_store_type_id
        : null,
      otherStoreTypes: props.response.chef_booking_other_store_types
        ? JSON.stringify(props.response.chef_booking_other_store_types)
        : null,
      additionalServices: props.response.chef_booking_additional_services
        ? props.response.chef_booking_additional_services
        : null,
      dishTypeId: selectedDishesId ? selectedDishesId : null,
      notes: notesValue != null ? JSON.stringify(notesValue) : null,
    };
    // createOrStore({ variables });

    await checkBookingExists(variables);
    // setIsOpen(false);
  }

  function setComplexityFunc(value) {
    setComplexity(value);
  }

  function closeCardModal(values) {}

  function backbookNowFormCallBack() {
    props.backbookNowFormCallBack();
  }

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

  function onSaveChanges(event) {
    event.preventDefault();
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
      chefBookingRequestNoOfPeople,
      chefBookingRequestComplexity,
      chefBookingRequestAdditionalServices,
      chefBookingRequestTotalPriceValue,
      chefBookingRequestTotalPriceUnit,
      chefBookingRequestCommissionPriceUnit,
      chefBookingRequestCommissionPriceValue,
      chefBookingRequestServiceChargePriceUnit,
      chefBookingRequestServiceChargePriceValue;

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
    chefBookingRequestComplexity = complexityValue - savedComplexity;
    chefBookingRequestAdditionalServices =
      additionalServices.length > 0 ? JSON.stringify(additionalServices) : null;
    let bookingHistId = bookingData.chefBookingHistId;
    let price = valuePrice ? valuePrice : savedPrice;
    chefBookingRequestTotalPriceValue = Math.abs(price - savedPrice);
    chefBookingRequestTotalPriceValue;
    chefBookingRequestCommissionPriceValue = Math.abs(commissionAmount - savedCommision);
    chefBookingRequestTotalPriceUnit = 'USD';
    // let complexity =
    if (chefBookingRequestComplexity >= 0) {
      let variables = {
        bookingHistId,
        chefId,
        customerId,
        chefBookingRequestNoOfPeople,
        chefBookingRequestComplexity,
        chefBookingRequestAdditionalServices,
        chefBookingRequestTotalPriceValue,
        chefBookingRequestTotalPriceUnit,
        chefBookingRequestCommissionPriceUnit: 'USD',
        chefBookingRequestCommissionPriceValue,
        chefBookingRequestServiceChargePriceUnit: 'USD',
        chefBookingRequestServiceChargePriceValue: serviceAmount,
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

      bookingRequestDataTag({
        variables,
      });
    } else {
      toastMessage('error', 'Complexity should be greater than previously selected complexity');
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
      setmultiple2(true);
      setmultiple1(false);
      setmultiple3(false);
    } else if (type === 'multiple3') {
      setmultiple3(true);
      setmultiple1(false);
      setmultiple2(false);
    }
    // checkbox(!state);
  }

  function handleDishCreateOption(value) {
    console.log('handleDishCreateOption', props.response, props.bookingDetail);
    let customerId = '';
    if (util.isObjectEmpty(props.response)) {
      customerId = props.response.customer_id;
    } else {
      customerId = props.ProfileDetails.customerId;
    }

    insertNewDish({
      variables: {
        dishTypeName: value,
        dishTypeDesc: value,
        chefId: null,
        customerId: customerId ? customerId : null,
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

  function selectedDishesview() {
    return (
      <div className="form-group">
        <label className="label">{'DESIRED DISHES'}</label>
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

  function pricingDetails() {
    let chefDetail;

    if (props.ProfileDetails && util.isObjectEmpty(props.ProfileDetails)) {
      if (
        props.ProfileDetails &&
        props.ProfileDetails.chefProfileExtendedsByChefId &&
        props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0]
      ) {
        chefDetail = props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0];
      } else if (props.ProfileDetails) {
        chefDetail = props.ProfileDetails;
      }
    } else {
      if (props.bookingDetail) {
        chefDetail = props.bookingDetail.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0];
      }
    }

    if (chefDetail && util.isObjectEmpty(chefDetail)) {
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
      let chefValue = chefDetail;
      baseRate = chefValue.chefPricePerHour;
      noOfGuests = props.pricingForm ? props.pricingForm.noOfGuests : props.guest;
      complexity = props.pricingForm ? props.pricingForm.complexity : props.complexity;

      console.log('BookNowModal', props);
      additionalServices = props.pricingForm
        ? props.pricingForm.additionalServices
          ? additionalServiceCalc(props.pricingForm.additionalServices, 'old')
          : 0
        : 0;

      // return 'hi';
      if (noOfGuests <= 5) {
        price = baseRate;
        price = price * noOfGuests;
        price = price * complexity;
        price = price + additionalServices;
        serviceCharge = (serviceAmount / 100) * price;
        chefCharge = price + serviceCharge + firstfve + complexityCharge;
        // totalCharge = price + serviceCharge;
        // totalCharge = price + serviceCharge;
        totalCharge = price;
        firstfve = baseRate * noOfGuests;
        complexityCharge = firstfve * complexity - firstfve;
        return (
          <div className="card">
            <div className="card-header">
              <h4 style={{ color: '#08AB93', fontSize: '18px' }}>Billing Details</h4>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
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
                Chef Base Rate
              </div>
              <div className="col-lg-2">${baseRate ? baseRate.toFixed(2) : '-'}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
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
                  // justifyContent: 'flex-end',
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
                  // justifyContent: 'flex-end',
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
                  // fontWeight: 'bold',
                  display: 'flex',
                  // justifyContent: 'flex-end',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef base rate(${baseRate}) X {noOfGuests}
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-2">${firstfve.toFixed(2)} </div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  // fontWeight: 'bold',
                  display: 'flex',
                  // justifyContent: 'flex-end',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Complexity Upcharge
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-2">${complexityCharge.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  // fontWeight: 'bold',
                  display: 'flex',
                  // justifyContent: 'flex-end',
                  fontSize: '17px',
                  borderRight: '1px solid #D3D3D3',
                }}
              >
                Additional services
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
              <div className="col-lg-2"> ${additionalServices.toFixed(2)}</div>
            </div>
            {/* <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
              <div
                className="col-lg-10"
                style={{
                  // fontWeight: 'bold',
                  display: 'flex',
                  borderRight: '1px solid #D3D3D3',
                  // justifyContent: 'flex-end',
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
                // paddingTop: '5px',
                // paddingBottom: '5px',
              }}
            >
              <div
                className="col-lg-10"
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  // justifyContent: 'flex-end',
                  fontSize: '17px',
                  borderRight: '1px solid #D3D3D3',
                  // color: '#08AB93',
                }}
              >
                Total amount to pay
              </div>
              {/* </div> */}
              {/* <div style={{ display: 'flex' }}> */}
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
        // price = baseRate * noOfGuests;
        // price = price - (noOfGuests - 5) * (baseRate / 2);
        // price = price * complexity - price;
        // price = price + additionalServices;

        firstfve = baseRate * noOfGuests;
        afterFive = (noOfGuests - 5) * (baseRate / 2);
        complexityCharge = (firstfve - afterFive) * complexity - (firstfve - afterFive);
        price = firstfve - afterFive;
        price = price + complexityCharge;
        price = price + additionalServices;
        serviceCharge = (serviceAmount / 100) * price;
        totalCharge = price;
        remainingMemberCount = noOfGuests - 5;
        halfOfBaseRate = baseRate / 2;
        return (
          <div>
            <h4 style={{ color: '#08AB93', fontSize: '18px' }}>Billing Details:</h4>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
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
                  // justifyContent: 'flex-end',
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
                  // justifyContent: 'flex-end',
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
                  // justifyContent: 'flex-end',
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
                  // justifyContent: 'flex-end',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Chef base rate(${baseRate}) X No.of.guests({noOfGuests})
              </div>
              <div className="col-lg-2">${firstfve.toFixed(2)}</div>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
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
                  // justifyContent: 'flex-end',
                  borderRight: '1px solid #D3D3D3',
                  fontSize: '17px',
                }}
              >
                Complexity Upcharge:
              </div>
              <div className="col-lg-2"> ${complexityCharge.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
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
                Additional services:
              </div>
              <div className="col-lg-2">${additionalServices.toFixed(2)}</div>
            </div>
            {/* <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
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
                Chef charge:{' '}
              </div>
              <div className="col-lg-2">${price.toFixed(2)}</div>
            </div> */}
            {/* <div style={{ display: 'flex', borderBottom: '1px solid #D3D3D3' }}>
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
                Rockoly charge:{' '}
              </div>
              <div className="col-lg-2">${serviceCharge.toFixed(2)}</div>
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
              <div className="col-lg-2">${totalCharge.toFixed(2)}</div>
            </div>
          </div>
        );
      }
    }
  }

  function closePriceModal() {
    setIsOpen(false);
    if (props.onCloseBookingModal) {
      props.onCloseBookingModal();
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
              <h2 style={{ fontSixe: '22px' }}>Pricing Page</h2>
            </div>
            <form className="signup-form">
              {props.screen != 'profile' && (
                <div>
                  {selectedDishesview()}
                  <div className="form-group">
                    <label className="label">{'BOOKING REQUEST NOTES'}</label>
                    <textarea
                      style={{ border: '1px solid' }}
                      type="text"
                      className="form-control booking_notes"
                      placeholder={
                        'Please enter dish names you wanna to cook. It will be displayed to chef and he/she may reply with list of ingredients. Thanks'
                      }
                      rows="4"
                      id="notes1"
                      name="notes1"
                      required={false}
                      value={notesValue}
                      onChange={e => onChangeNotes(e)}
                      data-error="Please enter notes"
                    />
                  </div>
                </div>
              )}
              {/* <div className="form-group" style={{ display: 'flex' }}>
                <div className="col-lg-6">
                  <label className="label">Chef Service Cost: </label>
                </div>
                <div className="col-lg-6"></div>
              </div>
              <div className="form-group" style={{ display: 'flex' }}>
                <div className="col-lg-6">
                  <label className="label">Complexity: </label>
                </div>
                <div className="col-lg-6"></div>
              </div>
              <div className="form-group" style={{ display: 'flex' }}>
                <div className="col-lg-6">
                  <label className="label">No of Guests: </label>
                </div>
                <div className="col-lg-6"></div>
              </div>
              <h4>Billing Details</h4>
              
              {/* <div className="form-group" style={{ display: 'flex' }}>
                <div className="col-lg-6" style={{ display: 'flex', alignItems: 'center' }}>
                  <label className="label" style={{ width: 'max-content' }}>
                    Summary
                  </label>
                </div>
                <div className="col-lg-6">
                  <textarea
                    type="text"
                    className="form-control booking_notes"
                    placeholder={'Add summary'}
                    rows="2"
                    id="notes"
                    name="notes"
                    required={false}
                    value={bookingSummary}
                    onChange={e => onChangeSummaryNotes(e)}
                    data-error="Add summary"
                  />
                </div>
              </div> */}
              {pricingDetails()}

              {props.screen !== 'request' && props.screen !== 'profile' && (
                <div>
                  <CustomerCardList
                    type={'modal'}
                    closeModal={closeModal}
                    closeCardModal={closeCardModal}
                  />
                </div>
              )}
            </form>
            <div className="save-button-modal">
              {props.screenName === 'booking' && (
                <button
                  className="btn btn-primary"
                  id="submit-modal-button"
                  onClick={backbookNowFormCallBack}
                >
                  Back
                </button>
              )}
              {/* {props.screenName === 'booking' && (
                <button
                  className="btn btn-primary"
                  id="submit-modal-button"
                  onClick={() => submitForm()}
                >
                  submit
                </button>
              )} */}
            </div>
          </div>
        </Modal>
      </div>
    );
  } catch (error) {
    //console.log('error', error);
  }
};

export default BookNowModal;
