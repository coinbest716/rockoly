import React,{useState,useEffect} from 'react';

const Experience = (props) => {

  const [experience,setExperience] = useState('');

  function onChange(value) {
    setExperience(value);
    if(props.valueChange){
      props.valueChange(value);
    }
  }
  useEffect(() =>{
    if(props.experience)
    setExperience(props.experience)
  },[props.experience])
  try {
    return (
      <section className="products-collections-area ptb-60 ProfileSetup">
        <h4>Experience</h4>
        <div className="form-group">
          <textarea
            style={{
              height: '85px',
              paddingBottom: 10,
              paddingTop: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            id="comment"
            className="form-control"
            value={experience}
            rows="8"
            placeholder="Describe your related work experience"
            data-error="Please enter your experience"
            onChange = {() => onChange(event.target.value)}
          />
        </div>
      </section>
    )
  } catch (error) {
    console.log("error", error)
  }
}

export default Experience;