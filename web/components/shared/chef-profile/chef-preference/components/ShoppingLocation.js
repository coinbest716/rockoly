import React, { useState, useEffect } from 'react';

const ShoppingLocation = props => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(props.shopYn);
  }, [props.shopYn]);

  function onSelectCheckbox() {
    setIsChecked(!isChecked);
    if (props.onValuesChange) {
      props.onValuesChange(!isChecked, 'shop');
    }
  }

  try {
    return (
      <section className="products-collections-area ptb-40 ProfileSetup" id="sction-card-modal">
        <form className="login-form">
          <div style={{ paddingLeft: '2%' }}>
            {/* <label> */}
            <h5
              style={{
                color: '#08AB93',
                fontSize: '20px',
                textDecoration: 'underline',
                fontWeight: 400,
                paddingBottom: '1%',
              }}
            >
              Shopping Location
            </h5>
            {/* </label> */}

            <p style={{ fontSize: '17px' }}>
              We don't charge the customer for the ingredients. Will you be able to pick up the
              ingredients for the customer at the store of their choice and provide the customer
              with ingredients receipt.
            </p>
            <label>
              <div
                className="row"
                id="availabilityRow"
                style={{ width: 'max-content', display: 'flex', marginLeft: '2%' }}
              >
                {/* {console.log("res",res)} */}
                <div>
                  <div className="buy-checkbox-btn" id="checkBoxView">
                    <div className="item">
                      <input
                        className="inp-cbx"
                        id="agree"
                        type="checkbox"
                        checked={isChecked}
                        onChange={event => {
                          onSelectCheckbox();
                        }}
                      />
                      <label className="cbx" htmlFor="agree">
                        <span>
                          <svg width="12px" height="10px" viewBox="0 0 12 10">
                            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                          </svg>
                        </span>
                        <span>I agree to this condition</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </form>
      </section>
    );
  } catch (error) {
    console.log('error', error);
  }
};

export default ShoppingLocation;
