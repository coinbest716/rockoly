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
  profileExtendId,
} from '../../../../utils/UserType';
import * as util from '../../../../utils/checkEmptycondition';
import { toastMessage } from '../../../../utils/Toast';
import { StoreInLocal, GetValueFromLocal } from '../../../../utils/LocalStorage';

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

//update screen
const updateScreens = gqlTag.mutation.chef.updateScreensGQLTAG;

const UPDATE_SCREENS = gql`
  ${updateScreens}
`;

const Complexity = props => {
  const [rangevalue, setrangeValue] = useState(0);
  const [extendedId, setExtendeId] = useState('');
  const [chefIdValue, setChefIdValue] = useState('');

  const [multiple1, setmultiple1] = useState(false);
  const [multiple2, setmultiple2] = useState(false);
  const [multiple3, setmultiple3] = useState(false);

  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');

  const [min1, setMin1] = useState(1);
  const [min2, setMin2] = useState(3);
  const [min3, setMin3] = useState(5);

  const [max1, setMax1] = useState(2);
  const [max2, setMax2] = useState(4);
  const [max3, setMax3] = useState(6);
  const [chefProfileextId, setChefProfileextId] = useState(null);

  const [updateComplexityValues, values] = useMutation(complexityTag, {
    onCompleted: responseForSubmit => {
      if (props.screen && props.screen === 'register') {
        // To get the updated screens value
        let screensValue = [];
        GetValueFromLocal('SharedProfileScreens')
          .then(result => {
            if (result && result.length > 0) {
              screensValue = result;
            }
            screensValue.push('COMPLEXITY');
            screensValue = _.uniq(screensValue);
            let variables = {
              chefId: props.chefId,
              chefUpdatedScreens: screensValue,
            };
            updateScrrenTag({ variables });
            if (props.nextStep) props.nextStep();
            StoreInLocal('SharedProfileScreens', screensValue);
          })
          .catch(err => {
            console.log('err', err);
          });
      }
      toastMessage('success', 'Complexity updated successfully');
    },
    onError: err => {
      toastMessage('error', err);
    },
  });
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

  const [updateScrrenTag, { data, loading, error }] = useMutation(UPDATE_SCREENS, {
    onCompleted: data => {
      // toastMessage(success, 'Favourite cuisines updated successfully');
      // console.log('daskjhkjhkjasdasd123123', data);
    },
    onError: err => {},
  });

  useEffect(() => {
    //get user role
    getUserTypeRole()
      .then(async res => {
        if (res === chef) {
          getChefId(chefId).then(async res => {
            await setChefIdValue(res);
          });
          getChefId(profileExtendId)
            .then(chefResult => {
              setExtendeId(chefResult);
            })
            .catch(err => {
              console.log('error', error);
            });
        }
      })
      .catch(err => {});
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
      let ids = chefDetails.nodes[0].chefProfileExtendedId;
      setChefProfileextId(ids);
      if (util.hasProperty(chefDetails, 'nodes') && util.isArrayEmpty(chefDetails.nodes)) {
        let extendedData = chefDetails.nodes[0];
        let finalData = extendedData.chefComplexity ? JSON.parse(extendedData.chefComplexity) : '';
        // setrangeValue(extendedData.chefComplexity ? parseInt(extendedData.chefComplexity) : 0)
        if (finalData && finalData.length > 0) {
          finalData.map(data => {
            if (data.complexcityLevel.trim() === '1X') {
              setmultiple1(true);
              setText1(data.dishes);
              setMin1(data.noOfItems.min);
              setMax1(data.noOfItems.max);
            }
            if (data.complexcityLevel.trim() === '1.5X') {
              setmultiple2(true);
              setText2(data.dishes);
              setMin2(data.noOfItems.min);
              setMax2(data.noOfItems.max);
            }
            if (data.complexcityLevel.trim() === '2X') {
              setmultiple3(true);
              setText3(data.dishes);
              setMin3(data.noOfItems.min);
              setMax3(data.noOfItems.max);
            }
          });
        }

        if (finalData === []) {
          setmultiple1(false);
          setText1('');
          setMin1(1);
          setMax1(2);
          setmultiple2(false);
          setText2(0);
          setMin2(3);
          setMax2(4);
          setmultiple3(false);
          setText3('');
          setMin3(5);
          setMax3(6);
        }
      }
    } else {
    }
  }, [chefData]);

  function onSavingValue() {
    let savingValue = [],
      storeObj = {},
      noOfItems = {};
    if (text1 && text2 && text3 && min1 && min2 && min3 && max1 && max2 && max3) {
      if (min1 <= 0 || min2 <= 0 || min3 <= 0 || max1 <= 0 || max2 <= 0 || max3 <= 0) {
        toastMessage('error', 'Number of menu items should be greater than 0.');
      } else if (
        parseInt(max1) <= parseInt(min1) ||
        parseInt(max2) <= parseInt(min2) ||
        parseInt(max3) <= parseInt(min3)
      ) {
        toastMessage('error', 'To value should be greater');
      } else if (
        min1 % 1 != 0 ||
        min2 % 1 != 0 ||
        min3 % 1 != 0 ||
        max1 % 1 != 0 ||
        max2 % 1 != 0 ||
        max3 % 1 != 0
      ) {
        toastMessage('error', 'Please enter valid input for menu items');
      } else {
        if (text1) {
          storeObj = {
            complexcityLevel: '1X',
            dishes: text1,
            noOfItems: {
              min: min1,
              max: max1,
            },
          };
          savingValue.push(storeObj);
        }
        if (text2) {
          storeObj = {
            complexcityLevel: '1.5X',
            dishes: text2,
            noOfItems: {
              min: min2,
              max: max2,
            },
          };
          savingValue.push(storeObj);
        }
        if (text3) {
          storeObj = {
            complexcityLevel: '2X',
            dishes: text3,
            noOfItems: {
              min: min3,
              max: max3,
            },
          };
          savingValue.push(storeObj);
        }
        updateComplexityValues({
          variables: {
            chefProfileExtendedId: chefProfileextId,
            chefComplexity: JSON.stringify(savingValue),
          },
        });
      }
    } else {
      toastMessage('error', 'Please fill all the details');
    }
  }

  function SavingStateValue(state, value) {
    if (value >= 0) {
      state(value);
    } else if (value == '' || value == null || value == undefined) {
      state(0);
    } else {
      toastMessage('renderError', 'Do not enter negative value');
    }
  }

  function SavingStateValueText(state, value) {
    state(value);
  }

  function onCheckboxClicked(checkbox, state, type) {
    // console.log(state)setmultiple1 setmultiple2 setmultiple3
    if (type === 'multiple1') {
      checkbox(!state);
      setmultiple2(false);
      setmultiple3(false);
    } else if (type === 'multiple2') {
      checkbox(!state);
      setmultiple1(false);
      setmultiple3(false);
    } else if (type === 'multiple3') {
      checkbox(!state);
      setmultiple1(false);
      setmultiple2(false);
    }
    // checkbox(!state);
  }

  try {
    return (
      <section
        className={`products-collections-area ptb-60 ProfileSetup 
      ${props.screen === 'register' ? 'base-rate-info' : ''}`}
        // className="products-collections-area ptb-60 ProfileSetup"
        id="sction-card-modal"
      >
        <div className="col-lg-12">
          {props.screen !== 'register' && (
            <div className="section-title">
              <h2>Complexity</h2>
            </div>
          )}
          <form className="login-form">
            <h5
              style={{
                paddingTop: '10px',
                paddingLeft: '10px',
                color: '#08AB93',
                fontSize: '20px',
                textDecoration: 'underline',
                fontWeight: 400,
                paddingBottom: '1%',
              }}
            >
              Complexity
            </h5>
            <div className="form-group">
              <div>
                <p style={{ fontSize: '17px', paddingLeft: '1%' }}>
                  We realize that putting together a complicated menu is extra work and some dishes
                  require complicated executions. Here is your chance to multiply the customer
                  invoice up to 2 times based on the complexity. Please take your time here as this
                  is something that's unique to you and what the customer will see when figuring out
                  the total bill.
                </p>
                {/* <div className="slidecontainer" style={{textAlign:'center'}}>
                <input type="range" min="1" max="100" value={rangevalue} className="slider" id="myRange" onChange={(event) => { event.persist(); onChange(event) }}></input>
                <label>Complexity Value : {rangevalue}</label>
              </div> */}
                <div className="row" id="availabilityRow" class="complexity_availability_row">
                  <div className="col-lg-12" style={{ display: 'flex', paddingTop: '15px' }}>
                    <div className="col-lg-4" id="checkBoxView">
                      <div className="item">
                        {/* <input
                          className="inp-cbx"
                          id="1X"
                          type="checkbox"
                          checked={multiple1}
                          onChange={() => onCheckboxClicked(setmultiple1, multiple1, 'multiple1')}
                        /> */}
                        <label className="cbx" htmlFor="1X">
                          {/* <span>
                            <svg width="12px" height="10px" viewBox="0 0 12 10">
                              <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                            </svg>
                          </span> */}
                          <span>1X</span>
                        </label>
                      </div>
                    </div>

                    <textarea
                      style={{ height: '100px', paddingTop: '10px', border: '1px solid' }}
                      type="text"
                      className="form-control"
                      id="form-input-view"
                      value={text1}
                      onChange={() => SavingStateValueText(setText1, event.target.value)}
                      placeholder="Provide an example of an enticing simple dish unique to you for 1x multiplier"
                    />
                  </div>
                  <div className="col-lg-12" style={{ display: 'flex', paddingTop: '15px' }}>
                    {/* <div style={{ display: 'flex', background: 'red' }}> */}
                    <div className="col-lg-4">
                      <label>How many menu items?</label>
                    </div>
                    {/* <div className="col-lg-3"> */}
                    <input
                      type="number"
                      value={min1}
                      onChange={() => SavingStateValue(setMin1, event.target.value)}
                      className="form-control"
                      id="form-input-view"
                    />
                    {/* </div> */}
                    {/* </div> */}
                    {/* <div className="col-lg-4" style={{ display: 'flex' }}> */}
                    <div className="col-lg-1" style={{ display: 'flex', justifyContent: 'center' }}>
                      <label>to</label>
                    </div>
                    {/* <div> */}{' '}
                    <input
                      type="number"
                      value={max1}
                      onChange={() => SavingStateValue(setMax1, event.target.value)}
                      className="form-control"
                      id="form-input-view"
                    />
                    {/* </div> */}
                    {/* </div> */}
                  </div>
                </div>
                <div className="row" id="availabilityRow" class="complexity_availability_row">
                  <div className="col-lg-12" style={{ display: 'flex', paddingTop: '15px' }}>
                    <div className="col-lg-4" id="checkBoxView">
                      {/* <div className="item"> */}
                      {/* <input
                          className="inp-cbx"
                          id="1.5X"
                          type="checkbox"
                          checked={multiple2}
                          onChange={() => onCheckboxClicked(setmultiple2, multiple2, 'multiple2')}
                        /> */}
                      <label className="cbx" htmlFor="1.5X">
                        {/* <span>
                            <svg width="12px" height="10px" viewBox="0 0 12 10">
                              <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                            </svg>
                          </span> */}
                        <span>1.5X</span>
                      </label>
                      {/* </div> */}
                    </div>

                    <textarea
                      style={{ height: '100px', paddingTop: '10px', border: '1px solid' }}
                      type="text"
                      className="form-control"
                      id="form-input-view"
                      value={text2}
                      onChange={() => SavingStateValueText(setText2, event.target.value)}
                      placeholder="Provide an example of average complexity dish unique to you for 1.5x multiplier"
                    />
                  </div>
                  <div className="col-lg-12" style={{ display: 'flex', paddingTop: '15px' }}>
                    <div className="col-lg-4">
                      <label>How many menu items?</label>
                    </div>
                    <input
                      type="number"
                      value={min2}
                      onChange={() => SavingStateValue(setMin2, event.target.value)}
                      className="form-control"
                      id="form-input-view"
                    />

                    {/* <div className="col-lg-12" style={{ display: 'flex' }}> */}
                    <div className="col-lg-1" style={{ display: 'flex', justifyContent: 'center' }}>
                      <label>to</label>
                    </div>
                    <input
                      type="number"
                      value={max2}
                      onChange={() => SavingStateValue(setMax2, event.target.value)}
                      className="form-control"
                      id="form-input-view"
                    />
                  </div>
                  {/* </div> */}
                </div>
                <div className="row" id="availabilityRow" class="complexity_availability_row">
                  <div className="col-lg-12" style={{ display: 'flex', paddingTop: '15px' }}>
                    <div className="col-lg-4" id="checkBoxView">
                      {/* <div className="item"> */}
                      {/* <input
                          className="inp-cbx"
                          id="2.0X"
                          type="checkbox"
                          checked={multiple3}
                          onChange={() => onCheckboxClicked(setmultiple3, multiple3, 'multiple3')}
                        /> */}
                      <label className="cbx" htmlFor="2.0X">
                        {/* <span>
                            <svg width="12px" height="10px" viewBox="0 0 12 10">
                              <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                            </svg>
                          </span> */}
                        <span>2.0X </span>
                      </label>
                    </div>
                    {/* </div> */}

                    <textarea
                      style={{ height: '100px', paddingTop: '10px', border: '1px solid' }}
                      type="text"
                      className="form-control"
                      id="form-input-view"
                      value={text3}
                      onChange={() => SavingStateValueText(setText3, event.target.value)}
                      placeholder="Provide an example of a complicated dish unique to you` for 2x multiplier"
                    />
                  </div>
                  <div className="col-lg-12" style={{ display: 'flex', paddingTop: '15px' }}>
                    <div className="col-lg-4">
                      <label>How many menu items?</label>
                    </div>
                    <input
                      type="number"
                      value={min3}
                      onChange={() => SavingStateValue(setMin3, event.target.value)}
                      className="form-control"
                      id="form-input-view"
                      id="form-input-view"
                    />

                    {/* <div className="col-lg-12" style={{ display: 'flex' }}> */}
                    <div className="col-lg-1" style={{ display: 'flex', justifyContent: 'center' }}>
                      <label>to</label>
                    </div>
                    <input
                      type="number"
                      value={max3}
                      onChange={() => SavingStateValue(setMax3, event.target.value)}
                      className="form-control"
                      id="form-input-view"
                    />
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="container">
            <div className="saveButton">
              <button type="button" className="btn btn-primary" onClick={() => onSavingValue()}>
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.log('error', error);
  }
};

export default Complexity;
