import React, { useEffect, useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import Autocomplete from 'react-google-autocomplete';
import Geolocation from 'react-geolocation';
import getConfig from 'next/config';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { bannerData } from '../const/BannerData';
import { toastMessage } from '../../../utils/Toast';
import { AccordionItemPanel } from 'react-accessible-accordion';
import s from '../../profile-setup/ProfileSetup.String';
const OwlCarousel = dynamic(import('react-owl-carousel3'));
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';
import * as gqlTag from '../../../common/gql';
import * as util from '../../../utils/checkEmptycondition';
import {
  getCustomerId,
  customer,
  getUserTypeRole,
  customerId,
} from '../../../utils/UserType';

// Carousel options
const { publicRuntimeConfig } = getConfig();
const { MAPAPIKEY } = publicRuntimeConfig;

const options = {
  loop: true,
  nav: true,
  dots: true,
  autoplayHoverPause: true,
  items: 1,
  smartSpeed: 750,
  autoplay: true,
  navText: ["<i class='fas fa-arrow-left'></i>", "<i class='fas fa-arrow-right'></i>"],
};

//customer
const customerDataTag = gqlTag.query.customer.profileByIdGQLTAG;
//for getting customer data
const GET_CUSTOMER_DATA = gql`
  ${customerDataTag}
`;

const Banner = props => {

  const [userRole, setUserRole] = useState([]);
  const [display, setDisplay] = useState(false);
  const [panel, setPanel] = useState(true);
  const [fullAddress, setFullAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longtitude, setLongtitude] = useState(null);
  const [customerIdValue,setCustomerId] = useState(null);
  const [customerProfileDetails, setCustomerProfileDetails] = useState([]);

  const [getCustomerData, { data }] = useLazyQuery(GET_CUSTOMER_DATA, {
    variables: { customerId: customerIdValue },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  useEffect(() => {
    setDisplay(true);
  }, []);

 //get chef id
 useEffect(() => {
  //get user role
  getUserTypeRole()
    .then(async res => {
      setUserRole(res);
      if (res === customer) {
        //customer user
        getCustomerId(customerId)
          .then(customerResult => {
            setCustomerId(customerResult);
          })
          .catch(err => { });
      }
    })
    .catch(err => { });
}, []);

useEffect(() => {
  if (customerIdValue) {
    getCustomerData();
  }
}, customerIdValue);

useEffect(() => {
  // getting customer's details
  if (
    util.isObjectEmpty(data) &&
    util.hasProperty(data, 'customerProfileByCustomerId') &&
    util.isObjectEmpty(data.customerProfileByCustomerId) &&
    util.hasProperty(data.customerProfileByCustomerId,'customerProfileExtendedsByCustomerId') &&
    util.isObjectEmpty(data.customerProfileByCustomerId.customerProfileExtendedsByCustomerId)   
  ) {
    let details = data.customerProfileByCustomerId.customerProfileExtendedsByCustomerId;
    if(util.hasProperty(details,'nodes')&&
       util.isArrayEmpty(details.nodes)
    ){
      setFullAddress(details.nodes[0].customerLocationAddress ? details.nodes[0].customerLocationAddress : '')
      setLongtitude(details.nodes[0].customerLocationLng ? details.nodes[0].customerLocationLng : '');
      setLatitude(details.nodes[0].customerLocationLat ? details.nodes[0].customerLocationLat : '');
    }
  } else {
    setCustomerProfileDetails([]);
  }
}, [data]);

  function getLocation(location) {
    if (props.getLocation) {
      props.getLocation(fullAddress, latitude, longtitude);
    }
  }

  function getCurrentLocation(lat, lon) {
    if (lat && lon) {
      axios
        .post(`${s.GOOGLEAPI}${lat},${lon}${s.KEY}${MAPAPIKEY}`)
        .then(locationData => {
          if (locationData && locationData.data && locationData.data.results[0]) {
            setFullAddress(locationData.data.results[0].formatted_address);
            setLatitude(locationData.data.results[0].formatted_address ? lat : '');
            setLongtitude(locationData.data.results[0].formatted_address ? lon : '');
            // props.getLocation(fullAddress, lat, lon);
            // setDefaultAddress(locationData.data.results[0], 'currentLocation');
          }
        })
        .catch(error => {
          toastMessage(renderError, error.message);
        });
    }
  }

  try {
    return (
      <React.Fragment>
        {/* <OwlCarousel className="home-slides owl-carousel owl-theme" {...options}> */}
        {userRole !== 'chef' &&
          display &&
          bannerData &&
          bannerData.map((res, index) => {
            return (
              <div className="row">
                <div className="col-lg-6">
                  <div className={res.class} key={index}>
                    <div className="d-table">
                      <div className="d-table-cell">
                        <div className="container">
                          <VisibilitySensor>
                            {({ isVisible }) => (
                              <div className="main-banner-content">
                                <h1
                                  className={
                                    isVisible ? 'animated fadeInUp opacityOne' : 'opacityZero'
                                  }
                                >
                                  {res.title}
                                </h1>

                                <p
                                  className={
                                    isVisible ? 'animated fadeInUp opacityOne' : 'opacityZero'
                                  }
                                >
                                  {res.description}
                                </p>
                              </div>
                            )}
                          </VisibilitySensor>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {userRole !== 'chef' && (
                  <div
                    className="col-lg-6"
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  >
                    <div className="location-details-model">
                      <div>
                        <p className="location-text">Rockoly - Find Your Chef</p>
                      </div>
                      <div style={{ display: 'flex', width: '95%' }}>
                        <h5 style={{ color: 'black', display: 'flex', width: '67%' }}>
                          <Autocomplete
                            className="form-control inputView"
                            placeholder="Enter location"
                            value={fullAddress}
                            onChange={event => setFullAddress(event.target.value)}
                            onPlaceSelected={place => {
                              setFullAddress(place.formatted_address);
                              setLatitude(place.formatted_address ? place.geometry.location.lat() : '');
                              setLongtitude(place.formatted_address ? place.geometry.location.lng() : '');
                            }}
                            types={['address']}
                            componentRestrictions={{ country: 'us' }}
                          />
                        </h5>
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
                                id="current-locaton-view"
                                onClick={() => getCurrentLocation(latitude, longitude)}
                              ></i>
                            </div>
                          )}
                        />
                        <button
                          className="btn btn-primary"
                          id="home-search-button"
                          onClick={() => getLocation(event)}
                          style={{ height: '42px', marginLeft: '20px', marginTop: '2px' }}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        {userRole === 'chef' &&
          display &&
          bannerData &&
          bannerData.map((res, index) => {
            return (
              <div className={res.class} key={index}>
                <div className="d-table">
                  <div className="d-table-cell">
                    <div className="container">
                      <VisibilitySensor>
                        {({ isVisible }) => (
                          <div className="main-banner-content">
                            <h1
                              className={isVisible ? 'animated fadeInUp opacityOne' : 'opacityZero'}
                            >
                              {res.title}
                            </h1>

                            <p
                              className={isVisible ? 'animated fadeInUp opacityOne' : 'opacityZero'}
                            >
                              {res.description}
                            </p>
                          </div>
                        )}
                      </VisibilitySensor>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        {/* </OwlCarousel> */}
      </React.Fragment>
    );
  } catch (error) {
    toastMessage('renderError', error.message);
  }
};

export default Banner;
