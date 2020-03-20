import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import _ from 'lodash';
import getConfig from 'next/config';
import Autocomplete from 'react-google-autocomplete';
import Geolocation from 'react-geolocation';
import axios from 'axios';
import { toastMessage, renderError, success } from '../../../utils/Toast';
import * as util from '../../../utils/checkEmptycondition';
import { getChefId, chef, customer } from '../../../utils/UserType';
import s from './Strings';

const { publicRuntimeConfig } = getConfig();
const { MAPAPIKEY } = publicRuntimeConfig;

const Location = forwardRef((props, ref) => {
  const [houseNo, setHouseNo] = useState(null);
  const [streetAddress, setStreetAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [distance, setDistance] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [intialState, setInitialState] = useState(true);

  //set cuisine list data

  useEffect(() => {
    console.log('initialLoad', props.props);
    if (props.props.role === customer) {
      let customerData = props.props.details;
      if (
        util.isObjectEmpty(customerData) &&
        util.hasProperty(customerData, 'customerProfileByCustomerId') &&
        util.isObjectEmpty(customerData.customerProfileByCustomerId) &&
        util.hasProperty(
          customerData.customerProfileByCustomerId,
          'customerProfileExtendedsByCustomerId'
        ) &&
        util.isObjectEmpty(
          customerData.customerProfileByCustomerId.customerProfileExtendedsByCustomerId
        ) &&
        util.hasProperty(
          customerData.customerProfileByCustomerId.customerProfileExtendedsByCustomerId,
          'nodes'
        ) &&
        util.isObjectEmpty(
          customerData.customerProfileByCustomerId.customerProfileExtendedsByCustomerId.nodes[0]
        )
      ) {
        let data =
          customerData.customerProfileByCustomerId.customerProfileExtendedsByCustomerId.nodes[0];
        setHouseNo(util.isStringEmpty(data.customerAddrLine1) ? data.customerAddrLine1 : null);
        setStreetAddress(util.isStringEmpty(data.customerAddrLine2) ? data.customerAddrLine2 : '');
        setFullAddress(
          util.isStringEmpty(data.customerLocationAddress) ? data.customerLocationAddress : ''
        );
        setLatitude(util.isStringEmpty(data.customerLocationLat) ? data.customerLocationLat : '');
        setLongitude(util.isStringEmpty(data.customerLocationLng) ? data.customerLocationLng : '');
        setZipCode(util.isStringEmpty(data.customerPostalCode) ? data.customerPostalCode : '');
        setCity(data.customerCity);
        setCountry(data.customerCountry);
        setState(data.customerState);
        if (
          // util.isStringEmpty(data.customerAddrLine1) &&
          util.isStringEmpty(data.customerAddrLine2) &&
          util.isStringEmpty(data.customerLocationAddress) &&
          util.isStringEmpty(data.customerPostalCode) &&
          util.isStringEmpty(data.customerCity) &&
          util.isStringEmpty(data.customerState) &&
          util.isStringEmpty(data.customerLocationLat) &&
          util.isStringEmpty(data.customerLocationLng)
        ) {
          setInitialState(false);
        }
      }
    } else if (props.props.role === chef) {
      let chefData = props.props.chefDetails;
      if (
        util.isObjectEmpty(chefData) &&
        util.hasProperty(chefData, 'chefProfileExtendedsByChefId') &&
        util.isObjectEmpty(chefData.chefProfileExtendedsByChefId) &&
        util.hasProperty(chefData.chefProfileExtendedsByChefId, 'nodes') &&
        util.isObjectEmpty(chefData.chefProfileExtendedsByChefId.nodes[0])
      ) {
        let data = chefData.chefProfileExtendedsByChefId.nodes[0];
        setHouseNo(util.isStringEmpty(data.chefAddrLine1) ? data.chefAddrLine1 : null);
        setStreetAddress(util.isStringEmpty(data.chefAddrLine2) ? data.chefAddrLine2 : '');
        setFullAddress(
          util.isStringEmpty(data.chefLocationAddress) ? data.chefLocationAddress : ''
        );
        setLatitude(util.isStringEmpty(data.chefLocationLat) ? data.chefLocationLat : '');
        setLongitude(util.isStringEmpty(data.chefLocationLng) ? data.chefLocationLng : '');
        setZipCode(util.isStringEmpty(data.chefPostalCode) ? data.chefPostalCode : '');
        setDistance(
          util.isStringEmpty(data.chefAvailableAroundRadiusInValue)
            ? data.chefAvailableAroundRadiusInValue
            : ''
        );
        setCity(data.chefCity);
        setCountry(data.chefCountry);
        setState(data.chefState);
        if (
          // util.isStringEmpty(data.chefAddrLine1) &&
          util.isStringEmpty(data.chefAddrLine2) &&
          util.isStringEmpty(data.chefLocationAddress) &&
          util.isStringEmpty(data.chefPostalCode) &&
          util.isStringEmpty(data.chefCity) &&
          util.isStringEmpty(data.chefState) &&
          util.isStringEmpty(data.chefLocationLat) &&
          util.isStringEmpty(data.chefLocationLng)
        ) {
          setInitialState(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (props.props.role === customer) {
      let customerData = props.props.details;
      if (
        util.isObjectEmpty(customerData) &&
        util.hasProperty(customerData, 'customerProfileByCustomerId') &&
        util.isObjectEmpty(customerData.customerProfileByCustomerId) &&
        util.hasProperty(
          customerData.customerProfileByCustomerId,
          'customerProfileExtendedsByCustomerId'
        ) &&
        util.isObjectEmpty(
          customerData.customerProfileByCustomerId.customerProfileExtendedsByCustomerId
        ) &&
        util.hasProperty(
          customerData.customerProfileByCustomerId.customerProfileExtendedsByCustomerId,
          'nodes'
        ) &&
        util.isObjectEmpty(
          customerData.customerProfileByCustomerId.customerProfileExtendedsByCustomerId.nodes[0]
        )
      ) {
        let data =
          customerData.customerProfileByCustomerId.customerProfileExtendedsByCustomerId.nodes[0];
        setHouseNo(util.isStringEmpty(data.customerAddrLine1) ? data.customerAddrLine1 : null);
        setStreetAddress(util.isStringEmpty(data.customerAddrLine2) ? data.customerAddrLine2 : '');
        setFullAddress(
          util.isStringEmpty(data.customerLocationAddress) ? data.customerLocationAddress : ''
        );
        setLatitude(util.isStringEmpty(data.customerLocationLat) ? data.customerLocationLat : '');
        setLongitude(util.isStringEmpty(data.customerLocationLng) ? data.customerLocationLng : '');
        setZipCode(util.isStringEmpty(data.customerPostalCode) ? data.customerPostalCode : '');
        setCity(data.customerCity);
        setCountry(data.customerCountry);
        setState(data.customerState);
      }
    } else if (props.props.role === chef) {
      let chefData = props.props.chefDetails;
      if (
        util.isObjectEmpty(chefData) &&
        util.hasProperty(chefData, 'chefProfileExtendedsByChefId') &&
        util.isObjectEmpty(chefData.chefProfileExtendedsByChefId) &&
        util.hasProperty(chefData.chefProfileExtendedsByChefId, 'nodes') &&
        util.isObjectEmpty(chefData.chefProfileExtendedsByChefId.nodes[0])
      ) {
        let data = chefData.chefProfileExtendedsByChefId.nodes[0];
        setHouseNo(util.isStringEmpty(data.chefAddrLine1) ? data.chefAddrLine1 : null);
        setStreetAddress(util.isStringEmpty(data.chefAddrLine2) ? data.chefAddrLine2 : '');
        setFullAddress(
          util.isStringEmpty(data.chefLocationAddress) ? data.chefLocationAddress : ''
        );
        setLatitude(util.isStringEmpty(data.chefLocationLat) ? data.chefLocationLat : '');
        setLongitude(util.isStringEmpty(data.chefLocationLng) ? data.chefLocationLng : '');
        setZipCode(util.isStringEmpty(data.chefPostalCode) ? data.chefPostalCode : '');
        setDistance(
          util.isStringEmpty(data.chefAvailableAroundRadiusInValue)
            ? data.chefAvailableAroundRadiusInValue
            : ''
        );
        setCity(data.chefCity);
        setState(data.chefState);
        setCountry(data.chefCountry);
      }
    }
    if (props.bookingDetail && util.isObjectEmpty(props.bookingDetail)) {
      let data = props.bookingDetail;
      console.log('Customer Location', data);
      if (
        util.isObjectEmpty(data) &&
        util.hasProperty(data, 'customerProfileByCustomerId') &&
        util.isObjectEmpty(data.customerProfileByCustomerId) &&
        util.hasProperty(
          data.customerProfileByCustomerId,
          'customerProfileExtendedsByCustomerId'
        ) &&
        util.isObjectEmpty(data.customerProfileByCustomerId.customerProfileExtendedsByCustomerId) &&
        util.hasProperty(
          data.customerProfileByCustomerId.customerProfileExtendedsByCustomerId,
          'nodes'
        ) &&
        util.isObjectEmpty(
          data.customerProfileByCustomerId.customerProfileExtendedsByCustomerId.nodes[0]
        )
      ) {
        let val = data.customerProfileByCustomerId.customerProfileExtendedsByCustomerId.nodes[0];
        setHouseNo(util.isStringEmpty(val.customerAddrLine1) ? val.customerAddrLine1 : null);
        setStreetAddress(util.isStringEmpty(val.customerAddrLine2) ? val.customerAddrLine2 : '');
        setFullAddress(
          util.isStringEmpty(val.customerLocationAddress) ? val.customerLocationAddress : ''
        );
        setLatitude(util.isStringEmpty(val.customerLocationLat) ? val.customerLocationLat : '');
        setLongitude(util.isStringEmpty(val.customerLocationLng) ? val.customerLocationLng : '');
        setZipCode(util.isStringEmpty(val.customerPostalCode) ? val.customerPostalCode : '');
        setCity(val.customerCity);
        setCountry(val.customerCountry);
        setState(val.customerState);
      }
    }
  }, [props.details, props.bookingDetail]);

  //when saving data
  try {
    // The component instance will be extended
    // with whatever you return from the callback passed
    // as the second argument
    useImperativeHandle(ref, () => ({
      getLocationValue() {
        if (
          util.isStringEmpty(fullAddress) &&
          util.isStringEmpty(latitude) &&
          util.isStringEmpty(longitude) &&
          // util.isStringEmpty(houseNo) &&
          util.isStringEmpty(streetAddress) &&
          util.isStringEmpty(zipCode) &&
          util.isStringEmpty(distance) &&
          props.props.role === chef
        ) {
          const variables = {
            fullAddress,
            latitude,
            longitude,
            houseNo,
            streetAddress,
            zipCode,
            distance,
            city,
            country,
            state,
            intialState,
          };

          return variables;
        } else if (
          util.isStringEmpty(fullAddress) &&
          util.isStringEmpty(latitude) &&
          util.isStringEmpty(longitude) &&
          // util.isStringEmpty(houseNo) &&
          util.isStringEmpty(streetAddress) &&
          util.isStringEmpty(zipCode) &&
          props.props.role === customer
        ) {
          const variables = {
            fullAddress,
            latitude,
            longitude,
            houseNo,
            streetAddress,
            zipCode,
            city,
            country,
            state,
            intialState,
          };

          return variables;
        } else {
          toastMessage('error', 'Please fill the all details');
          // const variables = {
          //   fullAddress,
          //   latitude,
          //   longitude,
          //   houseNo,
          //   streetAddress,
          //   zipCode,
          // };
          // return variables;
          return null;
        }
      },
    }));
  } catch (error) {
    toastMessage(renderError, error.message);
  }

  function getLocation(latitude, longitude) {
    if (latitude && longitude) {
      axios
        .post(`${s.GOOGLEAPI}${latitude},${longitude}${s.KEY}${MAPAPIKEY}`)
        .then(locationData => {
          console.log('getLocation', locationData);
          if (locationData && locationData.data && locationData.data.results[0]) {
            setDefaultAddress(locationData.data.results[0], 'currentLocation');
          }
        })
        .catch(error => {
          toastMessage(renderError, error.message);
        });
    }
  }

  //To set all default address
  function setDefaultAddress(locationData, type) {
    console.log('locationData', locationData);
    if (type === 'currentLocation') {
      setLatitude(locationData.geometry.location.lat.toString());
      setLongitude(locationData.geometry.location.lng.toString());
    } else if (type === 'autoComplete') {
      setLatitude(locationData.geometry.location.lat().toString());
      setLongitude(locationData.geometry.location.lng().toString());
    }
    if (locationData.address_components && locationData.formatted_address) {
      const results = locationData.address_components;
      setFullAddress(locationData.formatted_address);
      const city = findValue(results, 'locality');
      const city1 = findValue(results, 'administrative_area_level_2');
      const state = findValue(results, 'administrative_area_level_1');
      const country = findValue(results, 'country');
      const houseNo = findValue(results, 'HouseNo');
      const streetAddress1 = findValue(results, 'neighborhood');
      const streetAddress2 = findValue(results, 'sublocality_level_2');
      const streetAddress3 = findValue(results, 'sublocality_level_1');
      const route = findValue(results, 'route');
      const postalCode = findValue(results, 'postal_code');
      const address1 = streetAddress1 || '';
      const address2 = streetAddress2 || route;
      const address3 = streetAddress3 || '';
      let address = '';
      let cityValue = '';
      let value = '';
      // if (util.isStringEmpty(address2) && util.isStringEmpty(address3)) {
      //   address = `${address2},${address3}`;
      // } else if (util.isStringEmpty(address2)) {
      //   address = `${address2}`;
      // } else if (util.isStringEmpty(address3)) {
      //   address = `${address3}`;
      // }
      // let addressLine1 = '';
      // if (util.isStringEmpty(houseNo) && util.isStringEmpty(address1)) {
      //   addressLine1 = `${houseNo},${address1}`;
      // } else if (util.isStringEmpty(houseNo)) {
      //   addressLine1 = `${houseNo}`;
      // } else if (util.isStringEmpty(address1)) {
      //   addressLine1 = `${address1}`;
      // }
      // if (!util.isStringEmpty(city)) {
      //   setCity(city1);
      // } else {
      //   setCity(city);
      // }

      if (util.isStringEmpty(city)) {
        cityValue = `${city}`;
      } else {
        cityValue = `${city1}`;
      }

      if (cityValue) {
        const n = locationData.formatted_address.indexOf(cityValue);
        value = locationData.formatted_address.slice(0, n - 2);
        console.log('value', value);
      }
      // setHouseNo(addressLine1);
      address = value ? value : '';
      setStreetAddress(address);
      setZipCode(postalCode ? postalCode.toString() : '');
      setCountry(country);
      setCity(cityValue);
      setState(state);
    }
  }

  function findValue(results, name) {
    const result = _.find(results, obj => {
      if (obj.types[0] === name && obj.types[1] === 'political') {
        return obj;
      }
      if (obj.types[2] === name && obj.types[1] === 'sublocality') {
        return obj;
      }
      if (name === 'HouseNo') {
        if (obj.types[0] === 'premise' || obj.types[0] === 'street_number') {
          return obj;
        }
      } else if (obj.types[0] === name) {
        return obj;
      }
    });
    let stateShortName = result
      ? name === 'administrative_area_level_1'
        ? result.short_name
        : result.long_name
      : '';
    if (stateShortName) {
      return stateShortName;
    }
    return result ? (name === 'country' ? result.short_name : result.long_name) : '';
  }

  //when onchaning value of fields
  function onChangeValue(event, stateAssign) {
    try {
      if (util.isObjectEmpty(event)) {
        stateAssign(event.target.value);
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  function onChangeDistance(event, stateAssign) {
    try {
      if (event.target.value >= 0) {
        if (util.isObjectEmpty(event)) {
          stateAssign(event.target.value);
        }
      } else {
        toastMessage(renderError, 'Miles should not be a negative value');
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  try {
    return (
      <React.Fragment>
        <form className="signup-form">
          <div className="form-group">
            {/* <label> */}
            <h5
              // className="locationView"
              style={{
                color: '#08AB93',
                fontSize: '15px',
                textDecoration: 'underline',
                fontWeight: 400,
                paddingBottom: '1%',
              }}
            >
              {props.screen === 'booking' ? 'EVENT ADDRESS' : s.LOCATION}{' '}
            </h5>
            {/* </label> */}
            <div style={{ display: 'flex', paddingBottom: '2%' }}>
              <Autocomplete
                className="form-control inputView"
                id="location-containar-view"
                placeholder={s.ENTER_FULL_ADDRESS}
                required
                value={fullAddress}
                onChange={event => onChangeValue(event, setFullAddress)}
                onPlaceSelected={place => {
                  setDefaultAddress(place, 'autoComplete');
                }}
                types={['address']}
                componentRestrictions={{ country: ['us', 'in'] }}
              />
              <Geolocation
                render={({
                  fetchingPosition,
                  position: { coords: { latitude, longitude } = {} } = {},
                  error,
                  getCurrentPosition,
                }) => (
                  <div className="locationIconView">
                    <i
                      className="fas fa-crosshairs"
                      style={{ fontSize: '17px', paddingRight: '10px' }}
                      onClick={() => getLocation(latitude, longitude)}
                    ></i>
                  </div>
                )}
              />
            </div>
            <div style={{ display: 'flex', paddingBottom: '2%' }}>
              <input
                type={s.TEXT}
                className="form-control inputView"
                placeholder="Apartment,Suite (optional)"
                id={s.HOUSE_NO}
                name={s.HOUSE_NO}
                required
                data-error={s.PLEASE_ENTER_HOUSE_NO}
                value={houseNo}
                onChange={event => onChangeValue(event, setHouseNo)}
              />
            </div>
            {props.props.role === chef && (
              // <label>
              <h5
                style={{
                  color: '#08AB93',
                  fontSize: '20px',
                  textDecoration: 'underline',
                  fontWeight: 400,
                  paddingBottom: '1%',
                }}
              >
                This will be shown to customer after the booking{' '}
              </h5>
              // </label>
            )}
            <input
              type={s.TEXT}
              className="form-control  inputView"
              placeholder="Street Address"
              id={s.STREET_ADDRESS}
              name={s.STREET_ADDRESS}
              required
              data-error={s.PLEASE_ENTER_APARTMENT_NAME}
              value={streetAddress}
              onChange={event => onChangeValue(event, setStreetAddress)}
            />
          </div>
          <div style={{ marginBottom: '2%' }}>
            {props.props.role === chef && (
              // <label>
              //   {' '}
              <h5 style={{ color: '#08AB93', fontSize: '20px', textDecoration: 'underline' }}>
                This will be shown to customer even before booking{' '}
              </h5>
              // </label>
            )}
          </div>
          <div style={{ marginBottom: '2%' }}>
            {city !== null && city !== '' && (
              <input
                type={s.TEXT}
                className="form-control  inputView"
                placeholder="City"
                value={city}
                onChange={event => onChangeValue(event, setCity)}
              />
            )}
          </div>
          <div style={{ marginBottom: '2%' }}>
            {state !== null && state !== '' && (
              <input
                type={s.TEXT}
                className="form-control  inputView"
                placeholder="State"
                value={state}
                onChange={event => onChangeValue(event, setState)}
              />
            )}
          </div>
          <div style={{ marginBottom: '2%' }}>
            {country !== null && country !== '' && (
              <input
                type={s.TEXT}
                className="form-control  inputView"
                placeholder="Country"
                value={country}
                onChange={event => onChangeValue(event, setCountry)}
              />
            )}
          </div>

          <div style={{ marginBottom: '2%' }}>
            <input
              type={s.TEXT}
              className="form-control  inputView"
              placeholder={s.ENTER_ZIPCODE}
              id={s.ZIPCODE}
              name={s.ZIPCODE}
              required
              data-error={s.PLEASE_ENTER_ZIPCODE}
              value={zipCode}
              onChange={event => onChangeValue(event, setZipCode)}
            />
            {props.props.role === chef && (
              <div>
                <h5
                  style={{
                    color: '#08AB93',
                    fontSize: '20px',
                    textDecoration: 'underline',
                    fontWeight: 400,
                    paddingBottom: '1%',
                  }}
                >
                  How much distance can you travel to provide service?
                </h5>
                <input
                  type={s.TEXT}
                  className="form-control  inputView"
                  placeholder={s.ENTER_DISTANCE}
                  id={s.DISTANCE}
                  name={s.DISTANCE}
                  required
                  data-error={s.PLEASE_ENTER_DISTANCE}
                  value={distance}
                  onChange={event => onChangeDistance(event, setDistance)}
                />
              </div>
            )}
          </div>
        </form>
      </React.Fragment>
    );
  } catch (error) {
    toastMessage(renderError, error.message);
  }
});

export default Location;
