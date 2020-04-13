import React from 'react';
import BookingHistory from '../components/booking-history/BookingHistory.Screen';
import { withApollo } from '../apollo/apollo';
import { StoreInLocal } from '../utils/LocalStorage';
const Index = () => {

  StoreInLocal('past', "past");

  return <BookingHistory />;
};
export default withApollo(Index);
