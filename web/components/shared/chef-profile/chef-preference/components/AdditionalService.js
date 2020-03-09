import React, { useState, useEffect } from 'react';
import { AdditionalServiceData } from '../../const/AdditionalServiceData';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import * as gqlTag from '../../../../../common/gql';
import Loader from '../../../../Common/loader';
import {
  getChefId,
  chefId,
  chef,
  getUserTypeRole,
  profileExtendId,
} from '../../../../../utils/UserType';
import * as util from '../../../../../utils/checkEmptycondition';
import { toastMessage } from '../../../../../utils/Toast';

const additionalServiceGqlTag = gqlTag.query.master.allAdditionalServiceTypeMastersGQLTAG;

const additionalService = gql`
  ${additionalServiceGqlTag}
`;

const AdditionalService = props => {
  let storeTextValue = [],
    sampleArray = [];
  const [servicemasterList, setServicemasterList] = useState([]);
  const [savedService, setSavedService] = useState([]);
  const [isvaluePresent, setIsValuePresent] = useState([]);
  const [masterList, setmasterList] = useState([]);
  const [textBox, setTextBox] = useState([]);
  const [text0, setText0] = useState();
  const [text1, setText1] = useState(0);
  const [text2, setText2] = useState(0);
  const [text3, setText3] = useState(0);
  const [text4, setText4] = useState(0);
  const [text5, setText5] = useState(0);
  const [text6, setText6] = useState(0);
  const [text7, setText7] = useState(0);
  const [text8, setText8] = useState(0);

  const [getAdditionalServiceData, getServiceData] = useLazyQuery(additionalService, {
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  useEffect(() => {
    getAdditionalServiceData();
  }, []);

  useEffect(() => {
    setSavedService(props.savedService);
    setText0(props.text0);
    setText1(props.text1);
    setText2(props.text2);
    setText3(props.text3);
    setText4(props.text4);
    setText5(props.text5);
    setText6(props.text6);
    setText7(props.text7);
    setText8(props.text8);
  }, [props.savedService]);
  useEffect(() => {
    if (
      util.isObjectEmpty(getServiceData) &&
      util.hasProperty(getServiceData, 'data') &&
      util.isObjectEmpty(getServiceData.data) &&
      util.hasProperty(getServiceData.data, 'allAdditionalServiceTypeMasters') &&
      util.isObjectEmpty(getServiceData.data.allAdditionalServiceTypeMasters) &&
      util.hasProperty(getServiceData.data.allAdditionalServiceTypeMasters, 'nodes') &&
      util.isObjectEmpty(getServiceData.data.allAdditionalServiceTypeMasters.nodes)
    ) {
      let data = getServiceData.data.allAdditionalServiceTypeMasters.nodes;
      setServicemasterList(data);
    } else {
      setServicemasterList([]);
    }
  }, [getServiceData]);

  useEffect(() => {
    let data = [],
      option = {},
      txtbx = [],
      arr = [];
    let checkBoxvalue = [];

    if (servicemasterList.length > 0) {
      servicemasterList.map((listvalue, index) => {
        let newIndex = null;
        let priceValue = null;
        newIndex = _.findIndex(props.extendedData, function(o) {
          return o.service == listvalue.additionalServiceTypeId;
        });
        if (newIndex != -1) {
          checkBoxvalue.push(true);
          option = {
            label: listvalue.additionalServiceTypeDesc,
            value: listvalue.additionalServiceTypeId,
            price: props.extendedData[newIndex].price,
          };
        } else {
          checkBoxvalue.push(false);
          option = {
            label: listvalue.additionalServiceTypeDesc,
            value: listvalue.additionalServiceTypeId,
            price: null,
          };
        }

        data.push(option);
      });
      setmasterList(data);
      setIsValuePresent(checkBoxvalue);
      setTextBox(txtbx);
    }
  }, [getServiceData, servicemasterList, savedService]);

  function onSelectCheckbox(label, indexValue) {
    let deleteArray = isvaluePresent;
    deleteArray[indexValue] = !isvaluePresent[indexValue];

    deleteArray.map((res, index) => {
      let obj = {};
      if (res === true) {
        obj = {
          service: masterList[index].value,
          price: masterList[index].price,
        };
        sampleArray.push(obj);
      }
    });
    setIsValuePresent(deleteArray);
    if (props.onValuesChange) {
      props.onValuesChange(sampleArray, 'service');
    }
    sampleArray = [];
  }

  function onTypingValue(value, indexValue) {
  if (value >= 0){
    let data = [];
    masterList.map((listvalue, index) => {
      let newIndex = null;
      let priceValue = null;
      let option = {};
      let obj = {};
      if (indexValue === index && isvaluePresent[index]) {
        listvalue.price = value;
        // listvalue.label =
        // option = {
        //   label: listvalue.additionalServiceTypeDesc,
        //   value: listvalue.additionalServiceTypeId,
        //   price: value,
        // };
      } else if (indexValue === index && !isvaluePresent[indexValue]) {
        listvalue.price = value;
        // option = {
        //   label: listvalue.additionalServiceTypeDesc,
        //   value: listvalue.additionalServiceTypeId,
        //   price: 0,
        // };
      }

      // data.push(option);
    });
    let deleteArray = masterList;
    deleteArray[indexValue].price = value;
    setmasterList(deleteArray);
    isvaluePresent.map((res, index) => {
      let obj = {};
      if (res) {
        if (indexValue === index && res) {
          obj = {
            service: deleteArray[index].value,
            price: deleteArray[index].price,
          };
        } else if (indexValue !== index && res) {
          obj = {
            service: deleteArray[index].value,
            price: deleteArray[index].price,
          };
        }
        storeTextValue.push(obj);
      }
    });

    if (props.onValuesChange) {
      props.onValuesChange(storeTextValue, 'service');
    }
  }
  else{
    
    toastMessage('renderError', 'Do not select negative numbers');
  }
  }

  try {
    return (
      <section className="products-collections-area ptb-40 ProfileSetup" id="sction-card-modal">
        <form className="login-form">
          <div>
            {/* <label style={{}}> */}
            <h5
              style={{
                color: '#08AB93',
                paddingLeft: '2%',
                fontSize: '20px',
                textDecoration: 'underline',
                fontWeight: 400,
                paddingBottom: '1%',
              }}
            >
              Additional Services
            </h5>
            {/* </label> */}
            <p style={{ fontSize: '17px', paddingLeft: '2%' }}>
              What additional services can you provide? You can change the prices any time under
              your profile.
            </p>
            {masterList &&
              masterList.map((res, index) => {
                return (
                  <div className="row" id="availabilityRow" style={{ marginLeft: '2%' }}>
                    <div className="col-lg-12" style={{ display: 'flex', paddingLeft: '0px' }}>
                      <div className="col-lg-4" style={{ paddingLeft: '0px' }}>
                        <div
                          className="buy-checkbox-btn"
                          id="checkBoxView"
                          style={{ display: 'flex' }}
                        >
                          <div className="item">
                            <input
                              className="inp-cbx"
                              id={res.value}
                              type="checkbox"
                              checked={isvaluePresent[index]}
                              onChange={event => {
                                // event.persist();
                                onSelectCheckbox(res.value, index);
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

                      <div className="col-lg-2">
                        <input
                          type="number"
                          value={res.price}
                          onChange={() => onTypingValue(event.target.value, index)}
                          className="form-control"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </form>
      </section>
    );
  } catch (error) {
    console.log('error', error);
  }
};

export default AdditionalService;
