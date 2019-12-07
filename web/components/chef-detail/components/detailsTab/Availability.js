import React, { Component } from 'react';
import { toastMessage } from '../../../../utils/Toast';
import AvailabilityCalendar from '../../../profile-setup/components/availability/AvailabilityCalendar';

const Availability = props => {
  try {
    return (
      <div className="products-details-tab-content">
        <AvailabilityCalendar
          currentChefIdValue={props.chefId}
          chefDetails={props.chefDetails ? props.chefDetails : {}}
          calendarFrom="chefDetail"
        />
      </div>
    );
  } catch (error) {
    toastMessage('renderError', error.message);
  }
};

export default Availability;
