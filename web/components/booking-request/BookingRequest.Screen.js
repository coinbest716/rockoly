import React, { useEffect, useState, useContext } from 'react';
import gql from 'graphql-tag';
import moment from 'moment';
import { useQuery, useLazyQuery, useSubscription } from '@apollo/react-hooks';
import * as gqlTag from '../../common/gql';
import BookingCalendar from './components/BookingCalendar';
import BookingList from './components/BookingList';
import Page from '../shared/layout/Main';
import { toastMessage } from '../../utils/Toast';
import { AppContext } from '../../context/appContext';
import {
  isObjectEmpty,
  hasProperty,
  isArrayEmpty,
  isStringEmpty,
} from '../../utils/checkEmptycondition';
import {
  getChefId,
  getCustomerId,
  chefId,
  customer,
  getUserTypeRole,
  chef,
} from '../../utils/UserType';
import S from './BookingRequest.String';
import { fromDateReversed, NotificationconvertDateandTime, fromDate } from '../../utils/DateTimeFormat';
import { futureMonth } from '../../utils/DateTimeFormat';
import { StoreInLocal, GetValueFromLocal } from '../../utils/LocalStorage';

const requestSubscription = gqlTag.subscription.booking.byChefIdGQLTAG;
const REQUEST_SUBSCRIPTION = gql`
  ${requestSubscription}
`;
const BookingRequestScreen = () => {
  const [state, setState] = useContext(AppContext);
  const [bookingDetails, setBookingDetails] = useState({});
  const [allBookingDetails, setallBookingDetails] = useState({});
  const [SelectedDateValue, setSelectedDateValue] = useState('');
  const [RequestAvailableDate, setRequestAvailableDate] = useState();
  const [bookingCount, setBookingCount] = useState(0);
  const [chefIdValue, setChefId] = useState(null);
  const [dateValue, setDateValue] = useState();

  let details = [],
    availableDates = [];

  let uniqueArray = [];

  const gqlValue = gqlTag.query.booking.listWithFiltersGQLTAG({
    pFromTime: fromDate(),
    pToTime: futureMonth(),
    chefId: chefIdValue,
    first: 200,
  });

  const GET_CHEF_BOOKING_REQUEST = gql`
    ${gqlValue}
  `;

  const [getBookingData, { data }] = useLazyQuery(GET_CHEF_BOOKING_REQUEST, {
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });
  // console.log("Dates",Dates)
  const { subscriptionData } = useSubscription(REQUEST_SUBSCRIPTION, {
    variables: { chefId: chefIdValue },
    onSubscriptionData: res => {
      if (res) {
        getBookingData();
        // triggerHistorySubscription();
      }
    },
  });

  useEffect(() => {
    if (
      isObjectEmpty(data) &&
      hasProperty(data, 'listBookingByDateRange') &&
      isObjectEmpty(data.listBookingByDateRange) &&
      isArrayEmpty(data.listBookingByDateRange.nodes)
    ) {
      let bookingData = data.listBookingByDateRange.nodes;
      let bookingValue = [];
      bookingData.map(res => {
        if (
          res.chefBookingStatusId.trim() !== S.PAYMENT_PENDING &&
          res.chefBookingStatusId.trim() !== S.PAYMENT_FAILED
        ) {
          bookingValue.push(res);
        }
      });
      setallBookingDetails(bookingValue);
    } else {
      setallBookingDetails([]);
    }
  }, [data]);

  useEffect(() => {
    //get user role
    getUserTypeRole()
      .then(async res => {
        if (res === chef) {
          getChefId(chefId)
            .then(async chefResult => {
              await setChefId(chefResult);
            })
            .catch(err => { });
        }
      })
      .catch(err => { });
  }, []);

  useEffect(() => {
    if (chefIdValue) {
      getBookingData();
      if (localStorage.getItem('value') !== null) {
      localStorage.removeItem('value');
      }
    }
  }, chefIdValue);

  useEffect(() => {
    let details = [];
    if (allBookingDetails.length >= 1) {
      allBookingDetails.map(bookingDetail => {
        if (moment(bookingDetail.chefBookingFromTime).format('YYYY-MM-DD') === fromDateReversed() &&
          (bookingDetail.chefBookingStatusId.trim() === "CUSTOMER_REQUESTED" ||
            bookingDetail.chefBookingStatusId.trim() === "CHEF_ACCEPTED")) {
          details.push(bookingDetail);
        }
      });
      setBookingCount(details.length);
      setBookingDetails(details);
    }

  }, [data,allBookingDetails]);

  useEffect(() => {
    if (localStorage.getItem('value') !== null) {
      GetValueFromLocal('value')
        .then(result => {
          if (result) {
            let details = [];
            if (allBookingDetails.length >= 1) {
              allBookingDetails.map(bookingDetail => {
                if (moment(bookingDetail.chefBookingFromTime).format('YYYY-MM-DD') === result
                  && (bookingDetail.chefBookingStatusId.trim() === "CUSTOMER_REQUESTED" ||
                    bookingDetail.chefBookingStatusId.trim() === "CHEF_ACCEPTED")) {
                  details.push(bookingDetail);
                }
              });
              setBookingCount(details.length);
              setBookingDetails(details);
            }
            // console.log("details",details)
          }
        })
        .catch(err => {
          // console.log('err', err)
        });
    }
  },[data,allBookingDetails]);

  function onChangeCalendar(value, UnformatedValue) {

    setBookingDetails();
    let details = [];
    StoreInLocal('value', value);
    setDateValue(value)
    let SelectedDate = moment(UnformatedValue.start).format('DD-MM-YYYY');
    setSelectedDateValue(SelectedDate);

    if (allBookingDetails.length >= 1) {
      allBookingDetails.map(bookingDetail => {
        if (moment(bookingDetail.chefBookingFromTime).format('YYYY-MM-DD') === value &&
          (bookingDetail.chefBookingStatusId.trim() === "CUSTOMER_REQUESTED" ||
            bookingDetail.chefBookingStatusId.trim() === "CHEF_ACCEPTED")) {
          details.push(bookingDetail);
        }
      });
      setBookingCount(details.length);
      setBookingDetails(details);
    }

  }
  function RequestAvailableDateValue() {
    if (allBookingDetails.length >= 1) {
      allBookingDetails.map(dateValue => {
        if (dateValue.chefBookingStatusId.trim() === "CUSTOMER_REQUESTED" ||
          dateValue.chefBookingStatusId.trim() === "CHEF_ACCEPTED") {
          var startTime = NotificationconvertDateandTime(dateValue.chefBookingFromTime);
          let fromTime = startTime.split(',');

          if (uniqueArray.indexOf(fromTime[0]) === -1) {
            uniqueArray.push(fromTime[0]);
            availableDates.push(dateValue.chefBookingFromTime);
          }
        }
      });
      return availableDates;
    }
  }

  function triggerHistorySubscription() {

    // getBookingData();
    // // setSelectedDateValue();

    // if (allBookingDetails.length >= 1) {
    //   allBookingDetails.map(bookingDetail => {
    //     if (moment(bookingDetail.chefBookingFromTime).format('YYYY-MM-DD') === dateValue) {

    //       details.push(bookingDetail);
    //     }
    //   });

    //   setBookingCount(details.length);
    //   setBookingDetails(details);
    // }
  }

  try {
    return (
      <React.Fragment>
        <Page>
          <div className="bookingRequest">
            <section className="cart-area ptb-60">
              <div className="cart-totals">
                <div className="card">
                  <div className="cardContainer cardHeight" id="overall-cardview">
                    <div className="row" style={{ width: '100%' }}>
                      <div className="col-sm-6">
                        <BookingCalendar
                          className="bookingCalender"
                          onChangeCalendar={onChangeCalendar}
                          RequestAvailableDate={RequestAvailableDateValue()}
                        />
                      </div>
                      <div className="col-sm-6 listScroll">
                        <BookingList
                          requestDetails={bookingDetails}
                          SelectedDateValue={SelectedDateValue}
                          bookingCount={bookingCount}
                          triggerHistorySubscription={triggerHistorySubscription}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </Page>
      </React.Fragment>
    );
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
};
export default BookingRequestScreen;
