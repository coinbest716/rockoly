import React, { useEffect, useState } from 'react';
import { useQuery, useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import VisibilitySensor from 'react-visibility-sensor';
import Autocomplete from 'react-google-autocomplete';
import Geolocation from 'react-geolocation';
import getConfig from 'next/config';
import axios from 'axios';
import dynamic from 'next/dynamic';
import moment from 'moment';
import { firebase } from '../../../config/firebaseConfig';
import { bannerData } from '../const/BannerData';
import { toastMessage } from '../../../utils/Toast';
import { AccordionItemPanel } from 'react-accessible-accordion';
import s from '../../profile-setup/ProfileSetup.String';
const OwlCarousel = dynamic(import('react-owl-carousel3'));
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import * as util from '../../../utils/checkEmptycondition';
import {
  getCustomerId,
  getChefId,
  chef,
  chefId,
  customer,
  getUserTypeRole,
  customerId,
} from '../../../utils/UserType';
import {
  getIsoDate,
  getTimeOnly,
  getLocalTime,
  NotificationconvertDateandTime,
} from '../../../utils/DateTimeFormat';
import { NavigateToBookongDetail } from './Navigation';

// Carousel options
const { publicRuntimeConfig } = getConfig();
const { MAPAPIKEY } = publicRuntimeConfig;

const options = {
  loop: true,
  nav: true,
  dots: true,
  autoplayHoverPause: true,
  items: 1,
  smartSpeed: 750,
  autoplay: true,
  navText: ["<i class='fas fa-arrow-left'></i>", "<i class='fas fa-arrow-right'></i>"],
};

//customer
const customerDataTag = gqlTag.query.customer.profileByIdGQLTAG;
//for getting customer data
const GET_CUSTOMER_DATA = gql`
  ${customerDataTag}
`;

//chef
const chefDataTag = gqlTag.query.chef.profileByIdGQLTAG;

//for getting chef data
const GET_CHEF_DATA = gql`
  ${chefDataTag}
`;

const listChefData = gqlTag.query.chef.listAllDetailsGQLTAG;

const GET_CHEF_LIST_DATA = gql`
  ${listChefData}
`;

// update profile data submit for chef
const updateChefProfileSubmit = gqlTag.mutation.chef.submitForReviewGQLTAG;
const UPDATE_CHEF_PROFILE_SUBMIT = gql`
  ${updateChefProfileSubmit}
`;

const requestSubscription = gqlTag.subscription.booking.byChefIdGQLTAG;
const REQUEST_SUBSCRIPTION = gql`
  ${requestSubscription}
`;

// gql for subscription for chef
const chefProfileSubscription = gqlTag.subscription.chef.ProfileGQLTAG;
const CHEF_SUBSCRIPTION_TAG = gql`
  ${chefProfileSubscription}
`;
const Banner = props => {
  const [userRole, setUserRole] = useState([]);
  const [display, setDisplay] = useState(false);
  const [panel, setPanel] = useState(true);
  const [fullAddress, setFullAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longtitude, setLongtitude] = useState(null);
  const [customerIdValue, setCustomerId] = useState(null);
  const [customerProfileDetails, setCustomerProfileDetails] = useState([]);
  const [chefIdValue, setChefId] = useState(null);
  const [removeModal, setRemoveModal] = useState(false);
  const [ProfileDetails, setProfileDetails] = useState([]);
  const [chefStatusId, setChefStatusId] = useState('');
  const [reason, setReason] = useState('');
  const [mobileNumberVerified, setMobileNumberVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [dateFormat, setDateFormat] = useState(null);
  const [requestList, setRequestList] = useState([]);
  const [star, setStar] = useState();
  const [review, setReview] = useState();
  const [earnings, setEarnings] = useState();
  const [reviewList, setReviewList] = useState([]);
  const [reservationList, setReservationList] = useState([]);
  const [isRegistrationCompletedYn, setIsRegistrationCompletedYn] = useState(false);

  const [getCustomerData, { data }] = useLazyQuery(GET_CUSTOMER_DATA, {
    variables: { customerId: customerIdValue },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [getChefDataByProfile, chefData] = useLazyQuery(GET_CHEF_DATA, {
    variables: { chefId: chefIdValue },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [getChefListByProfile, listData] = useLazyQuery(GET_CHEF_LIST_DATA, {
    variables: {
      chefId: chefIdValue,
      dateTime: dateFormat,
    },
    fetchPolicy: 'network-only',
    // onError: err => {
    //   toastMessage('renderError', err);
    // },
  });

  const [updateChefProfileSubmitFn, { responseForProfileSubmit }] = useMutation(
    UPDATE_CHEF_PROFILE_SUBMIT,
    {
      onCompleted: responseForProfileSubmit => {
        toastMessage('success', 'Submitted successfully');
        onCloseModal();
      },
      onError: err => {
        toastMessage('error', err);
      },
    }
  );

  const { subscriptionData } = useSubscription(REQUEST_SUBSCRIPTION, {
    variables: { chefId: chefIdValue },
    onSubscriptionData: res => {
      if (res) {
        getChefListByProfile();
        // triggerHistorySubscription();
      }
    },
  });

  const { chefProfileSubsdata } = useSubscription(CHEF_SUBSCRIPTION_TAG, {
    variables: { chefId: chefIdValue },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.chefProfile) {
        getChefListByProfile();
      }
    },
  });

  useEffect(() => {
    setDisplay(true);
  }, []);

  //get chef id
  useEffect(() => {
   
    //get user role
    getUserTypeRole()
      .then(async res => {
        setUserRole(res);
        if (res === customer) {
          //customer user
          getCustomerId(customerId)
            .then(customerResult => {
              setCustomerId(customerResult);
            })
            .catch(err => {});
        } else {
          getChefId(chefId)
            .then(async chefResult => {
              await setChefId(chefResult);
            })
            .catch(err => {});
        }
      })
      .catch(err => {});
  }, []);

  useEffect(() => {
    if (customerIdValue) {
      getCustomerData();
    }
  }, customerIdValue);

  useEffect(() => {
    setDateFormat(
      moment(new Date())
        .utc()
        .format('YYYY-MM-DDTHH:mm:ss')
    );
    if (chefIdValue && dateFormat) {
      getChefListByProfile();
      getChefDataByProfile();
    }
    // else{
    //   getChefListByProfile();
    // }
  }, chefIdValue);

  // useEffect(() =>{
  //   getChefListByProfile();
  // },[])
  useEffect(() => {
    // getting customer's details
    if (
      util.isObjectEmpty(data) &&
      util.hasProperty(data, 'customerProfileByCustomerId') &&
      util.isObjectEmpty(data.customerProfileByCustomerId) &&
      util.hasProperty(data.customerProfileByCustomerId, 'customerProfileExtendedsByCustomerId') &&
      util.isObjectEmpty(data.customerProfileByCustomerId.customerProfileExtendedsByCustomerId)
    ) {
      let details = data.customerProfileByCustomerId.customerProfileExtendedsByCustomerId;
      if (util.hasProperty(details, 'nodes') && util.isArrayEmpty(details.nodes)) {
        setFullAddress(
          details.nodes[0].customerLocationAddress ? details.nodes[0].customerLocationAddress : ''
        );
        setLongtitude(
          details.nodes[0].customerLocationLng ? details.nodes[0].customerLocationLng : ''
        );
        setLatitude(
          details.nodes[0].customerLocationLat ? details.nodes[0].customerLocationLat : ''
        );
      }
    } else {
      setCustomerProfileDetails([]);
    }
  }, [data]);

  useEffect(() => {
    // getting chef's details
    if (
      util.isObjectEmpty(chefData) &&
      util.hasProperty(chefData, 'data') &&
      util.isObjectEmpty(chefData.data) &&
      util.hasProperty(chefData.data, 'chefProfileByChefId') &&
      util.isObjectEmpty(chefData.data.chefProfileByChefId)
    ) {
      setProfileDetails(chefData.data.chefProfileByChefId);
      let details = chefData.data.chefProfileByChefId;
      setIsRegistrationCompletedYn(details.isRegistrationCompletedYn);
      setChefStatusId(details.chefStatusId.trim());
      console.log("details.chefStatusId.trim()",details.chefStatusId.trim());
      let reason = details.chefRejectOrBlockReason ? 
      details.chefRejectOrBlockReason : '';
      setReason(reason);
    } else {
      setProfileDetails(null);
    }
  }, [chefData]);

  useEffect(() => {
    console.log("listData OUT",listData);
    if (
      util.isObjectEmpty(listData) &&
      util.hasProperty(listData, 'data') &&
      util.isObjectEmpty(listData.data) &&
      util.hasProperty(listData.data, 'chefProfileByChefId') &&
      util.isObjectEmpty(listData.data.chefProfileByChefId)
    ) {
      console.log("listData if",listData.data.chefProfileByChefId);
      let details = listData.data.chefProfileByChefId;
      let request = details.outstandingRequests;
      let listRequest = details.reviews;
      let reservations = details.futureReservations;
      if (request && request.nodes.length > 0) {
        setRequestList(request.nodes);
      } else {
        setRequestList([]);
      }
      if (details.totalEarnings) {
        setEarnings(details.totalEarnings);
      } else {
        setEarnings(0.000);
      }
      if (details.totalReviewCount) {
        setReview(details.totalReviewCount);
      } else {
        setReview(0);
      }
      if (listRequest && listRequest.nodes.length > 0) {
        setReviewList(listRequest.nodes);
      } else {
        setReviewList([]);
      }
      if (reservations && reservations.nodes.length > 0) {
        setReservationList(reservations.nodes);
      } else {
        setReservationList([]);
      }
    } else{
      console.log("listData else",listData)
      setProfileDetails(null);
      setRequestList([])
      setEarnings(0)
      setReview(0)
      setReviewList([])
      setReservationList([]);
    }
  }, [listData]);

  
  //Check email and mobile number verified or not
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        if (user.phoneNumber) {
          setMobileNumberVerified(true);
        }
        if (user.emailVerified) {
          setEmailVerified(true);
        }
      }
    });
  });

  function getLocation(location) {
    if (props.getLocation) {
      props.getLocation(fullAddress, latitude, longtitude);
    }
  }

  function getCurrentLocation(lat, lon) {
    if (lat && lon) {
      axios
        .post(`${s.GOOGLEAPI}${lat},${lon}${s.KEY}${MAPAPIKEY}`)
        .then(locationData => {
          if (locationData && locationData.data && locationData.data.results[0]) {
            setFullAddress(locationData.data.results[0].formatted_address);
            setLatitude(locationData.data.results[0].formatted_address ? lat : '');
            setLongtitude(locationData.data.results[0].formatted_address ? lon : '');
          }
        })
        .catch(error => {
          toastMessage(renderError, error.message);
        });
    }
  }

  function onClickAlert() {
    console.log('onClickAlert');
  }

  function onClickRequest(data) {
    console.log('onClickRequest');
    let newData = {};
    newData.chefBookingHistId = data.chefBookingHistId;
    NavigateToBookongDetail(newData);
  }

  function onClickReviews() {
    console.log('onClickReviews');
  }

  function onClickStats() {
    console.log('onClickStats');
  }

  function onClickReservations() {
    console.log('onClickReservations');
  }

  function chefBookingTime(data, type) {
    if (type == 'time') {
      let bookingFromTime = getTimeOnly(getLocalTime(data.chefBookingFromTime));
      let bookingToTime = getTimeOnly(getLocalTime(data.chefBookingToTime));
      return "  " + bookingFromTime + ' - ' + bookingToTime;
    } else {
      return NotificationconvertDateandTime(data.chefBookingFromTime);
    }
  }

  async function onClickSubmit() {
    if (emailVerified === true && mobileNumberVerified === true) {
      let variables = {
        pChefId: chefIdValue,
      };
      await updateChefProfileSubmitFn({
        variables,
      });
    } else {
      toastMessage('error', S.VERIFIED_ALERT);
    }
  }

  function onCloseModal() {
    try {
      setRemoveModal(false);
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }

  try {
    return (
      <React.Fragment>
        {/* <OwlCarousel className="home-slides owl-carousel owl-theme" {...options}> */}
        {userRole !== 'chef' &&
          display &&
          bannerData &&
          bannerData.map((res, index) => {
            return (
              <div className="row">
                <div className="col-lg-6">
                  <div className={res.class} key={index}>
                    <div className="d-table">
                      <div className="d-table-cell">
                        <div className="container">
                          <VisibilitySensor>
                            {({ isVisible }) => (
                              <div className="main-banner-content">
                                <h1
                                  className={
                                    isVisible ? 'animated fadeInUp opacityOne' : 'opacityZero'
                                  }
                                >
                                  {res.title}
                                </h1>

                                <p
                                  className={
                                    isVisible ? 'animated fadeInUp opacityOne' : 'opacityZero'
                                  }
                                >
                                  {res.description}
                                </p>
                              </div>
                            )}
                          </VisibilitySensor>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {userRole !== 'chef' && (
                  <div
                    className="col-lg-6"
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  >
                    <div className="location-details-model">
                      <div>
                        <p className="location-text">Rockoly - Find Your Chef</p>
                      </div>
                      <div style={{ display: 'flex', width: '95%' }}>
                        <h5 style={{ color: 'black', display: 'flex', width: '67%' }}>
                          <Autocomplete
                            className="form-control inputView"
                            placeholder="Enter location"
                            value={fullAddress}
                            onChange={event => setFullAddress(event.target.value)}
                            onPlaceSelected={place => {
                              setFullAddress(place.formatted_address);
                              setLatitude(
                                place.formatted_address ? place.geometry.location.lat() : ''
                              );
                              setLongtitude(
                                place.formatted_address ? place.geometry.location.lng() : ''
                              );
                            }}
                            types={['address']}
                            componentRestrictions={{ country: 'us' }}
                          />
                        </h5>
                        <Geolocation
                          render={({
                            fetchingPosition,
                            position: { coords: { latitude, longitude } = {} } = {},
                            error,
                            getCurrentPosition,
                          }) => (
                            <div className="locationIconView">
                              <i
                                className="fas fa-crosshairs"
                                id="current-locaton-view"
                                onClick={() => getCurrentLocation(latitude, longitude)}
                              ></i>
                            </div>
                          )}
                        />
                        <button
                          className="btn btn-primary"
                          id="home-search-button"
                          onClick={() => getLocation(event)}
                          style={{ height: '42px', marginLeft: '20px', marginTop: '2px' }}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        {userRole === 'chef' &&
          display &&
          bannerData &&
          bannerData.map((res, index) => {
            return (
              <div>
                <div class="row">
                  <div class="col-lg-5 overview" onClick={() => onClickAlert()}>
                    <h4>Alerts</h4>
                    <div>
                      {chefStatusId === 'PENDING' && (
                        <div>
                          <div className="statusMsg">
                            {s.PROFILE_STATUS}
                            <div className="response-view" style={{ paddingLeft: 5 }}>
                              {' '}
                              {' ' + s.REVIEW_PENDING}
                            </div>
                          </div>

                          <div className="statusMsg" id="failed">
                            <div className="response-view">{s.REVIEW_PENDING_MSG}</div>
                          </div>
                          {isRegistrationCompletedYn === true && (
                            <div className="basicInfoSubmit">
                              <button
                                type="submit"
                                onClick={() => setRemoveModal(true)}
                                className="btn btn-primary"
                              >
                                {s.SUBMIT}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      {chefStatusId === 'REJECTED' && (
                        <div>
                          <div className="statusMsg">
                            {s.PROFILE_STATUS}
                            <div className="response-view" style={{ paddingLeft: 5 }}>
                              {s.REVIEW_REJECTED}
                            </div>
                          </div>
                          {isRegistrationCompletedYn === true && (
                            <div className="basicInfoSubmit">
                              <button
                                type="submit"
                                onClick={() => setRemoveModal(true)}
                                className="btn btn-primary"
                              >
                                {s.SUBMIT}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      {chefStatusId === 'SUBMITTED_FOR_REVIEW' && (
                        <div>
                          <div className="statusMsg">
                            {s.PROFILE_STATUS}
                            <div className="response-view" style={{ paddingLeft: 5 }}>
                              {s.SUBMIT_FOR_REVIEW}
                            </div>
                          </div>
                        </div>
                      )}
                      {chefStatusId === 'APPROVED' && (
                        <div>
                          <div className="statusMsg">
                            {s.PROFILE_STATUS}
                            <div className="response-view">{s.PROFILE_VERIFIED}</div>
                          </div>
                        </div>
                      )}
                      {util.isStringEmpty(reason) && (
                        <div className="statusMsg">
                          REASON : 
                          <div className="response-view">{reason}</div>
                        </div>
                      )}
                    </div>

                    {emailVerified === true && (
                      // <span class="fas fa-check tickIcon" ></span>
                      <div class="verificationSuccess">Email has been Verified </div>
                    )}
                    {emailVerified === false && (
                      <div class="verification">You didn't verify your Email</div>
                    )}

                    {mobileNumberVerified === true && (
                      <div class="verificationSuccess">Mobile number has been Verified</div>
                    )}
                    {mobileNumberVerified === false && (
                      <div class="verification">You didn't verify your Mobile number</div>
                      // <span class="fas fa-times crossIcon" ></span>
                    )}
                  </div>
                  <div class="col-lg-6 overview scroll">
                    <h4>Request</h4>
                    {requestList.length > 0 &&
                      requestList.map(request => {
                        return (
                          <div
                            className="request row"
                            id="chef-home-request"
                          >
                            <div
                              className="col-lg-3"
                              style={{ display: 'flex', flexDirection: 'column',paddingTop: '2%' }}
                            >
                              <img
                                className="profile-pic"
                                src={request.customerProfileByCustomerId.customerPicId}
                              />
                              <p className="request-name">
                                {request.customerProfileByCustomerId.fullName}
                              </p>
                            </div>
                            <div className="col-lg-5" style={{ textAlign: 'center' }}>
                              <p className="request-name ">
                                Booking Time:{chefBookingTime(request, 'time')}
                              </p>
                              <p class="request-name">Date:{chefBookingTime(request, 'date')}</p>
                            </div>
                            <button
                              className="btn btn-primary button"
                              onClick={() => onClickRequest(request)}
                            >
                              View
                            </button>
                          </div>
                        );
                      })}
                    {requestList.length == 0 && <h4>No past request</h4>}
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-5 overview scroll">
                    <h4>Reviews</h4>
                    {reviewList.length > 0 &&
                      reviewList.map(review => {
                        return (
                          <div class="request row" id="chef-home-request">
                            <div
                              className="col-lg-3"
                              style={{ display: 'flex', flexDirection: 'column',paddingTop: '2%' }}
                            >
                              <img
                                class="profile-pic"
                                src={review.customerProfileByCustomerId.customerPicId}
                              />
                              <p class="request-name">
                                {review.customerProfileByCustomerId.fullName}
                              </p>
                            </div>
                            <div className="col-lg-5" style={{ textAlign: 'center' }}>
                              <p class="request-name">
                                Booking Time:{chefBookingTime(review, 'time')}
                              </p>

                              <p class="request-name">Date:{chefBookingTime(review, 'date')}</p>
                            </div>
                            <button
                              class="btn btn-primary button"
                              onClick={() => onClickRequest(review)}
                            >
                              View
                            </button>
                          </div>
                        );
                      })}
                    {reviewList.length == 0 && <h4>No pending reviews</h4>}
                  </div>
                  {/* reviewList */}
                  <div class="col-lg-6 overview">
                    <h4>Stats</h4>
                    <h5>Earnings : $ {earnings ? earnings.toFixed(2) : '0'}</h5>
                    <h5>Review Counts : {review}</h5>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-5 overview scroll">
                    <h4>Reservations</h4>
                    {reservationList.length > 0 &&
                      reservationList.map(reservation => {
                        return (
                          <div class="request row" id="chef-home-request">
                            <div
                              className="col-lg-3"
                              style={{ display: 'flex', flexDirection: 'column',paddingTop: '2%' }}
                            >
                              <img
                                class="profile-pic"
                                src={reservation.customerProfileByCustomerId.customerPicId}
                              />
                              <p class="request-name">
                                {reservation.customerProfileByCustomerId.fullName}
                              </p>
                            </div>
                            <div className="col-lg-5">
                              <p class="request-name">
                                Booking Time:{chefBookingTime(reservation, 'time')}
                              </p>
                              <p class="request-name">
                                Date:{chefBookingTime(reservation, 'date')}
                              </p>
                            </div>
                            <button
                              class="btn btn-primary button"
                              onClick={() => onClickRequest(reservation)}
                            >
                              View
                            </button>
                          </div>
                        );
                      })}
                    {reservationList.length == 0 && <h4>No reservations yet</h4>}
                  </div>
                </div>

                {removeModal === true && (
                  <div className={`bts-popup ${open ? 'is-visible' : ''}`} role="alert">
                    <div className="bts-popup-container">
                      <h6>Ready to submit your profile for review ?</h6>
                      <p>You will be notified of your registration status within 48 hours.</p>
                      <button
                        type="submit"
                        className="btn btn-success"
                        onClick={() => onCloseModal()}
                      >
                        Cancel
                      </button>{' '}
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => onClickSubmit()}
                      >
                        Ok
                      </button>
                      {/* <Link href="#">
                          <a onClick={() => onCloseModal()} className="bts-popup-close"></a>
                        </Link> */}
                    </div>
                  </div>
                )}
                {/* <div className="d-table">
                  <div className="d-table-cell">
                    <div className="container">
                      <VisibilitySensor>
                        {({ isVisible }) => (
                          <div className="main-banner-content">
                            <h1
                              className={isVisible ? 'animated fadeInUp opacityOne' : 'opacityZero'}
                            >
                              {res.title}
                            </h1>

                            <p
                              className={isVisible ? 'animated fadeInUp opacityOne' : 'opacityZero'}
                            >
                              {res.description}
                            </p>
                          </div>
                        )}
                      </VisibilitySensor>
                    </div>
                  </div>
                </div> */}
              </div>
            );
          })}
        {/* </OwlCarousel> */}
      </React.Fragment>
    );
  } catch (error) {
    toastMessage('renderError', error.message);
  }
};

export default Banner;
