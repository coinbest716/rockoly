import React, { useEffect } from 'react';
import { withApollo } from '../apollo/apollo';
import { useRouter } from 'next/router';
import ChatScreen from '../components/chat/Chat.Screen';

const Chat = () => {

  const router = useRouter();
  let details = router.query ? router.query : null;
  return <ChatScreen chatDetails={details} />;
};
export default withApollo(Chat);
