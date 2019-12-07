import React from 'react';
import { withApollo } from '../apollo/apollo';
import NotificationScreen from '../components/notification/Notification.Screen';

const Index = () => {
  return <NotificationScreen />;
};
export default withApollo(Index);
