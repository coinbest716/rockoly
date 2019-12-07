import React, { useState } from 'react';
import Link from 'next/link';

import { toastMessage } from '../../../utils/Toast';

const RemoveConfirmModal = props => {
  const [open, setOpen] = useState(true);

  function closeModal() {
    if (props.onCloseModal) {
      props.onCloseModal();
    }
  }

  function onAccept() {
    if (props.onConfirmRemove) {
      props.onConfirmRemove();
    }
  }

  // try {
  return (
    <div className={`bts-popup ${open ? 'is-visible' : ''}`} role="alert">
      <div className="bts-popup-container">
        <h6>{props.content}</h6>
        <button type="submit" className="btn btn-success" onClick={onAccept}>
          Yes
        </button>{' '}
        <button type="button" className="btn btn-danger" onClick={closeModal}>
          No
        </button>
        <Link href="#">
          <a onClick={closeModal} className="bts-popup-close"></a>
        </Link>
      </div>
    </div>
  );
  // } catch (error) {
  //   toastMessage('renderError', error.message);
  // }
};

export default RemoveConfirmModal;
