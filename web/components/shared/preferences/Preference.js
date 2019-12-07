import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { toastMessage, renderError, success, error } from '../../../utils/Toast';
import * as util from '../../../utils/checkEmptycondition';
import {
  getChefId,
  chefId,
  chef,
  customer,
  customerPreferenceId,
  getCustomerId,
} from '../../../utils/UserType';
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import s from '../../profile-setup/ProfileSetup.String';
import AllergyUpdate from './components/AllergyUpdate';
import DietaryRestrictions from './components/DietaryrestrictionsUpdate';
import KitchenUtensilsUpdate from './components/KitchenUtensilUpdate';
import FavoriteCuisine from './components/FavouriteCuisine';

const cuisineDataTag = gqlTag.query.master.cuisineGQLTAG;
const listAllergyTag = gqlTag.query.master.allAllergyByStatusGQLTAG;
const listDietaryTag = gqlTag.query.master.allDietaryRestrictionsByStatusGQLTAG;
const listKitchenTag = gqlTag.query.master.allKitchenEquipmentsByStatusGQLTAG;
const savePreferenceTag = gqlTag.mutation.customer.updatePreferencesGQLTAG;
const listCustomerAllergy = gqlTag.query.master.allergyByCustomerIdGQLTAG;


//for getting cuisine data
const GET_CUISINE_DATA = gql`
  ${cuisineDataTag}
`;

const LIST_ALLERGY = gql`
  ${listAllergyTag}
`;

const LIST_DIETARY = gql`
  ${listDietaryTag}
`;

const LIST_KITCHEN = gql`
  ${listKitchenTag}
`;

const SAVE_PREFERENCE = gql`
  ${savePreferenceTag}
`;

const LIST_CUSTOMER_ALLERGY = gql`
  ${listCustomerAllergy}
`;

