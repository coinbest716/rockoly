import React, { Component } from 'react';
import Page from '../../shared/layout/Main';
import ChangePasswordForm from './components/ChangePasswordForm';
import { toastMessage } from '../../../utils/Toast';

export default class ChangePassword extends Component {
  render() {
    try {
      return (
        <React.Fragment>
          <Page>
            <div className="auth">
              <section className="cart-area ptb-60">
                <div className="cart-totals">
                  <ChangePasswordForm />
                </div>
              </section>
            </div>
          </Page>
        </React.Fragment>
      );
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }
}
