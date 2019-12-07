import React, { Component } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { SampleData } from '../chefDetail/components/const/FoodList';
import QuickView from '../Modal/QuickView';
const OwlCarousel = dynamic(import('react-owl-carousel3'));
import { toastMessage } from '../../../../utils/Toast';

const options = {
  loop: true,
  nav: true,
  dots: true,
  autoplayHoverPause: true,
  autoplay: true,
  navText: ["<i class='fas fa-chevron-left'></i>", "<i class='fas fa-chevron-right'></i>"],
  responsive: {
    0: {
      items: 1,
    },
    576: {
      items: 2,
    },
    768: {
      items: 2,
    },
    1200: {
      items: 4,
    },
  },
};

class ImageGallery extends Component {
  state = {
    display: false,
    panel: true,
    modalOpen: false,
    modalImage: '',
    price: 0,
    idd: null,
    display: false,
    title: '',
  };

  componentDidMount() {
    this.setState({ display: true });
  }
  openModal = () => {
    this.setState({ modalOpen: true });
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  handleModalData = (image, price, id, title) => {
    this.setState({
      modalImage: image,
      price: price,
      idd: id,
      title,
    });
  };
  render() {
    try {
      return (
        <section className="offer-area ptb-60">
          <div className="container">
            <div className="section-title"></div>

            <div className="row">
              {this.state.display ? (
                <OwlCarousel className="offer-slides owl-carousel owl-theme" {...options}>
                  {SampleData.map((data, idx) => (
                    <div className="col-lg-12 col-md-12">
                      <div className="single-product-box">
                        <div className="product-image">
                          <Link href="#">
                            <a
                              data-tip="Quick View"
                              data-place="left"
                              onClick={e => {
                                e.preventDefault();
                                this.openModal();
                                this.handleModalData(
                                  data.quickView,
                                  data.price,
                                  data.id,
                                  data.title
                                );
                              }}
                            >
                              <img src={data.image} alt="image" width="100" height="300" />
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </OwlCarousel>
              ) : (
                ''
              )}
            </div>
          </div>
          {this.state.modalOpen ? (
            <QuickView
              closeModal={this.closeModal}
              idd={this.state.idd}
              image={this.state.modalImage}
              price={this.state.price}
              title={this.state.title}
              type="food"
            />
          ) : (
            ''
          )}
        </section>
      );
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }
}

export default ImageGallery;
