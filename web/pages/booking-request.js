import React, { useEffect } from 'react';
import BookingRequestScreen from '../components/booking-request/BookingRequest.Screen';
import {withApollo} from '../apollo/apollo';

const Index = () => {

    return <BookingRequestScreen />;
}

export default withApollo(Index);
