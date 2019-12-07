import React, { useState, useEffect } from 'react';

const Gratuity = props => {
  const [gratuity, setGratuity] = useState(0);

  useEffect(() => {
    if (props.chefGratuityValue) setGratuity(props.chefGratuityValue);
  }, [props.chefGratuityValue]);

  function onValueChanges(gratuityValue) {
    setGratuity(gratuityValue);
    if (props.onChangingValue) {
      props.onChangingValue(gratuityValue, 'gratuity');
    }
  }

  try {
    return (
      <section className="ProfileSetup">
        <form className="login-form">
          <div>
            <label>
              <h5>Gratuity</h5>
            </label>
            <p style={{ fontSize: '17px' }}>
              We will include a gratuity right away, but if the services or food has been poor we
              will refund the customer.
            </p>
            <div style={{ display: 'flex', height: '60px' }}>
              <label style={{ fontSize: '17px', display: 'flex', alignItems: 'center' }}>
                {' '}
                Default gratuity amount:{' '}
              </label>
              <p>
                <input
                  type="number"
                  min={0}
                  value={gratuity}
                  onChange={() => onValueChanges(event.target.value)}
                  className="form-control"
                />
              </p>
              <label style={{ display: 'flex', alignItems: 'center' }}> %</label>
            </div>
          </div>
        </form>
      </section>
    );
  } catch (error) {
    console.log('error', error);
  }
};

export default Gratuity;
