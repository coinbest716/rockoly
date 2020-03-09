import React, { Component } from 'react';
import Rating from 'react-rating';
import moment from 'moment';
import { listOptions } from '../const/ReviewsData';
import s from '../../ChefDetail.Strings';
import * as util from '../../../../utils/checkEmptycondition';
import { toastMessage } from '../../../../utils/Toast';
import {
  getDateFormat,
  getTimeOnly,
  getDateWithTime,
  getLocalTime,
  NotificationconvertDateandTime,
} from '../../../../utils/DateTimeFormat';
const useTagFunc = () => {
  let useTag = '<use xlink:href="#star" />';
  return <svg className="star" dangerouslySetInnerHTML={{ __html: useTag }} />;
};

const Reviews = props => {
  function formatCreatedDate(date) {
    return NotificationconvertDateandTime(date) + ' ' + getTimeOnly(getLocalTime(date));
  }

  try {
    return (
      <div className="products-details-tab-content chefDetail">
        <div className="product-review-form">
          {props.chefDetails &&
            util.isStringEmpty(props.chefDetails.chefId) &&
            util.hasProperty(props.chefDetails, 'reviewHistoriesByChefId') &&
            util.isObjectEmpty(props.chefDetails.reviewHistoriesByChefId) &&
            util.hasProperty(props.chefDetails.reviewHistoriesByChefId, 'nodes') &&
            util.isArrayEmpty(props.chefDetails.reviewHistoriesByChefId.nodes) &&
            props.chefDetails.reviewHistoriesByChefId.nodes.map(node => {
              if (node.isReviewedByCustomerYn) {
                var convertDate = node.createdAt;
                return (
                  <div className="review-comments" key={node.reviewHistId}>
                    {/* <div className="review-item"></div> */}

                    <div className="rating" id="ratingContainerView">
                      {util.hasProperty(node, 'customerProfileByCustomerId') && (
                        <img
                          className="customerpic"
                          src={
                            node.customerProfileByCustomerId.customerPicId
                              ? node.customerProfileByCustomerId.customerPicId
                              : require('../../../../images/mock-image/rockoly-logo.png')
                          }
                          style={{ width: '53px !important' }}
                        />
                      )}
                      <div className="review-page">
                        <div style={{ marginLeft: '10px', color: '#000' }}>
                          {node.customerProfileByCustomerId.fullName}
                        </div>
                        <div className="ratingsNameView" style={{ marginLeft: '4px' }}>
                          <span>
                            <Rating
                              initialRating={node.reviewPoint}
                              className="ratingView review-rating"
                              id="description-rating-view"
                              emptySymbol={
                                <img src={s.EMPTY_STAR} id="emptyStar" className="rating " />
                              }
                              fullSymbol="fa fa-star"
                              fractions={2}
                              readonly={true}
                            />{' '}
                            {node.reviewPoint ? node.reviewPoint : ''}
                          </span>
                        </div>
                        <div className="description" style={{ marginLeft: 9 }}>
                          <span>
                            <strong> {formatCreatedDate(convertDate)}</strong>
                          </span>
                          <p className="">{node.reviewDesc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          {props.chefDetails &&
            util.isStringEmpty(props.chefDetails.chefId) &&
            util.hasProperty(props.chefDetails, 'reviewHistoriesByChefId') &&
            util.isObjectEmpty(props.chefDetails.reviewHistoriesByChefId) &&
            util.hasProperty(props.chefDetails.reviewHistoriesByChefId, 'nodes') &&
            !util.isObjectEmpty(props.chefDetails.reviewHistoriesByChefId.nodes) && (
              <div>
                <h5 style={{ textAlign: 'center', color: '#08AB93', fontweight: 'bolder' }}>
                  No reviews yet!
                </h5>
                <p></p>
                <p></p>
                <p></p>
              </div>
            )}
          {/* <div className="card">
            <div className="card-body">
              <div className="review-form">
                <h3>Write a Review</h3>

                <form>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      className="form-control"
                    />
                  </div>

                  <div className="review-rating">
                    <p>Rate this item</p>

                    <div className="star-source">
                      <svg>
                        <linearGradient
                          x1="50%"
                          y1="5.41294643%"
                          x2="87.5527344%"
                          y2="65.4921875%"
                          id="grad"
                        >
                          <stop stopColor="#f2b01e" offset="0%"></stop>
                          <stop stopColor="#f2b01e" offset="60%"></stop>
                          <stop stopColor="#f2b01e" offset="100%"></stop>
                        </linearGradient>
                        <symbol id="star" viewBox="153 89 106 108">
                          <polygon
                            id="star-shape"
                            stroke="url(#grad)"
                            strokeWidth="5"
                            fill="currentColor"
                            points="206 162.5 176.610737 185.45085 189.356511 150.407797 158.447174 129.54915 195.713758 130.842203 206 95 216.286242 130.842203 253.552826 129.54915 222.643489 150.407797 235.389263 185.45085"
                          ></polygon>
                        </symbol>
                      </svg>
                    </div>

                    <div className="star-rating">
                      <input type="radio" name="star" id="five" />
                      <label htmlFor="five">{useTagFunc()}</label>

                      <input type="radio" name="star" id="four" />
                      <label htmlFor="four">{useTagFunc()}</label>

                      <input type="radio" name="star" id="three" />
                      <label htmlFor="three">{useTagFunc()}</label>

                      <input type="radio" name="star" id="two" />
                      <label htmlFor="two">{useTagFunc()}</label>

                      <input type="radio" name="star" id="one" />
                      <label htmlFor="one">{useTagFunc()}</label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Review Title</label>
                    <input
                      type="text"
                      id="review-title"
                      name="review-title"
                      placeholder="Enter your review a title"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Body of Review (1500)</label>
                    <textarea
                      name="review-body"
                      id="review-body"
                      cols="30"
                      rows="10"
                      placeholder="Write your comments here"
                      className="form-control"
                    />
                  </div>
                  <button type="submit" className="btn btn-light">
                    Submit Review
                  </button>
                </form>
              </div>
            </div> */}
          {/* </div> */}
        </div>
      </div>
    );
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
};
export default Reviews;
