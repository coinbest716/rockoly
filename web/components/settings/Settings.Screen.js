import React, { Component } from 'react';
import Settings from './components/Settings';
import Page from '../shared/layout/Main';
import { toastMessage } from '../../utils/Toast';

export default class SettingsScreen extends Component {
  render() {
    try {
      return (
        <React.Fragment>
          <Page>
            <div className="settings">
              <Settings />
            </div>
          </Page>
        </React.Fragment>
      );
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }
}
