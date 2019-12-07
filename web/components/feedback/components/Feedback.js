import React, { useEffect, useState, useContext } from 'react';
import _ from 'lodash';
import Link from 'next/link';
import Router from 'next/router';
import Rating from 'react-rating';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import * as gqlTag from '../../../common/gql';
import { toastMessage, renderError, success, error } from '../../../utils/Toast';
import { StoreInLocal } from '../../../utils/LocalStorage';
import S from '../Feedback.String';
import { isArrayEmpty, isNumberEmpty, isStringEmpty } from '../../../utils/checkEmptycondition';
import { AppContext } from '../../../context/appContext';
import n from '../../routings/routings';

const mockupData = ['Professional', 'Expertise', 'Quality Service'];

//create feedback details
const createFeedbackData = gqlTag.mutation.review.createGQLTAG;

//for updating feedback details
const CREATE_FEEDBACK_DETAILS = gql`
  ${createFeedbackData}
`;

export default function Feedback(props) {
  //Initial set value
  const [state, setState] = useContext(AppContext);
  const [fullName, setFullName] = useState('');
  const [starRating, setStarRating] = useState(2);
  const [compliment, setCompliment] = useState(mockupData);
  const [complimentText, setComplimentText] = useState('');
  const [review, setReview] = useState('');
  const [historyId, setHistoryId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [chefId, setChefId] = useState('');

  //createFeedbackInfo
  const [createFeedbackInfo, { feedbackData,error }] = useMutation(CREATE_FEEDBACK_DETAILS, {
    onCompleted: feedbackData => {
      toastMessage(success, S.SUCCESS_MSG);
      Router.push(n.HOME);
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });
  if(error){
    toastMessage('error',error)
  }
  useEffect(() => {
    if (props && props.bookinHistoryId) {
      let name = props.bookinHistoryId.name ? props.bookinHistoryId.name : '';
      setFullName(name);
      let historyId = props.bookinHistoryId.historyId ? props.bookinHistoryId.historyId : null;
      setHistoryId(historyId);
      setChefId(props.bookinHistoryId.chefId);
      setCustomerId(props.bookinHistoryId.customerId);
    }
  }, []);
  function complimentClick(data) {
    setCompliment(_.pull(compliment, data));
  }
  function clearAll() {
    setCompliment([]);
  }

  async function OnSubmitClick() {
    if (isArrayEmpty(compliment) && isNumberEmpty(starRating) && isStringEmpty(review)) {
      const variables = {
        reviewPoint: starRating,
        reviewDesc: review,
        reviewComplaintsDesc: JSON.stringify(compliment),
        chefId: chefId,
        customerId: customerId,
        isReviewedByChefYn: state.role && state.role === 'chef' ? true : false,
        isReviewedByCustomerYn: state.role && state.role === 'customer' ? true : false,
        reviewRefTablePkId: historyId,
        reviewRefTableName: 'chef_booking_history',
      };
      console.log('varibale', variables);
      await createFeedbackInfo({
        variables,
      });
    } else {
      toastMessage(error, S.FILL_DATA);
    }
  }

  useEffect(() => {
    const str = complimentText.split(',');
    if (str.length === 2) {
      const temp = compliment;
      temp.push(str[0]);
      setCompliment(temp);
      setComplimentText('');
    }
  }, [complimentText]);

  function onBlurchange() {
    if (complimentText !== '') {
      const temp = compliment;
      temp.push(complimentText);
      setCompliment(temp);
      setComplimentText('');
    }
  }
  function onKeyDownPress(e) {
    if (e.key === 'Enter') {
      onBlurchange();
    }
  }
  return (
    <section className="login-area ptb-60">
      <div className="container">
        <div className="row" id="FormRow">
          <div className="col-sm-6">
            <div className="login-content">
              <div className="section-title">
                <h2>{S.FEEDBACK}</h2>
              </div>

              <div className="section-title">
                <h2>
                  {fullName ? fullName : 'Chef Danial'}
                  {state.role === 'customer' && 's Kitchen'}
                </h2>
              </div>

              <div className="login-form">
                <div>
                  <label className="headerText">{S.GIVE_STAR_RATINGS}</label>
                  <div className="product-review">
                    <div className="rating" id="ratingContainer">
                      <Rating
                        initialRating={starRating}
                        onClick={event => setStarRating(event)}
                        className="ratingView"
                        emptySymbol={<img src={S.EMPTY_STAR} id="emptyStar" className="rating" />}
                        fullSymbol="fa fa-star"
                        fractions={2}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="complimentView">{S.GIVE_COMPLIMENT}</label>
                  <div className="woocommerce-sidebar-area">
                    <div className="collapse-widget filter-list-widget open">
                      <div className="selected-filters-wrap-list block">
                        <ul>
                          {compliment.length > 0 ? (
                            compliment.map((data, key) => {
                              return (
                                <li key={key}>
                                  <Link href="#">
                                    <a onClick={() => complimentClick(data)}>{data}</a>
                                  </Link>
                                </li>
                              );
                            })
                          ) : (
                            <div className="complimentText">{S.NO_COMPLIMENT}</div>
                          )}
                        </ul>
                        <div className="form-group">
                          <input
                            type="text"
                            className={S.FORM_CONTROL}
                            placeholder={S.COMPLIMENT_PLACE_HOLDER}
                            onBlur={() => onBlurchange()}
                            value={complimentText}
                            onKeyDown={event => onKeyDownPress(event)}
                            onChange={event => setComplimentText(event.target.value)}
                          />
                        </div>
                        <div className="delete-selected-filters" id="clearButton">
                          <Link href="#">
                            <a onClick={() => clearAll()}>
                              <i className="far fa-trash-alt"></i> <span>{S.CLEAR_ALL}</span>
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="headerText">{S.GIVE_YOUR_REVIEW_TITLE}</label>
                  <textarea
                    className={S.FORM_CONTROL}
                    rows="5"
                    placeholder={S.REVIEW_PLACE_HOLDER}
                    onChange={event => setReview(event.target.value)}
                    value={review}
                  />
                </div>
                <div>
                  <button type="button" className="btn btn-primary" onClick={() => OnSubmitClick()}>
                    {S.SUBMIT}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
