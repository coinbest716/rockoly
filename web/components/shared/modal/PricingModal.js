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

const createOrSaveBooking = gqlTag.mutation.booking.createOrSaveBookingGQLTAG;
const CREATE_OR_STORE_BOOKING = gql`
  ${createOrSaveBooking}
`;

const PricingModal = props => {
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
  const [showAgreement, setShowAgreement] = useState(
    props.screenName === 'booking' ? false : false
  );
  const [bookingDetail, setBookingDetail] = useState({});
  const [storeDisplayList, setStoreDisplayList] = useState([]);

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

  useEffect(() => {
    let val = [];
    let data = props.bookingDetail;
    if (util.isObjectEmpty(data)) {
      setBookingDetail(data);
      setSavedRange(data.chefBookingNoOfPeople);
      if (
        util.hasProperty(data, 'additionalServiceDetails') &&
        util.isStringEmpty(data.additionalServiceDetails)
      ) {
        JSON.parse(data.additionalServiceDetails).map(value => {
          val.push(value.id);
        });
        setSavedService(val);
      }
      setSavedComplexity(data.chefBookingComplexity);
      setSavedCommision(data.chefBookingCommissionPriceValue);
      // setValuePrice(data.chefBookingPriceValue);
      setSavedPrice(data.chefBookingPriceValue);
      setAdditionalServices(
        data.chefBookingAdditionalServices ? JSON.parse(data.chefBookingAdditionalServices) : null
      );
      // if (util.isArrayEmpty(data.chefBookingStoreTypeId)) {
      //   // setSavedStore(data.chefBookingStoreTypeId[0]);
      //   console.log('data.chefBookingStoreTypeId', data.chefBookingStoreTypeId);
      //   setStoreValue(data.chefBookingStoreTypeId);
      // }

      if (data.chefBookingComplexity === 1) {
        setSavedComplexity(1);
        setComplexity(1);
        setmultiple1(true);
        setmultiple2(false);
        setmultiple3(false);
      } else if (data.chefBookingComplexity === 1.5) {
        setSavedComplexity(1.5);
        setComplexity(1.5);
        setmultiple2(true);
        setmultiple1(false);
        setmultiple3(false);
      } else if (data.chefBookingComplexity === 2) {
        setSavedComplexity(2);
        setComplexity(2);
        setmultiple1(false);
        setmultiple2(false);
        setmultiple3(true);
      }
    }
  }, [props.bookingDetail]);

  useEffect(() => {
    let data = props.bookingDetail;
    let temp = [];
    if (
      util.isObjectEmpty(data) &&
      util.hasProperty(data.storeTypes, 'nodes') &&
      util.isArrayEmpty(data.storeTypes.nodes)
    ) {
      let value = data.storeTypes.nodes[0].storeTypeId.trim();
      storeList.map((item, key) => {
        if (item.storeTypeId.trim() === value) {
          const obj = {
            storeTypeId: item.storeTypeId,
            storeTypeName: item.storeTypeName,
            storeTypeDesc: item.storeTypeDesc,
            isFoundDraft: true,
          };

          temp.push(obj);
        } else {
          const obj = {
            storeTypeId: item.storeTypeId,
            storeTypeName: item.storeTypeName,
            storeTypeDesc: item.storeTypeDesc,
            isFoundDraft: false,
          };
          temp.push(obj);
        }
      });
      setStoreDisplayList(temp);
      if (value === 'OTHERS') {
        setOtherStoreValue(true);
        setOtherStoreDecription(
          data.chefBookingOtherStoreTypes ? JSON.parse(data.chefBookingOtherStoreTypes) : null
        );
      }
    }
  }, [props.bookingDetail, storeList]);

  useEffect(() => {
    let data = props.bookingDetail;
    let serviceData = [];
    if (
      util.isObjectEmpty(data) &&
      util.hasProperty(data, 'chefProfileByChefId') &&
      util.isObjectEmpty(data.chefProfileByChefId)
    ) {
      let temp = false;
      let detail = data.chefProfileByChefId;
      if (
        util.hasProperty(detail, 'chefProfileExtendedsByChefId') &&
        util.isObjectEmpty(detail.chefProfileExtendedsByChefId) &&
        util.hasProperty(detail.chefProfileExtendedsByChefId, 'nodes')
      ) {
        let count = 0;
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
          if (
            util.hasProperty(data, 'additionalServiceDetails') &&
            util.isStringEmpty(data.additionalServiceDetails)
          ) {
            let dataService = JSON.parse(data.additionalServiceDetails);
            let fullService = JSON.parse(
              detail.chefProfileExtendedsByChefId.nodes[0].additionalServiceDetails
            );

            fullService.map((item, key) => {
              dataService.map((val, index) => {
                if (val.id.trim() === item.id.trim()) {
                  temp = true;
                } else {
                  temp = false;
                }
              });
              serviceData.push(temp);
            });

            setIsValuePresent(serviceData);
          }
        } else {
          setAvailableService([]);
        }
      }
    } else {
      setProfileDetails([]);
    }
  }, [props.bookingDetail]);

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
    let temp = [];
    let serviceData = [];
    if (props.bookingDetails && util.isObjectEmpty(props.bookingDetails)) {
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

      if (
        util.isObjectEmpty(props.bookingDetails) &&
        util.hasProperty(props.bookingDetails, 'chefProfileByChefId') &&
        util.isObjectEmpty(props.bookingDetails.chefProfileByChefId)
      ) {
        let temp = false;
        let detail = props.bookingDetails.chefProfileByChefId;
        if (
          util.hasProperty(detail, 'chefProfileExtendedsByChefId') &&
          util.isObjectEmpty(detail.chefProfileExtendedsByChefId) &&
          util.hasProperty(detail.chefProfileExtendedsByChefId, 'nodes')
        ) {
          if (
            util.hasProperty(
              detail.chefProfileExtendedsByChefId.nodes[0],
              'additionalServiceDetails'
            ) &&
            util.isStringEmpty(
              detail.chefProfileExtendedsByChefId.nodes[0].additionalServiceDetails
            )
          ) {
            setAvailableService(
              JSON.parse(detail.chefProfileExtendedsByChefId.nodes[0].additionalServiceDetails)
            );
            if (
              util.hasProperty(props.bookingDetails, 'additionalServiceDetails') &&
              util.isStringEmpty(props.bookingDetails.additionalServiceDetails)
            ) {
              let dataService = JSON.parse(props.bookingDetails.additionalServiceDetails);
              let fullService = JSON.parse(
                detail.chefProfileExtendedsByChefId.nodes[0].additionalServiceDetails
              );
              fullService.map((item, key) => {
                dataService.map((val, index) => {
                  if (val.id.trim() === item.id.trim()) {
                    temp = true;
                  } else {
                    temp = false;
                  }
                });
                serviceData.push(temp);
              });
              setIsValuePresent(serviceData);
            }
          } else {
            setAvailableService([]);
          }
        }
      } else {
        setProfileDetails([]);
      }

      if (
        util.isObjectEmpty(props.bookingDetails) &&
        util.hasProperty(props.bookingDetails.storeTypes, 'nodes') &&
        util.isArrayEmpty(props.bookingDetails.storeTypes.nodes)
      ) {
        let value = props.bookingDetails.storeTypes.nodes[0].storeTypeId.trim();
        storeList.map((item, key) => {
          if (item.storeTypeId.trim() === value) {
            const obj = {
              storeTypeId: item.storeTypeId,
              storeTypeName: item.storeTypeName,
              storeTypeDesc: item.storeTypeDesc,
              isFoundDraft: true,
            };

            temp.push(obj);
          } else {
            const obj = {
              storeTypeId: item.storeTypeId,
              storeTypeName: item.storeTypeName,
              storeTypeDesc: item.storeTypeDesc,
              isFoundDraft: false,
            };
            temp.push(obj);
          }
        });
        setStoreDisplayList(temp);
        if (value === 'OTHERS') {
          setOtherStoreValue(true);
          setOtherStoreDecription(
            props.bookingDetails.chefBookingOtherStoreTypes
              ? JSON.parse(props.bookingDetails.chefBookingOtherStoreTypes)
              : null
          );
        }
      }
    } else {
      setBookingData([]);
      if (!util.isObjectEmpty(props.bookingDetail)) {
        let minGuest = ProfileDetails.noOfGuestsMin ? ProfileDetails.noOfGuestsMin : 1;
        setRange(minGuest);
        setStoreDisplayList(storeList);
      }
    }
  }, [props, storeList]);

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
    if (additionalServices && util.isArrayEmpty(additionalServices)) {
      additionalServices &&
        additionalServices.length > 0 &&
        additionalServices.map(value => {
          newValue = newValue + parseInt(value.price);
        });
      setAdditionalServicePrice(newValue);
    }
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
      let noOfGuest = ProfileDetails.noOfGuestsMin ? ProfileDetails.noOfGuestsMin : 1;
      setRange(savedRange && savedRange > 0 ? savedRange : noOfGuest);
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
    let temp = [];
    if (
      util.isObjectEmpty(listData) &&
      util.hasProperty(listData, 'data') &&
      util.isObjectEmpty(listData.data) &&
      util.hasProperty(listData.data, 'allStoreTypeMasters') &&
      util.isObjectEmpty(listData.data.allStoreTypeMasters) &&
      util.isArrayEmpty(listData.data.allStoreTypeMasters.nodes)
    ) {
      let val = listData.data.allStoreTypeMasters.nodes;
      val.map((item, key) => {
        const obj = {
          storeTypeId: item.storeTypeId,
          storeTypeName: item.storeTypeName,
          storeTypeDesc: item.storeTypeDesc,
          isFoundDraft: false,
        };
        temp.push(obj);
      });
      setStoreList(temp);
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

  const [createOrStore, response] = useMutation(CREATE_OR_STORE_BOOKING, {
    onCompleted: response => {
      let values = {
        noOfGuests: range !== null ? parseInt(range) : ProfileDetails.noOfGuestsMin,
        complexity: complexityValue,
        storeTypeIds: storeValue,
        otherStoreTypes: otherStoreDecription,
        additionalServices,
      };
      if (props.pricingFormCallBack) props.pricingFormCallBack(values, response);
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

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
        let variables = {
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
          fromTime: props.response.chef_booking_from_time
            ? props.response.chef_booking_from_time
            : null,
          toTime: props.response.chef_booking_to_time ? props.response.chef_booking_to_time : null,
          isDraftYn: true,
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
          otherDietaryRestrictionsTypes: props.response
            .chef_booking_other_dietary_restrictions_types
            ? JSON.stringify(props.response.chef_booking_other_dietary_restrictions_types)
            : null,
          kitchenEquipmentTypeIds: props.response.chef_booking_kitchen_equipment_type_id
            ? props.response.chef_booking_kitchen_equipment_type_id
            : null,
          otherKitchenEquipmentTypes: props.response.chef_booking_other_kitchen_equipment_types
            ? JSON.stringify(props.response.chef_booking_other_kitchen_equipment_types)
            : null,
          noOfGuests: range !== null ? parseInt(range) : ProfileDetails.noOfGuestsMin,
          complexity: complexityValue,
          storeTypeIds: storeValue ? storeValue : null,
          otherStoreTypes: otherStoreDecription ? JSON.stringify(otherStoreDecription) : null,
          additionalServices: additionalServices ? additionalServices : null,
          dishTypeId:
            bookingDetail && bookingDetail.chefBookingDishTypeId
              ? bookingDetail.chefBookingDishTypeId
              : null,
        };

        createOrStore({ variables });
        // if (props.pricingFormCallBack) props.pricingFormCallBack(values);
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

  function backPricingFormCallBack() {
    if (props.backPricingFormCallBack) props.backPricingFormCallBack();
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
    let newVal;

    if (util.isArrayEmpty(JSON.parse(ProfileDetails.chefAdditionalServices))) {
      newVal = JSON.parse(ProfileDetails.chefAdditionalServices);
    }

    let deleteArray = isvaluePresent;
    if (isvaluePresent[index] === false && props.screen === 'request') {
      deleteArray[index] = !isvaluePresent[index];
      setIsValuePresent(deleteArray);
    } else {
      deleteArray[index] = !isvaluePresent[index];
      setIsValuePresent(deleteArray);
    }

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
    if (util.isObjectEmpty(props.bookingDetails) && props.screen === 'request') {
      if (value < props.bookingDetails.chefBookingComplexity) {
        toastMessage('error', 'Complexity should be greater than previously selected complexity');
      } else {
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
      }
    } else {
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
    setShowAgreement(false);
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

  function backAllergyFormCallBack() {
    props.backAllergyFormCallBack();
  }

  try {
    return (
      <div className="pricing-modal-container">
        <Modal
          open={Isopen}
          id="inactive"
          center
          onClose={closePriceModal}
          style={{ width: '40%' }}
          closeOnOverlayClick={false}
        >
          {showAgreement === false && (
            <div className="login-content">
              <div className="section-title" id="booking-modal-title">
                <h2 style={{ fontSixe: '22px' }}>Pricing Page</h2>
              </div>
              <form className="signup-form">
                <div className="form-group">
                  <div style={{ display: 'flex' }}>
                    <div className="form-group col-lg-4" style={{ paddingLeft: '0px' }}>
                      <label className="label">Chef Base Rate:</label>
                    </div>
                    <div className="col-lg-6">$ {ProfileDetails.chefPricePerHour}</div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div className="form-group col-lg-4" style={{ paddingLeft: '0px' }}>
                      <label className="label">Number of Guests:</label>
                    </div>
                    <div className="col-lg-6">
                      <div style={{ paddingRight: '2%' }}>
                        <input
                          style={{ marginRight: '4%' }}
                          type="range"
                          min={ProfileDetails.noOfGuestsMin ? ProfileDetails.noOfGuestsMin : 1}
                          max={ProfileDetails.noOfGuestsMax ? ProfileDetails.noOfGuestsMax : 150}
                          value={range}
                          className="slider"
                          id="myRange"
                          onChange={event => {
                            event.persist();
                            setRange(parseInt(event.target.value));
                          }}
                        ></input>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            {ProfileDetails.noOfGuestsMin ? ProfileDetails.noOfGuestsMin : 1}
                          </div>
                          <div>{range}</div>
                          <div>
                            {ProfileDetails.noOfGuestsMax ? ProfileDetails.noOfGuestsMax : 150}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {util.isStringEmpty(ProfileDetails.chefComplexity) && (
                    <div className="form-group" id="bookingDetail">
                      <label className="label">Select Complexity</label>
                      <div>
                        <div
                          className="col-lg-12"
                          id="complexity-booking-modal"
                          style={{ display: 'flex' }}
                        >
                          {JSON.parse(ProfileDetails.chefComplexity) &&
                            JSON.parse(ProfileDetails.chefComplexity).map((data, index) => {
                              if (data.complexcityLevel === '1X') {
                                return (
                                  <div className="col-lg-4" id="availabilityRow">
                                    <div>
                                      <div className="buy-checkbox-btn" id="checkBoxView">
                                        <div className="item">
                                          <input
                                            className="inp-cbx"
                                            id="1X"
                                            type="radio"
                                            name="radio-group1"
                                            // onClick={() => setComplexityFunc(1.5)}
                                            checked={multiple1}
                                            onChange={() =>
                                              onCheckboxClicked(
                                                1,
                                                setmultiple1,
                                                multiple1,
                                                'multiple1'
                                              )
                                            }
                                          />
                                          <label className="cbx" htmlFor="1X">
                                            <span>
                                              <svg width="12px" height="10px" viewBox="0 0 12 10">
                                                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                              </svg>
                                            </span>
                                            <span>1X</span>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="" style={{ display: 'flex' }}>
                                        <label style={{ marginTop: '1px' }}> Dishes : </label>
                                        <p style={{ fontSize: '14px', marginLeft: '2px' }}>
                                          {data.dishes ? data.dishes : ''}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="" style={{ display: 'flex' }}>
                                        <div style={{ marginTop: '1px' }}>
                                          Between{' '}
                                          {data.noOfItems
                                            ? data.noOfItems.min
                                              ? data.noOfItems.min
                                              : 0
                                            : ''}{' '}
                                          -{' '}
                                          {data.noOfItems
                                            ? data.noOfItems.max
                                              ? data.noOfItems.max
                                              : 0
                                            : ''}{' '}
                                          Menu Items{' '}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              if (data.complexcityLevel === '1.5X') {
                                return (
                                  <div className="col-lg-4" id="availabilityRow">
                                    <div>
                                      <div className="buy-checkbox-btn" id="checkBoxView">
                                        <div className="item">
                                          <input
                                            className="inp-cbx"
                                            id="1.5X"
                                            type="radio"
                                            name="radio-group1"
                                            // onClick={() => setComplexityFunc(1.5)}
                                            checked={multiple2}
                                            style={{ marginRight: '4%' }}
                                            onChange={() =>
                                              onCheckboxClicked(
                                                1.5,
                                                setmultiple2,
                                                multiple2,
                                                'multiple2'
                                              )
                                            }
                                          />
                                          <label className="cbx" htmlFor="1.5X">
                                            <span>
                                              <svg width="12px" height="10px" viewBox="0 0 12 10">
                                                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                              </svg>
                                            </span>
                                            <span>1.5X</span>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="" style={{ display: 'flex' }}>
                                        <label style={{ marginTop: '1px' }}>
                                          Desired Dishes :{' '}
                                        </label>
                                        <p style={{ fontSize: '14px', marginLeft: '2px' }}>
                                          {data.dishes ? data.dishes : ''}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="" style={{ display: 'flex' }}>
                                        <div style={{ marginTop: '1px' }}>
                                          Between{' '}
                                          {data.noOfItems
                                            ? data.noOfItems.min
                                              ? data.noOfItems.min
                                              : 0
                                            : ''}{' '}
                                          -{' '}
                                          {data.noOfItems
                                            ? data.noOfItems.max
                                              ? data.noOfItems.max
                                              : 0
                                            : ''}{' '}
                                          Menu Items{' '}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              if (data.complexcityLevel === '2X') {
                                return (
                                  <div className="col-lg-4" id="availabilityRow">
                                    <div>
                                      <div className="  buy-checkbox-btn" id="checkBoxView">
                                        <div className="item">
                                          <input
                                            className="inp-cbx"
                                            id="2X"
                                            type="radio"
                                            name="radio-group1"
                                            // onClick={() => setComplexityFunc(2)}
                                            checked={multiple3}
                                            onChange={() =>
                                              onCheckboxClicked(
                                                2,
                                                setmultiple3,
                                                multiple3,
                                                'multiple3'
                                              )
                                            }
                                          />
                                          <label className="cbx" htmlFor="2X">
                                            <span>
                                              <svg width="12px" height="10px" viewBox="0 0 12 10">
                                                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                              </svg>
                                            </span>
                                            <span>2X</span>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="" style={{ display: 'flex' }}>
                                        <label style={{ marginTop: '1px' }}>
                                          Desired Dishes :{' '}
                                        </label>
                                        <p style={{ fontSize: '14px', marginLeft: '2px' }}>
                                          {data.dishes ? data.dishes : ''}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="" style={{ display: 'flex' }}>
                                        <div className="" style={{ display: 'flex' }}>
                                          <div style={{ marginTop: '1px' }}>
                                            Between{' '}
                                            {data.noOfItems
                                              ? data.noOfItems.min
                                                ? data.noOfItems.min
                                                : 0
                                              : ''}{' '}
                                            -{' '}
                                            {data.noOfItems
                                              ? data.noOfItems.max
                                                ? data.noOfItems.max
                                                : 0
                                              : ''}{' '}
                                            Menu Items{' '}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            })}
                        </div>
                      </div>
                    </div>
                  )}
                  {availableService.length > 0 && (
                    <div className="form-group" id="bookingDetail">
                      <label className="label">Select Additional Services Provided by Chef</label>
                      {availableService.map((data, index) => {
                        return (
                          <div>
                            <div className="col-lg-12" style={{ display: 'flex' }}>
                              <div className="col-lg-6">
                                <div
                                  className="buy-checkbox-btn"
                                  id="checkBoxView"
                                  style={{ display: 'flex' }}
                                >
                                  <div className="item">
                                    <input
                                      className="inp-cbx"
                                      id={data.name}
                                      type="checkbox"
                                      checked={isvaluePresent[index]}
                                      onClick={() => onSelectCheckbox(data, index)}
                                    />
                                    {/* savedAllergies.includes(res.allergyTypeId) */}
                                    <label className="cbx" htmlFor={data.name}>
                                      <span>
                                        <svg width="12px" height="10px" viewBox="0 0 12 10">
                                          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                        </svg>
                                      </span>
                                      <span>
                                        <p
                                          style={{
                                            textTransform: 'capitalize !important',
                                            // whiteSpace: 'no-wrap',
                                            // overflow: 'hidden',
                                            // textOverflow: 'elipsis',
                                          }}
                                        >
                                          {data.name}
                                        </p>
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <label>$ {data.price}</label>
                              </div>
                            </div>
                          </div>
                          // </div>
                          // </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <br />
                <span>
                  You will be provided with receipt for the cost of ingredients by your chef from
                  following store.
                </span>
                <br />
                <div className="form-group">
                  <div className="modal-containar-view" style={{ display: 'flex' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <label for="sel1" style={{ width: 'max-content' }}>
                        Select Store
                      </label>
                    </div>
                    <div className="col-lg-6">
                      <select
                        className="form-control"
                        id="sel1"
                        onChange={event => {
                          event.persist();
                          selectedValue(event);
                        }}
                      >
                        {storeDisplayList &&
                          storeDisplayList.map(store => {
                            return (
                              <option
                                value={store.storeTypeId}
                                selected={store.isFoundDraft === true ? true : false}
                              >
                                {store.storeTypeDesc}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  </div>
                  <br />
                </div>
                {otherStoreValue === true && (
                  <div className="form-group" style={{ display: 'flex' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <label className="label" style={{ width: '47%' }}>
                        Mention store
                      </label>
                    </div>
                    <textarea
                      style={{ border: '1px solid' }}
                      type="text"
                      className="form-control booking_notes"
                      placeholder={'Please specify other shop name'}
                      rows="2"
                      id="notes2"
                      name="notes2"
                      required={false}
                      value={otherStoreDecription}
                      onChange={e => onChangeNotes1(e)}
                      data-error="Enter store name"
                      style={{ width: '47%', marginLeft: '6px' }}
                    />
                  </div>
                )}

                {props.screen === 'request' && (
                  <div className="basicInfoSave col-sm-2">
                    <button
                      type="submit"
                      onClick={event => onSaveChanges(event)}
                      className="btn btn-primary"
                      style={{ width: 'fit-content' }}
                    >
                      Save
                    </button>
                    <br />
                  </div>
                )}
                {/* {props.screen !== 'request' && (
                <div>
                  <CustomerCardList
                    type={'modal'}
                    closeModal={closeModal}
                    closeCardModal={closeCardModal}
                  />
                </div>
              )} */}
              </form>
              <div className="save-button-modal">
                {props.screenName === 'booking' && (
                  <button
                    style={{ marginRight: '1%' }}
                    className="btn btn-primary"
                    id="submit-modal-button"
                    onClick={backPricingFormCallBack}
                  >
                    Back
                  </button>
                )}
                <div>
                  {/* {paymentButtonEnable === false && (
                    <button type="submit" className="btn btn-primary" id="saveButton">
                      {S.SUBMIT}
                    </button>
                  )}
                  {paymentButtonEnable === true && (
                    <button type="submit" className="btn btn-primary" id="saveButton">
                      {S.RETRY_PAYMENT}
                    </button>
                  )} */}
                  {props.screenName === 'booking' && (
                    <button
                      className="btn btn-primary"
                      id="submit-modal-button"
                      onClick={() => nextClick()}
                    >
                      Next
                    </button>
                  )}
                </div>
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
          )}
        </Modal>
      </div>
    );
  } catch (error) {
    //console.log('error', error);
  }
};

export default PricingModal;
