import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Modal from 'react-responsive-modal';
import S from './Modal.String';
import ChatDetailScreen from '../../chat/components/ChatListDetail.Screen';

const ChatModal = props => {
  //Initial set value
  // const [open, setOpen] = useState(true);
  // const [content, setContent] = useState('');
  // const [email, setemail] = useState('');

  function closeModal() {
    if (props.closeModal) {
      props.closeModal();
    }
  }

  console.log('props', props);

  return (
    <Modal open={true} onClose={closeModal} center closeOnOverlayClick={false}>
      <div className="alertModal">
        <h2>
          {props && props.chefDetails && props.chefDetails.fullName
            ? props.chefDetails.fullName
            : ''}
        </h2>
      </div>
      <div>
        <ChatDetailScreen type={'modal'} chefDetails={props.chefDetails} />
      </div>
    </Modal>
  );
};

export default ChatModal;
