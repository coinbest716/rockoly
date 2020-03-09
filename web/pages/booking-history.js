import React, { useEffect } from 'react';
import BookingHistory from '../components/booking-history/BookingHistory.Screen';
import { withApollo } from '../apollo/apollo';

const Index = () => {

  return <BookingHistory />;
};
export default withApollo(Index);
