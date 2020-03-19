import React, { useState, useEffect } from 'react';
import Modal from 'react-responsive-modal';
import * as util from '../../../utils/checkEmptycondition';
import KitchenUtensilsUpdate from '../../shared/preferences/components/KitchenUtensilUpdate';

const KitchenUtensilsUpdateModal = props => {
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

  function kitchenUtensilsFormCallBack(values, response) {
    props.kitchenUtensilsFormCallBack(values, response);
  }

  function backKitchenUtensilsFormCallBack() {
    props.backKitchenUtensilsFormCallBack();
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
            <KitchenUtensilsUpdate
              customerId={props.customerIdValue}
              details={props.customerDetails}
              response={props.response}
              kitchenUtensilsFormCallBack={kitchenUtensilsFormCallBack}
              backKitchenUtensilsFormCallBack={backKitchenUtensilsFormCallBack}
              screenName={props.screenName}
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

export default KitchenUtensilsUpdateModal;
