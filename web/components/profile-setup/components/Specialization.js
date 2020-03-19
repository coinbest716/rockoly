import React, { useState, useEffect, useContext, useRef } from 'react';
import { toastMessage, success, renderError } from '../../../utils/Toast';
import * as gqlTag from '../../../common/gql';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as util from '../../../utils/checkEmptycondition';
import s from '../ProfileSetup.String';
import {
  specializationId,
  getChefId,
  profileExtendId,
  getUserTypeRole,
} from '../../../utils/UserType';
import { cloneDeep } from 'lodash';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { AppContext } from '../../../context/appContext';
import Loader from '../../Common/loader';
import Experience from '../../shared/chef-profile/personal-info/components/Experience';
import { StoreInLocal, GetValueFromLocal } from '../../../utils/LocalStorage';

const cuisineDataTag = gqlTag.query.master.cuisineByChefIdGQLTAG;
const dishDataTag = gqlTag.query.master.dishByChefIdGQLTAG;
const updateChefData = gqlTag.mutation.chef.updateSpecializationGQLTAG;
const createCuisine = gqlTag.mutation.master.createCuisineTypeGQLTAG;
const createDish = gqlTag.mutation.master.createDishTypeGQLTAG;
const saveExperience = gqlTag.mutation.chef.updateChefWorkDetailsGQLTAG;

//for getting cuisine data
const GET_CUISINE_DATA = gql`
  ${cuisineDataTag}
`;

//for getting dish data
const GET_DISHES_DATA = gql`
  ${dishDataTag}
`;

//for updating specialization
const UPDATE_CHEF_SPECIALIZATION = gql`
  ${updateChefData}
`;

//for insert cusine
const INSERT_CUSINE = gql`
  ${createCuisine}
`;

//for insert dish
const INSERT_DISH = gql`
  ${createDish}
`;

//for experience
const EXPERIENCE = gql`
  ${saveExperience}
`;

//update screen
const updateScreens = gqlTag.mutation.chef.updateScreensGQLTAG;

const UPDATE_SCREENS = gql`
  ${updateScreens}
`;

