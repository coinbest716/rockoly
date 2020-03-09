import React, { useEffect } from 'react';
import PaymentHistory from '../components/payment-history/PaymentHistory.Screen';
import { withApollo } from '../apollo/apollo';

const Index = () => {

  return <PaymentHistory />;
};
export default withApollo(Index);
