import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import gql from 'graphql-tag';
import Rating from 'react-rating';
import ReactTooltip from 'react-tooltip';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import s from '../FavoriteChef.String';
import * as gqlTag from '../../../common/gql';
import Pagination from '../../shared/pagination/Pagination';
import { ToastContainer, Slide } from 'react-toastify';
import { toastMessage } from '../../../utils/Toast';
import { getCustomerId, customerId } from '../../../utils/UserType';
import NoData from '../../shared/noData/noData';
import Loader from '../../Common/loader';
import {
  isObjectEmpty,
  hasProperty,
  isArrayEmpty,
  isStringEmpty,
} from '../../../utils/checkEmptycondition';
import { NavigateToChefDetail } from './Navigation';
import { AppContext } from '../../../context/appContext';

const followcheflist = gqlTag.query.follow.filterByCustomerIdGQLTAG;
const updatefavorite = gqlTag.mutation.follow.chefFollowOrUnFollowGQLTAG;

const GET_FAVORITE_CHEF_LIST_DATA = gql`
  ${followcheflist}
`;

const UPDATE_FOLLOW_UNFOLLOW_LIST = gql`
  ${updatefavorite}
`;

const favoriteSubscription = gqlTag.subscription.customer.followChefGQLTAG;
const FAVORITE_SUBSCRIPTION = gql`
  ${favoriteSubscription}
`;

const getTotalCountTag = gqlTag.query.custom.totalCountGQLTAG;

const GET_TOTAL_COUNT = gql`
  ${getTotalCountTag}
`;

