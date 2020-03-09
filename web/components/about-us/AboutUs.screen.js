import React, { Component } from 'react';
import Page from '../shared/layout/Main';
import AboutUs from './components/AboutUs';
import Testimonials from '../shared/testimonials/Testimonials';
import { toastMessage } from '../../utils/Toast';

export default class IntroPageScreen extends Component {
  render() {
    try {
      return (
        <React.Fragment>
          <Page>
            <div className="aboutUs">
              <section className="cart-area ptb-60">
                <div className="cart-totals">
                  <AboutUs />
                  {/* <Testimonials /> */}
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
