import React from 'react';
import HomePage from './home-page';
import Payments from './payments';
import { withApollo } from '../apollo/apollo';
import Head from 'next/head';

const Index = () => {
  try {
    return (
      <React.Fragment>
        <HomePage />
      </React.Fragment>
    );
  } catch (error) {
    //console.log('error', error);
  }
};

export default withApollo(Index);
