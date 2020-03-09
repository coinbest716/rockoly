import React, { useEffect, useState } from 'react';
import Banner from './components/Banner';
import ChefList from './components/ChefList';
import CategoryList from './components/CategoryList';
import { NavigateToChefList } from './Navigation';
import Page from '../shared/layout/Main';
import Navbar from '../shared/layout/Navbar';
import Facility from '../shared/facility/Facility';
import Footer from '../shared/layout/Footer';
import { toastMessage } from '../../utils/Toast';
import { StoreInLocal } from '../../utils/LocalStorage';

export default function HomePageScreen() {
  const [locationValue, setLocationValue] = useState('');
  useEffect(() => {
    //Highlighting home menu initially, so storing in local storage
    StoreInLocal('selected_menu', 'home_page');
  }, []); // << super important array

  function getLocation(locationForm, latitude, longtitude) {
    setLocationValue(locationForm);
    let locationProps = {
      location: locationForm,
      latitude: latitude,
      longtitude: longtitude,
    };
    NavigateToChefList(locationProps);
  }

  try {
    return (
      <React.Fragment>
        <Page>
          <div className="homePage" id="home-screen-view">
            <Banner getLocation={getLocation} />
            {/* <ChefList />
            <CategoryList /> */}
            {/* <Facility /> */}
          </div>
        </Page>
      </React.Fragment>
    );
  } catch (error) {
    toastMessage('renderError', error.message);
  }
}
