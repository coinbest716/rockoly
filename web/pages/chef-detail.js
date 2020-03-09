import React, { Component } from 'react';
import { useRouter } from 'next/router';
import { withApollo } from '../apollo/apollo';
import ChefDetail from '../components/chef-detail/ChefDetail.Screen';

const Index = () => {
  const router = useRouter();
  let id = router.query ? router.query : '';
  return <ChefDetail chefIdToDisplay={id} />;
};
export default withApollo(Index);
