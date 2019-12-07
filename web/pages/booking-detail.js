import React, { Component } from 'react';
import { useRouter } from 'next/router';
import BookingDetails from '../components/booking-detail/BookingDetail.Screen';
import { withApollo } from '../apollo/apollo';

const BookingDetail = () => {
  const router = useRouter();
  let details = router.query ? router.query : '';
  return (
    <div>
      <BookingDetails BookingDetails={details} />
    </div>
  );
};

export default withApollo(BookingDetail);
