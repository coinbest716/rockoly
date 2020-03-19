import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import * as gqlTag from '../../../../common/gql';
import { StoreInLocal, GetValueFromLocal } from '../../../../utils/LocalStorage';

//update screen
const updateScreens = gqlTag.mutation.chef.updateScreensGQLTAG;

const UPDATE_SCREENS = gql`
  ${updateScreens}
`;

const ChefIntro = props => {
  const [updateScrrenTag, { data, loading, error }] = useMutation(UPDATE_SCREENS, {
    onCompleted: data => {
      // toastMessage(success, 'Favourite cuisines updated successfully');
    },
    onError: err => {},
  });
  function onClickNext() {
    if (props.screen && props.screen === 'register') {
      // To get the updated screens value
      let screensValue = [];
      GetValueFromLocal('SharedProfileScreens')
        .then(result => {
          if (result && result.length > 0) {
            screensValue = result;
          }
          screensValue.push('INTRO');
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
  }
  return (
    <div>
      <section
        className={`products-collections-area ptb-40 
       ${props.screen === 'register' ? 'base-rate-info' : ''}`}
        id="sction-card-modal"
      >
        <div style={{ paddingLeft: '2%' }}>
          <div>
            <h5
              style={{
                color: '#08AB93',
                fontSize: '20px',
                textDecoration: 'underline',
                paddingBottom: '1%',
              }}
            >
              Pricing Model
            </h5>
            <p style={{ fontSize: '17px' }}>
              Here at Rockoly our goal is to provide fair transparent pricing for the customer
              building trust and increasing the private chef industry market share and getting you
              more money in the long run. <br />
              In order to do so we have created a pricing model that is based on amount of work you
              do and not on ingredients cost or a type of the event. <br />
            </p>
            <h5
              style={{
                color: '#08AB93',
                fontSize: '20px',
                textDecoration: 'underline',
                paddingBottom: '1%',
              }}
            >
              {' '}
              4 things drive the pricing model
            </h5>
            <ul style={{ paddingLeft: '17px' }}>
              <li className="intro-list">Your base rate. </li>
              <li className="intro-list">Number of people you are cooking for.</li>
              <li className="intro-list">Complexity of the preparation of the menu.</li>
              <li className="intro-list">Additional services.</li>
            </ul>
            <p style={{ fontSize: '17px' }}>
              Let's tackle this one step at a time. Don't worry, you will be able to update the
              rates at any point in your profile and play around with the Pricing Model Calculator
              the client sees.
            </p>
          </div>
          <div className="saveButton" style={{ paddingRight: '2%' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                onClickNext();
              }}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChefIntro;
