import React, { useState, useEffect } from 'react';

const Experience = props => {
  const [experience, setExperience] = useState('');

  function onChange(value) {
    setExperience(value);
    if (props.valueChange) {
      props.valueChange(value);
    }
  }
  useEffect(() => {
    if (props.experience) setExperience(props.experience);
  }, [props.experience]);
  try {
    return (
      <section className="products-collections-area ptb-60 ProfileSetup" id="experience-view">
        <h5
          style={{
            color: '#08AB93',
            fontSize: '20px',
            textDecoration: 'underline',
            fontWeight: 400,
            paddingBottom: '1%',
          }}
        >
          Experience
        </h5>
        <div className="form-group">
          <textarea
            style={{
              height: '85px',
              paddingBottom: 10,
              paddingTop: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid',
            }}
            id="comment"
            className="form-control"
            value={experience}
            rows="8"
            placeholder="Describe your related work experience"
            data-error="Please enter your experience"
            onChange={() => onChange(event.target.value)}
          />
        </div>
      </section>
    );
  } catch (error) {
    console.log('error', error);
  }
};

export default Experience;