const Preference = props => {

  const [customerPreferenceIdValue, setCustomerPreferenceId] = useState('');

  const [savedAllergies, setSavedAllergies] = useState([]);
  const [savedDietary, setSavedDietary] = useState([]);
  const [savedUtensils, setSavedUtensils] = useState([]);
  const [savedCuisines, setSavedCuisines] = useState([]);


  const [typedAllergies, setTypedAllergies] = useState('')
  const [typedDietary, setTypedDietary] = useState('');
  const [typedUtensile, setTypedUtensile] = useState('');
  const [typedFavourite, setTypedfavourite] = useState('');

  const [favouriteCuisines, setFavouriteCuisines] = useState([]);

  const [isTriggerSubs, setIsTriggerSubs] = useState(false);

  const [getCuisineDataQuery, getCusineData] = useLazyQuery(GET_CUISINE_DATA, {
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  }); //get cuisine data

  const [getAllergyDataQuery, getAllergyData] = useLazyQuery(LIST_ALLERGY, {
    variables: { statusId: "APPROVED" },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  }); //get cuisine data LIST_DIETARY

  const [getDietaryDataQuery, getDietaryData] = useLazyQuery(LIST_DIETARY, {
    variables: { statusId: "APPROVED" },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  }); //get cuisine data LIST_DIETARY


  const [getKitchenDataQuery, getKitchenData] = useLazyQuery(LIST_KITCHEN, {
    variables: { statusId: "APPROVED" },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [updatePreferenceValues, { data }] = useMutation(SAVE_PREFERENCE, {
    onCompleted: data => {
      toastMessage(success, 'Values updated successfully');
      setIsTriggerSubs(true);
      getCuisineDataQuery();
      getAllergyDataQuery();
      getDietaryDataQuery();
      getKitchenDataQuery();
      getCustomerAllergy();
    },
    onError: err => {
      toastMessage('error', err);

    },
  });

  const [getCustomerAllergy, getAllergy] = useLazyQuery(LIST_CUSTOMER_ALLERGY, {
    variables: { pCustomerId: props.customerId },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  })
  useEffect(() => {
    if (props.customerId) {
      getCuisineDataQuery();
      getAllergyDataQuery();
      getDietaryDataQuery();
      getKitchenDataQuery();
      getCustomerAllergy();
    }
  }, [props]);

  useEffect(() => {
    getCustomerId(customerPreferenceId)
      .then(res => {
        setCustomerPreferenceId(res);
      })
      .catch(err => { });
  })

  //customerProfileByCustomerId
  useEffect(() => {
    let customerData = props.details;
    if (
      util.isObjectEmpty(customerData) &&
      util.hasProperty(customerData, 'customerProfileByCustomerId') &&
      util.isObjectEmpty(customerData.customerProfileByCustomerId)
      &&
      util.hasProperty(customerData.customerProfileByCustomerId, 'customerPreferenceProfilesByCustomerId')
      &&
      util.isObjectEmpty(customerData.customerProfileByCustomerId.customerPreferenceProfilesByCustomerId)
      &&
      util.isArrayEmpty(customerData.customerProfileByCustomerId.customerPreferenceProfilesByCustomerId.nodes)
      &&
      util.isObjectEmpty(customerData.customerProfileByCustomerId.customerPreferenceProfilesByCustomerId.nodes[0])
    ) {
      let propsData = customerData.customerProfileByCustomerId.customerPreferenceProfilesByCustomerId.nodes[0];
      setSavedAllergies(propsData.customerAllergyTypeId)
      setSavedCuisines(propsData.customerCuisineTypeId)
      setSavedDietary(propsData.customerDietaryRestrictionsTypeId)
      setSavedUtensils(propsData.customerKitchenEquipmentTypeId)
      setTypedAllergies(propsData.customerOtherAllergyTypes ? JSON.parse(propsData.customerOtherAllergyTypes) : '');
      setTypedDietary(propsData.customerOtherDietaryRestrictionsTypes ? JSON.parse(propsData.customerOtherDietaryRestrictionsTypes) : '');
      setTypedUtensile(propsData.customerOtherKitchenEquipmentTypes ? JSON.parse(propsData.customerOtherKitchenEquipmentTypes) : '');
      setTypedfavourite(propsData.customerOtherCuisineTypes ? JSON.parse(propsData.customerOtherCuisineTypes) : "");
    }
  }, [props.details])


  //getting cuisnes list from master table getAllergyData

  function updatePreference(event) {
    event.preventDefault();
    updatePreferenceValues({
      variables: {
        customerPreferenceId: customerPreferenceIdValue,
        customerCuisineTypeId: savedCuisines ? savedCuisines : [],
        customerOtherCuisineTypes: typedFavourite ? JSON.stringify(typedFavourite) : null,
        customerAllergyTypeId: savedAllergies ? savedAllergies : [],
        customerOtherAllergyTypes: typedAllergies ? JSON.stringify(typedAllergies) : null,
        customerDietaryRestrictionsTypeId: savedDietary ? savedDietary : [],
        customerOtherDietaryRestrictionsTypes: typedDietary ? JSON.stringify(typedDietary) : null,
        customerKitchenEquipmentTypeId: savedUtensils ? savedUtensils : [],
        customerOtherKitchenEquipmentTypes: typedUtensile ? JSON.stringify(typedUtensile) : null
      },
    })
  }

  function uploadingData(data, dataType, preferenceType) {
    setFavouriteCuisines()
    if (dataType === 'array') {
      if (preferenceType === 'allergy') {
        // setSavedAllergies(savedAllergies => [...savedAllergies, data])
        setSavedAllergies(data)
      } else if (preferenceType === 'dietary') {
        setSavedDietary(data)
      } else if (preferenceType === 'kitchen') {
        setSavedUtensils(data)
      } else if (preferenceType === 'favourite') {
        if (savedCuisines.length === 0) {
          setSavedCuisines(data)
        } else {
          // data.map((value) => {
          setSavedCuisines(data)
          // })
        }
        // setSavedCuisines(data)
      }
    } else if (dataType === 'string') {
      if (preferenceType === 'allergy') {
        setTypedAllergies(data)
      } else if (preferenceType === 'dietary') {
        setTypedDietary(data)
      } else if (preferenceType === 'kitchen') {
        setTypedUtensile(data)
      } else if (preferenceType === 'favourite') {
        setTypedfavourite(data)
      }
    }
  }

  return (
    <section className="products-collections-area ptb-60 ProfileSetup">
      <div className="section-title" id="sectionTitle">
        <h2>{s.PREFERENCES}</h2>
      </div>
      <form className="login-form col-ls-10">
        <AllergyUpdate details={props.details}
          customerId={props.customerId}
          role={customer}
          uploadingData={uploadingData}
          isTriggerSubs={isTriggerSubs} />
        <DietaryRestrictions details={props.details}
          customerId={props.customerId}
          role={customer}
          uploadingData={uploadingData}
          isTriggerSubs={isTriggerSubs} />
        <KitchenUtensilsUpdate details={props.details}
          customerId={props.customerId}
          role={customer}
          uploadingData={uploadingData}
          isTriggerSubs={isTriggerSubs} />
        <FavoriteCuisine details={props.details}
          customerId={props.customerId}
          role={customer}
          uploadingData={uploadingData}
          isTriggerSubs={isTriggerSubs} />
        {/* <button className="btn btn-primary" onClick={() => updatePreference(event)}>
          SAVE
      </button> */}
      </form>
      <div className="container">
        <div className="saveButton">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => updatePreference(event)}
          >
            Save
            </button>
        </div>
      </div>
    </section>
  );
};

export default Preference;
