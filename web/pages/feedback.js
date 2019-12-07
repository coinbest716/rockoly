import React from 'react';
import { useRouter } from 'next/router';
import Feedback from '../components/feedback/Feedback.Screen';
import { withApollo } from '../apollo/apollo';

const Index = () => {
  const router = useRouter();
  let details = router.query ? router.query : '';
  return <Feedback bookinHistoryId={details} />;
};
export default withApollo(Index);
