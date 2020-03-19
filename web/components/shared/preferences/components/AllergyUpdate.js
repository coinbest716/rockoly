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

// const listAllergyTag = gqlTag.query.master.allAllergyByStatusGQLTAG;
const listAllergyTag = gqlTag.query.master.allAllergyGQLTAG;
const savePreferenceTag = gqlTag.mutation.customer.updatePreferencesGQLTAG;
const listCustomerAllergy = gqlTag.query.master.allergyByCustomerIdGQLTAG;

const LIST_ALLERGY = gql`
  ${listAllergyTag}
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

const AllergyUpdate = props => {
  let sampleArray = [];
  const [customerPreferenceIdValue, setCustomerPreferenceId] = useState('');

  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [allergiesMasterList, setAllergiesMasterList] = useState('');
  const [typedAllergies, setTypedAllergies] = useState('');
  const [savedAllergies, setSavedAllergies] = useState([]);
  const [isvaluePresent, setIsValuePresent] = useState([]);
  const [isCheckBoxChanged, setIsCheckBoxChanged] = useState(false);
  const [customerPreferenceId, setCustomerPreference] = useState(null);

  const [getAllergyDataQuery, getAllergyData] = useLazyQuery(LIST_ALLERGY, {
    variables: { statusId: 'APPROVED' },
    onError: err => {
      toastMessage('renderError', err);
    },
  }); //get cuisine data LIST_DIETARY

  const [getCustomerData, customerData] = useLazyQuery(GET_CUSTOMER_DATA, {
    variables: { customerId: props.customerId },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [updateAllergyPreference, { data }] = useMutation(SAVE_PREFERENCE, {
    onCompleted: data => {
      // To get the updated screens value
      let screensValue = [];
      GetValueFromLocal('SharedProfileScreens')
        .then(result => {
          if (result && result.length > 0) {
            screensValue = result;
          }
          screensValue.push('ALLERGY');
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
        toastMessage(success, 'Allergies updated successfully');
      }
      // Naaziya: As we use this component in register too
      if (props && props.nextStep) {
        props.nextStep();
      }
      if (props && props.screenName && props.screenName === 'booking') {
        let values = {
          customerPreferenceId: customerPreferenceIdValue,
          customerAllergyTypeId:
            selectedAllergies && selectedAllergies.length > 0
              ? selectedAllergies
              : selectedAllergies.length === 0 && isCheckBoxChanged
              ? []
              : savedAllergies,
          customerOtherAllergyTypes: typedAllergies ? JSON.stringify(typedAllergies) : null,
        };
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
          allergyTypeIds:
            selectedAllergies && selectedAllergies.length > 0
              ? selectedAllergies
              : selectedAllergies.length === 0 && isCheckBoxChanged
              ? []
              : savedAllergies,
          otherAllergyTypes: typedAllergies ? JSON.stringify(typedAllergies) : null,
          dietaryRestrictionsTypesIds: props.bookingDetail.chefBookingDietaryRestrictionsTypeId
            ? props.bookingDetail.chefBookingDietaryRestrictionsTypeId
            : null,
          otherDietaryRestrictionsTypes: props.bookingDetail
            .chefBookingOtherDietaryRestrictionsTypes
            ? props.bookingDetail.chefBookingOtherDietaryRestrictionsTypes
            : null,
          kitchenEquipmentTypeIds: props.bookingDetail.chefBookingKitchenEquipmentTypeId
            ? props.bookingDetail.chefBookingKitchenEquipmentTypeId
            : null,
          otherKitchenEquipmentTypes: props.bookingDetail.chefBookingOtherKitchenEquipmentTypes
            ? props.bookingDetail.chefBookingOtherKitchenEquipmentTypes
            : null,
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

  const { SubscriptionCustomerdata } = useSubscription(CUTOMER_PREFERENCE_SUBS, {
    variables: { customerId: props.customerId },
    onSubscriptionData: res => {
      if (res) {
        getCustomerData();
      }
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
      getAllergyDataQuery();
      getCustomerData();
    }
  }, [props.customerId]);

  useEffect(() => {
    getCustomerId('customerPreferenceId')
      .then(res => {
        setCustomerPreferenceId(res);
      })
      .catch(err => {});
  });

  // useEffect(() => {
  //   if (props.isTriggerSubs) {
  //     getAllergyDataQuery();
  //   }
  // }, [props.isTriggerSubs]);
  //customerProfileByCustomerId

  //getting AllergyData list from master table get getDietaryData
  useEffect(() => {
    if (
      util.isObjectEmpty(getAllergyData) &&
      util.hasProperty(getAllergyData, 'data') &&
      util.isObjectEmpty(getAllergyData.data) &&
      util.hasProperty(getAllergyData.data, 'allAllergyTypeMasters') &&
      util.isObjectEmpty(getAllergyData.data.allAllergyTypeMasters) &&
      util.isArrayEmpty(getAllergyData.data.allAllergyTypeMasters.nodes)
    ) {
      let data = [],
        checkBoxvalue = [];

      getAllergyData.data.allAllergyTypeMasters.nodes.map((res, key) => {
        if (res) {
          let isValuePresenet = savedAllergies.includes(res.allergyTypeId);
          checkBoxvalue.push(isValuePresenet);
          let option = {
            label: res.allergyTypeDesc,
            value: res.allergyTypeId,
          };
          data.push(option);
        }
      });
      setAllergiesMasterList(data);
      setIsValuePresent(checkBoxvalue);
      // setSelectedAllergy(data)
    } else {
      setAllergiesMasterList([]);
    }
  }, [getAllergyData, savedAllergies]);

  useEffect(() => {
    if (
      util.isObjectEmpty(customerData) &&
      util.hasProperty(customerData, 'data') &&
      util.isObjectEmpty(customerData.data) &&
      util.hasProperty(customerData.data, 'customerProfileByCustomerId') &&
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
      setSavedAllergies(propsData.customerAllergyTypeId ? propsData.customerAllergyTypeId : []);
      setTypedAllergies(
        propsData.customerOtherAllergyTypes ? JSON.parse(propsData.customerOtherAllergyTypes) : ''
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
        sampleArray.push(allergiesMasterList[index].value);
      }
    });
    setSelectedAllergies(sampleArray);
  }

  const [createOrStore, response] = useMutation(CREATE_OR_STORE_BOOKING, {
    onCompleted: response => {
      let values = {
        customerPreferenceId: customerPreferenceIdValue,
        customerAllergyTypeId:
          selectedAllergies && selectedAllergies.length > 0
            ? selectedAllergies
            : selectedAllergies.length === 0 && isCheckBoxChanged
            ? []
            : savedAllergies,
        customerOtherAllergyTypes: typedAllergies ? JSON.stringify(typedAllergies) : null,
      };
      props.AllergyFormCallBack(values, response);
      // props.AllergyFormCallBack(values);
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  function updateAllergy(event) {
    event.preventDefault();

    updateAllergyPreference({
      variables: {
        customerPreferenceId: customerPreferenceId,
        customerAllergyTypeId:
          selectedAllergies && selectedAllergies.length > 0
            ? selectedAllergies
            : selectedAllergies.length === 0 && isCheckBoxChanged
            ? []
            : savedAllergies,
        customerOtherAllergyTypes: typedAllergies ? JSON.stringify(typedAllergies) : null,
      },
    });
  }

  function onTypingAllergy(value) {
    setTypedAllergies(value);
    // if (props.uploadingData) {
    //   props.uploadingData(value, 'string', 'allergy');
    // }
  }

  function submitAllergy() {
    if (props && props.AllergyFormCallBack) {
      let values = {
        customerPreferenceId: customerPreferenceIdValue,
        customerAllergyTypeId:
          selectedAllergies && selectedAllergies.length > 0
            ? selectedAllergies
            : selectedAllergies.length === 0 && isCheckBoxChanged
            ? []
            : savedAllergies,
        customerOtherAllergyTypes: typedAllergies ? JSON.stringify(typedAllergies) : null,
      };
      props.AllergyFormCallBack(values);
    }
  }

  function backAllergyFormCallBack() {
    props.backAllergyFormCallBack();
  }

  return (
    <section
      className={`products-collections-area ptb-60 ProfileSetup 
    ${props.screen === 'register' ? 'base-rate-info' : ''}`}
      // className="products-collections-area ptb-60 ProfileSetup"
      id="sction-card-modal"
    >
      <form className="login-form">
        <div className="section-title" id="title-content">
          <h2 style={{ fontSize: '20px', textDecoration: 'underline' }}>Allergies</h2>
        </div>
        <div className="section-title" id="title-content">
          <h2 style={{ fontSize: '20px', textDecoration: 'underline' }}>
            Do you have any allergies?
          </h2>
        </div>

        {/* <div className="card"> */}
        {/* <div className="card-body"> */}
        <div className="container">
          {allergiesMasterList &&
            allergiesMasterList.map((res, index) => {
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
                            onSelectCheckbox(res.value, 'dietary', index);
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
        </div>
        {/* <div className="displayDishCuisine" style={{ paddingLeft: '10px' }}>
          <h4 className="card-title cuisine" id="headerTitle">
            {s.ALLERGIES}
          </h4>
        </div> */}
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
            placeholder={s.ALLERGIES}
            value={typedAllergies}
            data-error="Please enter your experience"
            onChange={event => onTypingAllergy(event.target.value)}
          />
        </div>
        {/* </div> */}
        {/* </div> */}

        <div className="save-button-modal">
          {props.screenName !== 'booking' && (
            <button
              className="btn btn-primary"
              id="submit-modal-button"
              onClick={() => updateAllergy(event)}
            >
              Save
            </button>
          )}
          {props.screenName === 'booking' && (
            <div className="backbutton-modal-view">
              <button
                className="btn btn-primary"
                id="submit-modal-button"
                onClick={() => backAllergyFormCallBack()}
              >
                Back
              </button>
            </div>
          )}
          {props.screenName === 'booking' && (
            <button
              className="btn btn-primary"
              id="submit-modal-button"
              onClick={() => updateAllergy(event)}
            >
              Next
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default AllergyUpdate;
