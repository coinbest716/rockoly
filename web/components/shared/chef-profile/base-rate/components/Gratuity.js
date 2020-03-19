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
      <div></div>
      // <section className="ProfileSetup">
      //   <form className="login-form">
      //     <div className="gratuity-info">
      //       <label>
      //         <h5 style={{ paddingTop: '10px', paddingLeft: '10px' }}>Gratuity</h5>
      //       </label>
      //       <p style={{ fontSize: '17px', paddingLeft: '15px' }}>
      //         We will include a gratuity right away, but if the services or food has been poor we
      //         will refund the customer.
      //       </p>
      //       <div style={{ display: 'flex', height: '60px', paddingLeft: '10px' }}>
      //         <label style={{ fontSize: '17px', display: 'flex', alignItems: 'center' }}>
      //           {' '}
      //           Default gratuity amount:{' '}
      //         </label>
      //         <p>
      //           <input
      //             type="number"
      //             min={0}
      //             value={gratuity}
      //             onChange={() => onValueChanges(event.target.value)}
      //             className="form-control"
      //           />
      //         </p>
      //         <label style={{ display: 'flex', alignItems: 'center' }}> %</label>
      //       </div>
      //     </div>
      //   </form>
      // </section>
    );
  } catch (error) {
    //console.log('error', error);
  }
};

export default Gratuity;
