import React, { useState, useEffect } from 'react';
import { toastMessage, success, renderError, error } from '../../../../../utils/Toast';

const BaseRate = props => {
  const [baserate, setBaserate] = useState(0);

  useEffect(() => {
    if (props.baseRateValue) setBaserate(props.baseRateValue);
  }, [props.baseRateValue]);

  function onValueChanges(baserateValue) {
    if(baserateValue >= 0 ){
    setBaserate(baserateValue);
    if (props.onChangingValue) {
      props.onChangingValue(baserateValue, 'baserate');
    }
  }
  else{
    toastMessage(renderError, 'Do not enter negative number');
  }
  }
  try {
    return (
      <section className="products-collections-area  ProfileSetup" style={{ paddingBottom: '0px' }}>
        <form className="login-form">
          <div>
            {/* <label> */}
            <h5
              style={{
                paddingTop: '10px',
                paddingLeft: '10px',
                color: '#08AB93',
                fontSize: '20px',
                textDecoration: 'underline',
                fontWeight: 400,
                paddingBottom: '1%',
              }}
            >
              Base rate:
            </h5>
            {/* </label> */}
            {/* <div></div> */}
            <p style={{ fontSize: '17px', paddingLeft: '10px' }}>
              Base rate is what you approximately want to make per hour. Number of guests,
              complexity of the menu and addition services will determine your final payout. You can
              change the base rate any time under your profile.
            </p>

            {/* <span className="col-lg-3"> */}
            <div style={{ paddingLeft: '10px', width: '30%' }}>
              <input
                type="number"
                min={1}
                value={baserate}
                required
                className="form-control"
                placeholder="$"
                onChange={() => onValueChanges(event.target.value)}
              />
            </div>
            {/* </span> */}
          </div>
        </form>
      </section>
    );
  } catch (error) {
    console.log('error', error);
  }
};

export default BaseRate;
