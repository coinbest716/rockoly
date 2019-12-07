import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import S from './Modal.String';

const FacebookModal = props => {
  //Initial set value
  const [open, setOpen] = useState(true);
  const [content, setContent] = useState('');
  const [email, setemail] = useState('');

  useEffect(() => {
    setContent(props.content);
  }, [props]);

  function closeModal() {}

  function onClickSubmit() {
    if (props.emailValue) {
      props.emailValue(email);
    }
  }

  return (
    <div className={`bts-popup ${open ? 'is-visible' : ''}`} role="alert">
      <div className="bts-popup-container">
        <h6>{content}</h6>
        <div className="form-group">
          <label id="label">{S.EMAIL}</label>
          <input
            type={S.EMAIL_INPUT}
            className={S.FORM_CONTROL}
            placeholder={S.EMAIL_PLACEHOLDER}
            id={S.EMAIL_INPUT}
            name={S.EMAIL_INPUT}
            value={email}
            onChange={event => setemail(event.target.value)}
          />
        </div>
        <div className="row" id="buttonContainer">
          <button type="submit" className="btn btn-success" onClick={onClickSubmit}>
            {S.SUBMIT}
          </button>{' '}
          <Link href="#">
            <a onClick={onClickSubmit} className="bts-popup-close"></a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FacebookModal;
