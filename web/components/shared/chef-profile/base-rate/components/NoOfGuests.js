import React, { useState, useEffect } from 'react';

const NumberOfGuestes = props => {
  const [minRangevalue, setMinRangeValue] = useState(0);
  const [maxrangeValue, setMaxRangevalue] = useState(0);
  const [guestsCount, setGuestsCount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [personCount, setPersonCount] = useState(0);

  useEffect(() => {
    if (props.minGuests) setMinRangeValue(props.minGuests);
    if (props.maxGuests) setMaxRangevalue(props.maxGuests);
    if (props.noCanServe) setGuestsCount(props.noCanServe);
    if (props.discountValue) setDiscount(props.discountValue);
    if (props.personsCountValue) setPersonCount(props.personsCountValue);
  }, [
    props.minGuests,
    props.maxGuests,
    props.noCanServe,
    props.discountValue,
    props.personsCountValue,
  ]);

  function onMinChange(event) {
    setMinRangeValue(event.target.value);
    if (props.onChangingValue) {
      props.onChangingValue(event.target.value, 'minGuests');
    }
  }
  function onMaxChange(event) {
    setMaxRangevalue(event.target.value);
    if (props.onChangingValue) {
      props.onChangingValue(event.target.value, 'maxGuests');
    }
  }

  function onValueChanges(guestValue) {
    setGuestsCount(guestValue);
    if (props.onChangingValue) {
      props.onChangingValue(guestValue, 'serve');
    }
  }

  function onDiscountChanges(discountvalue) {
    setDiscount(discountvalue);
    if (props.onChangingValue) {
      props.onChangingValue(discountvalue, 'discount');
    }
  }

  function onPersonChanges(personCountValue) {
    setPersonCount(personCountValue);
    if (props.onChangingValue) {
      props.onChangingValue(personCountValue, 'count');
    }
  }
  try {
    return (
      <section className="ProfileSetup">
        <form className="login-form">
          <div>
            {/* <label> */}
            <h5
              style={{
                paddingTop: '10px',
                paddingLeft: '10px',
                fontSize: '20px',
                textDecoration: 'underline',
                fontWeight: 400,
                paddingBottom: '1%',
                color: '#08AB93',
                // color: rgb(8, 171, 147),
              }}
            >
              Number of guests
            </h5>
            {/* </label> */}

            <p style={{ fontSize: '17px', paddingLeft: '15px' }}>
              I can cook for the Minimum
              <input
                type="range"
                min="0"
                max="5"
                value={minRangevalue}
                className="slider"
                id="myRange"
                onChange={event => {
                  event.persist();
                  onMinChange(event);
                  setMaxRangevalue(event.target.value);
                }}
              ></input>
              ({minRangevalue}) and Maximum
              <input
                type="range"
                min="0"
                max="40"
                value={maxrangeValue}
                className="slider"
                id="myRange"
                onChange={event => {
                  event.persist();
                  onMaxChange(event);
                }}
              ></input>{' '}
              ({maxrangeValue}) guests.
            </p>
            {/* <p style={{ fontSize: '17px', paddingLeft: '15px' }}>
              Now let's decide how adding an extra customer will effect the total price. Don't worry
              you can play with pricing calculator and change the rates any time.
            </p>

            <p style={{ fontSize: '17px' }}>
              <div
                className="col-lg-12"
                style={{ display: 'flex', padding: '0px', fontSize: '17px' }}
              >
                <div className="col-lg-3" style={{ width: 'fit-content' }}>
                  Each guest an additional
                </div>
                <div className="col-lg-2">
                  <input
                    type="number"
                    value={guestsCount}
                    className="form-control"
                    min={0}
                    onChange={() => onValueChanges(event.target.value)}
                  />
                </div>
                X your base rate.
              </div>
            </p>

            <p style={{ fontSize: '17px' }}>
              <div className="col-lg-12" style={{ display: 'flex', padding: '0px' }}>
                <div className="col-lg-3" style={{ fontSize: '17px' }}>
                  Discount of
                </div>
                <div className="col-lg-2">
                  <input
                    type="text"
                    min={0}
                    value={discount}
                    onChange={() => onDiscountChanges(event.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
              <div
                className="col-lg-12"
                style={{ display: 'flex', padding: '0px', marginTop: '1%' }}
              >
                <div className="col-lg-3" style={{ fontSize: '17px' }}>
                  {' '}
                  % for each guest after
                </div>
                <div className="col-lg-2">
                  <input
                    type="text"
                    min={0}
                    value={personCount}
                    className="form-control"
                    onChange={() => onPersonChanges(event.target.value)}
                  />
                </div>
              </div>
            </p> */}
          </div>
        </form>
      </section>
    );
  } catch (error) {
    //console.log('error', error);
  }
};

export default NumberOfGuestes;
