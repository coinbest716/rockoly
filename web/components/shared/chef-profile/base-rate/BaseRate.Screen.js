import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import BaseRate from './components/Baserate';
import Gratuity from './components/Gratuity';
import NumberOfGuestes from './components/NoOfGuests';
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

const baseRateGqlTag = gqlTag.mutation.chef.updatePriceForBookingGQLTAG;

const baseRateTag = gql`
  ${baseRateGqlTag}
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

const BaserateScreen = props => {
  // console.log("props",props)

  const [extendedId, setExtendeId] = useState('');
  const [chefIdValue, setChefIdValue] = useState('');

  const [baseRateValue, setBaseRateValue] = useState(0);
  const [chefGratuityValue, setChefGratuityValue] = useState(0);
  const [minGuests, setMinGuests] = useState(0);
  const [maxGuests, setMaxGuests] = useState(0);
  const [noCanServe, setNoCanServe] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
  const [personsCountValue, setPersonCountValue] = useState(0);
  const [chefProfileextId, setChefProfileextId] = useState(null);

  const [updatebaseRateValues, values] = useMutation(baseRateTag, {
    onCompleted: responseForSubmit => {
      toastMessage('success', 'Values saved successfully');
      if (props.screen && props.screen === 'register') {
        // To get the updated screens value
        let screensValue = [];
        GetValueFromLocal('SharedProfileScreens')
          .then(result => {
            if (result && result.length > 0) {
              screensValue = result;
            }
            screensValue.push('BASE_RATE');
            screensValue = _.uniq(screensValue);
            if (props.nextStep) props.nextStep();
            let variables = {
              chefId: props.chefId,
              chefUpdatedScreens: screensValue,
            };
            updateScrrenTag({ variables });
            StoreInLocal('SharedProfileScreens', screensValue);
          })
          .catch(err => {
            //console.log('err', err);
          });
      }
    },
    onError: err => {
      toastMessage('error', err);
    },
  });

  const [updateScrrenTag, { data, loading, error }] = useMutation(UPDATE_SCREENS, {
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
        setBaseRateValue(
          extendedData.chefPricePerHour ? parseInt(extendedData.chefPricePerHour) : 0
        );
        setChefGratuityValue(extendedData.chefGratuity ? parseInt(extendedData.chefGratuity) : 0);
        setMinGuests(extendedData.noOfGuestsMin ? extendedData.noOfGuestsMin : 0);
        setMaxGuests(extendedData.noOfGuestsMax ? extendedData.noOfGuestsMax : 0);
        setNoCanServe(extendedData.noOfGuestsCanServe ? extendedData.noOfGuestsCanServe : 0);
        setDiscountValue(extendedData.discount ? parseInt(extendedData.discount) : 0);
        setPersonCountValue(extendedData.personsCount ? extendedData.personsCount : 0);
      }
    } else {
    }
  }, [chefData]);

  function onChangingValue(value, type) {
    if (type === 'baserate') {
      setBaseRateValue(value);
    } else if (type === 'gratuity') {
      setChefGratuityValue(value);
    } else if (type === 'minGuests') {
      setMinGuests(value);
    } else if (type === 'maxGuests') {
      setMaxGuests(value);
    } else if (type === 'serve') {
      setNoCanServe(value);
    } else if (type === 'discount') {
      setDiscountValue(value);
    } else if (type === 'count') {
      setPersonCountValue(value);
    }
  }

  function onSavingValues() {
    if (!parseInt(minGuests) || !parseInt(maxGuests)) {
      toastMessage(
        'error',
        'Please select a minimum and maximum number of guests you are able to cook for.'
      );
    } else if (
      parseInt(minGuests) > parseInt(maxGuests) ||
      parseInt(minGuests) == parseInt(maxGuests)
    ) {
      toastMessage('error', 'Maximum no of guests should be greater');
    } else if (baseRateValue == 0) {
      toastMessage('error', 'Please enter base rate');
    } else if (parseInt(minGuests) == 0 && parseInt(maxGuests) == 0) {
      toastMessage('error', 'Guest count should be greater than 0');
    } else if (parseInt(minGuests) !== 0 && parseInt(maxGuests) !== 0) {
      updatebaseRateValues({
        variables: {
          chefProfileExtendedId: chefProfileextId,
          chefPricePerHour: parseFloat(baseRateValue),
          chefGratuity: parseFloat(chefGratuityValue),
          noOfGuestsMin: parseInt(minGuests),
          noOfGuestsMax: parseInt(maxGuests),
          noOfGuestsCanServe: parseInt(noCanServe),
          discount: parseFloat(discountValue),
          personsCount: parseInt(personsCountValue),
        },
      });
    } else if (parseInt(minGuests) === 0 || parseInt(maxGuests) === 0) {
      toastMessage('error', 'Minimum/Maximum no of guests should be greater than 0');
    }
  }
  try {
    return (
      <React.Fragment>
        {/* <div className="Awards-card"> */}
        <section
          className={`products-collections-area ptb-40 
        ${props.screen === 'register' ? 'base-rate-info' : ''}`}
        >
          {props.screen !== 'register' && (
            <div className="section-title">
              <h2>Base Rate & Gratuity</h2>
            </div>
          )}
          <form className="login-form">
            <div className="form-group">
              <BaseRate onChangingValue={onChangingValue} baseRateValue={baseRateValue} />
              <Gratuity onChangingValue={onChangingValue} chefGratuityValue={chefGratuityValue} />
              <NumberOfGuestes
                onChangingValue={onChangingValue}
                minGuests={minGuests}
                maxGuests={maxGuests}
                noCanServe={noCanServe}
                discountValue={discountValue}
                personsCountValue={personsCountValue}
              />
            </div>
          </form>

          <div className="container">
            <div className="saveButton">
              <button type="button" className="btn btn-primary" onClick={() => onSavingValues()}>
                Save
              </button>
            </div>
          </div>
        </section>
        {/* </div> */}
      </React.Fragment>
    );
  } catch (error) {
    //console.log('error', error);
  }
};

export default BaserateScreen;
