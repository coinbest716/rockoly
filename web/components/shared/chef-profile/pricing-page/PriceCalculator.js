import React, { useState, useEffect, useRef, useContext } from 'react';
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import Modal from 'react-responsive-modal';
import Router from 'next/router';
import CalculatePrice from './CalculatePrice';
import gql from 'graphql-tag';
import * as gqlTag from '../../../../common/gql';
import * as util from '../../../../utils/checkEmptycondition';
import { priceCalculator } from '../../../../utils/priceCalculator';
import { toastMessage, success, renderError, error } from '../../../../utils/Toast';
import CreatableSelect from 'react-select/creatable';
import CustomerCardList from '../../../payments/components/CustomerCardList';
import _ from 'lodash';
import { NavigateToProfile } from './Navigation';

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

const PriceCalculator = props => {
  let sampleArray = [];
  const dishesRef = useRef();
  const [Isopen, setIsOpen] = useState(true);
  const [ProfileDetails, setProfileDetails] = useState([]);
  const [chefId, setChefId] = useState();
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
  const [showAgreement, setShowAgreement] = useState(props.screenName === 'booking' ? true : false);

  const [calculatePriceYn, setcalculatePriceYn] = useState(true);
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
      console.log("chefId,setChefId", chefData);
      setChefId(chefData.chefId);
      setChefSavedDishes(util.isArrayEmpty(data.chefDishTypeId) ? data.chefDishTypeId : []);
      // setSelectedDishesId(util.isArrayEmpty(data.chefDishTypeId) ? data.chefDishTypeId : []);
    }
  }, [props.ProfileDetails]);

  const [bookingRequestDataTag, requestData] = useMutation(EDIT_BOOKING, {
    onCompleted: data => {
      // console.log('data', data);
      if (props.onClickNo) {
        props.onClickNo();
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
    let service = [];
    if (
      util.isObjectEmpty(chefData) &&
      util.hasProperty(chefData, 'data') &&
      util.isObjectEmpty(chefData.data) &&
      util.hasProperty(chefData.data, 'chefProfileByChefId') &&
      util.isObjectEmpty(chefData.data.chefProfileByChefId)
    ) {
      let detail = chefData.data.chefProfileByChefId;
      setmultiple1(true);
      setmultiple2(false);
      setmultiple3(false);
      setComplexity(1);
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
          JSON.parse(detail.chefProfileExtendedsByChefId.nodes[0].additionalServiceDetails).map(
            data => {
              service.push(data.id);
            }
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
    console.log("additionalServices", additionalServices)
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
    if (props.ProfileDetails && props.ProfileDetails.chefProfileExtendedsByChefId.nodes) {
      let details = props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0];
      setProfileDetails(details);
      if (
        util.hasProperty(details, 'additionalServiceDetails') &&
        util.isStringEmpty(details.additionalServiceDetails)
      ) {
        setAvailableService(JSON.parse(details.additionalServiceDetails));
      } else {
        setAvailableService([]);
      }
    }
  }, [props.ProfileDetails]);

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
      } else {
        toastMessage(renderError, 'Please select a store to complete booking');
      }
    } else {
      toastMessage(renderError, 'Please select complexity to complete booking');
    }
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

  function onSelectCheckbox(value, index) {
    let newVal = JSON.parse(ProfileDetails.chefAdditionalServices);
    let deleteArray = isvaluePresent;
    deleteArray[index] = !isvaluePresent[index];
    // setAdditionalServices(deleteArray);

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
  function onAddService(event) {
    event.preventDefault();
    // if (response) {
    let details = {
      key: 6,
    };
    NavigateToProfile(details);
    // }
    // NavigateToBookongDetail(newData);
  }
  function setValues(index, value) {
    let tempArray = availableService;
    tempArray[index].price = value;
    console.log("valuesssssss", tempArray)
    setAvailableService(tempArray);
  }
  function incrementValue(e) {
    e.preventDefault();
    if(range<ProfileDetails.noOfGuestsMax)
    setRange(range+1)
  }
 
  function decrementValue(e) {
    e.preventDefault();
    if(range>=ProfileDetails.noOfGuestsMin)
    setRange(range-1)
  }

  try {
    return (
      <div>
        {showAgreement === false && (
          <div className="login-content">
            <div style={{ marginTop: '5px', marginBottom: '5px' }} className="section-title" id="booking-modal-title">
              <h2 style={{ fontSixe: '22px' }}>Pricing Calculator</h2>
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
                    <div class="input-group">
                      <input type="button" value="-" class="button-minus" onClick={(event) =>  decrementValue(event)}data-field="quantity" />
                      <input type="number" step="1" min={ProfileDetails.noOfGuestsMin ? ProfileDetails.noOfGuestsMin : 1} 
                      max={ProfileDetails.noOfGuestsMax ? ProfileDetails.noOfGuestsMax : 150} 
                      value={range} name="quantity" class="quantity-field" onChange={event => {
                        event.persist();
                        setRange(parseInt(event.target.value));
                      }}/>
                      <input type="button" value="+" class="button-plus" data-field="quantity" onClick={(event) => incrementValue(event)}/>
                    </div>
                    {/* <div style={{ paddingRight: '2%' }}> */}
                    {/* <input
                        style={{ marginRight: '4%', width: '100%' }}
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
                      ></input> */}
                    {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>{ProfileDetails.noOfGuestsMin ? ProfileDetails.noOfGuestsMin : 1}</div>
                        <div>{range}</div>
                        <div>
                          {ProfileDetails.noOfGuestsMax ? ProfileDetails.noOfGuestsMax : 150}
                        </div>
                      </div> */}
                    {/* </div> */}
                  </div>
                </div>
                {util.isStringEmpty(ProfileDetails.chefComplexity) && (
                  <div class="card">
                    <div class="card-header" id="booking-chef-details">
                      <label id="describe-booking">Select Complexity</label>
                    </div>

                    <div className="form-group" id="bookingDetail">
                      {/* <label className="label">Select Complexity</label> */}
                      <div>
                        <div
                          className="col-lg-12"
                          id="complexity-booking-modal"
                          style={{ display: 'flex' }}
                        >
                          {JSON.parse(ProfileDetails.chefComplexity) &&
                            JSON.parse(ProfileDetails.chefComplexity).map((data, index) => {
                              { console.log("ProfileDetails.chefComplexity", data) }
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
                                    <div></div>
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
                                        <label style={{ marginTop: '1px' }}> Dishes : </label>
                                        <p style={{ fontSize: '14px', marginLeft: '2px' }}>
                                          {data.dishes ? data.dishes : ''}
                                        </p>
                                      </div>
                                    </div>
                                    <div></div>
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
                                        <label style={{ marginTop: '1px' }}> Dishes : </label>
                                        <p style={{ fontSize: '14px', marginLeft: '2px' }}>
                                          {data.dishes ? data.dishes : ''}
                                        </p>
                                      </div>
                                    </div>
                                    <div></div>
                                  </div>
                                );
                              }
                            })}

                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {availableService.length > 0 ? (
                  <div class="card" style={{ marginTop: '3%' }}>
                    <div class="card-header" id="booking-chef-details">
                      <label>Select Additional Services</label>
                    </div>
                    <div className="form-group" id="bookingDetail">

                      {availableService.map((data, index) => {
                        return (
                          <div>
                            <div className="col-lg-12" style={{ display: 'flex', marginTop: '18px' }}>
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
                                      checked={
                                        savedService.includes(data.id)
                                          ? savedService.includes(data.id)
                                          : undefined
                                      }
                                      onClick={() => onSelectCheckbox(data, index)}
                                    />
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
                                          }}
                                        >
                                          {data.name}
                                        </p>
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6" style={{ display: 'flex', marginBottom: '18px' }}>
                                {/* <label>$ {data.price}</label> */}
                                <input type="text" class="form-control" onChange={() => setValues(index, event.target.value)} value={data.price}></input>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="saveAvailabilityButton" style={{ paddingRight: '2%' }}>
                      <button className="btn btn-primary" onClick={() => onAddService(event)}>
                      Edit Service
                      </button>
                    </div>
                  </div>
                ) :
                  <div class="card" style={{ marginTop: '3%' }}>
                    <div class="card-header" id="booking-chef-details">
                      <label>Select Additional Services </label>
                    </div>
                    <div className="saveButton" style={{ paddingRight: '2%' }}>
                      <button className="btn btn-primary" onClick={() => onAddService(event)}>
                        Edit Service
                      </button>
                    </div>
                    {/* onClick={() => handleSubmit()} */}
                    {/* <button className="btn btn-primary"></button> */}
                  </div>
                }
              </div>
              <br />
              {/* <span>
                You will be provided with receipt for the cost of ingredients by your chef from
                following stores.
                </span>
              <br /> */}
              {/* <div className="form-group">
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
                      {storeList &&
                        storeList.map(store => {
                          return <option value={store.storeTypeId}>{store.storeTypeDesc}</option>;
                        })}
                    </select>
                  </div>
                </div>
                <br />
              </div>
              {otherStoreValue === true && (
                <div className="form-group" style={{ display: 'flex' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="label" style={{ width: 'max-content' }}>
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
                    style={{ width: 'max-content' }}
                  />
                </div>
              )} */}
            </form>
            {/* <div className="save-button-modal">
              <div>

                <button
                  className="btn btn-primary"
                  id="submit-modal-button"
                  onClick={() => nextClick()}
                >
                  Calculate
                    </button>
              </div>
            </div> */}
            <br />
            {calculatePriceYn && (
              <CalculatePrice
                ProfileDetails={ProfileDetails}
                guest={range}
                complexity={complexityValue}
                chefId={props.chefId}
                additionalServices={additionalServices}
                screen="profile"
              />
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    //console.log('error', error);
  }
};

export default PriceCalculator;
