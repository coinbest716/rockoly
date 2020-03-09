import React, { useState, useEffect } from 'react';
import { useSubscription, useLazyQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Page from '../shared/layout/Main';
import BookingDetail from './components/BookingDetail';
import { toastMessage } from '../../utils/Toast';
import * as gqlTag from '../../common/gql';
import * as utils from '../../utils/checkEmptycondition';

//booking data
const bookingValue = gqlTag.query.booking.byIdGQLTAG;

//booking detail subscription
const bookingSubsGQLTag = gqlTag.subscription.booking.chefBookingHistoryGQLTAG;

const BOOKING_DATA = gql`
  ${bookingValue}
`;

const BOOKING_SUBS_GQL = gql`
  ${bookingSubsGQLTag}
`;

const bookingRequestSubs = gqlTag.query.booking.requestedBookingByIdGQLTAG;

const BOOKING_REQUEST_GQL = gql`
  ${bookingRequestSubs}
`;

export default function BookingDetails(props) {
  const [isUIRendered, setIsUIRendered] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [requestedData, setRequestedData] = useState([]);

  const [getBookingData, { data }] = useLazyQuery(BOOKING_DATA, {
    variables: {
      chefBookingHistId: props.BookingDetails.chefBookingHistId
        ? props.BookingDetails.chefBookingHistId
        : props.BookingDetails.chef_booking_hist_id,
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [getBookingRequestData, Requestdata] = useLazyQuery(BOOKING_REQUEST_GQL, {
    variables: {
      bookingHistId: props.BookingDetails.chefBookingHistId
        ? props.BookingDetails.chefBookingHistId
        : props.BookingDetails.chef_booking_hist_id,
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const { bookingSubsData } = useSubscription(BOOKING_SUBS_GQL, {
    variables: {
      chefBookingHistId: props.BookingDetails.chefBookingHistId
        ? props.BookingDetails.chefBookingHistId
        : props.BookingDetails.chef_booking_hist_id,
    },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.chefBookingHistory) {
        getBookingData();
      }
    },
  });
  useEffect(() => {
    getBookingData();
    // console.log('props', props);
  }, [props]);

  useEffect(() => {
    if (data) {
      setBookingDetails(data);
    }
  }, [data]);

  useEffect(() => {
    getBookingRequestData();
    // console.log('bookingDetails', bookingDetails);
    if (
      utils.isObjectEmpty(bookingDetails) &&
      utils.hasProperty(bookingDetails, 'chefBookingHistoryByChefBookingHistId') &&
      utils.isObjectEmpty(bookingDetails.chefBookingHistoryByChefBookingHistId) &&
      utils.hasProperty(bookingDetails.chefBookingHistoryByChefBookingHistId, 'chefBookingStatusId')
    ) {
      let status = bookingDetails.chefBookingHistoryByChefBookingHistId.chefBookingStatusId.trim();
      if (status) {
      }
    }
    setIsUIRendered(true);
  }, [bookingDetails]);

  useEffect(() => {
    if (
      utils.isObjectEmpty(Requestdata) &&
      utils.hasProperty(Requestdata, 'data') &&
      utils.isObjectEmpty(Requestdata.data) &&
      utils.hasProperty(Requestdata.data, 'allChefBookingRequestHistories') &&
      utils.isObjectEmpty(Requestdata.data.allChefBookingRequestHistories) &&
      utils.hasProperty(Requestdata.data.allChefBookingRequestHistories, 'nodes') &&
      utils.isArrayEmpty(Requestdata.data.allChefBookingRequestHistories.nodes)
    ) {
      setRequestedData(Requestdata.data.allChefBookingRequestHistories.nodes[0]);
    }
  }, [Requestdata]);
  try {
    return (
      <React.Fragment>
        <Page>
          {isUIRendered === true && (
            <div className="bookingDetail">
              <section
                className="products-details-area ptb-30"
                style={{ paddingTop: '30px', paddingBottom: '30px' }}
              >
                <div
                  className="container"
                  id="booking-detail-card"
                  style={{ paddingBottom: '30px' }}
                >
                  <BookingDetail
                    requestedData={requestedData ? requestedData : []}
                    BookingDetails={utils.isObjectEmpty(bookingDetails) ? bookingDetails : {}}
                    BookingHistory={
                      props.BookingDetails.chefBookingHistId
                        ? props.BookingDetails.chefBookingHistId
                        : props.BookingDetails.chef_booking_hist_id
                    }
                    bookingType={
                      props.BookingDetails.bookingType ? props.BookingDetails.bookingType : 'All'
                    }
                  />
                </div>
              </section>
            </div>
          )}
        </Page>
      </React.Fragment>
    );
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
}
