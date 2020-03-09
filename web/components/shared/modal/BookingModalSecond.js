import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import S from './Modal.String';
import Modal from 'react-responsive-modal';
import CustomerCardList from '../../payments/components/CustomerCardList';
import DietaryUpdate from '../../shared/preferences/components/DietaryrestrictionsUpdate';
import KitchenUtensilsUpdate from '../../shared/preferences/components/KitchenUtensilUpdate';
import AllergyUpdate from '../../shared/preferences/components/AllergyUpdate';

const CustomizeModal = props => {
  //Initial set value
  const [open, setOpen] = useState(true);

  //For closing modal
  function closeModal(value) {
    if (props.closeCardModal) {
      props.closeCardModal(value);
    }
  }

  function nextClick() {
    props.customizeFormCallBack();
  }

  return (
    <Modal open={true} onClose={closeModal} center closeOnOverlayClick={false}>
      <div>
        <div className="bts-popup-container">
          <AllergyUpdate customerId={props.customerIdValue} details={props.customerDetails} />
          <DietaryUpdate customerId={props.customerIdValue} details={props.customerDetails} />
          <KitchenUtensilsUpdate
            customerId={props.customerIdValue}
            details={props.customerDetails}
          />
          <button
            className="btn btn-primary"
            id="submit-modal-button"
            Add
            to
            onClick={() => nextClick()}
          >
            Next
          </button>
          ,
        </div>
      </div>
    </Modal>
  );
};

export default CustomizeModal;
