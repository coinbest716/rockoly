import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Modal from 'react-responsive-modal';
import S from './Modal.String';

const AlertModal = props => {
  //Initial set value
  const [open, setOpen] = useState(true);
  const [content, setContent] = useState('');
  const [email, setemail] = useState('');

  useEffect(() => {
    setContent(props.content);
  }, [props]);

  function closeModal() {
    if (props.alertModal) {
      props.alertModal(S.NO);
    }
  }

  function onClickYes() {
    if (props.alertModal) {
      props.alertModal(S.YES);
    }
  }

  return (
    <Modal open={open} onClose={closeModal} center closeOnOverlayClick={false}>
      <div className="alertModal">
        <h6>{content}</h6>
      </div>
      <div className="row alertModal" id="alertModal1">
        <button type="submit" className="btn btn-success" onClick={onClickYes}>
          {S.YES}
        </button>
        <button type="button" className="btn btn-danger" onClick={closeModal}>
          {S.NO}
        </button>
        <a onClick={closeModal} className="bts-popup-close"></a>
      </div>
    </Modal>
  );
};

export default AlertModal;
