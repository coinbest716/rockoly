import React, { Component } from 'react';
import dynamic from 'next/dynamic';
const OwlCarousel = dynamic(import('react-owl-carousel3'));
import { toastMessage } from '../../../utils/Toast';

const options = {
  loop: true,
  nav: false,
  dots: true,
  autoplayHoverPause: true,
  items: 1,
  autoplay: true,
  navText: ["<i class='fas fa-chevron-left'></i>", "<i class='fas fa-chevron-right'></i>"],
};

class Testimonials extends Component {
  state = {
    display: false,
    panel: true,
  };

  componentDidMount() {
    this.setState({ display: true });
  }

  render() {
    try {
      return (
        <section className="testimonials-area ptb-60">
          <div className="container">
            {this.state.display ? (
              <OwlCarousel className="testimonials-slides owl-carousel owl-theme" {...options}>
                <div className="single-testimonials">
                  <div className="client-image">
                    <img src={require('../../../images/mock-image/img1.jpg')} alt="image" />
                  </div>

                  <p style={{color: '#00bfff'}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices
                    gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem
                    ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices
                    gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
                  </p>

                  <div className="client-info">
                    <h4>Jason Statham</h4>
                    <span>Founder at Brand</span>
                  </div>
                </div>

                <div className="single-testimonials">
                  <div className="client-image">
                    <img src={require('../../../images/mock-image/img2.jpg')} alt="image" />
                  </div>

                  <p style={{color: '#00bfff'}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices
                    gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem
                    ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices
                    gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
                  </p>

                  <div className="client-info">
                    <h4>Jason Jisan</h4>
                    <span>Founder at Brand</span>
                  </div>
                </div>

                <div className="single-testimonials">
                  <div className="client-image">
                    <img src={require('../../../images/mock-image/img3.jpg')} alt="image" />
                  </div>

                  <p style={{color: '#00bfff'}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices
                    gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem
                    ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices
                    gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
                  </p>

                  <div className="client-info">
                    <h4>Jason Shabbir</h4>
                    <span>Founder at Brand</span>
                  </div>
                </div>
              </OwlCarousel>
            ) : (
              ''
            )}
          </div>
        </section>
      );
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }
}

export default Testimonials;
