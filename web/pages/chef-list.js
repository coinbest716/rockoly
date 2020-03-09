import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ChefListScreen from '../components/chef-list/ChefList.Screen';
import { withApollo } from '../apollo/apollo';

const ChefList = () => {

  const router = useRouter();

  let location = router.query ? router.query : '';

  return <ChefListScreen locationFilter={location} />;
  
};
export default withApollo(ChefList);
