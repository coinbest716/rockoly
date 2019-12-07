import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import S from './Modal.String';
import Modal from 'react-responsive-modal';
import CustomerCardList from '../../payments/components/CustomerCardList';

const CardListModal = props => {
  //Initial set value
  const [open, setOpen] = useState(true);

  //For closing modal
  function closeModal(value) {
    if (props.closeCardModal) {
      props.closeCardModal(value);
    }
  }

  return (
    <Modal open={open} onClose={closeModal} center closeOnOverlayClick={false}>
      <div style={{ height: '400px' }}>
        <div className="bts-popup-container">
          <CustomerCardList type={'modal'} closeModal={closeModal} />
          <a onClick={closeModal} className="bts-popup-close" id="closeButton"></a>
        </div>
      </div>
    </Modal>
  );
};

export default CardListModal;
