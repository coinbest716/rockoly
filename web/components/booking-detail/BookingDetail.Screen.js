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

export default function BookingDetails(props) {
  const [bookingDetails, setBookingDetails] = useState(null);

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
  }, [props]);

  useEffect(() => {
    setBookingDetails(data);
  }, [data]);

  try {
    return (
      <React.Fragment>
        <Page>
          <div className="bookingDetail">
            <section className="products-details-area pt-60">
              <div className="container">
                <BookingDetail
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
        </Page>
      </React.Fragment>
    );
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
}
