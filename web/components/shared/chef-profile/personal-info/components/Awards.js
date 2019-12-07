import React, { useState, useEffect } from 'react';

const Awards = (props) => {

  const [awards,setAwards] = useState('');

  useEffect(() =>{
    if(props.awards){
      setAwards(props.awards)
    }
  },[props.awards]);

  function onTypingValue(value){
    setAwards(value)
    if(props.uploadingData){
      props.uploadingData(value,'awards')
    }
  }

  try {
    return (
      <section>
        <h4>Awards</h4>
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
            rows="8"
            value = {awards}
            placeholder="Enter any awards you won"
            data-error="Please enter your experience"
            onChange = {()=>onTypingValue(event.target.value)}
          />
        </div>
      </section>
    )
  } catch (error) {
    console.log("error", error)
  }
}

export default Awards;