import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import gql from 'graphql-tag';
import Rating from 'react-rating';
import ReactTooltip from 'react-tooltip';
import { useQuery, useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import s from '../ChefList.String';
import * as gqlTag from '../../../common/gql';
import Loader from '../../Common/loader';
import Pagination from '../../shared/pagination/Pagination';
import { ToastContainer, Slide, toast } from 'react-toastify';
import { NavigateToChefDetail } from './Navigation';
import { AppContext } from '../../../context/appContext';
import { toastMessage } from '../../../utils/Toast';
import {
  isObjectEmpty,
  hasProperty,
  isArrayEmpty,
  isStringEmpty,
  isNumberEmpty,
} from '../../../utils/checkEmptycondition';
import { getUserTypeRole, getCustomerId, customerId, customer } from '../../../utils/UserType';
import BookingForm from '../../shared/modal/BookingForm';
import NoData from '../../shared/noData/noData';
export const ChefList = props => {
  const updatefavorite = gqlTag.mutation.follow.chefFollowOrUnFollowGQLTAG; // query to make favorite chef

  const UPDATE_FOLLOW_UNFOLLOW_LIST = gql`
    ${updatefavorite}
  `;

  const getTotalCountTag = gqlTag.query.custom.totalCountGQLTAG;

  const GET_TOTAL_COUNT = gql`
    ${getTotalCountTag}
  `;

  const [state, setState] = useContext(AppContext);
  const [chefdetails, setchefdetails] = useState(null);
  const [chefListTotalCount, setChefListTotalCount] = useState(0);
  const [filterOption, setFilterOption] = useState([]);
  const [firstParams, setFirstParams] = useState(state.firstparams);
  const [userRole, setUserRole] = useState([]);
  const [customerIdValue, setCustomerId] = useState(null);
  const [open, setOpen] = useState(false);
  const [chefData, setchefData] = useState({});
  const [loading, setLoading] = useState(true);
  // let showLoaderYn = true;
  // make chef favorite

  const [updatefollowlist, { data }] = useMutation(UPDATE_FOLLOW_UNFOLLOW_LIST, {
    onCompleted: data => {
      // setLoading(false);
      toastMessage('success', 'Added to Favorite List');
    },
    onError: err => {
      toastMessage('error', err);
    },
  });
  const [updateunfollowlist, { dataValue }] = useMutation(UPDATE_FOLLOW_UNFOLLOW_LIST, {
    onCompleted: dataValue => {
      // setLoading(false);
      toastMessage('success', 'Removed from Favorite List');
    },
    onError: err => {
      toastMessage('error', err);
    },
  });
  // get customer id
  useEffect(() => {
    setLoading(true);
    getCustomerId(customerId)
      .then(res => {
        setCustomerId(res);
        chefList();
      })
      .catch(err => {});
  }, []);

  // getting chef list data
  let filterdata = {
    data: props.filterOption,
    first: props.firstParams,
    offset: 0,
    roleType: state.customerId ? 'CUSTOMER' : '',
    roleId: state.customerId ? state.customerId : {},
  };

  const chefListData = gqlTag.query.chef.filterByParamsGQLTAG(filterdata);
  const CHEF_PROFILE_DETAILS = gql`
    ${chefListData}
  `;

  // console.log("chefListData",chefListData);
  const [gqlValueChefData, chefList] = useLazyQuery(CHEF_PROFILE_DETAILS, {
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  let parsedData = JSON.parse(props.filterOption);
  // console.log("getTotalCountTag",props.filterOption)

  const [getTotalCount, totalCountValue] = useLazyQuery(GET_TOTAL_COUNT, {
    variables: {
      pData: parsedData,
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const favoriteSubscription = gqlTag.subscription.customer.followChefGQLTAG;
  const FAVORITE_SUBSCRIPTION = gql`
    ${favoriteSubscription}
  `;
  const chefListSubscription = gqlTag.subscription.chef.allChefsGQLTAG;
  const CHEF_SUBSCRIPTION = gql`
    ${chefListSubscription}
  `;
  useEffect(() => {
    //get user role
    getUserTypeRole()
      .then(async res => {
        setUserRole(res);
        if (res === customer) {
          getCustomerId(customerId)
            .then(async res => {
              await setCustomerId(res);
              // gqlValueChefData();
            })
            .catch(err => {});
        }
        if (!res) {
          gqlValueChefData();
          getTotalCount();
        }
      })
      .catch(err => {});
  }, []);

  useEffect(() => {
    if (customerIdValue) {
      gqlValueChefData();
      getTotalCount();
    }
  }, customerIdValue);

  // get all chef details
  useEffect(() => {
    if (
      isObjectEmpty(chefList) &&
      hasProperty(chefList, 'data') &&
      isObjectEmpty(chefList.data) &&
      hasProperty(chefList.data, 'filterChefByParams') &&
      isObjectEmpty(chefList.data.filterChefByParams) &&
      isArrayEmpty(chefList.data.filterChefByParams.nodes) &&
      chefList.data.filterChefByParams.nodes.length > 0
    ) {
      setLoading(false);

      setchefdetails(chefList.data.filterChefByParams.nodes);
      setChefListTotalCount(
        chefList.data.filterChefByParams ? chefList.data.filterChefByParams.totalCount : 0
      );
      props.getChefListTotalCount(chefList.data.filterChefByParams.totalCount);
    } else {
      setchefdetails([]);
      setLoading(false);
      props.getChefListTotalCount(0);
    }
  }, [chefList]);

  useEffect(() => {
    if (
      isObjectEmpty(totalCountValue) &&
      hasProperty(totalCountValue, 'data') &&
      isObjectEmpty(totalCountValue.data) &&
      hasProperty(totalCountValue.data, 'totalCountByParams')
    ) {
    }
  }, [chefList]);

  const { customerFavorite } = useSubscription(FAVORITE_SUBSCRIPTION, {
    variables: { customerId: customerIdValue },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.customerFollowChef) {
        gqlValueChefData();
      }
    },
  });

  const { chefListDataSubs } = useSubscription(CHEF_SUBSCRIPTION, {
    onSubscriptionData: res => {
      if (res.subscriptionData.data.chefProfile) {
        gqlValueChefData();
      }
    },
  });

  // get total chef count

  function filterValues() {
    if (props.filter) {
      setFilterOption(props.filter);
    }
  }
  function makeChefFavorite(followChefId) {
    // setLoading(true);

    updatefollowlist({
      variables: {
        pChefId: followChefId,
        pCustomerId: customerIdValue,
        pType: 'FOLLOW',
      },
    });
  }
  function makeChefUnFavorite(unFollowChefId) {
    // setLoading(true);
    updateunfollowlist({
      variables: {
        pChefId: unFollowChefId,
        pCustomerId: customerIdValue,
        pType: 'UNFOLLOW',
      },
    });
  }
  function openModal() {
    setOpen(false);
  }
  // to click book now button
  function onClickBook(chef) {
    setchefData(chef);
    setOpen(true);
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

  return (
    <React.Fragment>
      <ReactTooltip />
      <ToastContainer transition={Slide} />
      {open === true && <BookingForm openModal={openModal} open={open} chefData={chefData} />}
      {() => filterValues()}
      {loading && <Loader />}
      {/* <div>showLoaderYn{showLoaderYn}</div>
      {console.log("showLoaderYn",showLoaderYn)} */}
      {chefdetails &&
        chefdetails.map(chef => {
          if (isObjectEmpty(chef) && isStringEmpty(chef.fullName)) {
            return (
              <div
                className="col-lg-3 col-sm-6 col-xs-12 col-md-4  products-col-item"
                key={chef.chefId}
              >
                <div className="single-product-box" id="content-hover">
                  <div className="product-image">
                    <img
                      src={
                        chef.chefPicId
                          ? chef.chefPicId
                          : require('../../../images/mock-image/default_chef_profile.png')
                      }
                      alt="image"
                      onClick={() => onSelectDetail(chef)}
                      className="cheflist-images"
                    />
                    {userRole && !chef.isCustomerFollowingYn && userRole === customer && (
                      <ul>
                        <li>
                          <a data-place="left" className="fov-icon-outline">
                            <i
                              className="far fa-heart"
                              id="heart-icon"
                              onClick={() => makeChefFavorite(chef.chefId)}
                            ></i>
                          </a>
                        </li>
                      </ul>
                    )}

                    {userRole && chef.isCustomerFollowingYn && userRole === customer && (
                      <ul>
                        <li>
                          <a data-place="left" className="fov-icon-outline">
                            <i
                              className="fa fa-heart favoriteHeart"
                              onClick={() => makeChefUnFavorite(chef.chefId)}
                            ></i>
                          </a>
                        </li>
                      </ul>
                    )}
                  </div>
                  {
                    <div className="product-content" onClick={() => onSelectDetail(chef)}>
                      <h2 className="chef-fullname">{chef.fullName}</h2>
                      {chef &&
                        hasProperty(chef, 'chefProfileExtendedsByChefId') &&
                        hasProperty(chef.chefProfileExtendedsByChefId, 'nodes') &&
                        isArrayEmpty(chef.chefProfileExtendedsByChefId.nodes) &&
                        // chef.totalReviewCount > 0 &&
                        chef.chefProfileExtendedsByChefId.nodes.map(node => {
                          return (
                            <div>
                              {isObjectEmpty(node) && isStringEmpty(node.chefCity) ? (
                                <p className="address">{node.chefCity}</p>
                              ) : (
                                <p>-----</p>
                              )}
                              {isObjectEmpty(node) &&
                                isStringEmpty(chef.pricePerHour) &&
                                isStringEmpty(node.chefPriceUnit) &&
                                chef.pricePerHour !== 0 && (
                                  <p className="chefprice">
                                    {node.chefPriceUnit.toUpperCase() === 'USD'
                                      ? '$'
                                      : node.chefPriceUnit}
                                    {chef.pricePerHour}
                                  </p>
                                )}
                            </div>
                          );
                        })}
                      {/* <br /> */}
                      {chef &&
                        hasProperty(chef, 'chefProfileExtendedsByChefId') &&
                        hasProperty(chef.chefProfileExtendedsByChefId, 'nodes') &&
                        isArrayEmpty(chef.chefProfileExtendedsByChefId.nodes) &&
                        // chef.totalReviewCount > 0 &&
                        chef.chefProfileExtendedsByChefId.nodes.map(node => {
                          return (
                            <div>
                              {isObjectEmpty(node) &&
                              isStringEmpty(node.chefAvailableAroundRadiusInValue) ? (
                                <p className="address">
                                  {' '}
                                  Travel around: {node.chefAvailableAroundRadiusInValue} miles
                                </p>
                              ) : (
                                <p>-----</p>
                              )}
                            </div>
                          );
                        })}
                      {/* <br /> */}
                      {chef.totalReviewCount > 0 ? (
                        <p>{chef.totalReviewCount} Reviews</p>
                      ) : (
                        <p>New Chef</p>
                      )}
                      {/* <br /> */}
                      {!isStringEmpty(chef.pricePerHour) && chef.totalReviewCount > 0 && (
                        <p className="emptyprice">-----</p>
                      )}
                      {/* {isStringEmpty(chef.pricePerHour) && chef.pricePerHour === 0 && <p>-----</p>}
                      {isNumberEmpty(chef.pricePerHour) && chef.pricePerHour !== 0 ? (
                                <p>$ {chef.pricePerHour}</p>
                              ) : (
                                <p>-----</p>
                              )} */}
                      {chef.totalReviewCount > 0 && (
                        <div className="rating" id="ratingContainer">
                          <Rating
                            initialRating={chef.averageRating}
                            className="ratingView"
                            emptySymbol={
                              <img src={s.EMPTY_STAR} id="emptyStar" className="rating" />
                            }
                            fullSymbol="fa fa-star"
                            fractions={2}
                            readonly={true}
                          />
                          {chef.averageRating === null && <i className="blackStar">(0)</i>}
                          {chef.averageRating !== null && (
                            <i className="blackStar">({chef.averageRating.toFixed(1)})</i>
                          )}
                        </div>
                      )}
                      <br />{' '}
                    </div>
                  }
                </div>
              </div>
            );
          }
        })}
      {chefdetails && chefdetails.length === 0 && loading === false && <NoData />}
      {chefdetails === null && (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Loader />
        </div>
      )}
    </React.Fragment>
  );
};
export default ChefList;
