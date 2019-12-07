import React, { useState, useEffect } from 'react';

const BaseRate = props => {
  const [baserate, setBaserate] = useState(0);

  useEffect(() => {
    if (props.baseRateValue) setBaserate(props.baseRateValue);
  }, [props.baseRateValue]);

  function onValueChanges(baserateValue) {
    setBaserate(baserateValue);
    if (props.onChangingValue) {
      props.onChangingValue(baserateValue, 'baserate');
    }
  }
  try {
    return (
      <section className="products-collections-area  ProfileSetup">
        <form className="login-form">
          <div>
            <label>
              <h5>Base rate:</h5>
            </label>
            <p style={{ fontSize: '17px' }}>
              Base rate is what you aproximately want to make per hour. Number of guests, complexity
              of the menu and addition services will determine your final payout. You can change the
              base rate any time under your profile.
            </p>

            <p>
              <input
                type="number"
                min={1}
                value={baserate}
                className="form-control"
                onChange={() => onValueChanges(event.target.value)}
              />
            </p>
          </div>
        </form>
      </section>
    );
  } catch (error) {
    console.log('error', error);
  }
};

export default BaseRate;
