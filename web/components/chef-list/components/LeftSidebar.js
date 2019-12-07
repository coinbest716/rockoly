import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Autocomplete from 'react-google-autocomplete';
import Select from 'react-select';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import * as util from '../../../utils/checkEmptycondition';
import { toastMessage } from '../../../utils/Toast';

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
  const [fullAddress, setFullAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [rating, setRatingValue] = useState(null);
  const [minRange, setMinRange] = useState();
  const [maxRange, setMaxRange] = useState();
  const [location, setLocation] = useState();
  const [cuisineStateValue, setCuisineStateValue] = useState();
  const [experience, setExperience] = useState('');
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
    if (props.setRatingValue && rating > 0) {
      props.setRatingValue(rating);
    } else if (!rating) {
      props.setRatingValue(0);
    }
    if (props.setPriceValue && minRange && maxRange) {
      props.setPriceValue(minRange, maxRange);
    } else if (!minRange && !maxRange) {
      props.setPriceValue(0, 0);
    } else {
      props.setPriceValue(minRange, maxRange);
    }
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
      filterOption
    ) {
      setRange(false);
      setStars(false);
      setPopular(false);
      setColor(false);
      setBrand(false);
      props.setFilterOption(filterOption);
      props.setDishOption('');
      props.setCuisineOption('');
      props.setPriceValue(0, 0);
      props.setRatingValue(0);
      props.setExperienceValue(0);
      setRatingValue(0);
      setSelectedCuisinesId([]);
      setSelectedCuisines([]);
      setSelectedDishes([]);
      setSelectedDishesId([]);
      setMinRange('');
      setMaxRange('');
      setCuisineFilterOptionValue('');
      setDishFilterOptionValue('');
      setExperience('');
    }
  }

  return (
    <div className={`col-lg-${props.col ? props.col : '3'} col-md-12`}>
      <button
        className="btn btn-primary"
        style={{ marginBottom: '30px', marginTop: '3%' }}
        onClick={() => onClearFilterOption('CHEF_SNO_ASC')}
      >
        Clear Filter
      </button>
      <div id="sidebar-card">
        <div className="woocommerce-sidebar-area cheflist">
          {/* <div className={`collapse-widget collections-list-widget ${location ? '' : 'open'}`}>
            <h3
              className={`collapse-widget-title ${location ? '' : 'active'}`}
              onClick={e => handleToggle(e, 'location')}
            >
              Location
              <i className="fas fa-angle-up"></i>
            </h3>
            <ul className={`collections-list-row ${location ? 'block' : 'none'}`}>
              <Autocomplete
                className="form-control inputView"
                placeholder="Enter location"
                required
                value={fullAddress}
                onChange={event => setFullAddress(event.target.value)}
                onPlaceSelected={place => {
                  setFullAddress(place.formatted_address);
                  setLatitude(place.geometry.location.lat());
                  setLongtitude(place.geometry.location.lng());
                  filterByLocation(place);
                }}
                types={['address']}
                // componentRestrictions={{ country: 'in' }}
              />
            </ul>
          </div> */}
          {/* <div className={`collapse-widget collections-list-widget ${collection ? '' : 'open'}`}>
            <h3
              className={`collapse-widget-title ${collection ? '' : 'active'}`}
              onClick={e => handleToggle(e, 'collection')}
              id="filter-text"
            >
              Price Sort
              <i className="fas fa-angle-up"></i>
            </h3>
            <ul className={`collections-list-row ${collection ? 'block' : 'none'}`}>
              <li>
                <Link href="#">
                  <a onClick={() => onsetFilterOption('PRICE_PER_HOUR_DESC')}>High To Low</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a onClick={() => onsetFilterOption('PRICE_PER_HOUR_ASC')}>Low To High</a>
                </Link>
              </li>
            </ul>
          </div> */}
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
                  Min
                  <input
                    className="sidebar-input-style"
                    type="number"
                    min="1"
                    value={minRange}
                    onChange={() => {
                      setMinRange(event.target.value);
                      setMaxRange(parseInt(event.target.value) + 1);
                    }}
                    placeholder="$"
                    style={{ marginLeft: '2%' }}
                  />
                </li>
              </div>
              <div>
                <li>
                  Max{' '}
                  <input
                    className="sidebar-input-style"
                    type="number"
                    min={maxRange}
                    value={maxRange}
                    onChange={event => {
                      setMaxRange(event.target.value);
                      // setPriceValue(event);
                    }}
                    placeholder="$"
                    id="to-input"
                    // style={{ marginLeft: '7%' }}
                  />
                </li>
              </div>
            </ul>
          </div>

          <div
            className={`collapse-widget size-list-widget ${brand ? '' : 'open'}`}
            id="filter-space"
          >
            <h3
              className={`collapse-widget-title ${brand ? '' : 'active'}`}
              onClick={e => handleToggle(e, 'brand')}
              id="filter-text"
            >
              Experience
              <i className="fas fa-angle-up"></i>
            </h3>

            <ul className={`brands-list-row ${brand ? 'block' : 'none'}`}>
              <div>
                <li>
                  <input
                    className="sidebar-input-style"
                    type="number"
                    min="1"
                    value={experience}
                    onChange={() => {
                      setExperienceValue(event.target.value);
                    }}
                    placeholder="1"
                    style={{ marginLeft: '2%' }}
                  />
                </li>
              </div>
            </ul>
          </div>
          {/* <div className={`collapse-widget brands-list-widget ${brand ? '' : 'open'}`}>
            <h3
              className={`collapse-widget-title ${brand ? '' : 'active'}`}
              onClick={e => handleToggle(e, 'brand')}
              id="filter-text"
            >
              Rating Sort
              <i className="fas fa-angle-up"></i>
            </h3>

            <ul className={`brands-list-row ${brand ? 'block' : 'none'}`}>
              <li>
                <Link href="#">
                  <a onClick={() => onsetFilterOption('AVERAGE_RATING_DESC')}>High To Low</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a onClick={() => onsetFilterOption('AVERAGE_RATING_ASC')}>Low To High</a>
                </Link>
              </li>
            </ul>
          </div> */}

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
                <Link href="#" className="sidebar-input-style">
                  <div>
                    <a
                      onClick={() => {
                        setRatingValue(1);
                      }}
                    >
                      1 <i className="far fa-star starColor"></i> & above{' '}
                    </a>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a
                    onClick={() => {
                      setRatingValue(2);
                    }}
                  >
                    2 <i className="far fa-star starColor"></i> & above{' '}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a
                    onClick={() => {
                      setRatingValue(3);
                    }}
                  >
                    3 <i className="far fa-star starColor"></i> & above
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a
                    onClick={() => {
                      setRatingValue(4);
                    }}
                  >
                    4 <i className="far fa-star starColor"></i> & above
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a
                    onClick={() => {
                      setRatingValue(5);
                    }}
                  >
                    5 <i className="far fa-star starColor"></i> & above
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* <div className={`collapse-widget size-list-widget ${size ? '' : 'open'}`}>
            <h3
              className={`collapse-widget-title ${size ? '' : 'active'}`}
              onClick={e => handleToggle(e, 'size')}
              id="filter-text"
            >
              Chef Created Date
              <i className="fas fa-angle-up"></i>
            </h3> */}
          {/* <div className={`collapse-widget size-list-widget ${size ? '' : 'open'}`}>
          <h3
            className={`collapse-widget-title ${size ? '' : 'active'}`}
            onClick={e => handleToggle(e, 'size')}
          >
            Chef Created Date
            <i className="fas fa-angle-up"></i>
          </h3>

          <ul className={`brands-list-row ${size ? 'block' : 'none'}`}>
            <li>
              <Link href="#">
                <a onClick={() => onsetFilterOption('CREATED_AT_DESC')}>High To Low</a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a onClick={() => onsetFilterOption('CREATED_AT_ASC')}>Low To High</a>
              </Link>
            </li>
          </ul>
        </div> */}

          {/* <ul className={`brands-list-row ${size ? 'block' : 'none'}`}>
              <li>
                <Link href="#">
                  <a onClick={() => onsetFilterOption('CREATED_AT_DESC')}>High To Low</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a onClick={() => onsetFilterOption('CREATED_AT_ASC')}>Low To High</a>
                </Link>
              </li>
            </ul> */}
          {/* </div> */}

          <div
            className={`collapse-widget tag-list-widget ${popular ? '' : 'open'}`}
            id="filter-space"
          >
            <h3
              className={`collapse-widget-title ${popular ? '' : 'active'}`}
              onClick={e => handleToggle(e, 'popular')}
              id="filter-text"
            >
              Dish Type
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

                {/* <Select
                    isMulti={true}
                    isSearchable={true}
                    value={selectedCuisines}
                    onChange={value =>
                      handleChange(value, setSelectedCuisines, setSelectedCuisinesId)
                    }
                    options={cusinesMasterList}
                    placeholder="Select Cuisine"
                  /> */}
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
