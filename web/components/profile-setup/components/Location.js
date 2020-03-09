import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { toastMessage, renderError, success } from '../../../utils/Toast';
import * as util from '../../../utils/checkEmptycondition';
import { getChefId, getCustomerId } from '../../../utils/UserType';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import s from '../ProfileSetup.String';
import CommonLocation from '../../shared/location/Location';
import { loginTo } from './availability/Navigation';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { MAPAPIKEY } = publicRuntimeConfig;
import u from '../../shared/location/Strings';
import axios from 'axios';
import { StoreInLocal, GetValueFromLocal } from '../../../utils/LocalStorage';

const updateLocationData = gqlTag.mutation.chef.changeLocationGQLTag; // chef
const updateCustomerLocationData = gqlTag.mutation.customer.changeLocationGQLTag; // chef

//update screen
// const updateScreens = gqlTag.mutation.customer.updateScreensGQLTAG;

// const UPDATE_SCREENS = gql`
//   ${updateScreens}
// `;

//for updating chef's location
const UPDATE_LOCATION_INFO = gql`
  ${updateLocationData}
`;

const UPDATE_CUSTOMER_LOCATION_INFO = gql`
  ${updateCustomerLocationData}
`;

//update screen
const updateScreens = gqlTag.mutation.chef.updateScreensGQLTAG;

const UPDATE_SCREENS = gql`
  ${updateScreens}
`;

//update registration screen
const chefUpdateSCreens = gqlTag.mutation.chef.updateRegistrationFlag;
const CHEF_REGISTER_UPDATE_SCREENS = gql`
  ${chefUpdateSCreens}
`;

//update screen
const updateScreensCustomer = gqlTag.mutation.customer.updateScreensGQLTAG;

const UPDATE_SCREENS_CUSTOMER = gql`
  ${updateScreensCustomer}
`;

