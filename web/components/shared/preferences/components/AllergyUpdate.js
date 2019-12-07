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

const listAllergyTag = gqlTag.query.master.allAllergyByStatusGQLTAG;
const savePreferenceTag = gqlTag.mutation.customer.updatePreferencesGQLTAG;
const listCustomerAllergy = gqlTag.query.master.allergyByCustomerIdGQLTAG;

const LIST_ALLERGY = gql`
  ${listAllergyTag}
`;

const SAVE_PREFERENCE = gql`
  ${savePreferenceTag}
`;

const AllergyUpdate = props => {
   
  let sampleArray = [];
  const [savedAllergies, setSavedAllergies] = useState([]);
  const [allergiesMasterList, setAllergiesMasterList] = useState('');
  const [typedAllergies, setTypedAllergies] = useState('');
  const [isvaluePresent, setIsValuePresent] = useState([]);

  const [getAllergyDataQuery, getAllergyData] = useLazyQuery(LIST_ALLERGY, {
    variables: { statusId: "APPROVED" },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  }); //get cuisine data LIST_DIETARY
  useEffect(() => {
    if (props.customerId) {
      getAllergyDataQuery();
    }
  }, [props.customerId]);

  useEffect(() => {
   if(props.isTriggerSubs){
    getAllergyDataQuery();
   }
  },[props.isTriggerSubs]);
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
      setTypedAllergies(propsData.customerOtherAllergyTypes ? JSON.parse(propsData.customerOtherAllergyTypes) : "");
    }

  }, [props.details,savedAllergies])

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
      let data = [], checkBoxvalue = [];

      getAllergyData.data.allAllergyTypeMasters.nodes.map((res, key) => {
        let option = {}
        if (res) {
          let isValuePresenet = savedAllergies.includes(res.allergyTypeId);
          checkBoxvalue.push(isValuePresenet)
          option = {
            label: res.allergyTypeDesc,
            value: res.allergyTypeId,
          };
          data.push(option);
          
        }
      });

      setAllergiesMasterList(data);
      setIsValuePresent(checkBoxvalue);
      // setSelectedAllergy(data)
    }
  }, [getAllergyData,savedAllergies]);

  function onSelectCheckbox(label, type,index) {
  
    let deleteArray = isvaluePresent;
    deleteArray[index] = !isvaluePresent[index] 
    setIsValuePresent(deleteArray)
    deleteArray.map((res,index) =>{
      if(res){
        sampleArray.push(allergiesMasterList[index].value)
      }
    })
    if (props.uploadingData) {
      props.uploadingData(sampleArray, 'array', 'allergy')
    }
  }

  function onTypingAllergy(value) {
    setTypedAllergies(value)
    if (props.uploadingData) {
      props.uploadingData(value, 'string', 'allergy')
    }
  }
  function checkValueInDb(value, type) {
    let isValuePresenet = savedAllergies.includes(value);
    return isValuePresenet ? isValuePresenet : undefined;
  }
  return (
    <section className="products-collections-area ptb-60 ProfileSetup">
      <form className="login-form">
        <div className="card">
          <div className="card-body">
            <div className="displayDishCuisine">
              <h4 className="card-title cuisine" id="headerTitle">
                {s.ALLERGIES}
              </h4>
            </div>
            <div className="container">
              {allergiesMasterList &&
                allergiesMasterList.map((res, index) => {
                  return (
                    <div className="row" id="availabilityRow">
                   
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
                                onSelectCheckbox(res.value, 'allergy',index)
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
                placeholder="Enter any new allergies"
                required={true}
                value={typedAllergies}
                data-error="Please enter your experience"
                onChange={event => onTypingAllergy(event.target.value)}
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

export default AllergyUpdate;
