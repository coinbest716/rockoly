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
  profileExtendId
} from '../../../../utils/UserType';
import * as util from '../../../../utils/checkEmptycondition';
import { toastMessage } from '../../../../utils/Toast';

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

const BaserateScreen = () => {

  const [extendedId, setExtendeId] = useState('');
  const [chefIdValue, setChefIdValue] = useState('');

  const [baseRateValue, setBaseRateValue] = useState(0);
  const [chefGratuityValue, setChefGratuityValue] = useState(0);
  const [minGuests, setMinGuests] = useState(0);
  const [maxGuests, setMaxGuests] = useState(0);
  const [noCanServe, setNoCanServe] = useState(0);
  const [discountValue,setDiscountValue] = useState(0);
  const [personsCountValue,setPersonCountValue] = useState(0);

  const [updatebaseRateValues, values] = useMutation(
    baseRateTag,
    {
      onCompleted: responseForSubmit => {
        toastMessage('success', 'Values saved successfully');
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
        setBaseRateValue(extendedData.chefPricePerHour ? parseInt(extendedData.chefPricePerHour) : 0)
        setChefGratuityValue(extendedData.chefGratuity ? parseInt(extendedData.chefGratuity) : 0)
        setMinGuests(extendedData.noOfGuestsMin ? extendedData.noOfGuestsMin : 0)
        setMaxGuests(extendedData.noOfGuestsMax ? extendedData.noOfGuestsMax : 0)
        setNoCanServe(extendedData.noOfGuestsCanServe ? extendedData.noOfGuestsCanServe : 0)
        setDiscountValue(extendedData.discount ? parseInt(extendedData.discount) : 0)
        setPersonCountValue(extendedData.personsCount ? extendedData.personsCount : 0)
      }
    } else {

    }
  }, [chefData]);

  function onChangingValue(value, type) {
    if (type === 'baserate') {
      setBaseRateValue(value)
    } else if (type === 'gratuity') {
      setChefGratuityValue(value)
    } else if (type === 'minGuests') {
      setMinGuests(value)
    } else if (type === 'maxGuests') {
      setMaxGuests(value)
    } else if (type === 'serve') {
      setNoCanServe(value)
    } else if (type === 'discount') {
      setDiscountValue(value)
    } else if(type === 'count'){
      setPersonCountValue(value)
    }
  }

  function onSavingValues() {
    if (minGuests > maxGuests) {
      toastMessage('error', 'Maximum no of guests should be greater')
    } else {
      updatebaseRateValues({
        variables: {
          chefProfileExtendedId: extendedId,
          chefPricePerHour: parseFloat(baseRateValue),
          chefGratuity: parseFloat(chefGratuityValue),
          noOfGuestsMin: parseInt(minGuests),
          noOfGuestsMax: parseInt(maxGuests),
          noOfGuestsCanServe: parseInt(noCanServe),
          discount : parseFloat(discountValue),
          personsCount : parseInt(personsCountValue)
        }
      })
    }
  }
  try {
    return (
      <React.Fragment>
        <section className="products-collections-area ptb-60 ">
          <div className="section-title">
            <h2>Base Rate & Gratuity</h2>
          </div>

          <form className="login-form">
            <div className="form-group">
              <BaseRate onChangingValue={onChangingValue}
                baseRateValue={baseRateValue} />
              <Gratuity onChangingValue={onChangingValue}
                chefGratuityValue={chefGratuityValue} />
              <NumberOfGuestes onChangingValue={onChangingValue}
                minGuests={minGuests} maxGuests={maxGuests} 
                noCanServe={noCanServe} discountValue={discountValue}
                personsCountValue = {personsCountValue}/>
            </div>
          </form>

          <div className="container">
            <div className="saveButton">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onSavingValues()}
              >
                Save
            </button>
            </div>
          </div>

        </section>
      </React.Fragment>
    )
  } catch (error) {
    console.log("error", error)
  };
}

export default BaserateScreen;