const Location = props => {
  // In order to gain access to the child component instance,
  // you need to assign it to a `ref`, so we call `useRef()` to get one
  const childRef = useRef();
  const [chefProfileExtendedsByChefId, setChefProfileExtendedsByChefId] = useState('');
  const [customerProfileExtendedsByCustomerId, setCustomerProfileExtendedsByCustomerId] = useState(
    ''
  );
  const [updateCustomerScreenTag] = useMutation(UPDATE_SCREENS_CUSTOMER, {
    onCompleted: data => {
      // toastMessage(success, 'Favourite cuisines updated successfully');
      if (props && props.nextStep) {
        props.nextStep();
      }
    },
    onError: err => {},
  });

  const [updateLocationInfo, { data }] = useMutation(UPDATE_LOCATION_INFO, {
    onCompleted: data => {
      if (props.screen && props.screen === 'register') {
        // To get the updated screens value
        let screensValue = [];
        GetValueFromLocal('SharedProfileScreens')
          .then(result => {
            if (result && result.length > 0) {
              screensValue = result;
            }

            screensValue.push('ADDRESS');
            screensValue = _.uniq(screensValue);

            StoreInLocal('SharedProfileScreens', screensValue);

            let variables = {
              chefId: props.chefId,
              chefUpdatedScreens: screensValue,
            };
            updateChefScreenTag({ variables });
          })
          .catch(err => {
            console.log('err', err);
          });
      }
      toastMessage(success, 'Saved Successfully');
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  const [updateChefScreenTag, { loading, error }] = useMutation(UPDATE_SCREENS, {
    onCompleted: data => {
      checkChefScreens();
    },
    onError: err => {},
  });

  const [updateRegistrationTag, updateRegister] = useMutation(CHEF_REGISTER_UPDATE_SCREENS, {
    onCompleted: data => {
      if (props.screen && props.screen === 'register') {
        loginTo();
      }
    },
    onError: err => {},
  });

  const [updateCustomerLocationInfo, { dataValue }] = useMutation(UPDATE_CUSTOMER_LOCATION_INFO, {
    onCompleted: dataValue => {
      if (props.screen && props.screen === 'register') {
        // To get the updated screens value
        let screensValue = [];
        GetValueFromLocal('SharedProfileScreens')
          .then(result => {
            if (result && result.length > 0) {
              screensValue = result;
            }

            screensValue.push('ADDRESS');
            screensValue = _.uniq(screensValue);
            StoreInLocal('SharedProfileScreens', screensValue);
            let variables = {
              customerId: props.customerId,
              customerUpdatedScreens: screensValue,
            };
            updateCustomerScreenTag({ variables });
          })
          .catch(err => {
            console.log('err', err);
          });
      }
      toastMessage(success, s.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(renderError, err);
    },
  });

  //To check the upated chef screens
  function checkChefScreens() {
    let screenArray = [
      'EMAIL_VERIFICATION',
      'MOBILE_VERIFICATION',
      'INTRO',
      'BASE_RATE',
      'ADDITIONAL_SERVICES',
      'COMPLEXITY',
      'CUISINE_SPEC',
      'PROFILE_PIC',
      'GALLERY',
      'DOCUMENTS',
      'AVAILABILITY',
      'ADDRESS',
    ];
    //To check the updated screen values
    GetValueFromLocal('SharedProfileScreens')
      .then(result => {
        if (result && result.length > 0) {
          result = _.pull(result, 'AWARDS');
          if (result.length === 12) {
            let variables = {
              chefId: props.chefId,
              isRegistrationCompletedYn: true,
            };
            updateRegistrationTag({ variables });
          } else {
            let screenData = _.pullAll(screenArray, result);
            let screenDetails = screenData.map((res, key) => {
              return _.upperFirst(_.lowerCase(res));
            });
            let screenValue = screenDetails.join(', ');
            toastMessage('renderError', 'Please fill out the screens: ' + screenValue);
          }
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  }

  //get Chef details
  useEffect(() => {
    if (props.role === 'chef') {
      let details = props.chefDetails;
      if (
        util.isObjectEmpty(details) &&
        util.hasProperty(details, 'chefProfileExtendedsByChefId') &&
        util.isObjectEmpty(details.chefProfileExtendedsByChefId) &&
        util.hasProperty(details.chefProfileExtendedsByChefId, 'nodes') &&
        util.isObjectEmpty(details.chefProfileExtendedsByChefId.nodes[0])
      ) {
        let data = details.chefProfileExtendedsByChefId.nodes[0];
        setChefProfileExtendedsByChefId(data.chefProfileExtendedId);
      }
    } else {
      let details = props.details;
      if (
        util.isObjectEmpty(details) &&
        util.hasProperty(details, 'customerProfileByCustomerId') &&
        util.isObjectEmpty(details.customerProfileByCustomerId) &&
        util.hasProperty(
          details.customerProfileByCustomerId,
          'customerProfileExtendedsByCustomerId'
        ) &&
        util.isObjectEmpty(
          details.customerProfileByCustomerId.customerProfileExtendedsByCustomerId
        ) &&
        util.hasProperty(
          details.customerProfileByCustomerId.customerProfileExtendedsByCustomerId,
          'nodes'
        ) &&
        util.isObjectEmpty(
          details.customerProfileByCustomerId.customerProfileExtendedsByCustomerId.nodes[0]
        )
      ) {
        let data =
          details.customerProfileByCustomerId.customerProfileExtendedsByCustomerId.nodes[0];
        setCustomerProfileExtendedsByCustomerId(data.customerProfileExtendedId);
      }
    }

    // getChefId('profileExtendId')
    //   .then(res => {
    //     setChefProfileExtendedsByChefId(res);
    //   })
    //   .catch(error => {
    //     toastMessage(renderError, error.message);
    //   });
  }, [props.details, props.chefDetails]);

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

  //when saving data
  async function handleSubmit() {
    try {
      const location = await childRef.current.getLocationValue();
      if (location !== null) {
        let {
          fullAddress,
          latitude,
          longitude,
          houseNo,
          streetAddress,
          zipCode,
          city,
          country,
          state,
          distance,
          intialState,
        } = location;
        if (intialState === true) {
          axios
            .post(
              `https://maps.googleapis.com/maps/api/geocode/json?key=${MAPAPIKEY}&address=${streetAddress} ${city} ${state} ${country} ${zipcode}`
            )
            .then(locationData => {
              if (locationData && locationData.data && locationData.data.results[0]) {
                latitude = locationData.data.results[0].geometry.location.lat.toString();
                longitude = locationData.data.results[0].geometry.location.lng.toString();
                if (
                  locationData.data.results[0].address_components &&
                  locationData.data.results[0].formatted_address
                ) {
                  const results = locationData.data.results[0].address_components;
                  fullAddress = locationData.data.results[0].formatted_address;
                  let city1 = findValue(results, 'locality');
                  let city2 = findValue(results, 'administrative_area_level_2');
                  let state1 = findValue(results, 'administrative_area_level_1');
                  let country1 = findValue(results, 'country');
                  let houseNo = findValue(results, 'HouseNo');
                  let streetAddress1 = findValue(results, 'neighborhood');
                  let streetAddress2 = findValue(results, 'sublocality_level_2');
                  let streetAddress3 = findValue(results, 'sublocality_level_1');
                  let route = findValue(results, 'route');
                  let postalCode = findValue(results, 'postal_code');
                  let address1 = streetAddress1 || '';
                  let address2 = streetAddress2 || route;
                  let address3 = streetAddress3 || '';
                  let address = '';
                  if (util.isStringEmpty(address2) && util.isStringEmpty(address3)) {
                    address = `${address2},${address3}`;
                  } else if (util.isStringEmpty(address2)) {
                    address = `${address2}`;
                  } else if (util.isStringEmpty(address3)) {
                    address = `${address3}`;
                  }
                  let addressLine1 = '';
                  if (util.isStringEmpty(houseNo) && util.isStringEmpty(address1)) {
                    addressLine1 = `${houseNo},${address1}`;
                  } else if (util.isStringEmpty(houseNo)) {
                    addressLine1 = `${houseNo}`;
                  } else if (util.isStringEmpty(address1)) {
                    addressLine1 = `${address1}`;
                  }
                  if (!util.isStringEmpty(city1)) {
                    city1 = city2;
                  }
                  houseNo = addressLine1;
                  streetAddress = address;
                  zipCode = postalCode ? postalCode.toString() : '';
                  country = country1;
                  city = city1;
                  state = state1;
                  if (
                    util.isStringEmpty(chefProfileExtendedsByChefId) &&
                    util.isStringEmpty(fullAddress) &&
                    util.isStringEmpty(latitude) &&
                    util.isStringEmpty(longitude) &&
                    // util.isStringEmpty(houseNo) &&
                    util.isStringEmpty(streetAddress) &&
                    util.isStringEmpty(zipCode) &&
                    util.isNumberEmpty(distance)
                  ) {
                    const variables = {
                      chefProfileExtendedId: chefProfileExtendedsByChefId,
                      chefLocationAddress: fullAddress,
                      chefLocationLat: latitude,
                      chefLocationLng: longitude,
                      chefAddrLine1: houseNo,
                      chefAddrLine2: streetAddress,
                      chefPostalCode: zipCode,
                      chefAvailableAroundRadiusInValue: parseFloat(distance),
                      chefAvailableAroundRadiusInUnit: 'MILES',
                      chefCity: city,
                      chefState: state,
                      chefCountry: country,
                    };
                    updateLocationInfo({
                      variables,
                    });
                  } else if (
                    util.isStringEmpty(customerProfileExtendedsByCustomerId) &&
                    util.isStringEmpty(fullAddress) &&
                    util.isStringEmpty(latitude) &&
                    util.isStringEmpty(longitude) &&
                    // util.isStringEmpty(houseNo) &&
                    util.isStringEmpty(streetAddress) &&
                    util.isStringEmpty(zipCode)
                  ) {
                    const variables = {
                      customerProfileExtendedId: customerProfileExtendedsByCustomerId,
                      customerLocationAddress: fullAddress,
                      customerLocationLat: latitude,
                      customerLocationLng: longitude,
                      customerAddrLine1: houseNo,
                      customerAddrLine2: streetAddress,
                      customerPostalCode: zipCode,
                      customerCity: city,
                      customerState: state,
                      customerCountry: country,
                    };
                    updateCustomerLocationInfo({
                      variables,
                    });
                  }
                }
              }
            })
            .catch(error => {
              toastMessage(renderError, error.message);
            });
        } else {
          if (
            util.isStringEmpty(chefProfileExtendedsByChefId) &&
            util.isStringEmpty(fullAddress) &&
            util.isStringEmpty(latitude) &&
            util.isStringEmpty(longitude) &&
            // util.isStringEmpty(houseNo) &&
            util.isStringEmpty(streetAddress) &&
            util.isStringEmpty(zipCode) &&
            util.isNumberEmpty(distance)
          ) {
            const variables = {
              chefProfileExtendedId: chefProfileExtendedsByChefId,
              chefLocationAddress: fullAddress,
              chefLocationLat: latitude,
              chefLocationLng: longitude,
              chefAddrLine1: houseNo,
              chefAddrLine2: streetAddress,
              chefPostalCode: zipCode,
              chefAvailableAroundRadiusInValue: parseFloat(distance),
              chefAvailableAroundRadiusInUnit: 'MILES',
              chefCity: city,
              chefState: state,
              chefCountry: country,
            };
            await updateLocationInfo({
              variables,
            });
          } else if (
            util.isStringEmpty(customerProfileExtendedsByCustomerId) &&
            util.isStringEmpty(fullAddress) &&
            util.isStringEmpty(latitude) &&
            util.isStringEmpty(longitude) &&
            // util.isStringEmpty(houseNo) &&
            util.isStringEmpty(streetAddress) &&
            util.isStringEmpty(zipCode)
          ) {
            const variables = {
              customerProfileExtendedId: customerProfileExtendedsByCustomerId,
              customerLocationAddress: fullAddress,
              customerLocationLat: latitude,
              customerLocationLng: longitude,
              customerAddrLine1: houseNo,
              customerAddrLine2: streetAddress,
              customerPostalCode: zipCode,
              customerCity: city,
              customerState: state,
              customerCountry: country,
            };
            await updateCustomerLocationInfo({
              variables,
            });
          }
        }
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }
  try {
    return (
      <React.Fragment>
        <section
          className={`products-collections-area ProfileSetup 
        ${props.screen === 'register' ? 'location-modal-info' : ''}`}
          id="location-form-view"
        >
          <form className="login-form">
            <div className="row">
              <div className="col-sm-12">
                <div className="login-content" style={{ marginTop: '2%' }}>
                  <div className="container">
                    <div className="signup-content">
                      {props.screen !== 'register' && (
                        <div className="section-title" id="title-content">
                          <h2>{s.EDIT_LOCATION_INFORMATION}</h2>
                        </div>
                      )}
                      <CommonLocation
                        ref={childRef}
                        props={props}
                        role={props.role}
                        details={props.details}
                        chefDetails={props.chefDetails}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="saveButton" style={{ paddingRight: '2%' }}>
            <button type="submit" className="btn btn-primary" onClick={() => handleSubmit()}>
              {s.SUBMIT_PROFILE}
            </button>
          </div>
        </section>
      </React.Fragment>
    );
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

export default Location;
