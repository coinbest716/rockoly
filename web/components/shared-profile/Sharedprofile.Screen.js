import React, { useState, useEffect } from 'react';
import StepZilla from "react-stepzilla";
import BasicProfileScreen from './components/basic-profile/BasicProfile.Screen';
import LocationScreen from './components/location/Location.Screen';
import AllergyUpdate from '../shared/preferences/components/AllergyUpdate';
import DietaryUpdate from '../shared/preferences/components/DietaryrestrictionsUpdate';
import KitchenUtensilsUpdate from '../shared/preferences/components/KitchenUtensilUpdate';
import FavoriteCuisine from '../shared/preferences/components/FavouriteCuisine';
import Page from '../shared/layout/Main';

export default function SharedProfile() {

  const steps =
    [
      // { name: 'Step ', component: <BasicProfileScreen customerId={"57c45002-5baf-4520-bc9a-06a4c73d1738"}/> },
      // { name: 'Step 2', component: <LocationScreen /> },
      {name: 'Step 1', component: < AllergyUpdate customerId={"57c45002-5baf-4520-bc9a-06a4c73d1738"}/>},
      {name: 'Step 2', component: < DietaryUpdate customerId={"57c45002-5baf-4520-bc9a-06a4c73d1738"}/>},
      {name: 'Step 3', component: < KitchenUtensilsUpdate customerId={"57c45002-5baf-4520-bc9a-06a4c73d1738"}/>},
      {name: 'Step 4', component: < FavoriteCuisine customerId={"57c45002-5baf-4520-bc9a-06a4c73d1738"}/>},    
    ]

  try {
    return (
      <React.Fragment>
        {/* <Page> */}
       
          <div className='step-progress ProfileSetup container'>
            <StepZilla steps={steps}/>
          </div>
       
        {/* </Page> */}
      </React.Fragment>
    );
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
}
