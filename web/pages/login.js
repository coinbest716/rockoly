import React from 'react';
import { useRouter } from 'next/router';
import Login from '../components/auth/login/Login.Screen';
import { withApollo } from '../apollo/apollo';

const Index = () => {
  const router = useRouter();
  let details = router.query ? router.query : '';
  return <Login chefId={details} />;
};
export default withApollo(Index);
