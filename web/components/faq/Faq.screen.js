import React, { Component } from 'react';
import Page from '../shared/layout/Main';
import Faq from './components/Faq';
import Facility from '../shared/facility/Facility';
import { toastMessage } from '../../utils/Toast';

export default class FaqScreen extends Component {
  render() {
    try {
      return (
        <React.Fragment>
          <Page>
            <section className="cart-area ptb-60">
              <div className="cart-totals">
                <Faq />
                {/* <Facility /> */}
              </div>
            </section>
          </Page>
        </React.Fragment>
      );
    } catch (error) {
      const errorMessage = error.message;
      toastMessage('renderError', errorMessage);
    }
  }
}
