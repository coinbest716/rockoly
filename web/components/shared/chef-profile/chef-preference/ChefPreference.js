import React, { useState, useEffect } from 'react';
import ShoppingLocation from './components/ShoppingLocation';
import AdditionalService from './components/AdditionalService';
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
import { Card } from 'antd';
import { StoreInLocal, GetValueFromLocal } from '../../../../utils/LocalStorage';

const updateGqlTag = gqlTag.mutation.chef.updateServiceGQLTAG;

const updateGql = gql`
  ${updateGqlTag}
`;

//chef
const chefDataTag = gqlTag.query.chef.profileByIdGQLTAG;

//for getting chef data
const GET_CHEF_DATA = gql`
  ${chefDataTag}
`;

//update screen
const updateScreens = gqlTag.mutation.chef.updateScreensGQLTAG;

const UPDATE_SCREENS = gql`
  ${updateScreens}
`;

const ChefPreference = props => {
  let dataValue = {},
    saveValue = [];
  const [extendedId, setExtendeId] = useState('');
  const [chefIdValue, setChefIdValue] = useState('');
  const [service, setService] = useState([]);
  const [savedService, setSavedService] = useState([]);
  const [text0, setText0] = useState(0);
  const [text1, setText1] = useState(0);
  const [text2, setText2] = useState(0);
  const [text3, setText3] = useState(0);
  const [text4, setText4] = useState(0);
  const [text5, setText5] = useState(0);
  const [text6, setText6] = useState(0);
  const [text7, setText7] = useState(0);
  const [text8, setText8] = useState(0);
  const [shopYn, setShopYn] = useState(false);
  const [dbSavedDate, setDbSavedDate] = useState([]);
  const [chefProfileextId, setChefProfileextId] = useState(null);

  const [updatevalues, { data }] = useMutation(updateGql, {
    onCompleted: data => {
      if (props.screen && props.screen === 'register') {
        // To get the updated screens value
        let screensValue = [];
        GetValueFromLocal('SharedProfileScreens')
          .then(result => {
            if (result && result.length > 0) {
              screensValue = result;
            }
            screensValue.push('ADDITIONAL_SERVICES');
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
            //console.log('err', err);
          });
      }
      toastMessage('success', 'Updated Successfully');
    },
    onError: err => {
      toastMessage('error', err);
    },
  });

  const [updateScrrenTag, { loading, error }] = useMutation(UPDATE_SCREENS, {
    onCompleted: data => {
      // toastMessage(success, 'Favourite cuisines updated successfully');
    },
    onError: err => {},
  });

  const [getChefDataByProfile, chefData] = useLazyQuery(GET_CHEF_DATA, {
    variables: { chefId: chefIdValue },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
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
              //console.log('error', error);
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

        extendedData = JSON.parse(extendedData.chefAdditionalServices);
        if (extendedData && extendedData.length > 0) {
          setDbSavedDate(extendedData);
          extendedData.map((data, index) => {
            saveValue.push(data.service);
            if (data.service === 'CLEANING                            ') {
              setText0(data.price);
            } else if (data.service === 'EXTRA_SERVER                        ') {
              setText1(data.price);
            } else if (data.service === 'FLOWERS_AND_DECORATION              ') {
              setText2(data.price);
            } else if (data.service === 'PLATING                             ') {
              setText3(data.price);
            } else if (data.service === 'POURING_SERVICE                     ') {
              setText4(data.price);
            } else if (data.service === 'SERVE_THE_FOOD                      ') {
              setText5(data.price);
            } else if (data.service === 'ADDITIONAL_STAFF                    ') {
              setText6(data.price);
            } else if (data.service === 'BARTENDER                           ') {
              setText7(data.price);
            } else if (data.service === 'CLEANUP                             ') {
              setText8(data.price);
            }
          });
        } else {
          setSavedService([]);
        }

        setShopYn(chefDetails.nodes[0].isChefEnabledShoppingLocationYn);
        setSavedService(saveValue);

        // setSavedService setrangeValue(extendedData.chefComplexity ? parseInt(extendedData.chefComplexity) : 0)
      }
    } else {
    }
  }, [chefData]);

  function onValuesChange(data, type) {
    if (type === 'service') setService(data);
    else if (type === 'shop') {
      setShopYn(data);
    }
  }

  function saveData() {
    let isSameValuePresent = false;
    if (!shopYn) {
      toastMessage('error', 'Please select shopping location');
    } else {
      service &&
        service.length > 0 &&
        service.map((item, key) => {
          if (item.price == '' || item.price == 0 || item.price == null) {
            isSameValuePresent = true;
          }
        });
      if (isSameValuePresent) {
        toastMessage('error', 'Please fill the price Values');
      } else {
        updatevalues({
          variables: {
            chefProfileExtendedId: chefProfileextId,
            chefAdditionalServices:
              service && service.length > 0 ? JSON.stringify(service) : JSON.stringify(dbSavedDate),
            isChefEnabledShoppingLocationYn: shopYn,
          },
        });
      }
    }
  }
  try {
    return (
      <React.Fragment>
        <section
          className={`products-collections-area ptb-40 
        ${props.screen === 'register' ? 'base-rate-info' : ''}`}
          id="sction-card-modal"
        >
          <div className="serviceView-containar">
            {/* <Card> */}
            {props.screen !== 'register' && (
              <div className="availability-header">
                <h5>Preference</h5>
              </div>
            )}
            {/* <form className="login-form"> */}
            {/* <div className="form-group">  */}
            <AdditionalService
              savedService={savedService}
              onValuesChange={onValuesChange}
              extendedData={dbSavedDate}
              text0={text0}
              text1={text1}
              text2={text2}
              text3={text3}
              text4={text4}
              text5={text5}
              text6={text6}
              text7={text7}
              text8={text8}
            />
            {props.screen === 'register' && (
              <ShoppingLocation onValuesChange={onValuesChange} shopYn={shopYn} />
            )}
            {/* </div> */}

            {/* </form> */}
            <div className="container">
              <div className="saveButton">
                <button type="button" className="btn btn-primary" onClick={() => saveData()}>
                  Save
                </button>
              </div>
            </div>
            {/* </Card> */}
          </div>
        </section>
      </React.Fragment>
    );
  } catch (error) {
    //console.log('error', error);
  }
};

export default ChefPreference;
