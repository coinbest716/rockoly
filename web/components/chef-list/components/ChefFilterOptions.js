import React, { useState } from 'react';
import Autocomplete from 'react-google-autocomplete';
import Geolocation from 'react-geolocation';
import getConfig from 'next/config';
import Router from 'next/router';
import axios from 'axios';
import n from '../../routings/routings';
import s from '../../profile-setup/ProfileSetup.String';

const { publicRuntimeConfig } = getConfig();
const { MAPAPIKEY } = publicRuntimeConfig;

const ChefFilterOptions = props => {
  const [fullAddress, setFullAddress] = useState(props.location);
  const [latitude, setLatitude] = useState(null);
  const [longtitude, setLongtitude] = useState(null);

  function filterByLocation(place) {
    if (props.filterByLocation && fullAddress && place) {
      props.filterByLocation(
        fullAddress,
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
    }
  }
  function ClearFilter() {
    Router.push({
      pathname: n.CHEF_LIST,
    });
    setFullAddress('');
    if (props.filterByLocation) {
      props.filterByLocation(null, null, null);
    }
  }
  function getCurrentLocation(lat, lon) {
    if (lat && lon) {
      axios
        .post(`${s.GOOGLEAPI}${lat},${lon}${s.KEY}${MAPAPIKEY}`)
        .then(locationData => {
          if (locationData && locationData.data && locationData.data.results[0]) {
            setFullAddress(locationData.data.results[0].formatted_address);
            if (props.filterByLocation) {
              props.filterByLocation(locationData.data.results[0].formatted_address, lat, lon);
            }
          }
        })
        .catch(error => {
          toastMessage(renderError, error.message);
        });
    }
  }

  return (
    <div className="row">
      <div className="products-filter-options col-md-12 col-lg-12">
        <div className="location-filter-modal" id="location-modal-view">
          <div className="row align-items-center">
            <p className="totalCount">
              Showing{' '}
              {props.firstParams > props.listTotalCount ? props.listTotalCount : props.firstParams}{' '}
              of {props.listTotalCount} results
            </p>
          </div>
          <div className="list-location" id="location-filter-view" style={{ display: 'flex' }}>
            <Autocomplete
              className="form-control"
              placeholder="Enter location"
              value={fullAddress}
              onChange={event => setFullAddress(event.target.value)}
              onPlaceSelected={place => {
                setFullAddress(place.formatted_address ? place.formatted_address : '');
                filterByLocation(place);
              }}
              types={['(cities)']}
            />
            <Geolocation
              render={({
                fetchingPosition,
                position: { coords: { latitude, longitude } = {} } = {},
                error,
                getCurrentPosition,
              }) => (
                // <button
                //   className="btn btn-primary clear-field"
                //   onClick={() => getCurrentLocation(latitude, longitude)}
                //   aria-hidden="true"
                // >
                <div className="list-Icon-view">
                  <i
                    className="fa fa-crosshairs crossStyle"
                    onClick={() => getCurrentLocation(latitude, longitude)}
                    id="current-locaton-view"
                  ></i>
                </div>
                // </button>
              )}
            />
            <button
              className="btn btn-primary clear-field"
              onClick={() => ClearFilter()}
              aria-hidden="true"
            >
              <i className="fa fa-times crossStyle" id="clear-button"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefFilterOptions;
