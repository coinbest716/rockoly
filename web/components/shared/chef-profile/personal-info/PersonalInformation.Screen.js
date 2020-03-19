import React, { useState, useEffect } from 'react';
import Awards from './components/Awards';
import Certifications from './components/Certifications';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { toastMessage, renderError, success, error } from '../../../../utils/Toast';
import * as util from '../../../../utils/checkEmptycondition';
import {
  getChefId,
  chef,
  getUserTypeRole,
  profileExtendId,
  chefId,
} from '../../../../utils/UserType';
import gql from 'graphql-tag';
import * as gqlTag from '../../../../common/gql';
import { StoreInLocal, GetValueFromLocal } from '../../../../utils/LocalStorage';

const experienceGqlTag = gqlTag.mutation.chef.updateChefExperienceDetailsGQLTAG;

const experienceGql = gql`
  ${experienceGqlTag}
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

const PersonalInformationScreen = props => {
  const [extendedId, setExtendeId] = useState('');
  const [chefIdValue, setChefIdValue] = useState('');
  const [chefProfileextId, setChefProfileextId] = useState(null);

  const [savedcertifications, setSavedCertifications] = useState([]);

  const [array, setArray] = useState([]);
  const [awards, setAwards] = useState('');

  const [updateExperienceData, { data }] = useMutation(experienceGql, {
    onCompleted: data => {
      if (props.screen && props.screen === 'register') {
        // To get the updated screens value
        let screensValue = [];
        GetValueFromLocal('SharedProfileScreens')
          .then(result => {
            if (result && result.length > 0) {
              screensValue = result;
            }
            screensValue.push('AWARDS');
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
      toastMessage(success, 'Awards and Certifications updated successfully');
    },
    onError: err => {
      toastMessage('error', err);
    },
  });

  const [updateScrrenTag, { loading, error }] = useMutation(UPDATE_SCREENS, {
    onCompleted: data => {
      // toastMessage(success, 'Favourite cuisines updated successfully');
      // console.log('daskjhkjhkjasdasd123123', data);
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
    if (chefIdValue) getChefDataByProfile();
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
      let arrayData = [];
      let chefDetails = chefData.data.chefProfileByChefId.chefProfileExtendedsByChefId;
      let ids = chefDetails.nodes[0].chefProfileExtendedId;
      setChefProfileextId(ids);

      if (
        util.hasProperty(chefDetails, 'nodes') &&
        util.isArrayEmpty(chefDetails.nodes) &&
        util.hasProperty(chefDetails.nodes[0], 'certificationsTypes') &&
        util.isObjectEmpty(chefDetails.nodes[0].certificationsTypes) &&
        util.hasProperty(chefDetails.nodes[0].certificationsTypes, 'nodes') &&
        util.isArrayEmpty(chefDetails.nodes[0].certificationsTypes.nodes)
      ) {
        let extendedData = chefDetails.nodes[0].certificationsTypes.nodes;
        extendedData.map(data => {
          arrayData.push(data.certificateTypeId);
        });
        if (util.hasProperty(chefDetails, 'nodes') && util.isArrayEmpty(chefDetails.nodes)) {
          if (chefDetails.nodes[0].chefAwards) {
            setAwards(
              chefDetails.nodes[0].chefAwards ? JSON.parse(chefDetails.nodes[0].chefAwards) : ''
            );
          }
        }
        // setSavedCertifications(arrayData)
        setArray(arrayData);
      }
    } else {
      setArray([]);
    }
  }, [chefData]);

  function uploadingData(data, type) {
    if (type === 'awards') {
      setAwards(data);
    } else if (type === 'certificates') {
      setArray(data);
    }
  }
  function onSavingData() {
    updateExperienceData({
      variables: {
        chefProfileExtendedId: chefProfileextId,
        chefAwards: JSON.stringify(awards),
        chefCertificateType: array,
      },
    });
  }
  try {
    return (
      <React.Fragment>
        <section
          className={`products-collections-area  
         ${props.screen === 'register' ? 'base-rate-info' : ''}`}
          // className="products-collections-area ptb-60 "
          style={{ paddingTop: '20px', paddingBottom: '20px' }}
        >
          {props.screen !== 'register' && (
            <div className="section-title">
              <h2>Personal Information</h2>
            </div>
          )}
          <form className="login-form" style={{ paddingLeft: '2%' }}>
            <div className="form-group">
              <Awards uploadingData={uploadingData} chefData={chefData} awards={awards} />
              <Certifications uploadingData={uploadingData} savedcertifications={array} />
            </div>
          </form>
          <div className="container">
            <div className="saveButton">
              <button type="button" className="btn btn-primary" onClick={() => onSavingData()}>
                Save
              </button>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  } catch (error) {
    //console.log('error', error);
  }
};

export default PersonalInformationScreen;
