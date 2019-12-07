import React, { Component } from 'react';
import Page from '../shared/layout/Main';
import { toastMessage } from '../../utils/Toast';
import IntroPageCarousel from './components/IntroPageCarousel.Screen';

export default class IntroPage extends Component {
  render() {
    try {
      return (
        <React.Fragment>
          <Page>
            <div className="aboutUs">
              <section className="cart-area ptb-60">
                <div className="cart-totals">
                  <IntroPageCarousel />
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
