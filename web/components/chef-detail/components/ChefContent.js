import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import Rating from 'react-rating';
import { useLazyQuery, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import * as util from '../../../utils/checkEmptycondition';
import s from '../ChefDetail.Strings';
import 'react-toastify/dist/ReactToastify.css';
import PricingModal from '../../shared/modal/PricingModal';
import ChatModal from '../../shared/modal/ChatModal';
import { AppContext } from '../../../context/appContext';
import {
  getChefId,
  getCustomerId,
  chefId,
  chef,
  customer,
  getUserTypeRole,
  customerId,
} from '../../../utils/UserType';
import BookingForms from '../../shared/modal/BookingForm';
import { toastMessage } from '../../../utils/Toast';

//chef
const chefDataTag = gqlTag.query.chef.profileByIdGQLTAG;
//for getting chef data
const GET_CHEF_DATA = gql`
  ${chefDataTag}
`;

const chefProfileSubscription = gqlTag.subscription.chef.ProfileGQLTAG;
const CHEF_SUBSCRIPTION_TAG = gql`
  ${chefProfileSubscription}
`;

const chefLocationSubscription = gqlTag.subscription.chef.profileExtendedGQLTAG;
const CHEF_LOCATION_SUBS = gql`
  ${chefLocationSubscription}
`;

// get conversationid subscription
const conversationSubscription = gqlTag.subscription.chat.conversationHistoryGQLTAG;
const CONVERSATION_SUBSCRIPTION_TAG = gql`
  ${conversationSubscription}
`;

const ChefContent = props => {
  const [isUIRendered, setIsUIRendered] = useState(false);
  const [chefIdValue, setChefId] = useState(null);
  const [customerIdValue, setCustomerId] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [ProfileDetails, setProfileDetails] = useState([]);
  const [state, setState] = useContext(AppContext);
  const [showChatPage, setShowChatPage] = useState(false);
  const [sameUser, setUserIsYn] = useState(false);

  let NoReview = 'No Review';

  const [getChefDataByProfile, { data, error }] = useLazyQuery(GET_CHEF_DATA, {
    variables: {
      chefId: props.chefId,
      pCustomerId: customerIdValue ? customerIdValue : null,
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  if (error) {
    toastMessage('error', error);
  }

  useEffect(() => {
    //get user role
    getUserTypeRole()
      .then(async res => {
        if (!res) {
          // console.log("res",res)
          getChefDataByProfile();
        }

        setUserRole(res);
        if (res === customer) {
          //customer user
          getCustomerId(customerId)
            .then(async customerResult => {
              await setCustomerId(customerResult);
              // console.log("customerResult",customerResult)
              // getCustomerData();
            })
            .catch(err => { });
        }
      })
      .catch(err => { });
  }, []);
  useEffect(() => {
    if (customerIdValue) {
      getChefDataByProfile();
    }
  }, customerIdValue);
  const { chefProfileSubsdata } = useSubscription(CHEF_SUBSCRIPTION_TAG, {
    variables: { chefId: props.chefId },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.chefProfile) {
        getChefDataByProfile();
      }
    },
  });
  const { chefLocationSubs } = useSubscription(CHEF_LOCATION_SUBS, {
    variables: { chefId: props.chefId },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.chefProfileExtended) {
        getChefDataByProfile();
      }
    },
  });

  const { chefConversationSubs } = useSubscription(CONVERSATION_SUBSCRIPTION_TAG, {
    variables: {
      tableName: 'chef_customer_conversation',
      tablePkId: props && props.chefId ? props.chefId : null,
      tablePkId2: customerIdValue ? customerIdValue : null,
    },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.conversationHistory) {
        getChefDataByProfile();
      }
    },
  });

  useEffect(() => {
    if (
      // util.isObjectEmpty(data) &&
      // util.hasProperty(data, 'data') &&
      // util.isObjectEmpty(data.data) &&
      util.hasProperty(data, 'chefProfileByChefId') &&
      util.isObjectEmpty(data.chefProfileByChefId)
    ) {
      setProfileDetails(data.chefProfileByChefId);
    } else {
      setProfileDetails(null);
    }
    setIsUIRendered(true);
  });

  useEffect(() => {
    //get local storage value for menu highlight and loggedin status to show menu
    getUserTypeRole()
      .then(res => {
        setUserRole(res);
      })
      .catch(err => { });
  });

  function openModal() {
    setOpen(false);
  }

  function onClickBooking(event) {
    if (props.onClickBooking) {
      props.onClickBooking(event, true);
    }
  }

  function closeModal() {
    setShowChatPage(false);
  }

  useEffect(() => {
    if (
      util.isObjectEmpty(state) &&
      util.hasProperty(state, 'customerProfile') &&
      util.isObjectEmpty(state.customerProfile)
    ) {
      let userId = state.customerProfile.userId;
      if (util.isObjectEmpty(ProfileDetails)) {
        if (userId === ProfileDetails.userId) {
          setUserIsYn(true);
        } else {
          setUserIsYn(false);
        }
      }
    }
  }, [state, ProfileDetails]);

  return (
    <React.Fragment>
      {/* {open === true && <BookingForms openModal={openModal} open={open} />} */}
      <div className="col-lg-6 col-md-6 col-sm-6 chefDetail">
        {isUIRendered === true && ProfileDetails && (
          <div
            className="product-details-content"
            id="chef-info-content"
            style={{ paddingRight: '10%' }}
          >
            {ProfileDetails && util.isStringEmpty(ProfileDetails.fullName) && (
              <h3 className="chef-content-fullname">{ProfileDetails.fullName}</h3>
            )}
            {ProfileDetails.chefProfileExtendedsByChefId &&
              util.hasProperty(ProfileDetails.chefProfileExtendedsByChefId, 'nodes') &&
              ProfileDetails.chefProfileExtendedsByChefId.nodes.map(node => {
                console.log('ProfileDetails', node);
                return (
                  <div key={node.chefProfileExtendedId}>
                    <div className="products-content" key={node.chefProfileExtendedId}>
                      <p className="chef-content-fullname" style={{ fontWeight: 500 }}>
                        {(userRole === chef || userRole === customer) &&
                          node.chefCity &&
                          node.chefState && (
                            <div>
                              <i className="fas fa-map-marker-alt iconColor"></i>
                              <span className="location">
                                {userRole === chef || userRole === customer
                                  ? `${node.chefCity}, ${node.chefState}`
                                  : `${node.chefCity}, ${node.chefState}`}
                              </span>
                            </div>
                          )}
                      </p>
                    </div>
                    {/* {console.log(ProfileDetails)} */}
                    <div className="price" id="price-valu-view">
                      <span className="new-price">
                        {node.chefPriceUnit &&
                          util.isStringEmpty(node.chefPricePerHour) &&
                          node.chefPricePerHour > 0 &&
                          node.chefPriceUnit.toUpperCase() === 'USD' && (
                            <div>$ {node.chefPricePerHour} </div>
                          )}
                        {node.chefPriceUnit &&
                          util.isStringEmpty(node.chefPricePerHour) &&
                          node.chefPricePerHour > 0 &&
                          node.chefPriceUnit.toUpperCase() !== 'USD' && (
                            <div>
                              {node.chefPriceUnit} {node.chefPricePerHour}
                            </div>
                          )}
                        {/* {node.chefPricePerHour &&
                          <div>
                            
                        </div>
                        } */}
                      </span>
                    </div>
                  </div>
                );
              })}
            {/* </div> */}

            <div
              className="product-review review-comments"
              id="review-text"
              style={{ margin: '0px', padding: '0px' }}
            >
              <div
                className="rating"
                id="ratingContainer-items"
                style={{ width: 'max-content', display: 'flex', alignItems: 'center' }}
              >
                <div className="review-item"></div>
                {ProfileDetails.averageRating > 0 && (
                  <div>
                  <Rating
                    initialRating={ProfileDetails.averageRating}
                    className="ratingView"
                    id="chef-content-rating"
                    emptySymbol={
                      <img src={s.EMPTY_STAR} id="empty-star-content" className="rating" />
                    }
                    fullSymbol="fa fa-star color-star-view"
                    // id=""
                    fractions={2}
                    readonly={true}
                  />
                  <span>
                    {ProfileDetails.averageRating > 0 && Math.round(ProfileDetails.averageRating)}{' '}
                  </span>{' '}
                  </div>
                )}
              </div>
            </div>

            <div className="review-text-view">

              {util.isStringEmpty(ProfileDetails.totalReviewCount) &&
                ProfileDetails.totalReviewCount > 0 && (
                  <span className="chefReviewCount">{ProfileDetails.totalReviewCount} Reviews</span>
                )}
              {!util.isStringEmpty(ProfileDetails.totalReviewCount) &&
                ProfileDetails.totalReviewCount === 0 && (
                  <span className="chefReviewCount">New Chef</span>
                )}
              {userRole !== '' &&
                userRole !== false &&
                userRole === customer &&
                sameUser === false && (
                  <div className="chat-btn">
                    <button
                      className="btn btn-primary"
                      id="chef-details-chat"
                      onClick={() => setShowChatPage(true)}
                      style={{ width: '100%' }}
                    >
                      Ask Questions
                    </button>
                  </div>
                )}
            </div>
          </div>
        )}
        {/* Show the chat window */}
        {showChatPage === true && (
          <div>
            <ChatModal closeModal={closeModal} chefDetails={ProfileDetails} />
          </div>
        )}

        <div className="reward-style">
          {/* {ProfileDetails && util.hasProperty(ProfileDetails, 'bookingCompletedCount') && (
            <div>
              <div
                className="description-name"
                id="pro-border-style"
                style={{ borderRightStyle: 'groove', }}
              >
                <div class="top-pro-view" style={{width:'maxContent'}}>
                  <span>
                    <img
                      src={require('../../../images/mock-image/shield-icon.png')}
                      alt="image"
                      className="icon-images"
                    />
                  </span>
                  

                  <span style={{ padding: '3px', paddingRight: '8px' }}>Top Pro</span>
                </div>
              </div>
            </div>
          )} */}
          {isUIRendered === true &&
            ProfileDetails &&
            util.hasProperty(ProfileDetails, 'bookingCompletedCount') &&
            util.isStringEmpty(ProfileDetails.bookingCompletedCount) && (
              <div>
                <div className="description-name" id="pro-border-style">
                  <div className="top-pro-view" style={{ width: 'maxContent' }}>
                    <span>
                      <img
                        src={require('../../../images/mock-image/shield-icon.png')}
                        alt="image"
                        className="icon-images"
                      />
                    </span>
                    {/* <i class="fal fa-shield-check"></i> */}
                    {ProfileDetails.bookingCompletedCount >= 100 ? (
                      <span style={{ padding: '5px', paddingRight: '8px' }}>Master Chef</span>
                    ) : (
                        <span style={{ padding: '5px', paddingRight: '8px' }}>New Chef</span>
                      )}
                  </div>
                </div>
              </div>
            )}
          {/* {isUIRendered === true && (
            <div
              className="description-name"
              id="pro-border-style"
              style={{ borderRightStyle: 'groove' }}
            >
              <div className="top-pro-view">
                <div className="dsmds">
                  <img
                    src={require('../../../images/mock-image/trophy-icon.png')}
                    alt="image"
                    className="icon-images"
                  />
                  <i class="fa fa-trophy" aria-hidden="true" id="description-icon"></i>
                  <span style={{ padding: '3px', paddingRight: '8px' }}>High in Demand</span>
                </div>
              </div>
            </div>
          )} */}

          {/* {ProfileDetails &&
            util.isStringEmpty(ProfileDetails.chefId) &&
            util.hasProperty(ProfileDetails, 'chefProfileExtendedsByChefId') &&
            util.hasProperty(ProfileDetails.chefProfileExtendedsByChefId, 'nodes') &&
            ProfileDetails.chefProfileExtendedsByChefId.nodes.map(node => {
              return (
                <div
                  id="pro-border-style"
                  style={{ borderRightStyle: 'groove' }}
                  key={ProfileDetails.chefId}
                >
                  {util.isStringEmpty(node.chefExperience) && (
                    <div className="top-pro-view">
                      <div className="description-name">
                        <div>
                          <img
                            src={require('../../../images/mock-image/clock-icon.png')}
                            alt="image"
                            className="icon-images"
                          />

                          <span
                            style={{
                              padding: '3px',
                              paddingRight: '8px',
                            }}
                          >
                            {node.chefExperience} Years in Business
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })} */}

          {/* {isUIRendered === true &&
            ProfileDetails &&
            util.hasProperty(ProfileDetails, 'bookingCompletedCount') &&
            util.isStringEmpty(ProfileDetails.bookingCompletedCount) && (
              <div className="description-name" style={{}}>
                <div className="top-pro-view">
                  <div className="dsmds">
                    <img
                      src={require('../../../images/mock-image/trophy-icon.png')}
                      alt="image"
                      className="icon-images"
                    />
                    <i class="fa fa-trophy" aria-hidden="true" id="description-icon"></i>
                    {ProfileDetails.bookingCompletedCount} <span> Hires</span>
                  </div>
                </div>
                <p id="description-date">{props.chefDetails.bookingCompletedCount}</p>
              </div>
            )} */}
          {/* {isUIRendered === true &&
            ProfileDetails &&
            util.hasProperty(ProfileDetails, 'bookingCompletedCount') &&
            !util.isStringEmpty(ProfileDetails.bookingCompletedCount) && (
              <div className="description-name" style={{}}>
                <div className="top-pro-view">
                  <img
                    src={require('../../../images/mock-image/trophy-icon.png')}
                    alt="image"
                    className="icon-images"
                  />

                  <span> No Hired</span>
                </div>
              </div>
            )} */}
        </div>
      </div>
      {/* <div className="col-lg-2 col-md-6 row" id="cheflist-image">
        {ProfileDetails &&
          util.hasProperty(ProfileDetails, 'chefProfileExtendedsByChefId') &&
          util.hasProperty(ProfileDetails.chefProfileExtendedsByChefId, 'nodes') &&
          util.isObjectEmpty(ProfileDetails.chefProfileExtendedsByChefId.nodes) &&
          ProfileDetails.chefProfileExtendedsByChefId.nodes.map(node => {
            return (
              <div>
                {util.isStringEmpty(node.chefFacebookUrl) && (
                  <Link href={node.chefFacebookUrl}>
                    <a target="_blank" className="atag">
                      <img
                        id="facebook1"
                        src="https://i.pinimg.com/originals/41/28/2b/41282b58cf85ddaf5d28df96ed91de98.png"
                      />
                    </a>
                  </Link>
                )}
                {util.isStringEmpty(node.chefTwitterUrl) && (
                  <Link href={node.chefTwitterUrl}>
                    <a target="_blank" className="atag">
                      <img
                        id="facebook"
                        src=" https://uwm.edu/studentinvolvement/wp-content/uploads/sites/260/2017/12/twitter-icon-vector.png"
                      />
                    </a>
                  </Link>
                )}
              </div>
            );
          })}
      </div> */}
      {/* <PricingModal ProfileDetails={ProfileDetails} chefId = {props.chefId}/> */}
      {/* {userRole === 'customer' && (
        <div className="col-lg-2 col-md-6 row" id="cheflist-image">
          {ProfileDetails &&
            ProfileDetails.chefProfileExtendedsByChefId.nodes.map(node => {
              return (
                <div>
                  <a className="atag">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={event => onClickBooking(event)}
                      id="submit-button"
                    >
                      Check Availability
                    </button>
                  </a>
                </div>
              );
            })}
        </div>
      )} */}
    </React.Fragment>
  );
};

export default ChefContent;
