import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { toastMessage, renderError, success, error } from '../../../../utils/Toast';
import * as util from '../../../../utils/checkEmptycondition';
import {
  getChefId,
  chefId,
  chef,
  customer,
  customerPreferenceId,
  getCustomerId,
} from '../../../../utils/UserType';
import gql from 'graphql-tag';
import * as gqlTag from '../../../../common/gql';
import s from '../../../profile-setup/ProfileSetup.String';

const cuisineDataTag = gqlTag.query.master.allCuisinesByStatusGQLTAG;
const savePreferenceTag = gqlTag.mutation.customer.updatePreferencesGQLTAG;

//for getting cuisine data
const GET_CUISINE_DATA = gql`
  ${cuisineDataTag}
`;

const SAVE_PREFERENCE = gql`
  ${savePreferenceTag}
`;

// for customer preference
const customerpreference = gqlTag.subscription.customer.preferenceGQLTAG;
const CUTOMER_PREFERENCE_SUBS = gql`
  ${customerpreference}
`;

//customer
const customerDataTag = gqlTag.query.customer.profileByIdGQLTAG;
//for getting customer data
const GET_CUSTOMER_DATA = gql`
  ${customerDataTag}
`;

const FavoriteCuisine = props => {
  const [customerPreferenceIdValue, setCustomerPreferenceId] = useState('');

  const [selectedFavouriteCuisine, setSelectedFavouriteCuisine] = useState('');
  const [selectedCuisinesId, setSelectedCuisinesId] = useState([]);
  const [cuisineCount, setCuisineCount] = useState();
  const [cusinesMasterList, setCuisinesMasterList] = useState([]);
  const [customerSavedCuisines, setCustomerSavedCuisines] = useState([]);
  const [typedCuisine, setTypedCuisine] = useState('');

  const [getCuisineDataQuery, getCusineData] = useLazyQuery(GET_CUISINE_DATA, {
    variables: { statusId: 'APPROVED' },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  }); //get cuisine data

  const [getCustomerData, customerData] = useLazyQuery(GET_CUSTOMER_DATA, {
    variables: { customerId: props.customerId },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const { SubscriptionCustomerdata } = useSubscription(CUTOMER_PREFERENCE_SUBS, {
    variables: { customerId: props.customerId },
    onSubscriptionData: res => {
      if (res) {
        getCustomerData();
      }
    },
  });

  const [updateFavouritePreferenceValues, { data }] = useMutation(SAVE_PREFERENCE, {
    onCompleted: data => {
      toastMessage(success, 'Favorite cuisines updated successfully');
      if (props.nextStep) props.nextStep();
    },
    onError: err => {
      toastMessage('error', err);
    },
  });

  useEffect(() => {
    if (props.customerId) {
      getCuisineDataQuery();
      getCustomerData();
    }
  }, [props.customerId]);

  useEffect(() => {
    getCustomerId(customerPreferenceId)
      .then(res => {
        setCustomerPreferenceId(res);
      })
      .catch(err => {});
  });

  useEffect(() => {
    // let customerData = props.details;
    if (
      util.isObjectEmpty(customerData) &&
      util.hasProperty(customerData, 'data') &&
      util.isObjectEmpty(customerData.data) &&
      util.hasProperty(customerData.data, 'customerProfileByCustomerId') &&
      util.isObjectEmpty(customerData.data.customerProfileByCustomerId) &&
      util.hasProperty(
        customerData.data.customerProfileByCustomerId,
        'customerPreferenceProfilesByCustomerId'
      ) &&
      util.isObjectEmpty(
        customerData.data.customerProfileByCustomerId.customerPreferenceProfilesByCustomerId
      ) &&
      util.isArrayEmpty(
        customerData.data.customerProfileByCustomerId.customerPreferenceProfilesByCustomerId.nodes
      ) &&
      util.isObjectEmpty(
        customerData.data.customerProfileByCustomerId.customerPreferenceProfilesByCustomerId
          .nodes[0]
      )
    ) {
      let propsData =
        customerData.data.customerProfileByCustomerId.customerPreferenceProfilesByCustomerId
          .nodes[0];
      setSelectedCuisinesId(propsData.customerCuisineTypeId);
      setTypedCuisine(
        propsData.customerOtherCuisineTypes ? JSON.parse(propsData.customerOtherCuisineTypes) : ''
      );
    }
  }, [props.details, customerData]);

  //getting cuisnes list from master table getAllergyData
  useEffect(() => {
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
    if (util.isArrayEmpty(cusinesMasterList) && util.isArrayEmpty(selectedCuisinesId)) {
      let data = selectedCuisinesId;
      let dishData = [];

      cusinesMasterList.map((res, key) => {
        let index = data.indexOf(res.value);
        if (index > -1) {
          let option = {
            label: res.label,
            value: res.value,
          };
          dishData.push(option);
        }
      });
      setSelectedFavouriteCuisine(dishData);
      setCuisineCount(dishData.length);
    } else {
      setSelectedFavouriteCuisine([]);
    }
  }, [cusinesMasterList, selectedCuisinesId]);

  function saveFavourite(event) {
    event.preventDefault();
    updateFavouritePreferenceValues({
      variables: {
        customerPreferenceId: customerPreferenceIdValue,
        customerCuisineTypeId: selectedCuisinesId ? selectedCuisinesId : [],
        customerOtherCuisineTypes: typedCuisine ? JSON.stringify(typedCuisine) : null,
      },
    });
  }
  function handleChange(value, stateAssign, stateAssignForId, type) {
    let data = [];
    if (util.isArrayEmpty(value)) {
      value.map(res => {
        data.push(res.value);
      });
      if (props.uploadingData) {
        props.uploadingData(data, 'array', 'favourite');
      }
      stateAssign(value);
      stateAssignForId(data);
      if (type === 'cuisine') {
        setCuisineCount(data.length);
      }
    } else {
      if (type === 'cuisine') {
        setCuisineCount(0);
      }
      stateAssign([]);
      stateAssignForId([]);
    }
  }
  function onTypingCuisine(event) {
    setTypedCuisine(event.target.value);
    // if (props.uploadingData) {
    //   props.uploadingData(event.target.value, 'string', 'favourite')
    // }
  }
  return (
    <section className="products-collections-area ptb-60 ProfileSetup">
      <form className="login-form">
        <div className="section-title" id="title-content">
          <h2>Favorite Cuisine</h2>
        </div>
        <div className="main-margin" style={{ marginTop: '20px', marginBottom: '100px' }}>
          <div className="card">
            <div className="card-body">
              <div className="displayDishCuisine">
                <h4 className="card-title" id="headerTitle">
                  {s.FAVORITE_CUISINE}
                </h4>
                <p className="cuisine">( {cuisineCount > 0 ? cuisineCount : 0} items selected)</p>
              </div>
              <Select
                isMulti={true}
                isSearchable={true}
                value={selectedFavouriteCuisine}
                onChange={value =>
                  handleChange(value, setSelectedFavouriteCuisine, setSelectedCuisinesId, 'cuisine')
                }
                options={cusinesMasterList}
                // onCreateOption={value => handleFavoriteCreateOption(value)}
                placeholder="Select favourite cuisine"
              />
              <div className="form-group">
                <textarea
                  style={{
                    height: '85px',
                    paddingBottom: 10,
                    paddingTop: 10,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '10px',
                    border: '1px solid',
                  }}
                  id="comment"
                  className="form-control"
                  rows="8"
                  placeholder="Enter any new cuisine"
                  value={typedCuisine}
                  data-error="Please enter your experience"
                  onChange={event => onTypingCuisine(event)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="save-button-modal">
          <button
            className="btn btn-primary"
            id="submit-modal-button"
            onClick={() => saveFavourite(event)}
          >
            Save
          </button>
        </div>
      </form>
    </section>
  );
};

export default FavoriteCuisine;
