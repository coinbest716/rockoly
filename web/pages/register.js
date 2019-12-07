import React from 'react';
import Register from '../components/auth/register/Register.Screen';
import { withApollo } from '../apollo/apollo';

const Index = () => {
  return <Register />;
};
export default withApollo(Index);