export const FavoriteChef = props => {
  const [state, setState] = useContext(AppContext);
  const [favoriteChefData, setfavoriteChefData] = useState([]);
  const [customerIdValue, setCustomerId] = useState(null);
  const [firstParams, setFirstParams] = useState(state.firstparams ? state.firstparams : 15);
  const [favoriteCount, setFavoriteCount] = useState();
  const [favoriteCountData, setFavoriteCountData] = useState();
  //Fetching favorite list of particular customer
  const [getFavoriteChefListData, DataValue] = useLazyQuery(GET_FAVORITE_CHEF_LIST_DATA, {
    variables: {
      customerId: customerIdValue,
      first: firstParams,
      offset: 0,
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  let dataValue = {
    type: 'CUSTOMER_FOLLOW_CHEF',
    customerId: customerIdValue,
  };
  const [getTotalCount, totalCountValue] = useLazyQuery(GET_TOTAL_COUNT, {
    variables: {
      pData: JSON.stringify(dataValue),
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  // unfollow favorite chef
  const [updatefollowunfollowlist, { data }] = useMutation(UPDATE_FOLLOW_UNFOLLOW_LIST, {
    onCompleted: data => {
      toastMessage('success', 'Removed from favourite list');
    },
    onError: err => {
      toastMessage('error', err);
    },
  });

  useEffect(() => {
    // getting customer id
    getCustomerId(customerId)
      .then(res => {
        setCustomerId(res);
        getFavoriteChefListData();
        getTotalCount();
      })
      .catch(err => {});
  }, []);

  const { customerFavorite } = useSubscription(FAVORITE_SUBSCRIPTION, {
    variables: { customerId: customerIdValue },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.customerFollowChef) {
        getFavoriteChefListData();
        getTotalCount();
      }
    },
  });

  useEffect(() => {
    // get favorite list
    if (
      isObjectEmpty(DataValue) &&
      hasProperty(DataValue, 'data') &&
      isObjectEmpty(DataValue.data) &&
      hasProperty(DataValue.data, 'allCustomerFollowChefs') &&
      isObjectEmpty(DataValue.data.allCustomerFollowChefs) &&
      isArrayEmpty(DataValue.data.allCustomerFollowChefs.nodes)
    ) {
      setFavoriteCountData(DataValue.data.allCustomerFollowChefs.nodes.length);
      setfavoriteChefData(DataValue.data.allCustomerFollowChefs.nodes);
      if (props.setCountValue) {
        props.setCountValue(DataValue.data.allCustomerFollowChefs.nodes.length, favoriteCount);
      }
      getTotalCount();
    } else {
      setfavoriteChefData([]);
    }
  }, [DataValue]);

  useEffect(() => {
    if (
      isObjectEmpty(totalCountValue) &&
      hasProperty(totalCountValue, 'data') &&
      isObjectEmpty(totalCountValue.data) &&
      hasProperty(totalCountValue.data, 'totalCountByParams')
    ) {
      setFavoriteCount(totalCountValue.data.totalCountByParams);
    }
  }, [totalCountValue]);

  function unFollowChef(unfollowChefId) {
    //query to unfollow customer
    updatefollowunfollowlist({
      variables: {
        pChefId: unfollowChefId,
        pCustomerId: customerIdValue,
        pType: 'UNFOLLOW',
      },
    });
    // getFavoriteChefListData;
  }
  function onSelectDetail(response) {
    try {
      if (response) {
        let details = {
          chefId: response.chefId,
        };
        NavigateToChefDetail(details);
      }
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }
  function firstParamsValue() {
    setFirstParams(firstParams + 15);
    // fetchData(chefIdValue, firstParams + 10);
  }

  return (
    <React.Fragment>
      <div>
        {/* {favoriteCountData>0 && favoriteCount>0 &&
      <p>Showing {favoriteCountData} of {favoriteCount} results</p>
      } */}
      </div>
      <ReactTooltip />

      <ToastContainer transition={Slide} />

      {favoriteChefData &&
        favoriteChefData.map(favoriteChef => {
          if (isObjectEmpty(favoriteChef)) {
            return (
              <div
                className="col-lg-3 col-sm-6 col-md-4 col-6 products-col-item favoritechef"
                key={favoriteChef.customerFollowChefId}
              >
                <div
                  className="single-product-box"
                  style={{ paddingBottom: '10px' }}
                  id="content-hover"
                >
                  <div className="product-image">
                    <img
                      className="fav-list-image"
                      src={
                        isObjectEmpty(favoriteChef.chefProfileByChefId) &&
                        favoriteChef.chefProfileByChefId.chefPicId
                          ? favoriteChef.chefProfileByChefId.chefPicId
                          : require('../../../images/mock-image/default_chef_profile.png')
                      }
                      onClick={() => onSelectDetail(favoriteChef)}
                      alt="image"
                    />
                    {favoriteChef && isObjectEmpty(favoriteChef.chefProfileByChefId) && (
                      <h2 className="chef-fullname">{favoriteChef.chefProfileByChefId.fullName}</h2>
                    )}

                    {favoriteChef &&
                      isObjectEmpty(favoriteChef.chefProfileByChefId) &&
                      hasProperty(
                        favoriteChef.chefProfileByChefId,
                        'chefProfileExtendedsByChefId'
                      ) &&
                      isObjectEmpty(
                        favoriteChef.chefProfileByChefId.chefProfileExtendedsByChefId
                      ) &&
                      isArrayEmpty(
                        favoriteChef.chefProfileByChefId.chefProfileExtendedsByChefId.nodes
                      ) &&
                      favoriteChef.chefProfileByChefId.chefProfileExtendedsByChefId.nodes.map(
                        chefaddress => {
                          return (
                            <div key={chefaddress.chefProfileExtendedId}>
                              {isObjectEmpty(chefaddress) &&
                              isStringEmpty(chefaddress.chefAddrLine2) ? (
                                <div className="address">{chefaddress.chefAddrLine2}</div>
                              ) : (
                                <div>-----</div>
                              )}

                              {isObjectEmpty(chefaddress) &&
                                isStringEmpty(chefaddress.pricePerHour) &&
                                isStringEmpty(chefaddress.chefPriceUnit) &&
                                chefaddress.pricePerHour !== 0 && (
                                  <p className="chefprice">
                                    {chefaddress.chefPriceUnit.toUpperCase() === 'USD'
                                      ? '$'
                                      : chefaddress.chefPriceUnit}
                                    {chefaddress.pricePerHour} / Hour
                                  </p>
                                )}
                            </div>
                          );
                        }
                      )}
                    <br />
                    {favoriteChef &&
                      isObjectEmpty(favoriteChef.chefProfileByChefId) &&
                      hasProperty(
                        favoriteChef.chefProfileByChefId,
                        'chefProfileExtendedsByChefId'
                      ) &&
                      isObjectEmpty(
                        favoriteChef.chefProfileByChefId.chefProfileExtendedsByChefId
                      ) &&
                      isArrayEmpty(
                        favoriteChef.chefProfileByChefId.chefProfileExtendedsByChefId.nodes
                      ) &&
                      favoriteChef.chefProfileByChefId.chefProfileExtendedsByChefId.nodes.map(
                        chefaddress => {
                          return (
                            <div key={chefaddress.chefProfileExtendedId}>
                              {isObjectEmpty(chefaddress) &&
                              isStringEmpty(chefaddress.chefAvailableAroundRadiusInValue) ? (
                                <div className="address">
                                  Travel around : {chefaddress.chefAvailableAroundRadiusInValue}{' '}
                                  miles
                                </div>
                              ) : (
                                <div>-----</div>
                              )}
                            </div>
                          );
                        }
                      )}
                    <br />
                    {hasProperty(favoriteChef, 'chefProfileByChefId') &&
                    hasProperty(favoriteChef.chefProfileByChefId, 'totalReviewCount') &&
                    isStringEmpty(favoriteChef.chefProfileByChefId.totalReviewCount) &&
                    favoriteChef.chefProfileByChefId.totalReviewCount > 0 ? (
                      <div>{favoriteChef.chefProfileByChefId.totalReviewCount} Reviews</div>
                    ) : (
                      <div>No Reviews</div>
                    )}
                    {/* <br />{' '} */}

                    <br />
                    {/* {!isStringEmpty(chef.pricePerHour) && <p className="emptyprice">-----</p>}
                    {isStringEmpty(chef.pricePerHour) && chef.pricePerHour === 0 && <p>-----</p>} */}
                    <div className="rating" id="ratingContainer">
                      <Rating
                        initialRating={
                          favoriteChef.chefProfileByChefId.averageRating
                            ? favoriteChef.chefProfileByChefId.averageRating
                            : 0
                        }
                        className="ratingView"
                        emptySymbol={
                          <img
                            src={s.EMPTY_STAR}
                            id="emptyStar"
                            className="rating"
                            // style={{ backgroundColor: 'red' }}
                          />
                        }
                        fullSymbol="fa fa-star"
                        fractions={2}
                        readonly={true}
                      />
                      {favoriteChef.chefProfileByChefId.averageRating === null && (
                        <i className="blackStar">(0)</i>
                      )}
                      {favoriteChef.chefProfileByChefId.averageRating !== null && (
                        <i className="blackStar">
                          (
                          {favoriteChef.chefProfileByChefId.averageRating
                            ? favoriteChef.chefProfileByChefId.averageRating.toFixed(1)
                            : 0}
                          )
                        </i>
                      )}
                    </div>
                    {/* {chef.totalReviewCount > 0 ?
                      <div>
                        {chef.totalReviewCount} Reviews
                          </div>
                      : <div>No Reviews</div>
                    } */}
                  </div>
                  <br />{' '}
                  <div className="unfollow-view">
                    <Link href="#">
                      <a
                        className="btn btn-primary"
                        id="unfollow-button"
                        onClick={() => unFollowChef(favoriteChef.chefId)}
                        // style={{ display: 'flex' }}
                      >
                        UNFOLLOW
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            );
          }
        })}
      {favoriteChefData.length === 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          {/* <Loader /> */}
        </div>
      )}
      {favoriteChefData === null && favoriteChefData.length === 0 && <NoData />}
      {favoriteCount > firstParams && (
        <div className="loadmore-button">
          <a
            className="btn btn-primary"
            id="view-details-button"
            onClick={() => firstParamsValue()}
          >
            Load More
          </a>
        </div>
      )}
    </React.Fragment>
  );
};
export default FavoriteChef;