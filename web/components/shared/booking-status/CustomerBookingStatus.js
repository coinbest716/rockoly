import React, { useEffect, useState } from 'react';
import S from './BookingStatus.String';
import * as util from '../../../utils/checkEmptycondition';
import AddsModal from '../modal/RequestStatusModal';

const CustomerBookingStatus = props => {
  //Initial set value
  const [bookingData, setBookingData] = useState({});
  const [status, setStatus] = useState('');
  const [fullName, setFullName] = useState('Customer');

  useEffect(() => {
    if (util.isObjectEmpty(props) && util.isObjectEmpty(props.bookingDetails)) {
      setBookingData(props.bookingDetails);
      let status = props.bookingDetails.chefBookingStatusId
        ? props.bookingDetails.chefBookingStatusId.trim()
        : '';
      setStatus(status);
      if (
        util.isObjectEmpty(props.bookingDetails.chefProfileByChefId) &&
        util.isStringEmpty(props.bookingDetails.chefProfileByChefId.fullName)
      ) {
        setFullName(props.bookingDetails.chefProfileByChefId.fullName);
      }
    }
  }, [props]);

  return (
    <React.Fragment>
      <div>
        {status === S.PAYMENT_PENDING && <div className="infoText">{S.PAYMENT_PENDING_TEXT}</div>}
        {status === S.PAYMENT_FAILED && <div className="infoText">{S.PAYMENT_FAILED_TEXT}</div>}
        {status === S.REFUND_AMOUNT_SUCCESS && (
          <div className="infoText">{S.REFUND_AMOUNT_SUCCESS_TEXT}</div>
        )}
        {status === S.REFUND_AMOUNT_FAILED && (
          <div className="infoText">{S.REFUND_AMOUNT_FAILED_TEXT}</div>
        )}
        {status === S.CUSTOMER_REQUESTED && <div className="infoText">{S.YOU_HAVE_REQUESTED}</div>}
        {status === S.CHEF_REQUESTED_AMOUNT && (
          <div className="infoText">{S.CHEF_REQUESTED_AMOUNT_TEXT}</div>
        )}
        {status === S.CHEF_ACCEPTED && (
          <div className="infoText">
            {fullName} {S.ACCEPTED_BOOKING}
          </div>
        )}
        {status === S.CHEF_REJECTED && (
          <div className="infoText">
            {fullName} {S.REJECTED_BOOKING}
          </div>
        )}
        {status === S.CANCELLED_BY_CHEF && (
          <div className="infoText">
            {fullName} {S.CANCELLED_BOOKING}
          </div>
        )}
        {status === S.CANCELLED_BY_CUSTOMER && (
          <div className="infoText">{S.YOU_HAVE_CANCELLED}</div>
        )}
        {status === S.COMPLETED || status === S.AMT_TRANSFER_SUCCESS ? (
          <div className="infoText">{S.COMPLETED_TEXT}</div>
        ) : (
          bookingData.chefBookingCompletedByCustomerYn &&
          bookingData.chefBookingCompletedByCustomerYn === true && (
            <div className="infoText">{S.YOU_HAVE_COMPLETED}</div>
          )
        )}
      </div>
    </React.Fragment>
  );
};

export default CustomerBookingStatus;
