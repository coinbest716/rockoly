import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import * as gqlTag from '../../../../common/gql';
import Loader from '../../../Common/loader';
import {
  getChefId,
  chefId,
  chef,
  getUserTypeRole,
  profileExtendId
} from '../../../../utils/UserType';
import * as util from '../../../../utils/checkEmptycondition';
import { toastMessage } from '../../../../utils/Toast';

const complexityGqlTag = gqlTag.mutation.chef.updateComplexityGQLTAG;

const complexityTag = gql`
  ${complexityGqlTag}
`;

//chef
const chefDataTag = gqlTag.query.chef.profileByIdGQLTAG;

//for getting chef data
const GET_CHEF_DATA = gql`
  ${chefDataTag}
`;

const chefSubscription = gqlTag.subscription.chef.profileExtendedGQLTAG;

const CHEF_SUBS = gql`
  ${chefSubscription}
`;

const Complexity = () => {

  const [rangevalue, setrangeValue] = useState(0);
  const [extendedId, setExtendeId] = useState('');
  const [chefIdValue, setChefIdValue] = useState('');

  const [multiple1, setmultiple1] = useState(false);
  const [multiple2, setmultiple2] = useState(false);
  const [multiple3, setmultiple3] = useState(false);

  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');

  const [min1, setMin1] = useState(0);
  const [min2, setMin2] = useState(0);
  const [min3, setMin3] = useState(0);

  const [max1, setMax1] = useState(0);
  const [max2, setMax2] = useState(0);
  const [max3, setMax3] = useState(0);

  const [updateComplexityValues, values] = useMutation(
    complexityTag,
    {
      onCompleted: responseForSubmit => {
        toastMessage('success', 'Submitted successfully');
      },
      onError: err => {
        toastMessage('error', err);
      },
    }
  );
  const [getChefDataByProfile, chefData] = useLazyQuery(GET_CHEF_DATA, {
    variables: { chefId: chefIdValue },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const { chefLocationSubs } = useSubscription(CHEF_SUBS, {
    variables: { chefId: chefIdValue },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.chefProfileExtended) {
        getChefDataByProfile();
      }
    },
  });

  useEffect(() => {
    //get user role
    getUserTypeRole()
      .then(async res => {
        if (res === chef) {
          getChefId(chefId)
            .then(async res => {
              await setChefIdValue(res);
            })
          getChefId(profileExtendId)
            .then(chefResult => {
              setExtendeId(chefResult);
            })
            .catch(err => { console.log("error", error) });
        }
      })
      .catch(err => { });
  }, [extendedId, chefIdValue]);

  useEffect(() => {
    if (chefIdValue) {
      getChefDataByProfile();
    }
  }, [chefIdValue]);

  useEffect(() => {
    // getting chef's details
    if (
      util.isObjectEmpty(chefData) &&
      util.hasProperty(chefData, 'data') &&
      util.isObjectEmpty(chefData.data) &&
      util.hasProperty(chefData.data, 'chefProfileByChefId') &&
      util.isObjectEmpty(chefData.data.chefProfileByChefId) &&
      util.hasProperty(chefData.data.chefProfileByChefId, 'chefProfileExtendedsByChefId') &&
      util.isObjectEmpty(chefData.data.chefProfileByChefId.chefProfileExtendedsByChefId)
    ) {
      let chefDetails = chefData.data.chefProfileByChefId.chefProfileExtendedsByChefId;
      if (util.hasProperty(chefDetails, "nodes") &&
        util.isArrayEmpty(chefDetails.nodes)
      ) {
        let extendedData = chefDetails.nodes[0]
        let finalData = extendedData.chefComplexity ? JSON.parse(extendedData.chefComplexity) : '';
        // setrangeValue(extendedData.chefComplexity ? parseInt(extendedData.chefComplexity) : 0)
        finalData.map((data) =>{
          if(data.complexcityLevel.trim() === "1X"){
            setmultiple1(true);
            setText1(data.dishes);
            setMin1(data.noOfItems.min);
            setMax1(data.noOfItems.max)
          }
          if(data.complexcityLevel.trim() === "1.5X"){
            setmultiple2(true);
            setText2(data.dishes);
            setMin2(data.noOfItems.min);
            setMax2(data.noOfItems.max)
          }
          if(data.complexcityLevel.trim() === "2X"){
            setmultiple3(true);
            setText3(data.dishes);
            setMin3(data.noOfItems.min);
            setMax3(data.noOfItems.max)
          }
        })
        if(finalData === []){
          setmultiple1(false);
          setText1('');
          setMin1();
          setMax1()
          setmultiple2(false)
          setText2()
          setMin2()
          setMax2()
          setmultiple3(false)
          setText3('')
          setMin3()
          setMax3()
        }
      }
    } else {
        
    }
  }, [chefData,chefDetails]);

  function onSavingValue() {
    let savingValue=[],storeObj={},noOfItems={};
    if(multiple1){
      storeObj = {
        complexcityLevel : "1X",
        dishes : text1,
        noOfItems : {
          min : min1,
          max : max1
        }
      }
      savingValue.push(storeObj)
    }
    if(multiple2){
      storeObj = {
        complexcityLevel : "1.5X",
        dishes : text2,
        noOfItems : {
          min : min2,
          max : max2
        }
      }
      savingValue.push(storeObj)
    }
    if(multiple3){
      storeObj = {
        complexcityLevel : "2X",
        dishes : text3,
        noOfItems : {
          min : min3,
          max : max3
        }
      }
      savingValue.push(storeObj)
    }

    updateComplexityValues({
      variables: {
        chefProfileExtendedId: extendedId,
        chefComplexity: JSON.stringify(savingValue),
      }
    })
  }

  function SavingStateValue(state, value) {
    state(value)
  }

  function onCheckboxClicked(checkbox,state){
    checkbox(!state)
  }

  try {
    return (

      <section className="products-collections-area ptb-60 ProfileSetup">
        <div className="col-lg-12">
          <div className="section-title">
            <h2>Complexity</h2>
          </div>
          <form className="login-form">
            <div className="form-group">
              <div>
                <p style={{ fontSize: '17px' }}>
                  We realize that putting together a complicated menu is extra work and some dishes require complicated executions. Here is your chance to multiply the customer invoice up to 2 times based on the complexity.
                  Please take your time here as this is something that's unique to you and what the customer will see when figuring out the total bill.
          </p>
                {/* <div className="slidecontainer" style={{textAlign:'center'}}>
                <input type="range" min="1" max="100" value={rangevalue} className="slider" id="myRange" onChange={(event) => { event.persist(); onChange(event) }}></input>
                <label>Complexity Value : {rangevalue}</label>
              </div> */}
                <div className="row" id="availabilityRow">
                  <div className="buy-checkbox-btn" id="checkBoxView">
                    <div className="item">
                      <input
                        className="inp-cbx"
                        id="1X"
                        type="checkbox"
                        checked={
                          multiple1
                        }
                        onChange = {() => onCheckboxClicked(setmultiple1,multiple1)}
                      />
                      <label className="cbx"
                        htmlFor="1X"
                      >
                        <span>
                          <svg width="12px" height="10px" viewBox="0 0 12 10">
                            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                          </svg>
                        </span>
                        <span>1X multiplier</span>
                      </label>
                    </div>
                  </div>

                  <textarea
                    style={{ height: '100px' }}
                    type="text"
                    className="form-control"
                    value={text1}
                    onChange={() => SavingStateValue(setText1, event.target.value)}
                    placeholder="Provide an example of an enticing simple dish unique to you for 1x multiplier"
                  />
                  <label>How many menu items?</label>
                  <input type="text"
                    value={min1}
                    onChange={() => SavingStateValue(setMin1, event.target.value)}
                    className="form-control"
                  />
                  <label>to</label>
                  <input type="text"
                    value={max1}
                    onChange={() => SavingStateValue(setMax1, event.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="row" id="availabilityRow">
                  <div className="buy-checkbox-btn" id="checkBoxView">
                    <div className="item">
                      <input
                        className="inp-cbx"
                        id="1.5X"
                        type="checkbox"
                        checked={
                          multiple2
                        }
                        onChange = {() => onCheckboxClicked(setmultiple2,multiple2)}
                      />
                      <label className="cbx"
                        htmlFor="1.5X"
                      >
                        <span>
                          <svg width="12px" height="10px" viewBox="0 0 12 10">
                            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                          </svg>
                        </span>
                        <span>1.5X multiplier</span>
                      </label>
                    </div>
                  </div>

                  <textarea
                    style={{ height: '100px' }}
                    type="text"
                    className="form-control"
                    value={text2}
                    onChange={() => SavingStateValue(setText2, event.target.value)}
                    placeholder="Provide an example of average complexity dish unique to you for 1.5x multiplier"
                  />
                  <label>How many menu items?</label>
                  <input type="text"
                    value={min2}
                    onChange={() => SavingStateValue(setMin2, event.target.value)}
                    className="form-control" />
                  <label>to</label>
                  <input type="text"
                    value={max2}
                    onChange={() => SavingStateValue(setMax2, event.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="row" id="availabilityRow">
                  <div className="buy-checkbox-btn" id="checkBoxView">
                    <div className="item">
                      <input
                        className="inp-cbx"
                        id="2.0X"
                        type="checkbox"
                        checked={
                          multiple3
                        }
                        onChange = {() => onCheckboxClicked(setmultiple3,multiple3)}
                      />
                      <label className="cbx"
                        htmlFor="2.0X"
                      >
                        <span>
                          <svg width="12px" height="10px" viewBox="0 0 12 10">
                            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                          </svg>
                        </span>
                        <span>2.0X multiplier</span>
                      </label>
                    </div>
                  </div>

                  <textarea
                    style={{ height: '100px' }}
                    type="text"
                    className="form-control"
                    value={text3}
                    onChange={() => SavingStateValue(setText3, event.target.value)}
                    placeholder="Provide an example of a complicated dish unique to you` for 2x multiplier"
                  />
                  <label>How many menu items?</label>
                  <input type="text"
                    value={min3}
                    onChange={() => SavingStateValue(setMin3, event.target.value)}
                    className="form-control" />
                  <label>to</label>
                  <input type="text"
                    value={max3}
                    onChange={() => SavingStateValue(setMax3, event.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </form>
          <div className="container">
            <div className="saveButton">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onSavingValue()}
              >
                Save
            </button>
            </div>
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.log("error", error)
  }
}

export default Complexity;