import React, { useState, useEffect } from 'react';
import Modal from 'react-responsive-modal';
import * as util from '../../../utils/checkEmptycondition';
import DietaryUpdate from '../../shared/preferences/components/DietaryrestrictionsUpdate';

const DietUpdateModal = props => {
  const [Isopen, setIsOpen] = useState(true);
  const [ProfileDetails, setProfileDetails] = useState([]);
  const [range, setRange] = useState(1);
  const [PriceRange, setPrcieRange] = useState(1);
  const [bookingDetail, setBookingDetail] = useState({});

  function closeModal() {
    setIsOpen(false);

    if (props.onCloseBookingModal) {
      props.onCloseBookingModal();
    }
  }

  useEffect(() => {
    let data = props.bookingDetail;
    if (util.isObjectEmpty(data)) {
      setBookingDetail(data);
    }
  }, [props.bookingDetail]);

  function DietFormCallBack(value, response) {
    props.DietFormCallBack(value, response);
  }

  function backDietFormCallBack() {
    props.backDietFormCallBack();
  }

  try {
    return (
      <div>
        <Modal
          open={Isopen}
          id="inactive"
          center
          onClose={closeModal}
          style={{ width: '40%' }}
          // closeOnOverlayClick={false}
        >
          <div className="login-content">
            <DietaryUpdate
              customerId={props.customerIdValue}
              details={props.customerDetails}
              DietFormCallBack={DietFormCallBack}
              backDietFormCallBack={backDietFormCallBack}
              screenName={props.screenName}
              response={props.response}
              bookingDetail={bookingDetail}
            />
          </div>
        </Modal>
      </div>
    );
  } catch (error) {
    //console.log('error', error);
  }
};

export default DietUpdateModal;