const Specialization = props => {
  const dishesRef = useRef();
  const cuisinesRef = useRef();
  const [extendedId, setExtendeId] = useState('');
  const [cusinesMasterList, setCuisinesMasterList] = useState([]);
  const [dishesMasterList, setDishesMasterList] = useState([]);
  const [ingredientsMasterList, setIngredientsMasterList] = useState([]);
  const [chefSavedCuisines, setChefSavedCuisines] = useState([]);
  const [chefSavedDishes, setChefSavedDishes] = useState([]);
  const [chefSavedIngredients, setChefSavedIngredients] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedCuisinesId, setSelectedCuisinesId] = useState([]);
  const [selectedDishesId, setSelectedDishesId] = useState([]);
  const [selectedIngredientsId, setSelectedIngredientsId] = useState([]);
  const [state, setState] = useContext(AppContext);
  const [dishCount, setDishCount] = useState(0);
  const [cuisineCount, setCuisineCount] = useState(0);
  const [loadingYn, setLoadingYn] = useState(false);
  const [dishLoadingYn, setDishLoadingYn] = useState(false);
  const [experience, setExperience] = useState('');
  const [chefProfileextId, setChefProfileextId] = useState(null);

  // const [ingredients, setIngredients] = useState('');
  const [specializationId, setSpecializationId] = useState('');

  const [updateScrrenTag, { loading, error }] = useMutation(UPDATE_SCREENS, {
    onCompleted: data => {
      // toastMessage(success, 'Favourite cuisines updated successfully');
    },
    onError: err => {},
  });

  const [getCuisineDataQuery, getCusineData] = useLazyQuery(GET_CUISINE_DATA, {
    // getting image gallery based on chef id
    variables: { pChefId: props && props.chefId ? props.chefId : null },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  }); //get cuisine data

  const [getDishDataQuery, getDishesData] = useLazyQuery(GET_DISHES_DATA, {
    // getting image gallery based on chef id
    variables: { pChefId: props && props.chefId ? props.chefId : null },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  }); //get dishes data

  const [updateChefSpecialization, { data }] = useMutation(UPDATE_CHEF_SPECIALIZATION, {
    onCompleted: data => {
      // toastMessage(success, s.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  const [updateExperience, { dataValue }] = useMutation(EXPERIENCE, {
    onCompleted: dataValue => {
      // toastMessage(success, s.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  // const [updateChefSpecialization, { data }] = useMutation(UPDATE_CHEF_SPECIALIZATION, {
  //   onCompleted: data => {
  //     toastMessage(success, s.SUCCESS_MSG);
  //   },
  //   onError: err => {
  //     toastMessage(renderError, err.message);
  //   },
  // });

  useEffect(() => {
    let chefData = props.chefDetails;
    if (
      util.isObjectEmpty(chefData) &&
      util.hasProperty(chefData, 'chefProfileExtendedsByChefId') &&
      util.isObjectEmpty(chefData.chefProfileExtendedsByChefId) &&
      util.isObjectEmpty(chefData.chefProfileExtendedsByChefId) &&
      util.isArrayEmpty(chefData.chefProfileExtendedsByChefId.nodes) &&
      util.isObjectEmpty(chefData.chefProfileExtendedsByChefId.nodes[0])
    ) {
      let data = chefData.chefProfileExtendedsByChefId.nodes[0];
      let chefDetails = chefData.chefProfileExtendedsByChefId;
      let ids = chefDetails.nodes[0].chefProfileExtendedId;
      setChefProfileextId(ids);
      setExperience(data.chefDesc);
    }
  }, [props]);

  useEffect(() => {
    if (props && util.isStringEmpty(props.chefId)) {
      getCuisineDataQuery();
      getDishDataQuery();
    }
  }, [props.chefId]);

  // useEffect(() => {
  //   if (state.chefId) {
  //   }
  // }, [props, state.chefId]);

  useEffect(() => {
    //get user role
    getUserTypeRole()
      .then(async res => {
        if (res === 'chef') {
          getChefId(profileExtendId)
            .then(chefResult => {
              setExtendeId(chefResult);
            })
            .catch(err => {
              //console.log('error', error);
            });
        }
      })
      .catch(err => {});
  }, [extendedId]);

  const [insertNewCusine, { cusineData }] = useMutation(INSERT_CUSINE, {
    onCompleted: cusineData => {
      let masterValue = cusineData.createCuisineTypeMaster.cuisineTypeMaster;
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
      selectedItems = selectedCuisines;
      selectedItems.push(option);
      setSelectedCuisines(selectedItems);
      cuisinesRef.current.onInputChange();
      // toastMessage(success, s.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(renderError, err);
    },
  });

  const [insertNewDish, { dishData }] = useMutation(INSERT_DISH, {
    onCompleted: dishData => {
      let masterValue = dishData.createDishTypeMaster.dishTypeMaster;
      let dishList = [];
      dishList = dishesMasterList;
      let option = {
        label: masterValue.dishTypeName,
        value: masterValue.dishTypeId,
      };
      dishList.push(option);
      setDishesMasterList(dishList);
      //set selected items
      let selectedItems = [];
      selectedItems = selectedDishes;
      selectedItems.push(option);
      setSelectedDishes(selectedItems);
      //set selected item's id
      let selectedIds = [];
      selectedIds = selectedDishesId;
      selectedIds.push(masterValue.dishTypeId);
      setSelectedDishesId(selectedIds);
      dishesRef.current.onInputChange();
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  // useEffect(() => {
  //   if (
  //     state &&
  //     state.chefProfile &&
  //     state.chefProfile.chefSpecializationProfilesByChefId &&
  //     state.chefProfile.chefSpecializationProfilesByChefId.nodes[0] &&
  //     state.chefProfile.chefSpecializationProfilesByChefId.nodes[0].ingredientsDesc
  //   ) {
  //     console.log(
  //       'im in if ingredients',
  //       state.chefProfile.chefSpecializationProfilesByChefId.nodes[0].ingredientsDesc
  //     );
  //     let availableing = JSON.parse(
  //       state.chefProfile.chefSpecializationProfilesByChefId.nodes[0].ingredientsDesc
  //     );
  //     let ingArray = [];
  //     console.log('daslkkljkljlkj123123', availableing);
  //     availableing.map((res, key) => {
  //       if (res) {
  //         let option = {
  //           label: res.name,
  //           value: res.name,
  //         };
  //         ingArray.push(option);
  //       }
  //     });
  //     setIngredientsMasterList(ingArray);
  //     console.log('dsadkjl1kj2lk3j123', ingArray);
  //   }
  // }, [state]);

  //getting chef profile detail
  useEffect(() => {
    let chefData = props.chefDetails;
    if (
      util.isObjectEmpty(chefData) &&
      util.hasProperty(chefData, 'chefSpecializationProfilesByChefId') &&
      util.isObjectEmpty(chefData.chefSpecializationProfilesByChefId) &&
      util.isArrayEmpty(chefData.chefSpecializationProfilesByChefId.nodes) &&
      util.isObjectEmpty(chefData.chefSpecializationProfilesByChefId.nodes[0])
    ) {
      let data = chefData.chefSpecializationProfilesByChefId.nodes[0];
      setChefSavedCuisines(util.isArrayEmpty(data.chefCuisineTypeId) ? data.chefCuisineTypeId : []);
      setChefSavedDishes(util.isArrayEmpty(data.chefDishTypeId) ? data.chefDishTypeId : []);
      setSelectedCuisinesId(
        util.isArrayEmpty(data.chefCuisineTypeId) ? data.chefCuisineTypeId : []
      );
      setSelectedDishesId(util.isArrayEmpty(data.chefDishTypeId) ? data.chefDishTypeId : []);
      setSpecializationId(data.chefSpecializationId);
      // let ingredientsData = data.ingredientsDesc ? JSON.parse(data.ingredientsDesc) : '';
      // setIngredients(ingredientsData[0]);
    }
  }, [props.chefDetails]);

  //getting cuisnes list from master table
  useEffect(() => {
    if (util.hasProperty(getCusineData, 'error') && util.isStringEmpty(getCusineData.error)) {
      toastMessage('error', getCusineData.error);
    }
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

      // setCuisinesMasterList(getCusineData.data.allCuisineTypeMasters.nodes);
    }
  }, [getCusineData]);

  //getting dishes list from master table
  useEffect(() => {
    if (
      util.isObjectEmpty(getDishesData) &&
      util.hasProperty(getDishesData, 'data') &&
      util.isObjectEmpty(getDishesData.data) &&
      util.hasProperty(getDishesData.data, 'getDishTypes') &&
      util.isObjectEmpty(getDishesData.data.getDishTypes) &&
      util.isArrayEmpty(getDishesData.data.getDishTypes.nodes)
    ) {
      let data = [];
      getDishesData.data.getDishTypes.nodes.map((res, key) => {
        if (res) {
          let option = {
            label: res.dishTypeDesc,
            value: res.dishTypeId,
          };
          data.push(option);
        }
      });

      setDishesMasterList(data);

      // setDishesMasterList(getDishesData.data.allDishTypeMasters.nodes);
    }
  }, [getDishesData]);

  //set cousine data based on alreay stored data
  useEffect(() => {
    let cuisineData = [];

    if (util.isArrayEmpty(cusinesMasterList) && util.isArrayEmpty(chefSavedCuisines)) {
      let data = chefSavedCuisines;
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
      setSelectedCuisines(cuisineData);
      setCuisineCount(chefSavedCuisines.length);
      // console.log('chefSavedCuisines', chefSavedCuisines, cuisineData);
    } else {
      setSelectedCuisines([]);
      setCuisineCount(0);
    }
  }, [cusinesMasterList, chefSavedCuisines]);

  //set dish data based on alreay stored data
  useEffect(() => {
    if (util.isArrayEmpty(dishesMasterList) && util.isArrayEmpty(chefSavedDishes)) {
      let data = chefSavedDishes;
      let dishData = [];

      dishesMasterList.map((res, key) => {
        let index = data.indexOf(res.value);
        if (index > -1) {
          let option = {
            label: res.label,
            value: res.value,
          };
          dishData.push(option);
        }
      });
      setSelectedDishes(dishData);
      setDishCount(chefSavedDishes.length);
    } else {
      setSelectedDishes([]);
    }
  }, [dishesMasterList, chefSavedDishes]);

  function handleChange(value, stateAssign, stateAssignForId, type) {
    let data = [];
    if (util.isArrayEmpty(value)) {
      value.map(res => {
        data.push(res.value);
      });
      stateAssign(value);
      stateAssignForId(data);
      if (type === 'dish') {
        setDishCount(data.length);
      } else if (type === 'cuisine') {
        setCuisineCount(data.length);
      }
    } else {
      if (type === 'dish') {
        setDishCount(0);
      } else if (type === 'cuisine') {
        setCuisineCount(0);
      }
      stateAssign([]);
      stateAssignForId([]);
    }
  }
  function valueChange(value) {
    setExperience(value);
  }
  //when saving data
  function onSaveData() {
    // let temp = [];
    // temp.push(ingredients);
    updateChefSpecialization({
      variables: {
        chefSpecializationId: specializationId,
        chefCuisineTypeId: selectedCuisinesId,
        chefDishTypeId: selectedDishesId,
        ingredientsDesc: null,
      },
    });
    updateExperience({
      variables: {
        chefProfileExtendedId: chefProfileextId,
        chefDesc: experience,
        chefSpecializationId: specializationId,
        chefCuisineTypeId: selectedCuisinesId,
      },
    });

    toastMessage(success, 'Updated Successfully');
    if (props.screen && props.screen === 'register') {
      // To get the updated screens value
      let screensValue = [];
      GetValueFromLocal('SharedProfileScreens')
        .then(result => {
          if (result && result.length > 0) {
            screensValue = result;
          }
          screensValue.push('CUISINE_SPEC');
          screensValue = _.uniq(screensValue);
          let variables = {
            chefId: props.chefId,
            chefUpdatedScreens: screensValue,
          };
          updateScrrenTag({ variables });
          if (props.nextStep) {
            props.nextStep();
          }
          StoreInLocal('SharedProfileScreens', screensValue);
        })
        .catch(err => {
          //console.log('err', err);
        });
    }
  }

  function handleCreateOption(value) {
    setLoadingYn(true);
    let chefId = props.chefId;
    insertNewCusine({
      variables: {
        cusineTypeName: value,
        cuisineTypeDesc: value,
        chefId: chefId,
      },
    }).then(data => {
      setLoadingYn(false);
      toastMessage(success, 'Cuisine added to list');
      let savedDishCount = cuisineCount;
      savedDishCount = savedDishCount + 1;
      setCuisineCount(savedDishCount);
    });
  }

  function handleDishCreateOption(value) {
    setDishLoadingYn(true);
    let chefId = props && props.chefId ? props.chefId : null;
    insertNewDish({
      variables: {
        dishTypeName: value,
        dishTypeDesc: value,
        chefId: chefId,
      },
    }).then(data => {
      setDishLoadingYn(false);
      toastMessage(success, 'Dish added to list');
      let savedDishCount = dishCount;
      savedDishCount = savedDishCount + 1;
      setDishCount(savedDishCount);
    });
  }

  function handleIngredientsCreateOption(value) {
    let ingValue = ingredientsMasterList;
    let option = {
      label: value,
      value: value,
    };
    ingValue.push(option);
    setIngredientsMasterList(option);
    // let chefId = state.chefId;
    // insertNewDish({
    //   variables: {
    //     dishTypeName: value,
    //     dishTypeDesc: value,
    //     chefId: chefId,
    //   },
    // });
  }

  try {
    return (
      <section className="products-collections-area">
        {props.screen !== 'register' && (
          <div className="section-title" id="sectionTitle">
            <h2>{s.SPECIALIZATION}</h2>
          </div>
        )}
        <div>
          <form className="login-form">
            <div className="card" id="cuisine-specialization">
              <div className="card-body">
                {/* cuisines */}
                <div className="displayDishCuisine">
                  <h4
                    className="card-title"
                    id="headerTitle"
                    style={{
                      color: '#08AB93',
                      fontSize: '20px',
                      textDecoration: 'underline',
                      fontWeight: 400,
                      paddingBottom: '1%',
                    }}
                  >
                    {s.CUISINE}
                  </h4>
                  <p className="cuisine">({cuisineCount} items selected)</p>
                </div>
                {loadingYn && <Loader />}
                <CreatableSelect
                  isMulti={true}
                  ref={cuisinesRef}
                  isSearchable={true}
                  value={selectedCuisines}
                  onChange={value =>
                    handleChange(value, setSelectedCuisines, setSelectedCuisinesId, 'cuisine')
                  }
                  options={
                    cusinesMasterList && cusinesMasterList.length > 0 ? cusinesMasterList : []
                  }
                  onCreateOption={value => handleCreateOption(value)}
                  placeholder="Select Cuisine"
                />
              </div>
            </div>
            <div className="card" id="cuisine-specialization">
              <div className="card-body">
                <div className="displayDishCuisine">
                  <h4
                    className="card-title"
                    id="headerTitle"
                    style={{
                      color: '#08AB93',
                      fontSize: '20px',
                      textDecoration: 'underline',
                      fontWeight: 400,
                      paddingBottom: '1%',
                    }}
                  >
                    {s.DISH_SPECIALTY}
                  </h4>
                  <p className="cuisine">({dishCount} items selected)</p>
                </div>
                {dishLoadingYn && <Loader />}
                <CreatableSelect
                  ref={dishesRef}
                  isMulti={true}
                  isSearchable={true}
                  value={selectedDishes}
                  onChange={value =>
                    handleChange(value, setSelectedDishes, setSelectedDishesId, 'dish')
                  }
                  options={dishesMasterList && dishesMasterList.length > 0 ? dishesMasterList : []}
                  onCreateOption={value => handleDishCreateOption(value)}
                  placeholder="Select Dish"
                />
              </div>
            </div>
            {/* Ingredients*/}
            {/* <div className="main-margin">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title" id="headerTitle">
                    {s.INGREDIENTS}
                  </h4>
                  <textarea
                    id="comment"
                    className="form-control"
                    rows="8"
                    placeholder="Enter your Ingredients"
                    required={true}
                    value={ingredients}
                    data-error="Please enter your Ingredients"
                    onChange={event => setIngredients(event.target.value)}
                  />
                </div>
              </div>
            </div> */}
          </form>
        </div>
        <div id="experience-specialization">
          <Experience valueChange={valueChange} experience={experience} />
        </div>
        <div className="container">
          <div className="saveButton" id="save-button-view">
            <button type="button" className="btn btn-primary" onClick={() => onSaveData()}>
              {s.SAVE}
            </button>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};
export default Specialization;
