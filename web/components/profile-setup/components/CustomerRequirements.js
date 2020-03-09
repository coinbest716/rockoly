import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { toastMessage, renderError, success, error } from '../../../utils/Toast';
import * as util from '../../../utils/checkEmptycondition';
import {
  getChefId,
  chefId,
  chef,
  customer,
  customerProfileExtendedId,
  getCustomerId,
} from '../../../utils/UserType';
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import s from '../ProfileSetup.String';

const cuisineDataTag = gqlTag.query.master.cuisineByChefIdGQLTAG;
const createAllergyTag = gqlTag.mutation.master.createAllergyTypeGQLTAG;
const listAllergyTag = gqlTag.query.master.allergyTypesByCustomerIdGQLTAG;
const createDietaryTag = gqlTag.mutation.master.createDietaryRestrictionsTypeGQLTAG;
const listDietaryTag = gqlTag.query.master.dietaryRestrictionsTypesByCustomerIdGQLTAG;
const listKitchenTag = gqlTag.query.master.allKitchenEquipmentTypeMastersGQLTAG;

//for getting cuisine data
const GET_CUISINE_DATA = gql`
  ${cuisineDataTag}
`;

const CREATE_ALLERGY = gql`
  ${createAllergyTag}
`;

const LIST_ALLERGY = gql`
  ${listAllergyTag}
`;

const CREATE_DIETARY = gql`
  ${createDietaryTag}
`;
const LIST_DIETARY = gql`
  ${listDietaryTag}
`;

const LIST_KITCHEN = gql`
  ${listKitchenTag}
`;

