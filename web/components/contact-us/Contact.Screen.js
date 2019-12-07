import React, { Component } from 'react';
import ContactForm from './components/ContactForm';
import Page from '../shared/layout/Main';
import { toastMessage } from '../../utils/Toast';

export default class ContactScreen extends Component {
  render() {
    try {
      return (
        <React.Fragment>
          <Page>
            <div className="contactForm">
              <section className="cart-area ptb-60">
                <div className="cart-totals">
                  <ContactForm />
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
