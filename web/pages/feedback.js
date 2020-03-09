import React, { useEffect } from 'react';
import { withApollo } from '../apollo/apollo';
import { useRouter } from 'next/router';
import Feedback from '../components/feedback/Feedback.Screen';

const Index = () => {

  const router = useRouter();
  let details = router.query ? router.query : '';
  return <Feedback bookinHistoryId={details} />;
};
export default withApollo(Index);
