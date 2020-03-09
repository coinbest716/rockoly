import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Modal from 'react-responsive-modal';
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import { useLazyQuery } from '@apollo/react-hooks';
import S from './Modal.String';
import AddsModal from './RequestStatusModal';
import PricingModal from './PricingModal';
import * as util from '../../../utils/checkEmptycondition';
import { toastMessage, success, renderError, error } from '../../../utils/Toast';

const getBookingData = gqlTag.query.booking.byIdGQLTAG;
//gql to get store list

const GET_BOOKING_DATA = gql`
  ${getBookingData}
`;
const CompleteConfirmModal = props => {
  //Initial set value
  const [open, setOpen] = useState(true);
  const [content, setContent] = useState('');
  const [email, setemail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [bookingDetails, setBookingDetails] = useState([]);

  useEffect(() => {
    getBookingData();
    setContent(props.content);
  }, [props]);

  const [getBookingData, { data }] = useLazyQuery(GET_BOOKING_DATA, {
    variables: {
      chefBookingHistId: props.id,
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  useEffect(() => {
    if (
      util.isObjectEmpty(data) &&
      util.hasProperty(data, 'chefBookingHistoryByChefBookingHistId') &&
      util.isObjectEmpty(data.chefBookingHistoryByChefBookingHistId)
    ) {
      setBookingDetails(data.chefBookingHistoryByChefBookingHistId);
    } else {
      setBookingDetails([]);
    }
  }, [data]);

  function closeModal() {
    if (props.onCloseModal) {
      props.onCloseModal();
    }
  }

  function onClickNo(type) {
    setModalVisible(true);
  }
  function onClickYes() {
    if (props.alertModal) {
      props.alertModal(S.YES);
    }
    setPriceModalVisible(true);
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
        <button type="button" className="btn btn-danger" onClick={() => onClickNo('close')}>
          {S.NO}
        </button>
        <a onClick={() => closeModal} className="bts-popup-close"></a>
      </div>
      {modalVisible && (
        <AddsModal
          onCloseModal={props.onCloseModal}
          content="Are you sure you want to Complete?"
          bookingDetail={props.bookingDetail}
          userRole={props.userRole}
          type="Complete"
        />
      )}
      {priceModalVisible && (
        <PricingModal
          bookingDetails={bookingDetails}
          chefId={bookingDetails.chefId}
          onCloseModal={props.onCloseModal}
          screen="request"
        />
      )}
    </Modal>
  );
};

export default CompleteConfirmModal;
