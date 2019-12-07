import React, { useEffect, useState } from 'react';
import S from './BookingStatus.String';
import * as util from '../../../utils/checkEmptycondition';
import AddsModal from '../modal/RequestStatusModal';

const ChefBookingStatus = props => {
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
        util.isObjectEmpty(props.bookingDetails.customerProfileByCustomerId) &&
        util.isStringEmpty(props.bookingDetails.customerProfileByCustomerId.fullName)
      ) {
        setFullName(props.bookingDetails.customerProfileByCustomerId.fullName);
      }
    }
  }, [props]);

  return (
    <React.Fragment>
      <div
        className="booking-status-view"
        style={{ width: '100%', display: 'flex', alignItems: 'center' }}
      >
        <div>
          {(status === S.REFUND_AMOUNT_SUCCESS || status === S.REFUND_AMOUNT_FAILED) && (
            <div className="infoText">{S.REFUND_CHEF_TEXT}</div>
          )}
          {status === S.CUSTOMER_REQUESTED && (
            <div className="infoText">
              {fullName} {S.REQUESTED_BOOKING}
            </div>
          )}
          {status === S.CHEF_ACCEPTED && <div className="infoText">{S.YOU_HAVE_ACCEPTED}</div>}
          {status === S.CHEF_REJECTED && <div className="infoText">{S.YOU_HAVE_REJECTED}</div>}
          {status === S.CANCELLED_BY_CUSTOMER && (
            <div className="infoText">
              {fullName} {S.CANCELLED_BOOKING}
            </div>
          )}
          {status === S.CANCELLED_BY_CHEF && <div className="infoText">{S.YOU_HAVE_CANCELLED}</div>}
          {status === S.COMPLETED ? (
            <div className="infoText">{S.COMPLETED_TEXT}</div>
          ) : (
            <div>
              {status === S.AMT_TRANSFER_SUCCESS ? (
                <div className="addressText">{S.AMT_TRANSFER_SUCCESS_TEXT}</div>
              ) : (
                <div>
                  {bookingData.chefBookingCompletedByChefYn &&
                    bookingData.chefBookingCompletedByChefYn === true && (
                      <div className="infoText">{S.YOU_HAVE_COMPLETED}</div>
                    )}
                </div>
              )}
            </div>
          )}

          {status === S.AMT_TRANSFER_FAILED && (
            <div className="addressText">{S.AMT_TRANSFER_FAILED_TEXT}</div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ChefBookingStatus;
