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

const updateLocationData = gqlTag.mutation.chef.changeLocationGQLTag; // chef
const updateCustomerLocationData = gqlTag.mutation.customer.changeLocationGQLTag; // chef

//for updating chef's location
const UPDATE_LOCATION_INFO = gql`
  ${updateLocationData}
`;

const UPDATE_CUSTOMER_LOCATION_INFO = gql`
  ${updateCustomerLocationData}
`;
const Location = props => {
  // In order to gain access to the child component instance,
  // you need to assign it to a `ref`, so we call `useRef()` to get one
  const childRef = useRef();
  const [chefProfileExtendedsByChefId, setChefProfileExtendedsByChefId] = useState('');
  const [customerProfileExtendedsByCustomerId, setCustomerProfileExtendedsByCustomerId] = useState(
    ''
  );
  const [updateLocationInfo, { data }] = useMutation(UPDATE_LOCATION_INFO, {
    onCompleted: data => {
      toastMessage(success, s.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  const [updateCustomerLocationInfo, { dataValue }] = useMutation(UPDATE_CUSTOMER_LOCATION_INFO, {
    onCompleted: dataValue => {
      toastMessage(success, s.SUCCESS_MSG);
    },
    onError: err => {
      // console.log('errerrerr', err);
      toastMessage(renderError, err);
    },
  });
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
  }, [props.chefDetails]);

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

  //when saving data
  async function handleSubmit() {
    try {
      const {
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
      } = await childRef.current.getLocationValue();
      // e.preventDefault();
      if (
        util.isStringEmpty(chefProfileExtendedsByChefId) &&
        util.isStringEmpty(fullAddress) &&
        util.isStringEmpty(latitude) &&
        util.isStringEmpty(longitude) &&
        util.isStringEmpty(houseNo) &&
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
        util.isStringEmpty(houseNo) &&
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
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  try {
    return (
      <React.Fragment>
        <section className="products-collections-area  ProfileSetup">
          <form className="login-form">
            <div className="row">
              <div className="col-sm-12">
                <div className="login-content" style={{ marginTop: '2%' }}>
                  <div className="container">
                    <div className="signup-content">
                      <div className="section-title" id="title-content">
                        <h2>{s.EDIT_LOCATION_INFORMATION}</h2>
                      </div>
                      <CommonLocation ref={childRef} props={props} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="saveButton">
            <button type="submit" className="btn btn-primary" onClick={() => handleSubmit()}>
              {s.SAVE}
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
