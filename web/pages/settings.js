import React,{useEffect} from 'react';
import SettingsScreen from '../components/settings/Settings.Screen';
import { withApollo } from '../apollo/apollo';

const Index = () => {

  return <SettingsScreen />;
};
export default withApollo(Index);
