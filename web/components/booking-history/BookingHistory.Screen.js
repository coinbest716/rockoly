import React, { useState, useEffect, useContext } from 'react';
import gql from 'graphql-tag';
import Select from 'react-select';
import ModernDatepicker from 'react-modern-datepicker';
import moment from 'moment';
import { useQuery, useLazyQuery, useSubscription } from '@apollo/react-hooks';
import _ from 'lodash';
import Router from 'next/router';
import HistoryList from './components/BookingHistoryList';
import S from './BookingHistory.String';
import Page from '../shared/layout/Main';
import {
  getChefId,
  getCustomerId,
  chefId,
  chef,
  customer,
  getUserTypeRole,
  customerId,
} from '../../utils/UserType';
import {
  getDateFormat,
  fromDate,
  futureMonth,
  last2Month,
  getCurrentMonth,
  getDataForGmt,
} from '../../utils/DateTimeFormat';
import {
  isObjectEmpty,
  hasProperty,
  isArrayEmpty,
  isStringEmpty,
} from '../../utils/checkEmptycondition';
import { toastMessage } from '../../utils/Toast';
import * as gqlTag from '../../common/gql';

const getTotalCountTag = gqlTag.query.custom.totalCountGQLTAG;

const GET_TOTAL_COUNT = gql`
  ${getTotalCountTag}
`;

