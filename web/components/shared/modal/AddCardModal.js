import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import S from './Modal.String';
import AddCard from '../../payments/components/AddCard';
import Modal from 'react-responsive-modal';

const AddCardModal = props => {
  //Initial set value
  const [open, setOpen] = useState(true);

  //For closing modal
  function closeAddCardModal() {
    if (props.closeAddCardModal) {
      props.closeAddCardModal();
    }
  }

  return (
    <Modal open={open} onClose={closeAddCardModal} center closeOnOverlayClick={false}>
      <div>
        <AddCard closeAddCardModal={props.closeAddCardModal} />
        <a onClick={closeAddCardModal} className="bts-popup-close" id="closeButton"></a>
      </div>
    </Modal>
  );
};

export default AddCardModal;
