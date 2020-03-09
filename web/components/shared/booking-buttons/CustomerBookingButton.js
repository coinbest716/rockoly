import React, { useEffect, useState } from 'react';
import S from './BookingButtons.String';
import * as util from '../../../utils/checkEmptycondition';
import AddsModal from '../modal/RequestStatusModal';
import { NavigateToFeedbackPage } from './Navigation';
import ChefRequestModal from '../../shared/modal/chefRequestModal';
import AvailabilityCalendar from '../../profile-setup/components/availability/AvailabilityCalendar';

const CustomerBookingButton = props => {
  //Initial set value
  const [bookingData, setBookingData] = useState({});
  const [status, setStatus] = useState('');
  const [userRole, setUserRole] = useState('customer');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRejectVisible, setModalRejectVisible] = useState(false);
  const [modalCancelVisible, setModalCancelVisible] = useState(false);
  const [modalCompleteVisible, setModalCompleteVisible] = useState(false);
  const [cancelRequestModalShow, setCancelRequestModalShow] = useState(false);
  const [editBooking, setEditBooking] = useState(false);

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

  function onClickValue(value) {
    setEditBooking(value);
  }

  function onCloseBookingModal() {
    setEditBooking(false);
  }

  function cancelRequestModal() {
    setCancelRequestModalShow(true);
  }

  return (
    <React.Fragment>
      <div>
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
          {status === S.PAYMENT_PENDING && (
            <div className="common-button-style" id="list-button-style">
              <div>
                <button
                  type="submit"
                  className="btn btn-warning"
                  onClick={() => onClickValue(true)}
                  id="cancel-button-style"
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {(status === S.COMPLETED ||
            status === S.AMT_TRANSFER_FAILED ||
            status === S.AMT_TRANSFER_SUCCESS) &&
            bookingData.chefBookingCompletedByChefYn === true &&
            bookingData.chefBookingCompletedByCustomerYn === false && (
              <div
                className="addressText"
                id="message-text"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  // paddingRight: '8%',
                  width: 'max-content',
                }}
              >
                <button
                  type="button"
                  className="btn btn-primary feedback-button"
                  onClick={() => onClickFeedback(bookingData)}
                  id="buttonTextCompleted"
                  style={{ marginTop: '10px', marginRight: '4%', width: '220px' }}
                >
                  {S.SUBMIT_FEEDBACK}
                </button>
              </div>
            )}
          {/* {status === S.CHEF_REQUESTED_AMOUNT && (
            <div className="common-button-style" id="list-button-style">
              <div>
                <button
                  type="submit"
                  className="btn btn-warning"
                  onClick={() => onClickModel(modalCancelVisible, setModalCancelVisible)}
                  id="cancel-button-style"
                >
                  {S.CHE_REQUESTED_AMOUNT_STRING}
                </button>
              </div>
            </div>
          )} */}
          {status === S.CHEF_REQUESTED_AMOUNT && (
            <div className="common-button-style" id="list-button-style">
              <div>
                <button
                  type="submit"
                  className="btn btn-warning"
                  onClick={() => cancelRequestModal()}
                  id="cancel-button-style"
                >
                  {S.CHE_REQUESTED_AMOUNT_STRING}
                </button>
              </div>
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
      {cancelRequestModalShow === true && (
        <ChefRequestModal
          bookingDetail={bookingData}
          chefBookingId={bookingData.chefBookingHistId}
        />
      )}
      {editBooking && (
        <AvailabilityCalendar
          isEdit={true}
          currentChefIdValue={bookingData.chefId}
          bookingDetail={bookingData}
          screen="draft"
          onCloseBookingModal={onCloseBookingModal}
        />
      )}
    </React.Fragment>
  );
};

export default CustomerBookingButton;