export default function BookingHistory() {
  // set role
  const [userRole, setUserRole] = useState(null);

  // set id
  const [customerIdValue, setCustomerId] = useState(null);
  const [chefIdValue, setChefId] = useState(null);

  // set select
  const [bookingOptionArray, setBookingOptionArray] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);

  // first and offset for pagination
  const [firstParams, setFirstParams] = useState(15);

  // set type
  const [type, setType] = useState(S.ALL);

  // set dates
  const [startDate, setStartDate] = useState(getCurrentMonth(new Date()).fromDate);
  const [endDate, setEndDate] = useState(getCurrentMonth(new Date()).toDate);
  const [bookingFromDate, setBookingFromDate] = useState(getCurrentMonth(new Date()).fromDate);
  const [bookingToDate, setBookingToDate] = useState(getCurrentMonth(new Date()).toDate);
  // option values
  const [optionValue, setOptionValue] = useState();

  const [resultBookingData, setResultBookingData] = useState([]);

  const [bookingCount, setbookingCount] = useState();

  const [countValue, setCountValue] = useState();

  const [pathName,setPathName] = useState('');

  // get gql tag
  let bookingGQLTag = null;
  let bookingGQL = null;
  bookingGQLTag = gqlTag.query.booking.listWithFiltersGQLTAG({
    customerId: customerIdValue,
    pFromTime: bookingFromDate,
    pToTime: bookingToDate,
    statusId: optionValue ? optionValue : [],
    first: firstParams,
  });

  useEffect(() => {
    if (isObjectEmpty(Router) && isObjectEmpty(Router.router) && isStringEmpty(Router.router.route)) {
      setPathName(Router.router.pathname);
    }
  },[Router]);

  if (userRole === chef) {
    bookingGQLTag = gqlTag.query.booking.listWithFiltersGQLTAG({
      chefId: chefIdValue,
      pFromTime: bookingFromDate,
      pToTime: bookingToDate,
      statusId: optionValue ? optionValue : [],
      first: firstParams,
    });
  } else if(pathName=='/booking-history'){
    bookingGQLTag = gqlTag.query.booking.listWithFiltersGQLTAG({
      customerId: customerIdValue,
      pFromTime: bookingFromDate,
      pToTime: bookingToDate,
      statusId: optionValue ? optionValue : [],
      first: firstParams,
    });
  }else if(pathName == "/past-customer-bookings"){
    bookingGQLTag = gqlTag.query.booking.listPastOrFutureBookingsGQLTAG({
      customerId: customerIdValue,
      isPastBookings: true,
      chefBookingDate :  moment(new Date()).utc().format('YYYY-MM-DDTHH:mm:ss'),
      statusId: optionValue ? optionValue : [],
      first: firstParams,
    });
  }else if(pathName == "/future-customer-bookings"){
    bookingGQLTag = gqlTag.query.booking.listPastOrFutureBookingsGQLTAG({
      customerId: customerIdValue,
      isFutureBookings: true,
      chefBookingDate :  moment(new Date()).utc().format('YYYY-MM-DDTHH:mm:ss'),
      statusId: optionValue ? optionValue : [],
      first: firstParams,
    });
  }

  bookingGQL = gql`
    ${bookingGQLTag}
  `;

  const [getBookingData, { data, loading }] = useLazyQuery(bookingGQL, {
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  let getTotalCountData = {
    type: userRole === chef ? 'CHEF_BOOKING' : 'CUSTOMER_BOOKING',
    chefId: chefIdValue ? chefIdValue : undefined,
    customerId: customerIdValue ? customerIdValue : undefined,
    startDate: bookingFromDate,
    endDate: bookingToDate,
    statusId: countValue,
  };

  const [getTotalCount, totalCountValue] = useLazyQuery(GET_TOTAL_COUNT, {
    variables: {
      pData: JSON.stringify(getTotalCountData),
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });
  // select options for chef
  const chefSelectOptions = [
    {
      label: S.ALL,
      value: [
        '"CUSTOMER_REQUESTED"',
        '"CHEF_ACCEPTED"',
        '"CHEF_REJECTED"',
        '"COMPLETED"',
        '"CANCELLED_BY_CHEF"',
        '"CANCELLED_BY_CUSTOMER"',
        '"AMOUNT_TRANSFER_SUCCESS"',
        '"AMOUNT_TRANSFER_FAILED"',
        '"REFUND_AMOUNT_SUCCESS"',
        '"REFUND_AMOUNT_FAILED"',
        '"CHEF_REQUESTED_AMOUNT"',
      ],
      totalCountValue: `{CUSTOMER_REQUESTED,CHEF_ACCEPTED,CHEF_REJECTED,COMPLETED,CANCELLED_BY_CHEF,CANCELLED_BY_CUSTOMER,AMOUNT_TRANSFER_SUCCESS,AMOUNT_TRANSFER_FAILED,REFUND_AMOUNT_SUCCESS,REFUND_AMOUNT_FAILED}`,
    },
    {
      label: S.REQUESTED,
      value: '"CUSTOMER_REQUESTED"',
      totalCountValue: `{CUSTOMER_REQUESTED}`,
    },
    {
      label: S.ACCEPTED,
      value: '"CHEF_ACCEPTED"',
      totalCountValue: `{CHEF_ACCEPTED}`,
    },
    {
      label: S.Completed,
      value: ['"AMOUNT_TRANSFER_SUCCESS"'],
      totalCountValue: `{AMOUNT_TRANSFER_SUCCESS}`,
    },
    {
      label: S.Rejected,
      value: '"CHEF_REJECTED"',
      totalCountValue: `{CHEF_REJECTED}`,
    },
    {
      label: S.CANCELLED,
      value: ['"CANCELLED_BY_CHEF"', '"CANCELLED_BY_CUSTOMER"'],
      totalCountValue: `{CANCELLED_BY_CHEF,CANCELLED_BY_CUSTOMER}`,
    },
    {
      label: S.TRANSFER_FAILED_TAB,
      value: ['"COMPLETED"', '"AMOUNT_TRANSFER_FAILED"'],
      totalCountValue: `{COMPLETED,AMOUNT_TRANSFER_FAILED}`,
    },
    {
      label: S.CHEF_REQUESTED_AMOUNT,
      value: ['"CHEF_REQUESTED_AMOUNT"'],
      totalCountValue: '{CHEF_REQUESTED_AMOUNT}',
    },
  ];

  //select options  for customer
  const customerSelectOptions = [
    {
      label: S.ALL,
      value: [
        '"PAYMENT_PENDING"',
        '"PAYMENT_FAILED"',
        '"CUSTOMER_REQUESTED"',
        '"CHEF_ACCEPTED"',
        '"CHEF_REJECTED"',
        '"CANCELLED_BY_CHEF"',
        '"CANCELLED_BY_CUSTOMER"',
        '"COMPLETED"',
        '"AMOUNT_TRANSFER_FAILED"',
        '"AMOUNT_TRANSFER_SUCCESS"',
        '"REFUND_AMOUNT_SUCCESS"',
        '"REFUND_AMOUNT_FAILED"',
        '"CHEF_REQUESTED_AMOUNT"',
      ],
      totalCountValue: `{PAYMENT_PENDING,PAYMENT_FAILED,CUSTOMER_REQUESTED,CHEF_ACCEPTED,CHEF_REJECTED,CANCELLED_BY_CHEF,CANCELLED_BY_CUSTOMER,COMPLETED,AMOUNT_TRANSFER_FAILED,AMOUNT_TRANSFER_SUCCESS,REFUND_AMOUNT_SUCCESS,REFUND_AMOUNT_FAILED}`,
    },
    {
      label: S.REQUESTED,
      value: '"CUSTOMER_REQUESTED"',
      totalCountValue: `{CUSTOMER_REQUESTED}`,
    },
    {
      label: S.ACCEPTED,
      value: '"CHEF_ACCEPTED"',
      totalCountValue: `{CHEF_ACCEPTED}`,
    },
    {
      label: S.Completed,
      value: ['"COMPLETED"', '"AMOUNT_TRANSFER_FAILED"', '"AMOUNT_TRANSFER_SUCCESS"'],
      totalCountValue: `{COMPLETED,AMOUNT_TRANSFER_FAILED,AMOUNT_TRANSFER_SUCCESS}`,
    },
    {
      label: S.Rejected,
      value: '"CHEF_REJECTED"',
      totalCountValue: `{CHEF_REJECTED}`,
    },
    {
      label: S.CANCELLED,
      value: ['"CANCELLED_BY_CHEF"', '"CANCELLED_BY_CUSTOMER"'],
      totalCountValue: `{CANCELLED_BY_CHEF, CANCELLED_BY_CUSTOMER}`,
    },
    {
      label: S.PAYMENT_OPTION,
      value: ['"PAYMENT_PENDING"'],
      totalCountValue: `{PAYMENT_PENDING}`,
    },
    {
      label: S.PAYMENT_FAILED_OPTION,
      value: ['"PAYMENT_FAILED"'],
      totalCountValue: `{PAYMENT_FAILED}`,
    },
    {
      label: S.REFUND_AMOUNT_SUCCESS_TAB,
      value: ['"REFUND_AMOUNT_SUCCESS"'],
      totalCountValue: `{REFUND_AMOUNT_SUCCESS}`,
    },
    {
      label: S.REFUND_AMOUNT_FAILED_TAB,
      value: ['"REFUND_AMOUNT_FAILED"'],
      totalCountValue: `{REFUND_AMOUNT_FAILED}`,
    },
    {
      label: S.CHEF_REQUESTED_AMOUNT,
      value: ['"CHEF_REQUESTED_AMOUNT"'],
      totalCountValue: '{CHEF_REQUESTED_AMOUNT}',
    },
  ];

  useEffect(() => {
    if (
      isObjectEmpty(data) &&
      hasProperty(data, 'listBookingByDateRange') &&
      isObjectEmpty(data.listBookingByDateRange) &&
      hasProperty(data.listBookingByDateRange, 'nodes') &&
      isArrayEmpty(data.listBookingByDateRange.nodes)
    ) {
      setResultBookingData(data.listBookingByDateRange.nodes);
    } else if(pathName == '/booking-history') {
      setResultBookingData([]);
    }
  }, [data]);

  useEffect(() => {
    if (
      isObjectEmpty(data) &&
      hasProperty(data, 'allChefBookingHistories') &&
      isObjectEmpty(data.allChefBookingHistories) &&
      hasProperty(data.allChefBookingHistories, 'nodes') &&
      isArrayEmpty(data.allChefBookingHistories.nodes)
    ) {
      setResultBookingData(data.allChefBookingHistories.nodes);
    } else if(pathName == '/past-customer-bookings'){
      setResultBookingData([]);
    }else if(pathName == '/future-customer-bookings'){

    }
  }, [data]);

  useEffect(() => {
    if (
      isObjectEmpty(totalCountValue) &&
      hasProperty(totalCountValue, 'data') &&
      isObjectEmpty(totalCountValue.data) &&
      hasProperty(totalCountValue.data, 'totalCountByParams')
    ) {
      setbookingCount(totalCountValue.data.totalCountByParams);
    }
  }, [totalCountValue]);

  // get role
  useEffect(() => {
    getUserTypeRole()
      .then(res => {
        setUserRole(res);
        if (res === customer) {
          setBookingOptionArray(customerSelectOptions);
          setSelectedOption(customerSelectOptions[0]);
          setOptionValue(customerSelectOptions[0].value);
          getCustomerId(customerId)
            .then(customerResult => {
              setCustomerId(customerResult);
              getBookingData();
              getTotalCount();
            })
            .catch(err => {});
        } else {
          setBookingOptionArray(chefSelectOptions);
          setSelectedOption(chefSelectOptions[0]);
          setOptionValue(chefSelectOptions[0].value);
          getChefId(chefId)
            .then(chefResult => {
              setChefId(chefResult);
              getBookingData();
              getTotalCount();
            })
            .catch(err => {});
        }
      })
      .catch(err => {});
  }, []);

  //
  function onSelectChange(value) {
    setSelectedOption(value);
  }

  function onSubmit() {
    setOptionValue(selectedOption.value);
    setBookingFromDate(startDate);
    setBookingToDate(endDate);
    setCountValue(selectedOption.totalCountValue);
    getBookingData();
    getTotalCount();
  }

  function firstParamsValue() {
    setFirstParams(firstParams + firstParams);
    getBookingData();
  }
  function selectStartDate(event) {
    setStartDate(event + ' ' + '00:00:00');
    setEndDate(event + ' ' + '23:59:59');
  }

  function triggerHistorySubscription() {
    getBookingData();
    getTotalCount();
  }
  try {
    return (
      <React.Fragment>
        <Page>
          <div className="bookingHistory">
            <section className="cart-area ptb-60">
              <div className="cart-totals">
                <div className="col-lg-12 col-md-12" id="bookingContainarView">
                  <div className="tab products-details-tab">
                    <div className="row">
                      <div className="bookingHistoryFilterView">
                        <div className="col-md-12" id="bookingHistoryFilter">
                          <div className="collapse-widget tag-list-widgetopen open">
                            <ul className="tags-list-row block">
                              <Select
                                isSearchable={true}
                                value={selectedOption}
                                onChange={value => onSelectChange(value)}
                                options={bookingOptionArray}
                                placeholder="Select Booking history type"
                              />
                            </ul>
                          </div>
                        </div>

                        <div className="start-date-calendar">
                          <ModernDatepicker
                            className="calanderStyle"
                            date={startDate}
                            format={'MM-DD-YYYY'}
                            showBorder
                            required
                            onChange={event => {
                              selectStartDate(event);
                            }}
                            placeholder={S.ADD_FROM_DATE}
                            color={'#d9b44a'}
                          />
                        </div>
                        <div className="end-date-calendar">
                          <ModernDatepicker
                            className="calanderStyle"
                            date={endDate}
                            format={'MM-DD-YYYY'}
                            showBorder
                            required
                            minDate={startDate}
                            onChange={event => setEndDate(event + ' ' + '23:59:59')}
                            placeholder={S.ADD_TO_DATE}
                            color={'#d9b44a'}
                          />
                        </div>
                        <div className="submit-button-view">
                          <button
                            type="button"
                            id="submitButton"
                            class="btn btn-primary btn-sm"
                            onClick={() => onSubmit()}
                          >
                            {S.SUBMIT}
                          </button>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="tab_content">
                          <div className="tabs_item">
                            <div className="products-details-tab-content">
                              <HistoryList
                                bookingType={type}
                                bookingDetails={resultBookingData}
                                userRole={userRole}
                                bookingCount={bookingCount}
                                firstParams={firstParams}
                                firstParamsValue={firstParamsValue}
                                triggerHistorySubscription={triggerHistorySubscription}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
        </Page>
      </React.Fragment>
    );
  } catch (error) {
    toastMessage('renderError', error.message);
  }
}
