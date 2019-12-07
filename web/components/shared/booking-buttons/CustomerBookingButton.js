import React, { useEffect, useState } from 'react';
import S from './BookingButtons.String';
import * as util from '../../../utils/checkEmptycondition';
import AddsModal from '../modal/RequestStatusModal';
import { NavigateToFeedbackPage } from './Navigation';

const CustomerBookingButton = props => {
  //Initial set value
  const [bookingData, setBookingData] = useState({});
  const [status, setStatus] = useState('');
  const [userRole, setUserRole] = useState('customer');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRejectVisible, setModalRejectVisible] = useState(false);
  const [modalCancelVisible, setModalCancelVisible] = useState(false);
  const [modalCompleteVisible, setModalCompleteVisible] = useState(false);

  useEffect(() => {
    if (util.isObjectEmpty(props) && util.isObjectEmpty(props.bookingDetails)) {
      setBookingData(props.bookingDetails);
      let status = props.bookingDetails.chefBookingStatusId
        ? props.bookingDetails.chefBookingStatusId.trim()
        : '';
      setStatus(status);
      setUserRole(props.userRole);
    }
  }, [props]);

  //on click feedback buttton
  function onClickFeedback(res) {
    let data = {
      historyId: res.chefBookingHistId ? res.chefBookingHistId : '',
      name:
        res.chefProfileByChefId && res.chefProfileByChefId.fullName
          ? res.chefProfileByChefId.fullName
          : '',
      chefId: res.chefId ? res.chefId : '',
      customerId: res.customerId ? res.customerId : '',
    };
    NavigateToFeedbackPage(data);
  }

  function onCloseModal() {
    setModalCancelVisible(false);
  }

  function onClickModel(value, setState) {
    setState(!value);
  }

  return (
    <React.Fragment>
      <div className="">
        <div className="product-price">
          {status === S.CUSTOMER_REQUESTED && (
            <div className="common-button-style" id="list-button-style">
              <div>
                <button
                  type="submit"
                  className="btn btn-warning"
                  onClick={() => onClickModel(modalCancelVisible, setModalCancelVisible)}
                  id="cancel-button-style"
                >
                  {S.CANCEL}
                </button>
              </div>
            </div>
          )}
          {status === S.CHEF_ACCEPTED &&
            bookingData.chefBookingCompletedByCustomerYn === false &&
            bookingData.chefBookingCompletedByChefYn === false && (
              <div className="common-button-style" id="booking-button-style">
                <button
                  type="submit"
                  className="btn btn-warning"
                  onClick={() => onClickModel(modalCancelVisible, setModalCancelVisible)}
                  id="cancel-button-style"
                >
                  {S.CANCEL}
                </button>
              </div>
            )}
          {(status === S.COMPLETED ||
            status === S.AMT_TRANSFER_FAILED ||
            status === S.AMT_TRANSFER_SUCCESS) &&
            bookingData.chefBookingCompletedByChefYn === true &&
            bookingData.chefBookingCompletedByCustomerYn === false && (
              <div className="addressText" id="message-text">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => onClickFeedback(bookingData)}
                  id="buttonTextCompleted"
                >
                  {S.SUBMIT_FEEDBACK}
                </button>
              </div>
            )}
        </div>
      </div>
      {modalCancelVisible === true && (
        <AddsModal
          onCloseModal={onCloseModal}
          content={S.CANCEL_ALERT}
          bookingDetail={bookingData}
          userRole={userRole}
          type={S.CANCEL}
        />
      )}
    </React.Fragment>
  );
};

export default CustomerBookingButton;