const CustomerRequirements = props => {
  const [selectedAllergy, setSelectedAllergy] = useState('');
  const [selectedAllergyId, setSelectedAllergyId] = useState('');
  const [allergiesMasterList, setAllergiesMasterList] = useState('');
  const [allergyCount, setAllergyCount] = useState();

  const [selectedDietary, setSelectedDietary] = useState('');
  const [selectedDietaryId, setSelectedDietaryId] = useState('');
  const [dietaryMasterList, setDietaryMasterList] = useState('');
  const [dietaryCount, setDietaryCount] = useState();

  const [selectedUtensiles, setSelectedUtensils] = useState('');
  const [utensilsMasterList, setUtensilsMasterList] = useState([]);
  const [selectedUtensilsId, setSelectedUtensilsId] = useState('');
  const [utensilsCount, setUtensilsCount] = useState();

  const [selectedFavouriteCuisine, setSelectedFavouriteCuisine] = useState('');
  const [selectedCuisinesId, setSelectedCuisinesId] = useState([]);
  const [cuisineCount, setCuisineCount] = useState();
  const [cusinesMasterList, setCuisinesMasterList] = useState([]);
  const [customerSavedCuisines, setCustomerSavedCuisines] = useState([]);

  const [getCuisineDataQuery, getCusineData] = useLazyQuery(GET_CUISINE_DATA, {
    variables: { pChefId: '' },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  }); //get cuisine data

  const [getAllergyDataQuery, getAllergyData] = useLazyQuery(LIST_ALLERGY, {
    variables: { pCustomerId: props.customerId },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  }); //get cuisine data LIST_DIETARY

  const [insertNewAllergy, { cusineData }] = useMutation(CREATE_ALLERGY, {
    onCompleted: cusineData => {
      getAllergyDataQuery();
      let masterValue = cusineData.createAllergyTypeMaster.allergyTypeMaster;
      let cuisineList = [];
      cuisineList = cusinesMasterList;
      let option = {
        label: masterValue.cusineTypeName,
        value: masterValue.cuisineTypeId,
      };
      cuisineList.push(option);
      setCuisinesMasterList(cuisineList);

      let selectedIds = [];
      selectedIds = selectedCuisinesId;
      selectedIds.push(masterValue.cuisineTypeId);
      setSelectedCuisinesId(selectedIds);
      //set selected items
      let selectedItems = [];
      selectedItems = selectedFavouriteCuisine;
      selectedItems.push(option);
      setCustomerSavedCuisines(selectedItems);
    },
    onError: err => {
      toastMessage(renderError, err);
    },
  });

  const [insertNewDietary, { dietaryData }] = useMutation(CREATE_ALLERGY, {
    onCompleted: dietaryData => {
      // let masterValue = dietaryData.dietaryData.allergyTypeMaster;
      // let cuisineList = [];
      // cuisineList = cusinesMasterList;
      // let option = {
      //   label: masterValue.cusineTypeName,
      //   value: masterValue.cuisineTypeId,
      // };
      // cuisineList.push(option);
      // setCuisinesMasterList(cuisineList);

      // let selectedIds = [];
      // selectedIds = selectedCuisinesId;
      // selectedIds.push(masterValue.cuisineTypeId);
      // setSelectedCuisinesId(selectedIds);
      // //set selected items
      // let selectedItems = [];
      // selectedItems = selectedFavouriteCuisine;
      // selectedItems.push(option);
      // setCustomerSavedCuisines(selectedItems);
    },
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [getDietaryDataQuery, getDietaryData] = useLazyQuery(LIST_DIETARY, {
    variables: { pCustomerId: props.customerId },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  }); //get cuisine data LIST_DIETARY

  const [getKitchenDataQuery, getKitchenData] = useLazyQuery(LIST_KITCHEN, {
    variables: { pCustomerId: props.customerId },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  useEffect(() => {
    getCuisineDataQuery();
    getAllergyDataQuery();
    getDietaryDataQuery();
    getKitchenDataQuery();
  }, [props]);

  useEffect(() => {
    let chefData = props.customerDetails;
    if (
      util.isObjectEmpty(chefData) &&
      util.hasProperty(chefData, 'chefSpecializationProfilesByChefId') &&
      util.isObjectEmpty(chefData.chefSpecializationProfilesByChefId) &&
      util.isArrayEmpty(chefData.chefSpecializationProfilesByChefId.nodes) &&
      util.isObjectEmpty(chefData.chefSpecializationProfilesByChefId.nodes[0])
    ) {
      let data = chefData.chefSpecializationProfilesByChefId.nodes[0];
      setCustomerSavedCuisines(
        util.isArrayEmpty(data.chefCuisineTypeId) ? data.chefCuisineTypeId : []
      );
      setSelectedCuisinesId(
        util.isArrayEmpty(data.chefCuisineTypeId) ? data.chefCuisineTypeId : []
      );
    }
  }, [props.customerDetails]);

  //getting cuisnes list from master table getAllergyData
  useEffect(() => {
    if (
      util.isObjectEmpty(getCusineData) &&
      util.hasProperty(getCusineData, 'data') &&
      util.isObjectEmpty(getCusineData.data) &&
      util.hasProperty(getCusineData.data, 'getCuisineTypes') &&
      util.isObjectEmpty(getCusineData.data.getCuisineTypes) &&
      util.isArrayEmpty(getCusineData.data.getCuisineTypes.nodes)
    ) {
      let data = [];
      getCusineData.data.getCuisineTypes.nodes.map((res, key) => {
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

  //getting AllergyData list from master table get getDietaryData
  useEffect(() => {
    // console.log("getAllergyData",getAllergyData)
    if (
      util.isObjectEmpty(getAllergyData) &&
      util.hasProperty(getAllergyData, 'data') &&
      util.isObjectEmpty(getAllergyData.data) &&
      util.hasProperty(getAllergyData.data, 'getAllergyTypes') &&
      util.isObjectEmpty(getAllergyData.data.getAllergyTypes) &&
      util.isArrayEmpty(getAllergyData.data.getAllergyTypes.nodes)
    ) {
      let data = [];
      getAllergyData.data.getAllergyTypes.nodes.map((res, key) => {
        if (res) {
          let option = {
            label: res.allergyTypeDesc,
            value: res.allergyTypeId,
          };
          data.push(option);
        }
      });
      setAllergiesMasterList(data);
      // setSelectedAllergy(data)
    }
  }, [getAllergyData]);

  //getting AllergyData list from master table get getKitchenData
  useEffect(() => {
    if (
      util.isObjectEmpty(getDietaryData) &&
      util.hasProperty(getDietaryData, 'data') &&
      util.isObjectEmpty(getDietaryData.data) &&
      util.hasProperty(getDietaryData.data, 'getDietaryRestrictionsTypes') &&
      util.isObjectEmpty(getDietaryData.data.getDietaryRestrictionsTypes) &&
      util.isArrayEmpty(getDietaryData.data.getDietaryRestrictionsTypes.nodes)
    ) {
      let data = [];
      getDietaryData.data.getDietaryRestrictionsTypes.nodes.map((res, key) => {
        if (res) {
          let option = {
            label: res.dietaryRestrictionsTypeDesc,
            value: res.dietaryRestrictionsTypeId,
          };
          data.push(option);
        }
      });
      setDietaryMasterList(data);
    }
  }, [getDietaryData]);

  useEffect(() => {
    if (
      util.isObjectEmpty(getKitchenData) &&
      util.hasProperty(getKitchenData, 'data') &&
      util.isObjectEmpty(getKitchenData.data) &&
      util.hasProperty(getKitchenData.data, 'allKitchenEquipmentTypeMasters') &&
      util.isObjectEmpty(getKitchenData.data.allKitchenEquipmentTypeMasters) &&
      util.isArrayEmpty(getKitchenData.data.allKitchenEquipmentTypeMasters.nodes)
    ) {
      let data = [];
      getKitchenData.data.allKitchenEquipmentTypeMasters.nodes.map((res, key) => {
        if (res) {
          let option = {
            label: res.kitchenEquipmentTypeDesc,
            value: res.kitchenEquipmentTypeId,
          };
          data.push(option);
        }
      });
      setUtensilsMasterList(data);
    }
  }, [getKitchenData]);

  useEffect(() => {
    let cuisineData = [];

    if (util.isArrayEmpty(cusinesMasterList) && util.isArrayEmpty(customerSavedCuisines)) {
      let data = customerSavedCuisines;
      cusinesMasterList.map((res, key) => {
        let index = data.indexOf(res.value);
        if (index > -1) {
          let option = {
            label: res.label,
            value: res.value,
          };
          cuisineData.push(option);
        }
      });
      setSelectedFavouriteCuisine(cuisineData);
      // setCuisineCount(customerSavedCuisines.length);
    } else {
      setSelectedFavouriteCuisine([]);
    }
  }, [cusinesMasterList, customerSavedCuisines]);

  useEffect(() => {
    let cuisineData = [];

    if (util.isArrayEmpty(allergiesMasterList) && util.isArrayEmpty(customerSavedCuisines)) {
      let data = customerSavedCuisines;
      cusinesMasterList.map((res, key) => {
        let index = data.indexOf(res.value);
        if (index > -1) {
          let option = {
            label: res.label,
            value: res.value,
          };
          cuisineData.push(option);
        }
      });
      setSelectedFavouriteCuisine(cuisineData);
      // setCuisineCount(customerSavedCuisines.length);
    } else {
      setSelectedFavouriteCuisine([]);
    }
  }, [cusinesMasterList, customerSavedCuisines]);

  function handleChange(value, stateAssign, stateAssignForId, type) {
    let data = [];
    if (util.isArrayEmpty(value)) {
      value.map(res => {
        data.push(res.value);
      });
      stateAssign(value);
      stateAssignForId(data);
      if (type === 'allergy') {
        setAllergyCount(data.length);
      } else if (type === 'cuisine') {
        setCuisineCount(data.length);
      } else if (type === 'dietary') {
        setDietaryCount(data.length);
      } else if (type === 'utensils') {
        setUtensilsCount(data.length);
      }
    } else {
      if (type === 'allergy') {
        setAllergyCount(0);
      } else if (type === 'cuisine') {
        setCuisineCount(0);
      } else if (type === 'dietary') {
        setDietaryCount(0);
      } else if (type === 'utensils') {
        setUtensilsCount(0);
      }
      stateAssign([]);
      stateAssignForId([]);
    }
  }

  function handleAllergyCreateOption(value) {
    insertNewAllergy({
      variables: {
        allergyTypeName: value,
        customerId: props.customerId,
        chefId: null,
      },
    }).then(data => {
      toastMessage(success, 'Allergy added to list');
      getAllergyDataQuery();
    });
  }
  //insertNewDietary
  function handleDietaryCreateOption(value) {
    insertNewDietary({
      variables: {
        dietaryRestrictionsTypeName: value,
        customerId: props.customerId,
        chefId: null,
      },
    }).then(data => {
      toastMessage(success, 'Dietary restriction added to list');
    });
  }
  return (
    <section className="products-collections-area ptb-60 ProfileSetup">
      <div className="section-title" id="sectionTitle">
        <h2>{s.PREFERENCES}</h2>
      </div>
      <form className="login-form">
        <div className="card">
          <div className="card-body">
            {/* cuisines */}
            <div className="displayDishCuisine">
              <h4 className="card-title" id="headerTitle">
                {s.ALLERGIES}
              </h4>
              <p className="cuisine">({allergyCount > 0 ? allergyCount : 0} items selected)</p>
            </div>

            <CreatableSelect
              isMulti={true}
              isSearchable={true}
              value={selectedAllergy}
              onChange={value =>
                handleChange(value, setSelectedAllergy, setSelectedAllergyId, 'allergy')
              }
              options={allergiesMasterList}
              onCreateOption={value => handleAllergyCreateOption(value)}
              placeholder="Select Allergies"
            />
          </div>
        </div>
        <div className="main-margin" style={{ marginTop: '20px' }}>
          <div className="card">
            <div className="card-body">
              <div className="displayDishCuisine">
                <h4 className="card-title" id="headerTitle">
                  {s.DIETARY_RESTRICTIONS}
                </h4>
                <p className="cuisine">({dietaryCount > 0 ? dietaryCount : 0} items selected)</p>
              </div>

              <CreatableSelect
                // ref={dishesRef}
                isMulti={true}
                isSearchable={true}
                value={selectedDietary}
                onChange={value =>
                  handleChange(value, setSelectedDietary, setSelectedDietaryId, 'dietary')
                }
                options={dietaryMasterList}
                onCreateOption={value => handleDietaryCreateOption(value)}
                placeholder="Select dietary restriction"
              />
            </div>
          </div>
        </div>
        <div className="main-margin" style={{ marginTop: '20px' }}>
          <div className="card">
            <div className="card-body">
              <div className="displayDishCuisine">
                <h4 className="card-title" id="headerTitle">
                  {s.KITCHEN_UTENSILS}
                </h4>
                <p className="cuisine">( {utensilsCount > 0 ? utensilsCount : 0} items selected)</p>
              </div>
              <Select
                isMulti={true}
                isSearchable={true}
                value={selectedUtensiles}
                onChange={value =>
                  handleChange(value, setSelectedUtensils, setSelectedUtensilsId, 'utensils')
                }
                options={utensilsMasterList}
                placeholder="Select kitchen utensils"
              />
            </div>
          </div>
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
              <CreatableSelect
                isMulti={true}
                isSearchable={true}
                value={selectedFavouriteCuisine}
                onChange={value =>
                  handleChange(value, setSelectedFavouriteCuisine, setSelectedCuisinesId, 'cuisine')
                }
                options={cusinesMasterList}
                placeholder="Select favorite cuisine"
              />
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CustomerRequirements;
