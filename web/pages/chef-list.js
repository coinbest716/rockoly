import React, { Component } from 'react';
import { useRouter } from 'next/router';
import ChefListScreen from '../components/chef-list/ChefList.Screen';
import { withApollo } from '../apollo/apollo';

const ChefList = () => {
  const router = useRouter();

  let location = router.query ? router.query : '';
  // console.log("ChefList",location)
  return <ChefListScreen locationFilter={location} />;
};
export default withApollo(ChefList);
