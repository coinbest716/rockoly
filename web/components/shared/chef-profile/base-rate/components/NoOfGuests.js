import React, { useState, useEffect } from 'react';

const NumberOfGuestes = (props) => {

  const [minRangevalue, setMinRangeValue] = useState(0);
  const [maxrangeValue, setMaxRangevalue] = useState(1);
  const [guestsCount, setGuestsCount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [personCount, setPersonCount] = useState(0);

  useEffect(() => {
    if (props.minGuests)
      setMinRangeValue(props.minGuests)
    if (props.maxGuests)
      setMaxRangevalue(props.maxGuests)
    if (props.noCanServe)
      setGuestsCount(props.noCanServe)
    if (props.discountValue)
      setDiscount(props.discountValue)
    if(props.personsCountValue)
    setPersonCount(props.personsCountValue)
  }, [props.minGuests, props.maxGuests, props.noCanServe,props.discountValue,props.personsCountValue])

  function onChange(event) {
    setMinRangeValue(event.target.value);
    if (props.onChangingValue) {
      props.onChangingValue(event.target.value, 'minGuests')
    }
  }
  function onMaxChange(event) {
    setMaxRangevalue(event.target.value)
    if (props.onChangingValue) {
      props.onChangingValue(event.target.value, 'maxGuests')
    }
  }

  function onValueChanges(guestValue) {
    setGuestsCount(guestValue);
    if (props.onChangingValue) {
      props.onChangingValue(guestValue, 'serve')
    }
  }

  function onDiscountChanges(discountvalue) {
    setDiscount(discountvalue);
    if (props.onChangingValue) {
      props.onChangingValue(discountvalue, 'discount')
    }
  }

  function onPersonChanges(personCountValue) {
    setPersonCount(personCountValue);
    if (props.onChangingValue) {
      props.onChangingValue(personCountValue, 'count')
    }
  }
  try {
    return (
      <section className="ProfileSetup">
        <form className="login-form">
          <div>
            <label><h5 style={{ textAlign: 'center' }}>Number of guests</h5></label>

            <p style={{ fontSize: '17px' }}>I can cook for the Minimum
            <input type="range" min="1" max="100" value={minRangevalue}
                className="slider" id="myRange"
                onChange={(event) => { event.persist(); onChange(event) }}></input>({minRangevalue})
    and Maximum
              <input type="range" min="1" max="100" value={maxrangeValue}
                className="slider" id="myRange"
                onChange={(event) => { event.persist(); onMaxChange(event) }}></input> ({maxrangeValue}) guests.</p>
            <p style={{ fontSize: '17px' }}>
              Now let's decide how adding an extra customer will effect the total price.
              Don't worry you can play with pricing calculator and change the rates any time.
        </p>

            <p style={{ fontSize: '17px' }}>
              Each guest an additional <input type="number"
                value={guestsCount} className="form-control"
                min={0}
                onChange={() => onValueChanges(event.target.value)}
              /> X your base rate.
        </p>

            <p style={{ fontSize: '17px' }}>
              Discount of <input type="text"
                value={discount}
                onChange={() => onDiscountChanges(event.target.value)}
                className="form-control" />%
            for each guest after <input type="text" value={personCount}
                className="form-control"
                onChange={() => onPersonChanges(event.target.value)}
              />
            </p>

          </div>

        </form>
      </section>
    )
  } catch (error) {
    console.log("error", error)
  }
}

export default NumberOfGuestes;