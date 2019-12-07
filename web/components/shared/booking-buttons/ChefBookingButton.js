import React, { useEffect, useState } from 'react';
import S from './BookingButtons.String';
import * as util from '../../../utils/checkEmptycondition';
import AddsModal from '../modal/RequestStatusModal';
import Loader from '../../Common/loader';

const ChefBookingButton = props => {
  //Initial set value
  const [bookingData, setBookingData] = useState({});
  const [status, setStatus] = useState('');
  const [userRole, setUserRole] = useState('customer');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRejectVisible, setModalRejectVisible] = useState(false);
  const [modalCancelVisible, setModalCancelVisible] = useState(false);
  const [modalCompleteVisible, setModalCompleteVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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

  function onCloseModal() {

    if (props.triggerSubscription) {
      props.triggerSubscription();
    } 
    setLoading(false);
    setModalVisible(false);
    setModalRejectVisible(false);
    setModalCancelVisible(false);
    setModalCompleteVisible(false);
  }

  function onClickModel(value, setState) {
    setLoading(true);
    setState(!value);
  }

  return (
    <React.Fragment>

      <div className="" id="all-button-view">
        <div style={{ height: '100%' }}>
          <div className="row">
            {status === S.CUSTOMER_REQUESTED && (
              <div className="booking-button">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => onClickModel(modalVisible, setModalVisible)}
                  id="buttonText"
                  style={{ width: '120px' }}
                >
                  {S.ACCEPT}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => onClickModel(modalRejectVisible, setModalRejectVisible)}
                  id="buttonText-danger"
                  style={{ width: '120px' }}
                >
                  {S.REJECT}
                </button>
              </div>
            )}
            {status === S.CHEF_ACCEPTED &&
              bookingData.chefBookingCompletedByCustomerYn === false &&
              bookingData.chefBookingCompletedByChefYn === false && (
                <div className="booking-button">
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => onClickModel(modalCancelVisible, setModalCancelVisible)}
                    id="cancel-button-style"
                  >
                    {S.CANCEL}{' '}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => onClickModel(modalCompleteVisible, setModalCompleteVisible)}
                    id="buttonText"
                    style={{ marginTop: '10px', color: '#fff' }}
                  >
                    {S.COMPLETE}
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
      {modalVisible === true && (
        <AddsModal
          content={S.ACCEPT_ALERT}
          onCloseModal={onCloseModal}
          bookingDetail={bookingData}
          userRole={userRole}
          type={S.ACCEPT}
        />
      )}
      {modalRejectVisible === true && (
        <AddsModal
          visible={modalVisible}
          onCloseModal={onCloseModal}
          content={S.REJECT_ALERT}
          bookingDetail={bookingData}
          userRole={userRole}
          type={S.REJECT}
        />
      )}
      {modalCancelVisible === true && (
        <AddsModal
          onCloseModal={onCloseModal}
          content={S.CANCEL_ALERT}
          bookingDetail={bookingData}
          userRole={userRole}
          type={S.CANCEL}
        />
      )}
      {modalCompleteVisible === true && (
        <AddsModal
          onCloseModal={onCloseModal}
          content={S.COMPLETED_ALERT}
          bookingDetail={bookingData}
          userRole={userRole}
          type={S.COMPLETE}
        />
      )}
    </React.Fragment>
  );
};

export default ChefBookingButton;
