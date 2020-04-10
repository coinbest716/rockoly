import React, { Component } from 'react';
import { useRouter } from 'next/router';
import BookingDetails from '../components/booking-detail/BookingDetail.Screen';
import { withApollo } from '../apollo/apollo';
import { StoreInLocal, GetValueFromLocal } from '../utils/LocalStorage';

const BookingDetail = () => {
  const router = useRouter();
  let details = router.query ? router.query : '';
  let bookingId = details.chefBookingHistId ? details.chefBookingHistId : details.chef_booking_hist_id;
  console.log("bookingId",details)
  StoreInLocal('bookingId', bookingId);

  if(details.toRole && details.toRole == 'CHEF'){
    // localStorage.setItem('logRole','chef')
    StoreInLocal('logRole', 'CHEFLOGGED');
  }else if(details.toRole ){
    StoreInLocal('logRole', 'CUSTOMERLOGGED');
  }
  return (
    <div>
      <BookingDetails BookingDetails={details} />
    </div>
  );
};

export default withApollo(BookingDetail);
