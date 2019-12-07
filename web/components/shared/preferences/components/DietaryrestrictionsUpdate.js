import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
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

const listDietaryTag = gqlTag.query.master.allDietaryRestrictionsByStatusGQLTAG;
const savePreferenceTag = gqlTag.mutation.customer.updatePreferencesGQLTAG;


const LIST_DIETARY = gql`
  ${listDietaryTag}
`;

const SAVE_PREFERENCE = gql`
  ${savePreferenceTag}
`;


const DietaryRestrictions = props => {

  let sampleArray = [];

  const [customerPreferenceIdValue, setCustomerPreferenceId] = useState('');

  const [selectedDietaries, setSelectedDietaries] = useState([]);
  const [dietaryMasterList, setDietaryMasterList] = useState('');
  const [typedDietary, setTypedDietary] = useState('');
  const [savedDietaries,setSavedDietary] = useState([]);
  const [isvaluePresent, setIsValuePresent] = useState([]);


  const [getDietaryDataQuery, getDietaryData] = useLazyQuery(LIST_DIETARY, {
    variables: { statusId: "APPROVED" },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  }); //get cuisine data LIST_DIETARY



  const [updatePreferenceValues, { data }] = useMutation(SAVE_PREFERENCE, {
    onCompleted: data => {
      toastMessage(success, 'Values updated successfully')
    },
    onError: err => {
      toastMessage('error', err);
    },
  });

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
          setSavedDietary(propsData.customerDietaryRestrictionsTypeId)
          setTypedDietary(propsData.customerOtherDietaryRestrictionsTypes ? JSON.parse(propsData.customerOtherDietaryRestrictionsTypes) : "");
      }
  
    }, [props.details,savedDietaries])

  useEffect(() => {
    if (props.customerId) {
      getDietaryDataQuery();
    }
  }, [props.customerId]);

  useEffect(() => {
    getCustomerId(customerPreferenceId)
      .then(res => {
        setCustomerPreferenceId(res);
      })
      .catch(err => { });
  })

  //getting AllergyData list from master table get getKitchenData
  useEffect(() => {
    if (
      util.isObjectEmpty(getDietaryData) &&
      util.hasProperty(getDietaryData, 'data') &&
      util.isObjectEmpty(getDietaryData.data) &&
      util.hasProperty(getDietaryData.data, 'allDietaryRestrictionsTypeMasters') &&
      util.isObjectEmpty(getDietaryData.data.allDietaryRestrictionsTypeMasters) &&
      util.isArrayEmpty(getDietaryData.data.allDietaryRestrictionsTypeMasters.nodes)
    ) {
      let data = [], checkBoxvalue = [];;
      getDietaryData.data.allDietaryRestrictionsTypeMasters.nodes.map((res, key) => {
        if (res) {

          let isValuePresenet = savedDietaries.includes(res.dietaryRestrictionsTypeId);
          checkBoxvalue.push(isValuePresenet)
          let option = {
            label: res.dietaryRestrictionsTypeDesc,
            value: res.dietaryRestrictionsTypeId,
          };
          data.push(option);
        }
      });
      setIsValuePresent(checkBoxvalue);
      setDietaryMasterList(data);
    }
  }, [getDietaryData,savedDietaries]);


  function updatePreference(event) {
    event.preventDefault();
    updatePreferenceValues({
      variables: {
        customerPreferenceId: customerPreferenceIdValue,
        customerCuisineTypeId: [],
        customerOtherCuisineTypes: null,
        customerAllergyTypeId: [],
        customerOtherAllergyTypes: null,
        customerDietaryRestrictionsTypeId: selectedDietaries ? selectedDietaries : [],
        customerOtherDietaryRestrictionsTypes: typedDietary ? JSON.stringify(typedDietary) : null,
        customerKitchenEquipmentTypeId: [],
        customerOtherKitchenEquipmentTypes: null
      },
    })
  }
  function onSelectCheckbox(label, type,index) {
    let deleteArray = isvaluePresent;
    deleteArray[index] = !isvaluePresent[index] 
    setIsValuePresent(deleteArray)

    deleteArray.map((res,index) =>{
      if(res){
        sampleArray.push(dietaryMasterList[index].value)
      }
    })

    if(props.uploadingData){
      props.uploadingData(sampleArray,"array","dietary")
    }
  }

  function onTypingDietary(value){
    setTypedDietary(value)
    if(props.uploadingData){
      props.uploadingData(value,"string","dietary")
    }
  }
  function checkValueInDb(value){
    let isValuePresenet = savedDietaries.includes(value);
    return isValuePresenet ? isValuePresenet : false;
  }
  return (
    <section className="products-collections-area ptb-6 ProfileSetup">

      <form className="login-form">
        <div className="card">
          <div className="card-body">
            <div className="displayDishCuisine">
              <h4 className="card-title cuisine" id="headerTitle">
                {s.DIETARY_RESTRICTIONS}
              </h4>
            </div>
            <div className="container">
              {dietaryMasterList &&
                dietaryMasterList.map((res, index) => {
                  return (
                    <div className="row" id="availabilityRow" style={{ wordBreak: 'break-word' }}>
                      <div>
                        <div className="buy-checkbox-btn" id="checkBoxView">
                          <div className="item">
                            <input
                              className="inp-cbx"
                              id={res.value}
                              type="checkbox"
                              checked={
                                isvaluePresent[index]
                              }
                              onChange={event => {
                                event.persist();
                                onSelectCheckbox(res.value, 'dietary',index)
                              }}
                            />
                            <label className="cbx"
                              htmlFor={res.value}
                            >
                              <span>
                                <svg width="12px" height="10px" viewBox="0 0 12 10">
                                  <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                </svg>
                              </span>
                              <span>{res.label}</span>
                            </label>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}

            </div>
            <div className="form-group">
          <textarea
            style={{
              height: '85px',
              paddingBottom: 10,
              paddingTop: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            id="comment"
            className="form-control"
            rows="8"
            placeholder="Enter any new dietary"
            required={true}
            value={typedDietary}
            data-error="Please enter your experience"
            onChange={event => onTypingDietary(event.target.value)}
          />
        </div>
          </div>
          
        </div>
        
        {/* <button className = "btn btn-primary" onClick={() => updatePreference(event)}>
        SAVE
      </button> */}
      </form>
    </section>
  );
};

export default DietaryRestrictions;
