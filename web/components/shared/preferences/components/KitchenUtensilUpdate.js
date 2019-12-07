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

const listKitchenTag = gqlTag.query.master.allKitchenEquipmentsByStatusGQLTAG;
const savePreferenceTag = gqlTag.mutation.customer.updatePreferencesGQLTAG;

const LIST_KITCHEN = gql`
  ${listKitchenTag}
`;

const SAVE_PREFERENCE = gql`
  ${savePreferenceTag}
`;

const KitchenUtensilsUpdate = props => {
  let sampleArray = [];

  const [customerPreferenceIdValue, setCustomerPreferenceId] = useState('');

  const [selectedUtensiles, setSelectedUtensils] = useState('');
  const [utensilsMasterList, setUtensilsMasterList] = useState([]);
  const [typedUtensile, setTypedUtensile] = useState('');
  const [savedUtensils, setSavedUtensils] = useState([]);
  const [isvaluePresent, setIsValuePresent] = useState([]);

  const [getKitchenDataQuery, getKitchenData] = useLazyQuery(LIST_KITCHEN, {
    variables: { statusId: 'APPROVED' },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [updatePreferenceValues, { data }] = useMutation(SAVE_PREFERENCE, {
    onCompleted: data => {
      toastMessage(success, 'Values updated successfully');
    },
    onError: err => {
      toastMessage('error', err);
    },
  });

  useEffect(() => {
    if (props.customerId) {
      getKitchenDataQuery();
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
    let customerData = props.details;
    if (
      util.isObjectEmpty(customerData) &&
      util.hasProperty(customerData, 'customerProfileByCustomerId') &&
      util.isObjectEmpty(customerData.customerProfileByCustomerId) &&
      util.hasProperty(
        customerData.customerProfileByCustomerId,
        'customerPreferenceProfilesByCustomerId'
      ) &&
      util.isObjectEmpty(
        customerData.customerProfileByCustomerId.customerPreferenceProfilesByCustomerId
      ) &&
      util.isArrayEmpty(
        customerData.customerProfileByCustomerId.customerPreferenceProfilesByCustomerId.nodes
      ) &&
      util.isObjectEmpty(
        customerData.customerProfileByCustomerId.customerPreferenceProfilesByCustomerId.nodes[0]
      )
    ) {
      let propsData =
        customerData.customerProfileByCustomerId.customerPreferenceProfilesByCustomerId.nodes[0];
      setSavedUtensils(propsData.customerKitchenEquipmentTypeId);
      setTypedUtensile(
        propsData.customerOtherKitchenEquipmentTypes
          ? JSON.parse(propsData.customerOtherKitchenEquipmentTypes)
          : ''
      );
    }
  }, [props.details]);

  function onSelectCheckbox(label, type, index) {
    let deleteArray = isvaluePresent;
    deleteArray[index] = !isvaluePresent[index];
    setIsValuePresent(deleteArray);

    deleteArray.map((res, index) => {
      if (res) {
        sampleArray.push(utensilsMasterList[index].value);
      }
    });

    if (props.uploadingData) {
      props.uploadingData(sampleArray, 'array', 'kitchen');
    }
  }
  function onTypingKitchen(value) {
    setTypedUtensile(value);
    if (props.uploadingData) {
      props.uploadingData(value, 'string', 'kitchen');
    }
  }
  function checkValueInDb(value) {
    let isValuePresenet = savedUtensils.includes(value);
    return isValuePresenet ? isValuePresenet : undefined;
  }
  return (
    <section className="products-collections-area ptb-60 ProfileSetup">
      <form className="login-form">
        <div className="card">
          <div className="card-body">
            <div className="displayDishCuisine">
              <h4 className="card-title cuisine" id="headerTitle">
                {s.KITCHEN_UTENSILS}
              </h4>
            </div>
            <div className="container">
              {utensilsMasterList &&
                utensilsMasterList.map((res, index) => {
                  return (
                    <div className="row" id="availabilityRow">
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
                              <span>{res.label}</span>
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
                  }}
                  id="comment"
                  className="form-control"
                  rows="8"
                  placeholder="Enter any new equipment"
                  required={true}
                  value={typedUtensile}
                  data-error="Please enter your experience"
                  onChange={event => onTypingKitchen(event.target.value)}
                />
              </div>
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

export default KitchenUtensilsUpdate;
