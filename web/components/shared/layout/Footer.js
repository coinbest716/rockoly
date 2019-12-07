import React, { Component } from 'react';
import n from '../../routings/routings';
import { toastMessage } from '../../../utils/Toast';

class Footer extends Component {
  render() {
    try {
      return (
        <footer className="footer-area">
          <div className="container">
            <div className="row">
              <div className="col-lg-5 col-md-6">
                <div className="single-footer-widget">
                  <div className="logo">
                    <p
                      style={{
                        fontSize: 21,
                        fontWeight: 'bold',
                      }}
                    >
                      Rockoly
                    </p>
                  </div>

                  <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                    Ipsum is simply dummy text of the printing and typesetting industry.
                  </p>
                </div>
              </div>
{/* 
              <div className="col-lg-3 col-md-6">
                <div className="single-footer-widget">
                  <h3>Quick Links</h3>

                  <ul className="quick-links">
                    <li>
                      <a href={n.ABOUT_US}>About Us</a>
                    </li>
                    <li>
                      <a href={n.FAQ}>FAQ's</a>
                    </li>
                    <li><a href="#">Customer Services</a></li>
                    <li>
                      <a href={n.CONTACT_US}>Contact Us</a>
                    </li>
                  </ul>
                </div>
              </div> */}

              <div className="col-lg-3 col-md-6">
                <div className="single-footer-widget">
                  <h3>Information</h3>

                  <ul className="information-links">
                    <li>
                      <a href={n.ABOUT_US}>About Us</a>
                    </li>
                    {/* <li>
                      <a href={n.CONTACT_US}>Contact Us</a>
                    </li> */}
                    {/* <li><a href="#">Sizing Guide</a></li>
                                    <li><a href="#">Customer Services</a></li> */}
                  </ul>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="single-footer-widget">
                  <h3>Contact Us</h3>

                  <ul className="footer-contact-info">
                    <li>
                      <i className="fas fa-map-marker-alt"></i> Location: 2750 Quadra Street
                      Victoria, Canada
                    </li>
                    <li>
                      <i className="fas fa-phone"></i> Call Us: <a href="#">(+123) 456-7898</a>
                    </li>
                    <li>
                      <i className="far fa-envelope"></i> Email Us:{' '}
                      <a href="#">support@comero.com</a>
                    </li>
                    <li>
                      <i className="fas fa-fax"></i> Fax: <a href="#">+123456</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="copyright-area">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6 col-md-6">
                  <p>Copyrite @ 2019 Rockoly. All Rights Reserved</p>
                </div>

                {/* <div className="col-lg-6 col-md-6">
                  <ul className="payment-card">
                    <li>
                      <a href="#" target="_blank">
                        <img src={require('../../../images/visa.png')} alt="image" />
                      </a>
                    </li>
                    <li>
                      <a href="#" target="_blank">
                        <img src={require('../../../images/mastercard.png')} alt="image" />
                      </a>
                    </li>
                    <li>
                      <a href="#" target="_blank">
                        <img src={require('../../../images/mastercard2.png')} alt="image" />
                      </a>
                    </li>
                    <li>
                      <a href="#" target="_blank">
                        <img src={require('../../../images/visa2.png')} alt="image" />
                      </a>
                    </li>
                    <li>
                      <a href="#" target="_blank">
                        <img src={require('../../../images/expresscard.png')} alt="image" />
                      </a>
                    </li>
                  </ul>
                </div> */}
              </div>
            </div>
          </div>
        </footer>
      );
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }
}

export default Footer;
