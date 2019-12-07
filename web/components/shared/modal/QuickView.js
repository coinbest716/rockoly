import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addQuantityWithNumber } from '../../../store/actions/cartActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class QuickView extends Component {

    state = {
        qty: 1,
        max: 100,
        min: 1
    };

    handleAddToCartFromView = () => {
        this.props.addQuantityWithNumber(this.props.id, this.state.qty); 

        toast.success('Redirecting to payment page', {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });

        setTimeout(() => {this.props.closeModal()},5000); 
    }

    IncrementItem = () => {
        try{
            this.setState(prevState => {
                if(prevState.qty < 100) {
                    return {
                        qty: prevState.qty + 1
                    }
                } else {
                    return null;
                }
            });
        }
        catch(error){
            console.log(error);
        }
    }

    DecreaseItem = () => {
        try{
            this.setState(prevState => {
                if(prevState.qty > 1) {
                    return {
                        qty: prevState.qty - 1
                    }
                } else {
                    return null;
                }
            });
        }
        catch(error){
            console.log(error);
        }
    }

    render() {
        const { closeModal } = this.props;
        return (
            <div className="modal fade productQuickView show" style={{paddingRight: '16px', display: 'block'}}>
                <ToastContainer />
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <button type="button" onClick={closeModal} className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true"><i className="fas fa-times"></i></span>
                        </button>
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-md-6">
                                <div className="productQuickView-image">
                                    <img src={this.props.image} alt="image" /> 
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6">
                                <div className="product-content">
                                    <h3><a href="#">Ran's Kitchen</a></h3>

                                    <div className="price">
                                        <span className="new-price">${this.props.price}</span>
                                    </div>

                                    <div className="product-review">
                                        <div className="rating">
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star-half-alt"></i>
                                        </div>
                                        <a href="#" className="rating-count">3 reviews</a>
                                    </div>

                                    <ul className="product-info">
                                        <li><span>Known Dishes:</span> <a href="#">Indian,Chinese,Japanese dishes</a></li>
                                        <li><span>Availability:</span> <a href="#">Work on both week days and week end</a></li>
                                        <li><span>Best servers:</span> <a href="#">Dosa,chettinad gravy,sweets</a></li>
                                    </ul> 

                                    {/* <div className="product-color-switch">
                                        <h4>Color:</h4>

                                        <ul>
                                            <li><a href="#" title="Black" className="color-black"></a></li>
                                            <li><a href="#" title="White" className="color-white"></a></li>
                                            <li className="active"><a href="#" title="Green" className="color-green"></a></li>
                                            <li><a href="#" title="Yellow Green" className="color-yellowgreen"></a></li>
                                            <li><a href="#" title="Teal" className="color-teal"></a></li>
                                        </ul>
                                    </div> */}

                                    {/* <div className="product-size-wrapper">
                                        <h4>Size:</h4>

                                        <ul>
                                            <li><a href="#">XS</a></li>
                                            <li className="active"><a href="#">S</a></li>
                                            <li><a href="#">M</a></li>
                                            <li><a href="#">XL</a></li>
                                            <li><a href="#">XXL</a></li>
                                        </ul>
                                    </div> */}

                                    <div className="product-add-to-cart">
                                        <div className="input-counter">
                                            <p><b>Cook for</b></p>
                                            <span 
                                                className="minus-btn"
                                                onClick={this.DecreaseItem}
                                            >
                                                <i className="fas fa-minus"></i>
                                            </span>
                                            <input 
                                                type="text" 
                                                value={this.state.qty}
                                                min={this.state.min}
                                                max={this.state.max} 
                                                onChange={e => this.setState({ qty: e.target.value })}
                                            />
                                            <span 
                                                className="plus-btn"
                                                onClick={this.IncrementItem}
                                            >
                                                <i className="fas fa-plus"></i>
                                            </span>
                                            <p><b>Persons</b></p>
                                        </div>

                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                            onClick={this.handleAddToCartFromView}
                                        >
                                            <i className="fas fa-cart-plus"></i> Book this Chef
                                        </button>
                                    </div>

                                    <a href="#" className="view-full-info">View full info</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps= (dispatch)=>{
    return {
        addQuantityWithNumber: (id, qty) => {dispatch(addQuantityWithNumber(id, qty))}
    }
}

export default connect(
    null,
    mapDispatchToProps
)(QuickView)
