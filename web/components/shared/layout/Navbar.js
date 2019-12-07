import React, { Component } from 'react';
import { withApollo } from '../../../apollo/apollo';
import TopPanel from './TopPanel';
import MegaMenu from './MegaMenu';
import { toastMessage } from '../../../utils/Toast';

const Navbar = () => {
  try {
    return (
      <React.Fragment>
        <TopPanel />
        <MegaMenu />
      </React.Fragment>
    );
  } catch (error) {
    toastMessage('renderError', error.message);
  }
};

export default withApollo(Navbar);
