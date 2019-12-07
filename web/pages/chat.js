import React, { Component } from 'react';
import { useRouter } from 'next/router';
import ChatScreen from '../components/chat/Chat.Screen';
import { withApollo } from '../apollo/apollo';

const Chat = () => {
  const router = useRouter();
  let details = router.query ? router.query : null;
  // console.log("ChefList",location)
  return <ChatScreen chatDetails={details} />;
};
export default withApollo(Chat);
