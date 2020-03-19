import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import moment from 'moment';
import Autocomplete from 'react-google-autocomplete';
import Select from 'react-select';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ModernDatepicker from 'react-modern-datepicker';
import * as gqlTag from '../../../common/gql';
import * as util from '../../../utils/checkEmptycondition';
import { toastMessage } from '../../../utils/Toast';
import { getCurrentMonth } from '../../../utils/DateTimeFormat';
import S from '../../booking-history/BookingHistory.String';
import DatePicker from 'react-datepicker';
import { subDays, addDays } from 'date-fns';
import '../../../assets/styles/datePicker/datepicker.scss';
import { getDateMonthYear } from '../../../utils/DateTimeFormat';
const cuisineDataTag = gqlTag.query.master.cuisineGQLTAG; // cuisine tag

const dishDataTag = gqlTag.query.master.dishGQLTAG; // dishes tag

//for getting cuisine data
const GET_CUISINE_DATA = gql`
  ${cuisineDataTag}
`;

//for getting dish data
const GET_DISHES_DATA = gql`
  ${dishDataTag}
`;

const LeftSidebar = props => {
  const [currentSelection, setCurrentSelection] = useState(false);
  const [collection, setCollection] = useState(false);
  const [brand, setBrand] = useState(false);
  const [size, setSize] = useState(false);
  const [price, setPrice] = useState(false);
  const [color, setColor] = useState(false);
  const [popular, setPopular] = useState(false);
  const [stars, setStars] = useState(false);
  const [pricerange, setRange] = useState(false);
  const [filterDishOptionValue, setDishFilterOptionValue] = useState(null);
  const [filterCuisineOptionValue, setCuisineFilterOptionValue] = useState(null);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [selectedCuisinesId, setSelectedCuisinesId] = useState([]);
  const [cusinesMasterList, setCuisinesMasterList] = useState([]);
  const [dishesMasterList, setDishesMasterList] = useState([]);
  const [selectedDishesId, setSelectedDishesId] = useState([]);
  const [minRange, setMinRange] = useState();
  const [maxRange, setMaxRange] = useState();
  const [location, setLocation] = useState();
  const [cuisineStateValue, setCuisineStateValue] = useState();
  const [experience, setExperience] = useState('');
  const [startTime, setstartTime] = useState(new Date());
  const [endTime, setendTime] = useState(getCurrentMonth(new Date()).toDate);
  const [time, setTime] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [fiveStar, setFiveStar] = useState(false);
  const [fourStar, setFourStar] = useState(false);
  const [threeStar, setThreeStar] = useState(false);
  const [noStar, setNoStar] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [firstChecked, setFirstChecked] = useState(false);
  const [secondChecked, setSecondChecked] = useState(false);
  const [thirdChecked, setthirdChecked] = useState(false);
  const [fourthChecked, setfourthChecked] = useState(false);
  const [zeroDollor, setZeroDollor] = useState(false);
  const [twentyDollor, setTwentyDollor] = useState(false);
  const [fourtyDollor, setFourtyDollor] = useState(false);
  const [sixtyDollor, setSixtyDollor] = useState(false);

  let cuisineValue, dishValue;
  let count = 0,
    dishCount = 0;
  const getCusineData = useQuery(GET_CUISINE_DATA, {
    onError: err => {
      toastMessage('renderError', err);
    },
  }); //get cuisine data
  const getDishesData = useQuery(GET_DISHES_DATA, {
    onError: err => {
      toastMessage('renderError', err);
    },
  }); // get dishes data

  useEffect(() => {
    // get all cusine types
    if (
      util.isObjectEmpty(getCusineData) &&
      util.hasProperty(getCusineData, 'data') &&
      util.isObjectEmpty(getCusineData.data) &&
      util.hasProperty(getCusineData.data, 'allCuisineTypeMasters') &&
      util.isObjectEmpty(getCusineData.data.allCuisineTypeMasters) &&
      util.isArrayEmpty(getCusineData.data.allCuisineTypeMasters.nodes)
    ) {
      let data = [];
      getCusineData.data.allCuisineTypeMasters.nodes.map((res, key) => {
        if (res) {
          let option = {
            label: res.cuisineTypeDesc,
            value: res.cuisineTypeId,
          };
          data.push(option);
        }
      });
      setCuisinesMasterList(data);
    }
  }, [getCusineData]);

  useEffect(() => {
    // get all dishes type
    if (
      util.isObjectEmpty(getDishesData) &&
      util.hasProperty(getDishesData, 'data') &&
      util.isObjectEmpty(getDishesData.data) &&
      util.hasProperty(getDishesData.data, 'allDishTypeMasters') &&
      util.isObjectEmpty(getDishesData.data.allDishTypeMasters) &&
      util.isArrayEmpty(getDishesData.data.allDishTypeMasters.nodes)
    ) {
      let data = [];
      getDishesData.data.allDishTypeMasters.nodes.map((res, key) => {
        if (res) {
          let option = {
            label: res.dishTypeDesc,
            value: res.dishTypeId,
          };
          data.push(option);
        }
      });

      setDishesMasterList(data);
    }
  }, [getDishesData]);

  function handleToggle(e, evt) {
    // handle open and close toggle
    e.preventDefault();

    if (evt == 'currentSelection') {
      setCurrentSelection(!currentSelection);
    } else if (evt == 'collection') {
      setCollection(!collection);
    } else if (evt == 'brand') {
      setBrand(!brand);
    } else if (evt == 'size') {
      setSize(!size);
    } else if (evt == 'price') {
      setPrice(!price);
    } else if (evt == 'color') {
      setColor(!color);
    } else if (evt == 'popular') {
      setPopular(!popular);
    } else if (evt == 'stars') {
      setStars(!stars);
    } else if (evt == 'pricerange') {
      setRange(!pricerange);
    } else if (evt == 'location') {
      setLocation(!location);
    } else if (evt == 'time') {
      setTime(!time);
    }
  }

  function onsetCuisineOption(value, stateAssign, stateAssignForId) {
    // passing cuisine type
    let cuisineOptionsArray = [],
      cuisineoptions = [],
      data = [];
    cuisineOptionsArray.push(value);
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
    cuisineOptionsArray.map(cuisineOption => {
      if (cuisineOption) {
        cuisineOption.map(cuisine => {
          if (count === 0) {
            cuisineValue = cuisine.value;
            // setCuisineStateValue(cuisine.value);
            // console.log("cuisineValue if",cuisineValue)cuisineStateValue,setCuisineStateValue
            count = count + 1;
          } else if (count !== 0) {
            cuisineValue = cuisineValue + ',' + cuisine.value;
          }
        });
      }
    });
    if (cuisineValue) {
      cuisineValue = '{' + cuisineValue + '}';
      setCuisineFilterOptionValue(cuisineValue);
    } else {
      setCuisineFilterOptionValue('');
    }
  }

  function onsetDishOption(value, stateAssign, stateAssignForId) {
    // passing dish type
    let dishOptionsArray = [],
      dishoptions = [],
      cuisineObject = {},
      data = [];
    dishOptionsArray.push(value);
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
    dishOptionsArray.map(dishOption => {
      if (dishOption) {
        dishOption.map(dish => {
          if (dishCount === 0) {
            dishValue = dish.value;
            dishCount = dishCount + 1;
          } else if (dishCount !== 0) {
            dishValue = dishValue + ',' + dish.value;
          }
          // else {
          //   dishValue = dishValue + ',' + dish.value;
          //
          // }
          // dishoptions.push("{"+dish.value+"}");
        });
      }
    });
    if (dishValue) {
      dishValue = '{' + dishValue + '}';
      setDishFilterOptionValue(dishValue);
    } else {
      setDishFilterOptionValue('');
    }
    // dishValue = '{' + dishValue + '}';
    // setDishFilterOptionValue(dishValue);
  }

  function onsetFilterOption(filterOption) {
    // passing filter option
    setFilterOptionValue(filterOption);
    if (props.setFilterOption && filterOption) {
      props.setFilterOption(filterOption);
    }
  }

  function setExperienceValue(value) {
    if (value > 0) {
      setExperience(value);
    } else {
      if (!value) {
        setExperience('');
      } else {
        toastMessage('error', 'Enter experience greater than 0');
      }
    }
  }

  function FilterSubmit(event) {
    if (props.setRatingValue) {
      let ratingArray = [];
      if (fiveStar) {
        ratingArray.push(5);
      }
      if (fourStar) {
        ratingArray.push(4);
      }
      if (threeStar) {
        ratingArray.push(3);
      }
      if (noStar) {
        ratingArray.push(0, 1, 2);
      }
      let passingValue = '{';
      if (ratingArray && ratingArray.length > 0) {
        ratingArray.map((rate, index) => {
          if (index == ratingArray.length - 1) {
            passingValue = passingValue + rate;
          } else {
            passingValue = passingValue + rate + ',';
          }
        });
        passingValue = passingValue + '}';
      } else {
        passingValue = null;
      }
      props.setRatingValue(passingValue);
    }
    if (props.setPriceValue) {
      // props.setPriceValue(minRange, maxRange);
      let priceArray = [];
      if (zeroDollor) {
        priceArray.push({
          min_price: 0,
          max_price: 20,
        });
      }
      if (twentyDollor) {
        priceArray.push({
          min_price: 20,
          max_price: 40,
        });
      }
      if (fourtyDollor) {
        priceArray.push({
          min_price: 40,
          max_price: 60,
        });
      }
      if (sixtyDollor) {
        priceArray.push({
          min_price: 60,
          max_price: null,
        });
      }
      props.setPriceValue(priceArray);
    }
    // else if (!minRange && !maxRange) {
    //   props.setPriceValue(0, 0);
    // } else {
    //   props.setPriceValue(minRange, maxRange);
    // }
    if (props.setCuisineOption && filterCuisineOptionValue) {
      props.setCuisineOption(filterCuisineOptionValue);
    } else {
      props.setCuisineOption(filterCuisineOptionValue);
    }
    if (props.setDishOption && filterDishOptionValue) {
      props.setDishOption(filterDishOptionValue);
    } else {
      props.setDishOption(filterDishOptionValue);
    }
    if (props.setExperienceValue && experience > 0) {
      props.setExperienceValue(experience);
    } else if (!experience) {
      props.setExperienceValue(0);
    }

    if (props.setEventTime && startTime && endTime && startDate && endDate && isDateSelected) {
      let isCorrect = moment(startTime).isAfter(endTime);
      if (isCorrect === true) {
        toastMessage('error', 'Please select future time of the event');
      } else {
        props.setEventTime(startTime, endTime);
      }
    } else {
      if (isDateSelected) props.setEventTime(startTime, endTime);
    }
  }

  function selectStartDate(event) {
    setstartTime(event + ' ' + '00:00:00');
    setendTime(event + ' ' + '23:59:59');
  }

  function onClearFilterOption(filterOption) {
    // passing filter option
    if (
      props.setFilterOption ||
      props.setPriceValue ||
      props.setRatingValue ||
      props.setDishOption ||
      props.setCuisineOption ||
      props.setExperienceValue ||
      props.setEventTime ||
      filterOption
    ) {
      setRange(false);
      setStars(false);
      setPopular(false);
      setColor(false);
      setBrand(false);
      setTime(false);
      props.setFilterOption(filterOption);
      props.setDishOption('');
      props.setCuisineOption('');
      props.setPriceValue([]);
      props.setRatingValue('');
      props.setExperienceValue(0);
      props.setEventTime('', '');
      setSelectedCuisinesId([]);
      setSelectedCuisines([]);
      setSelectedDishes([]);
      setSelectedDishesId([]);
      setMinRange('');
      setMaxRange('');
      setCuisineFilterOptionValue('');
      setDishFilterOptionValue('');
      setExperience('');
      setstartTime('');
      setendTime('');
      setStartDate();
      setEndDate();
      setstartTime();
      setendTime();
      setNoStar(false);
      setThreeStar(false);
      setFourStar(false);
      setFiveStar(false);
      setFirstChecked(false);
      setSecondChecked(false);
      setthirdChecked(false);
      setfourthChecked(false);
      setZeroDollor(false);
      setTwentyDollor(false);
      setFourtyDollor(false);
      setSixtyDollor(false);
    }
  }
  return (
    <div className={`col-lg-${props.col ? props.col : '3'} col-md-12`}>
      <button
        className="btn btn-primary"
        style={{ marginBottom: '30px', marginTop: '7%' }}
        onClick={() => onClearFilterOption('CHEF_SNO_ASC')}
      >
        Clear Filter
      </button>
      <div id="sidebar-card">
        <div className="woocommerce-sidebar-area cheflist">
          <div
            className={`collapse-widget tag-list-widget ${time ? '' : 'open'}`}
            id="filter-space"
          >
            <h3
              className={`collapse-widget-title ${time ? '' : 'active'}`}
              onClick={e => handleToggle(e, 'time')}
              id="filter-text"
            >
              Date of the Event
              <i className="fas fa-angle-up"></i>
            </h3>

            <ul className={`tags-list-row ${time ? 'block' : 'none'}`}>
              <div className="start-date-container">
                From Date
                <div className="start-date-calendar">
                  <DatePicker
                    selected={startDate ? startDate : new Date()}
                    onChange={date => {
                      setIsDateSelected(true);
                      setStartDate(date);
                      setstartTime(moment(date).format('YYYY-MM-DDTHH:mm:SS'));
                      if (date) {
                        setEndDate(addDays(date, 1));
                        setendTime(moment(addDays(date, 1)).format('YYYY-MM-DDTHH:mm:SS'));
                      }
                    }}
                    timeInputLabel="Time:"
                    minDate={new Date()}
                    timeFormat="HH:mm"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    // showTimeInput
                    showTimeSelect
                    timeIntervals={15}
                    timeCaption="time"
                  />
                </div>
              </div>
              <div className="end-date-container">
                To Date
                <div className="start-date-calendar">
                  <DatePicker
                    selected={endDate}
                    onChange={date => {
                      setEndDate(date);
                      setendTime(moment(date).format('YYYY-MM-DDTHH:mm:SS'));
                    }}
                    timeInputLabel="Time:"
                    timeFormat="HH:mm"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={startDate ? startDate : new Date()}
                    // showTimeInput
                    showTimeSelect
                    timeIntervals={15}
                    timeCaption="time"
                  />
                </div>
              </div>
            </ul>
          </div>
          <div
            className={`collapse-widget size-list-widget ${pricerange ? '' : 'open'}`}
            id="filter-space"
          >
            <h3
              className={`collapse-widget-title ${pricerange ? '' : 'active'}`}
              onClick={e => handleToggle(e, 'pricerange')}
              id="filter-text"
            >
              Price
              <i className="fas fa-angle-up"></i>
            </h3>

            <ul className={`brands-list-row ${pricerange ? 'block' : 'none'}`}>
              <div>
                <li>
                  <div>
                    <input
                      type="checkbox"
                      checked={sixtyDollor}
                      onChange={() => {
                        setSixtyDollor(!sixtyDollor);
                      }}
                    />
                    $$$$ ($60 +)
                  </div>
                </li>
                <li>
                  <div>
                    <input
                      type="checkbox"
                      checked={fourtyDollor}
                      onChange={() => {
                        setFourtyDollor(!fourtyDollor);
                      }}
                    />
                    $$$ ($40 - $60)
                  </div>
                </li>
                <li>
                  <div>
                    <input
                      type="checkbox"
                      checked={twentyDollor}
                      onChange={() => {
                        setTwentyDollor(!twentyDollor);
                      }}
                    />
                    $$ ($20 - $40)
                  </div>
                </li>
                <li>
                  <div>
                    <input
                      type="checkbox"
                      checked={zeroDollor}
                      onChange={() => {
                        setZeroDollor(!zeroDollor);
                      }}
                    />
                    $ ($0 - $20)
                  </div>
                </li>
              </div>
            </ul>
          </div>
          <div
            className={`collapse-widget tag-list-widget ${stars ? '' : 'open'}`}
            id="filter-space"
          >
            <h3
              className={`collapse-widget-title ${stars ? '' : 'active'}`}
              onClick={e => handleToggle(e, 'stars')}
              id="filter-text"
            >
              Rating
              <i className="fas fa-angle-up"></i>
            </h3>
            <ul className={`tags-list-row ${stars ? 'block' : 'none'}`}>
              <li>
                <div>
                  <input
                    type="checkbox"
                    checked={fiveStar}
                    onChange={() => {
                      setFiveStar(!fiveStar);
                    }}
                  />
                  <i className="fa fa-star starColor"></i>
                  <i className="fa fa-star starColor"></i>
                  <i className="fa fa-star starColor"></i>
                  <i className="fa fa-star starColor"></i>
                  <i className="fa fa-star starColor"></i>
                  {/* <span>{' and above'}</span> */}
                </div>
              </li>
              <br />
              <li>
                <input
                  type="checkbox"
                  checked={fourStar}
                  onChange={() => {
                    setFourStar(!fourStar);
                  }}
                />{' '}
                <i className="fa fa-star starColor"></i>
                <i className="fa fa-star starColor"></i>
                <i className="fa fa-star starColor"></i>
                <i className="fa fa-star starColor"></i>
                {/* <span>{' and above'}</span> */}
              </li>
              <br />
              <li>
                <input
                  type="checkbox"
                  checked={threeStar}
                  onChange={() => {
                    setThreeStar(!threeStar);
                  }}
                />{' '}
                <i className="fa fa-star starColor"></i>
                <i className="fa fa-star starColor"></i>
                <i className="fa fa-star starColor"></i>
                {/* <span>{' and above'}</span> */}
              </li>
              <br />
              <li>
                <input
                  type="checkbox"
                  checked={noStar}
                  onChange={() => {
                    setNoStar(!noStar);
                  }}
                />{' '}
                <span>{'  Rising talent'}</span>
              </li>
            </ul>
          </div>
          <div
            className={`collapse-widget tag-list-widget ${popular ? '' : 'open'}`}
            id="filter-space"
          >
            <h3
              className={`collapse-widget-title ${popular ? '' : 'active'}`}
              onClick={e => handleToggle(e, 'popular')}
              id="filter-text"
            >
              Dish Specialty
              <i className="fas fa-angle-up"></i>
            </h3>

            <ul className={`tags-list-row ${popular ? 'block' : 'none'}`}>
              <Select
                isMulti={true}
                isSearchable={true}
                value={selectedDishes}
                onChange={value => onsetDishOption(value, setSelectedDishes, setSelectedDishesId)}
                options={dishesMasterList}
                placeholder="Select Dish"
              />
            </ul>
          </div>
          <div
            className={`collapse-widget tag-list-widget ${color ? '' : 'open'}`}
            id="filter-space"
            style={{ marginBottom: '3%' }}
          >
            <h3
              className={`collapse-widget-title ${color ? '' : 'active'}`}
              onClick={e => handleToggle(e, 'color')}
              id="filter-text"
            >
              Cuisine Type
              <i className="fas fa-angle-up"></i>
            </h3>
            <div id="dish-type-selector">
              <ul className={`tags-list-row ${color ? 'block' : 'none'}`}>
                <Select
                  isMulti={true}
                  isSearchable={true}
                  value={selectedCuisines}
                  onChange={value =>
                    onsetCuisineOption(value, setSelectedCuisines, setSelectedCuisinesId)
                  }
                  options={cusinesMasterList}
                  placeholder="Select Cuisine"
                />
              </ul>
              <ul>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginRight: '9%',
                    marginTop: '40px',
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => FilterSubmit()}
                    id="sidebar-submit"
                  >
                    Submit
                  </button>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
