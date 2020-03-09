import { Component } from 'react';
import Strings from '../AboutUs.String';
import { toastMessage } from '../../../utils/Toast';

class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: 'welcome',
    };
  }
  render() {
    try {
      return (
        <section className="about-area ptb-60">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12 col-md-12">
                <div className="about-content">
                  <h2>{Strings.ABOUT_OUR_STORE}</h2>
                  <p style={{ fontSize: '19px' }}>
                    Started by two Boston guys, Rockoly is a platform connecting private chefs to
                    hungry customers. We seek to demystify private chef industry by providing clear
                    transparent pricing based on our unique pricing model and easy booking process.
                    No longer will customers be overcharged for having a "wedding" vs "anything but
                    the wedding". No longer will customers be overcharged for having lobster instead
                    of chicken and rice because of 3x ingredients cost pricing model. Join the
                    revolution and let's bring healthy gourmet cooking to your home.
                  </p>

                  {/* <div className="signature mb-0">
                    <img src={require('../../../images/mock-image/img1.jpg')} alt="image" />
                  </div> */}
                </div>
              </div>

              {/* <div className="col-lg-6 col-md-12">
                <div className="about-image">
                  <img
                    src={require('../../../images/mock-image/main-banner1.jpg')}
                    className="about-img1"
                    alt="image"
                  />

                  <img
                    src={require('../../../images/mock-image/img3.jpg')}
                    className="about-img2"
                    alt="image"
                  />
                </div>
              </div> */}
            </div>
          </div>
        </section>
      );
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }
}

export default AboutUs;
