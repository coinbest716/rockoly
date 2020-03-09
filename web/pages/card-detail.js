import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import CardListItem from '../components/payments/components/CardListItem';
import { withApollo } from '../apollo/apollo';

const CardDetail = () => {

  const router = useRouter();
  let details = router.query ? router.query : '';
  return (
    <div>
      <CardListItem cardDetails={details} />
    </div>
  );
};

export default withApollo(CardDetail);
