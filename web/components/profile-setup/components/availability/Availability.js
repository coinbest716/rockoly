import React from 'react';
import AvailabilityDays from './AvailabityDays';

const Availability = props => {
  return (
    <React.Fragment>
      <AvailabilityDays currentChefId={props.chefId} />
    </React.Fragment>
  );
};
export default Availability;
