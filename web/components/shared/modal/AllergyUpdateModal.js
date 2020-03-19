import React, { useState, useEffect } from 'react';
import Modal from 'react-responsive-modal';
import * as util from '../../../utils/checkEmptycondition';
import AllergyUpdate from '../../shared/preferences/components/AllergyUpdate';

const AllergyUpdateModal = props => {
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

  function submitAllergy(response, values) {
    props.AllergyFormCallBack(response, values);
  }

  function backAllergyFormCallBack() {
    props.backAllergyFormCallBack();
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
            <AllergyUpdate
              customerId={props.customerIdValue}
              details={props.customerDetails}
              screenName={props.screenName}
              AllergyFormCallBack={submitAllergy}
              backAllergyFormCallBack={backAllergyFormCallBack}
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

export default AllergyUpdateModal;
