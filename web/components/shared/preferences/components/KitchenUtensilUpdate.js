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
import { StoreInLocal, GetValueFromLocal } from '../../../../utils/LocalStorage';

// const listKitchenTag = gqlTag.query.master.allKitchenEquipmentsByStatusGQLTAG;
const listKitchenTag = gqlTag.query.master.allKitchenEquipmentsGQLTAG;
const savePreferenceTag = gqlTag.mutation.customer.updatePreferencesGQLTAG;

const LIST_KITCHEN = gql`
  ${listKitchenTag}
`;

const SAVE_PREFERENCE = gql`
  ${savePreferenceTag}
`;

//update screen
const updateScreens = gqlTag.mutation.customer.updateScreensGQLTAG;

const UPDATE_SCREENS = gql`
  ${updateScreens}
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

const createOrSaveBooking = gqlTag.mutation.booking.createOrSaveBookingGQLTAG;
const CREATE_OR_STORE_BOOKING = gql`
  ${createOrSaveBooking}
`;

const KitchenUtensilsUpdate = props => {
  let sampleArray = [];

  const [customerPreferenceIdValue, setCustomerPreferenceId] = useState('');

  const [selectedUtensiles, setSelectedUtensils] = useState('');
  const [utensilsMasterList, setUtensilsMasterList] = useState([]);
  const [typedUtensile, setTypedUtensile] = useState('');
  const [savedUtensils, setSavedUtensils] = useState([]);
  const [isvaluePresent, setIsValuePresent] = useState([]);
  const [isCheckBoxChanged, setIsCheckBoxChanged] = useState(false);
  const [customerPreferenceId, setCustomerPreference] = useState(null);

  const [getKitchenDataQuery, getKitchenData] = useLazyQuery(LIST_KITCHEN, {
    variables: { statusId: 'APPROVED' },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

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

  const [createOrStore, response] = useMutation(CREATE_OR_STORE_BOOKING, {
    onCompleted: response => {
      let variables = {
        customerKitchenEquipmentTypeId:
          selectedUtensiles && selectedUtensiles.length > 0
            ? selectedUtensiles
            : selectedUtensiles.length === 0 && isCheckBoxChanged
            ? []
            : savedUtensils,
        customerOtherKitchenEquipmentTypes: typedUtensile ? JSON.stringify(typedUtensile) : null,
      };
      props.kitchenUtensilsFormCallBack(variables, response);
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  const [updateKitchenPreferenceValues, { data }] = useMutation(SAVE_PREFERENCE, {
    onCompleted: data => {
      // To get the updated screens value
      let screensValue = [];
      GetValueFromLocal('SharedProfileScreens')
        .then(result => {
          if (result && result.length > 0) {
            screensValue = result;
          }
          screensValue.push('KITCHEN_EQUIPMENT');
          screensValue = _.uniq(screensValue);
          let variables = {
            customerId: props.customerId,
            customerUpdatedScreens: screensValue,
          };
          StoreInLocal('SharedProfileScreens', screensValue);
          updateScrrenTag({ variables });
        })
        .catch(err => {
          //console.log('err', err);
        });
      if (props.screenName !== 'booking') {
        toastMessage(success, 'Kitchen equipments updated successfully');
      }
      // Naaziya: As we use this component in register too
      if (props && props.nextStep) {
        props.nextStep();
      }
      if (props && props.screenName && props.screenName === 'booking') {
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
          dishTypeId: props.response.selectedDishesId ? props.response.selectedDishesId : null,
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
          kitchenEquipmentTypeIds:
            selectedUtensiles && selectedUtensiles.length > 0
              ? selectedUtensiles
              : selectedUtensiles.length === 0 && isCheckBoxChanged
              ? []
              : savedUtensils,
          otherKitchenEquipmentTypes: typedUtensile ? JSON.stringify(typedUtensile) : null,
          noOfGuests: props.bookingDetail.chefBookingNoOfPeople
            ? props.bookingDetail.chefBookingNoOfPeople
            : null,
          complexity: props.bookingDetail.chefBookingComplexity
            ? props.bookingDetail.chefBookingComplexity
            : null,
          storeTypeIds: props.bookingDetail.chefBookingStoreTypeId
            ? props.bookingDetail.chefBookingStoreTypeId
            : null,
          otherStoreTypes: props.bookingDetail.chefBookingOtherStoreTypes
            ? props.bookingDetail.chefBookingOtherStoreTypes
            : null,
          additionalServices: props.bookingDetail.chefBookingAdditionalServices
            ? JSON.parse(props.bookingDetail.chefBookingAdditionalServices)
            : null,
          dishTypeId: props.bookingDetail.chefBookingDishTypeId
            ? props.bookingDetail.chefBookingDishTypeId
            : null,
        };
        createOrStore({ variables });
      }
    },
    onError: err => {
      toastMessage('error', err);
    },
  });

  const [updateScrrenTag, { loading, error }] = useMutation(UPDATE_SCREENS, {
    onCompleted: data => {
      // toastMessage(success, 'Favourite cuisines updated successfully');
    },
    onError: err => {},
  });

  useEffect(() => {
    if (props.customerId) {
      getKitchenDataQuery();
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
    if (
      util.isObjectEmpty(getKitchenData) &&
      util.hasProperty(getKitchenData, 'data') &&
      util.isObjectEmpty(getKitchenData.data) &&
      util.hasProperty(getKitchenData.data, 'allKitchenEquipmentTypeMasters') &&
      util.isObjectEmpty(getKitchenData.data.allKitchenEquipmentTypeMasters) &&
      util.isArrayEmpty(getKitchenData.data.allKitchenEquipmentTypeMasters.nodes)
    ) {
      let data = [],
        checkBoxvalue = [];
      getKitchenData.data.allKitchenEquipmentTypeMasters.nodes.map((res, key) => {
        if (res) {
          let isValuePresenet = savedUtensils.includes(res.kitchenEquipmentTypeId);
          checkBoxvalue.push(isValuePresenet);
          let option = {
            label: res.kitchenEquipmentTypeDesc,
            value: res.kitchenEquipmentTypeId,
          };
          data.push(option);
        }
      });
      setIsValuePresent(checkBoxvalue);
      setUtensilsMasterList(data);
    } else {
      setUtensilsMasterList([]);
    }
  }, [getKitchenData, savedUtensils]);

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
      let preferenceId =
        customerData.data.customerProfileByCustomerId.customerPreferenceProfilesByCustomerId
          .nodes[0].customerPreferenceId;
      setCustomerPreference(preferenceId);
      let propsData =
        customerData.data.customerProfileByCustomerId.customerPreferenceProfilesByCustomerId
          .nodes[0];
      setSavedUtensils(
        propsData.customerKitchenEquipmentTypeId ? propsData.customerKitchenEquipmentTypeId : []
      );
      setTypedUtensile(
        propsData.customerOtherKitchenEquipmentTypes
          ? JSON.parse(propsData.customerOtherKitchenEquipmentTypes)
          : ''
      );
    }
  }, [props.details, customerData]);

  function onSelectCheckbox(label, type, index) {
    setIsCheckBoxChanged(true);
    let deleteArray = isvaluePresent;
    deleteArray[index] = !isvaluePresent[index];
    setIsValuePresent(deleteArray);

    deleteArray.map((res, index) => {
      if (res) {
        sampleArray.push(utensilsMasterList[index].value);
      }
    });
    setSelectedUtensils(sampleArray);
    // if (props.uploadingData) {
    //   props.uploadingData(sampleArray, 'array', 'kitchen');
    // }
  }
  function onTypingKitchen(value) {
    setTypedUtensile(value);
    // if (props.uploadingData) {
    //   props.uploadingData(value, 'string', 'kitchen');
    // }
  }
  function checkValueInDb(value) {
    let isValuePresenet = savedUtensils.includes(value);
    return isValuePresenet ? isValuePresenet : undefined;
  }
  function updateKitchenPreference(event) {
    event.preventDefault();
    updateKitchenPreferenceValues({
      variables: {
        customerPreferenceId: customerPreferenceId,
        customerKitchenEquipmentTypeId:
          selectedUtensiles && selectedUtensiles.length > 0
            ? selectedUtensiles
            : selectedUtensiles.length === 0 && isCheckBoxChanged
            ? []
            : savedUtensils,
        customerOtherKitchenEquipmentTypes: typedUtensile ? JSON.stringify(typedUtensile) : null,
      },
    });
  }

  function kitchenUtensilsFormCallBack() {
    let variables = {
      customerKitchenEquipmentTypeId:
        selectedUtensiles && selectedUtensiles.length > 0
          ? selectedUtensiles
          : selectedUtensiles.length === 0 && isCheckBoxChanged
          ? []
          : savedUtensils,
      customerOtherKitchenEquipmentTypes: typedUtensile ? JSON.stringify(typedUtensile) : null,
    };
    props.kitchenUtensilsFormCallBack(variables, response);
  }

  function backKitchenUtensilsFormCallBack() {
    props.backKitchenUtensilsFormCallBack();
  }

  return (
    <section
      className={`products-collections-area ptb-60 ProfileSetup 
    ${props.screen === 'register' ? 'base-rate-info' : ''}`}
      id="sction-card-modal"
    >
      <form className="login-form">
        <div className="section-title" id="title-content">
          <h2 style={{ fontSize: '20px', textDecoration: 'underline' }}>Kitchen Equipment</h2>
        </div>
        <div className="section-title" id="title-content">
          <h2 style={{ fontSize: '20px', textDecoration: 'underline' }}>
            What type of kitchen equipment do you have?
          </h2>
        </div>
        {/* <div className="card"> */}
        {/* <div className="card-body"> */}
        <div className="container">
          {utensilsMasterList &&
            utensilsMasterList.map((res, index) => {
              return (
                <div
                  className="row"
                  id="availabilityRow"
                  style={{ wordBreak: 'break-word', paddingLeft: '10px' }}
                >
                  <div>
                    <div className="buy-checkbox-btn" id="checkBoxView">
                      <div className="item">
                        <input
                          className="inp-cbx"
                          id={res.value}
                          type="checkbox"
                          checked={isvaluePresent[index]}
                          onChange={event => {
                            event.persist();
                            onSelectCheckbox(res.value, 'kitchen', index);
                          }}
                        />
                        <label className="cbx" htmlFor={res.value}>
                          <span>
                            <svg width="12px" height="10px" viewBox="0 0 12 10">
                              <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                            </svg>
                          </span>
                          <span className="dietary-name-view">{res.label}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          <div className="form-group">
            <textarea
              style={{
                height: '85px',
                paddingBottom: 10,
                paddingTop: 10,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid',
              }}
              id="comment"
              className="form-control"
              rows="8"
              placeholder="Please specify any additional kitchen equipment you might have."
              value={typedUtensile}
              data-error="Please enter your experience"
              onChange={event => onTypingKitchen(event.target.value)}
            />
          </div>
        </div>
        {/* </div> */}
        {/* </div> */}
      </form>
      <div className="save-button-modal" style={{ width: '97%' }}>
        {props.screenName !== 'booking' && (
          <button
            className="btn btn-primary"
            id="submit-modal-button"
            onClick={() => updateKitchenPreference(event)}
            style={{ marginBottom: '5%' }}
          >
            Save
          </button>
        )}
        {props.screenName === 'booking' && (
          <div className="backbutton-modal-view">
            <button
              className="btn btn-primary"
              id="submit-modal-button"
              onClick={() => backKitchenUtensilsFormCallBack()}
              style={{ marginBottom: '5%' }}
            >
              Back
            </button>
          </div>
        )}
        {props.screenName === 'booking' && (
          <button
            className="btn btn-primary"
            id="submit-modal-button"
            onClick={() => updateKitchenPreference(event)}
            style={{ marginBottom: '5%' }}
          >
            Next
          </button>
        )}
      </div>
    </section>
  );
};

export default KitchenUtensilsUpdate;
