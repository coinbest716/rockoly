import React from 'react';
import Page from '../../shared/layout/Main';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import { toastMessage } from '../../../utils/Toast';

export default function ForgotPassword() {
  try {
    return (
      <React.Fragment>
        <Page>
          <div className="auth">
            <section className="cart-area ptb-60">
              <div className="cart-totals">
                <ForgotPasswordForm />
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
