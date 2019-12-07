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
  const [text0, setText0] = useState(0);
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
      arr = [],
      checkBoxvalue = [];
    if (servicemasterList.length > 0) {
      servicemasterList.map((listvalue, index) => {
        let isValuePresenet = savedService.includes(listvalue.additionalServiceTypeId);
        checkBoxvalue.push(isValuePresenet);
        option = {
          label: listvalue.additionalServiceTypeDesc,
          value: listvalue.additionalServiceTypeId,
        };
       
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
    setIsValuePresent(deleteArray);
   
    deleteArray.map((res,index) => {
      let obj = {};
      if (res) {
        if(indexValue === 0 && res){
          obj = {
            service : masterList[index].value,
            price : 0
          }
        }else if(indexValue === 1 && res){
          obj = {
            service : masterList[index].value,
            price : 0
          }
        } else if(indexValue === 2 && res){
          obj = {
            service : masterList[index].value,
            price : 0
          }
        }else if(indexValue === 3 && res){
          obj = {
            service : masterList[index].value,
            price : 0
          }
        }else if(indexValue === 4 && res){
          obj = {
            service : masterList[index].value,
            price : 0
          }
        }else if(indexValue === 5 && res){
          obj = {
            service : masterList[index].value,
            price : 0
          }
        }else if(indexValue === 6 && res){
          obj = {
            service : masterList[index].value,
            price : 0
          }
        }else if(indexValue === 7 && res){
          obj = {
            service : masterList[index].value,
            price : 0
          }
        }else if(indexValue === 8 && res){
          obj = {
            service : masterList[index].value,
            price : 0
          }
        }
        sampleArray.push(obj)
      }
    });


    if (props.onValuesChange) {
      props.onValuesChange(sampleArray, 'service');
    }
  }

  function onTypingValue(value, indexValue,text) {
   
    if (indexValue === 0 && text === 'text0') {
      if (isvaluePresent[indexValue])
        setText0(value)
      else {
        // setText0('');
        toastMessage('error', 'Please select the checkbox');
      }
    } else if (indexValue === 1 && text === 'text1') {
      if (isvaluePresent[indexValue])
        setText1(value)
      else
        toastMessage('error', 'Please select the checkbox')
    } else if (indexValue === 2 && text === 'text2') {
      if (isvaluePresent[indexValue])
        setText2(value)
      else
        toastMessage('error', 'Please select the checkbox')
    } else if (indexValue === 3 && text === 'text3') {
      if (isvaluePresent[indexValue])
        setText3(value)
      else
        toastMessage('error', 'Please select the checkbox')
    } else if (indexValue === 4 && text === 'text4') {
      if (isvaluePresent[indexValue])
        setText4(value)
      else
        toastMessage('error', 'Please select the checkbox')
    } else if (indexValue === 5 && text === 'text5') {
      if (isvaluePresent[indexValue])
        setText5(value)
      else
        toastMessage('error', 'Please select the checkbox')
    } else if (indexValue === 6 && text === 'text6') {
      if (isvaluePresent[indexValue])
        setText6(value)
      else
        toastMessage('error', 'Please select the checkbox')
    } else if (indexValue === 7 && text === 'text7') {
      if (isvaluePresent[indexValue])
        setText7(value)
      else
        toastMessage('error', 'Please select the checkbox')
    } else if (indexValue === 8 && text === 'text8') {
      if (isvaluePresent[indexValue])
        setText8(value)
      else
        toastMessage('error', 'Please select the checkbox')
    }
    isvaluePresent.map((res,index) => {
      let obj = {};
      if (res) {
        if(indexValue === 0 && res && text === 'text0'){
          obj = {
            service : masterList[index].value,
            price : value
          }
        }else if(indexValue === 1 && res && text === 'text1'){
          obj = {
            service : masterList[index].value,
            price : value
          }
        } else if(indexValue === 2 && res && text === 'text2'){
          obj = {
            service : masterList[index].value,
            price : value
          }
        }else if(indexValue === 3 && res && text === 'text3'){
          obj = {
            service : masterList[index].value,
            price : value
          }
        }else if(indexValue === 4 && res && text === 'text4'){
          obj = {
            service : masterList[index].value,
            price : value
          }
        }else if(indexValue === 5 && res && text === 'text5'){
          obj = {
            service : masterList[index].value,
            price : value
          }
        }else if(indexValue === 6 && res && text === 'text6'){
          obj = {
            service : masterList[index].value,
            price : value
          }
        }else if(indexValue === 7 && res && text === 'text7'){
          obj = {
            service : masterList[index].value,
            price : value
          }
        }else if(indexValue === 8 && res && text === 'text8'){
          obj = {
            service : masterList[index].value,
            price : value
          }
        }
        storeTextValue.push(obj)
      }
    });

    if (props.onValuesChange) {
      props.onValuesChange(storeTextValue, 'service');
    }
  }

  try {
    return (
      <section className="products-collections-area ptb-60 ProfileSetup">
        <form className="login-form">
          <div className="form-group">
            <label>
              <h5 style={{ textAlign: 'center' }}>Additional Services</h5>
            </label>
            <p style={{ textAlign: 'center', fontSize: '17px' }}>
              What additional services can you provide? You can change the prices any time under
              your profile.
            </p>
            {masterList &&
              masterList.map((res, index) => {
                return (
                  <div className="row" id="availabilityRow" style={{ marginLeft: '2%' }}>
                    <div className="row">
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
                    {index === 0 &&
                      <input type="text" value={text0}
                        onChange={() => onTypingValue(event.target.value, index,'text0')}
                        className="form-control"
                        placeholder="Enter price for this service" />
                    }
                    {index === 1 &&
                      <input type="text" value={text1}
                        onChange={() => onTypingValue(event.target.value, index,'text1')}
                        className="form-control"
                        placeholder="Enter price for this service" />
                    }
                    {index === 2 &&
                      <input type="text" value={text2}
                        onChange={() => onTypingValue(event.target.value, index,'text2')}
                        className="form-control"
                        placeholder="Enter price for this service" />
                    }
                    {index === 3 &&
                      <input type="text" value={text3}
                        onChange={() => onTypingValue(event.target.value, index,'text3')}
                        className="form-control"
                        placeholder="Enter price for this service" />
                    }
                    {index === 4 &&
                      <input type="text" value={text4}
                        onChange={() => onTypingValue(event.target.value, index,'text4')}
                        className="form-control"
                        placeholder="Enter price for this service" />
                    }
                    {index === 5 &&
                      <input type="text" value={text5}
                        onChange={() => onTypingValue(event.target.value, index,'text5')}
                        className="form-control"
                        placeholder="Enter price for this service" />
                    }
                    {index === 6 &&
                      <input type="text" value={text6}
                        onChange={() => onTypingValue(event.target.value, index,'text6')}
                        className="form-control"
                        placeholder="Enter price for this service" />
                    }
                    {index === 7 &&
                      <input type="text" value={text7}
                        onChange={() => onTypingValue(event.target.value, index,'text7')}
                        className="form-control"
                        placeholder="Enter price for this service" />
                    }
                    {index === 8 &&
                      <input type="text" value={text8}
                        onChange={() => onTypingValue(event.target.value, index,'text8')}
                        className="form-control"
                        placeholder="Enter price for this service"
                      />
                    }
                  </div>
                );
              })}
            {/* <div className="buy-checkbox-btn" id="checkBoxView">
              <div className="item">
                <input
                  className="inp-cbx"
                  id="other"
                  type="checkbox"

                />
                <label className="cbx"
                  htmlFor="other"
                >
                  <span>
                    <svg width="12px" height="10px" viewBox="0 0 12 10">
                      <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                    </svg>
                  </span>
                  <span>Other (Please specify and we will review):  </span>
                </label>

              </div>
            </div>
            <input type="text" className="form-control" /> */}
          </div>
        </form>
      </section>
    );
  } catch (error) {
    console.log('error', error);
  }
};

export default AdditionalService;
