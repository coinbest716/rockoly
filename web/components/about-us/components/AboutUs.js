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
              <div className="col-lg-6 col-md-12">
                <div className="about-content">
                  <h2>{Strings.ABOUT_OUR_STORE}</h2>
                  <p>{Strings.P1}</p>

                  <p>{Strings.P2}</p>

                  <p>{Strings.P1}</p>

                  <div className="signature mb-0">
                    <img src={require('../../../images/mock-image/img1.jpg')} alt="image" />
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-md-12">
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
              </div>
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
