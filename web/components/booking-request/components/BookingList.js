import React, { useEffect, useState, useContext } from 'react';
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import S from '../BookingRequest.String';
import { NavigateToBookongDetail } from './Navigation';
import { toastMessage } from '../../../utils/Toast';
import {
  isObjectEmpty,
  hasProperty,
  isArrayEmpty,
  isStringEmpty,
} from '../../../utils/checkEmptycondition';
import { getLocalTime } from '../../../utils/DateTimeFormat';
import { AppContext } from '../../../context/appContext';
import ChefBookingButton from '../../shared/booking-buttons/ChefBookingButton';
import ChefBookingStatus from '../../shared/booking-status/ChefBookingStatus';

const BookingList = props => {
  const [state, setState] = useContext(AppContext);
  const [userRole, setUserRole] = useState(state.role);
  const [requestList, setRequestList] = useState();

  function onClickBookingDetail(data) {
    let bookingType = S.UPCOMING;
    data.bookingType = bookingType;
    NavigateToBookongDetail(data);
  }

  function triggerSubscription() {
    if (props.triggerHistorySubscription) {
      props.triggerHistorySubscription();
    }
  }

  useEffect(() =>{
    if(isObjectEmpty(props.requestDetails)){
      setRequestList(props.requestDetails);
    }else{
      setRequestList([])
    }
  },[props])

  try {
    return (
      <React.Fragment>
        <div className="list-group">
          <div style={{ display: 'flex' }}>
            <p style={{ color: '#08AB93' }} class="date-view">
              <b>
                {props.SelectedDateValue}
                {/* <div style={{ display: 'flex', justifyContent: 'center' }}></div> */}
              </b>
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '75%',
                fontWeight: 'bolder',
              }}
            >
              {' '}
              <label style={{}}>
                {'   '}Showing {props.bookingCount} results
              </label>
            </div>
          </div>
          {isObjectEmpty(requestList) &&
           requestList.map(res => {
              return (
                <div
                  className="woocommerce-sidebar-area"
                  id="booking-list-style"
                  key={res.chefBookingHistId}
                >
                  <div className="collapse-widget aside-products-widget">
                    <div className="" id="request-content-view">
                      {hasProperty(res, 'customerProfileByCustomerId') &&
                        isObjectEmpty(res.customerProfileByCustomerId) && (
                          <div
                            className="col-lg-3 col-md-12 col-sm-12"
                            id="request-profile-view"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              onClickBookingDetail(res);
                            }}
                          >
                            <div className="products-image">
                              <img
                                src={
                                  res.customerProfileByCustomerId.customerPicId
                                    ? res.customerProfileByCustomerId.customerPicId
                                    : require('../../../images/mock-image/sample_user.png')
                                }
                                alt="image"
                                width="200"
                                height="140"
                              />
                            </div>
                          </div>
                        )}
                      {hasProperty(res, 'customerProfileByCustomerId') &&
                        isStringEmpty(res.customerProfileByCustomerId) && (
                          <div
                            className="col-lg-4 col-md-12 col-sm-12"
                            id="request-address-view"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              onClickBookingDetail(res);
                            }}
                          >
                            <div className="products-content">
                              <span>
                                <div>
                                  <p className="request-name-view" style={{ fontWeight: 'bolder' }}>
                                    {res.customerProfileByCustomerId.fullName}
                                  </p>
                                  {hasProperty(
                                    res.customerProfileByCustomerId,
                                    'customerProfileExtendedsByCustomerId'
                                  ) &&
                                    isObjectEmpty(
                                      res.customerProfileByCustomerId
                                        .customerProfileExtendedsByCustomerId
                                    ) &&
                                    hasProperty(
                                      res.customerProfileByCustomerId
                                        .customerProfileExtendedsByCustomerId,
                                      'nodes'
                                    ) &&
                                    isArrayEmpty(
                                      res.customerProfileByCustomerId
                                        .customerProfileExtendedsByCustomerId.nodes
                                    ) &&
                                    res.customerProfileByCustomerId.customerProfileExtendedsByCustomerId.nodes.map(
                                      node => {
                                        return (
                                          <div className="request-addcontainer-view">
                                            {isObjectEmpty(node) &&
                                              isStringEmpty(node.customerLocationAddress) && (
                                                <p className="request-address-view">
                                                  <i
                                                    className="fas fa-map-marker-alt iconColor"
                                                    aria-hidden="true"
                                                  >
                                                    {' '}
                                                  </i>{' '}
                                                  {node.customerLocationAddress}
                                                </p>
                                              )}
                                          </div>
                                        );
                                      }
                                    )}

                                  <p className="request-time-view" style={{ color: '#da0c62' }}>
                                    <i
                                      className="fas fa-clock iconColor"
                                      id="time-icon-view"
                                      aria-hidden="true"
                                    >
                                      {' '}
                                    </i>{' '}
                                    {moment(getLocalTime(res.chefBookingFromTime)).format('h:mm a')}{' '}
                                    to{' '}
                                    {moment(getLocalTime(res.chefBookingToTime)).format('h:mm a')}
                                  </p>
                                </div>
                              </span>
                            </div>
                          </div>
                        )}
                      <div className="col-lg-5 col-md-12 col-sm-12" id="request-status-view">
                        <ChefBookingStatus bookingDetails={res} />
                        <ChefBookingButton bookingDetails={res} userRole={'chef'} triggerSubscription={triggerSubscription}/>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          {!isObjectEmpty(props.requestDetails) && (
            <div>
              <p className="noRequest">Currently You have no request on this date</p>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
};
export default BookingList;
