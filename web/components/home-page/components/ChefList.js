import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addToCart } from '../../../store/actions/cartActions';
import Link from 'next/link';
import ReactTooltip from 'react-tooltip';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import QuickView from '../../Modal/QuickView';
import dynamic from 'next/dynamic';
import n from '../../routings/routings';
const OwlCarousel = dynamic(import('react-owl-carousel3'));
import { toastMessage } from '../../../utils/Toast';

const SampleData = [
  {
    id: 1,
    title: 'Chef Daniel',
    price: 30,
    image: require('../../../images/mock-image/img1.jpg'),
    imageHover: require('../../../images/mock-image/img4.jpg'),
    quickView: require('../../../images/mock-image/img1.jpg'),
    rating: '4.5 (12)',
  },
  {
    id: 2,
    title: 'Chef Max',
    price: 20,
    image: require('../../../images/mock-image/img2.jpg'),
    imageHover: require('../../../images/mock-image/img3.jpg'),
    quickView: require('../../../images/mock-image/img2.jpg'),
    rating: '3.5 (23)',
  },
  {
    id: 3,
    title: 'Chef Flavia',
    price: 15,
    image: require('../../../images/mock-image/img3.jpg'),
    imageHover: require('../../../images/mock-image/img2.jpg'),
    quickView: require('../../../images/mock-image/img3.jpg'),
    rating: '4 (10)',
  },
  {
    id: 4,
    title: 'Chef Luca',
    price: 130,
    image: require('../../../images/mock-image/img4.jpg'),
    imageHover: require('../../../images/mock-image/img1.jpg'),
    quickView: require('../../../images/mock-image/img4.jpg'),
    rating: '5 (120)',
  },
  {
    id: 5,
    title: 'Chef Slyvia',
    price: 90,
    image: require('../../../images/mock-image/img1.jpg'),
    imageHover: require('../../../images/mock-image/img4.jpg'),
    quickView: require('../../../images/mock-image/img1.jpg'),
    rating: '4.5 (20)',
  },
  {
    id: 6,
    title: 'Florin',
    price: 180,
    image: require('../../../images/mock-image/img2.jpg'),
    imageHover: require('../../../images/mock-image/img3.jpg'),
    quickView: require('../../../images/mock-image/img2.jpg'),
    rating: '4.5 (13)',
  },
  {
    id: 7,
    title: 'Chef Daniel',
    price: 30,
    image: require('../../../images/mock-image/img1.jpg'),
    imageHover: require('../../../images/mock-image/img4.jpg'),
    quickView: require('../../../images/quick-view-img.jpg'),
    rating: '2 (11)',
  },
  {
    id: 8,
    title: 'Chef Max',
    price: 20,
    image: require('../../../images/mock-image/img2.jpg'),
    imageHover: require('../../../images/mock-image/img4.jpg'),
    quickView: require('../../../images/quick-view-img.jpg'),
    rating: '4.5 (14)',
  },
  {
    id: 9,
    title: 'Chef Flavia',
    price: 15,
    image: require('../../../images/mock-image/img3.jpg'),
    imageHover: require('../../../images/mock-image/img2.jpg'),
    quickView: require('../../../images/quick-view-img.jpg'),
    rating: '4.5 (16)',
  },
  {
    id: 10,
    title: 'Chef Luca',
    price: 130,
    image: require('../../../images/mock-image/img4.jpg'),
    imageHover: require('../../../images/mock-image/img1.jpg'),
    quickView: require('../../../images/quick-view-img.jpg'),
    rating: '4.5 (12)',
  },
  {
    id: 11,
    title: 'Chef Slyvia',
    price: 90,
    image: require('../../../images/mock-image/img1.jpg'),
    imageHover: require('../../../images/mock-image/img4.jpg'),
    quickView: require('../../../images/quick-view-img.jpg'),
    rating: '4.5 (13)',
  },
  {
    id: 12,
    title: 'Florin',
    price: 180,
    image: require('../../../images/mock-image/img2.jpg'),
    imageHover: require('../../../images/mock-image/img3.jpg'),
    quickView: require('../../../images/quick-view-img.jpg'),
    rating: '4.5 (64)',
  },
];

const options = {
  loop: true,
  nav: false,
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
    1024: {
      items: 3,
    },
    1200: {
      items: 4,
    },
  },
};

class ChefList extends Component {
  state = {
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
      let { products } = this.props;
      const { modalOpen } = this.state;
      return (
        <section className="trending-products-area ptb-60">
          <ReactTooltip />
          <ToastContainer transition={Slide} />
          <div className="container">
            <div className="section-title without-bg">
              <h2>
                <span className="dot"></span> Our Chefs
              </h2>
            </div>

            <div className="row">
              {this.state.display ? (
                <OwlCarousel
                  className="trending-products-slides-two owl-carousel owl-theme"
                  {...options}
                >
                  {SampleData.map((data, idx) => (
                    <div className="col-lg-12 col-md-12" key={idx}>
                      <div className="single-product-box">
                        <div className="product-image">
                          <Link href={n.CHEF_DETAIL}>
                            <a>
                              <img src={data.image} alt="image" />
                              <img src={data.imageHover} alt="image" />
                            </a>
                          </Link>

                          {/* <ul>
                                            <li>
                                                <Link href="#">
                                                    <a
                                                        data-tip="Quick View"
                                                        data-place="left"
                                                        onClick={e => {
                                                                e.preventDefault();
                                                                this.openModal();
                                                                this.handleModalData(data.quickView,data.price,data.id, data.title)
                                                            }
                                                        }
                                                    >
                                                        <i className="far fa-eye"></i>
                                                    </a>
                                                </Link>
                                            </li>
                                            <li>
                                              
                                                    <a data-tip="Add to Wishlist" data-place="left">
                                                        <i className="far fa-heart"></i>
                                                    </a>
                                              
                                            </li>
                                            <li>
                                               
                                                    <a data-tip="Add to Compare" data-place="left">
                                                        <i className="fas fa-sync"></i>
                                                    </a>
                                                
                                            </li>
                                        </ul> */}
                        </div>

                        <div className="product-content">
                          <h3>
                            <Link href={n.CHEF_DETAIL}>
                              <a>{data.title}</a>
                            </Link>
                          </h3>

                          <div className="product-price">
                            <span className="new-price">From ${data.price}/person</span>
                          </div>

                          <div className="rating">
                            <div className="innerblock">
                              <i className="fas fa-star"></i>
                            </div>

                            <div className="innerblock">
                              <p style={{ color: '#000000' }}>{data.rating}</p>
                            </div>
                          </div>
                          <Link href={n.CHEF_DETAIL}>
                            <a className="btn btn-light">View Detail</a>
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
          {modalOpen ? (
            <QuickView
              closeModal={this.closeModal}
              idd={this.state.idd}
              image={this.state.modalImage}
              price={this.state.price}
              title={this.state.title}
              type="chef"
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

const mapStateToProps = state => {
  return {
    products: state.products,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addToCart: id => {
      dispatch(addToCart(id));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChefList);
