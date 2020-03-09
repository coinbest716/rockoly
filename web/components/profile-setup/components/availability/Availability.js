import React from 'react';
import AvailabilityDays from './AvailabityDays';

const Availability = props => {
  return (
    <React.Fragment>
      <div
        className={`products-collections-area ptb-20 
        ${props.screen === 'register' ? 'base-rate-info' : ''}`}
      >
        <AvailabilityDays
          isFromRegister={props.isFromRegister}
          currentChefId={props.chefId}
          screen={props.screen}
          nextStep={props.nextStep}
        />
      </div>
    </React.Fragment>
  );
};
export default Availability;
