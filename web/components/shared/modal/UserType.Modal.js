import React, { Component } from 'react';
import Link from 'next/link';
import s from './Modal.String';
import { toastMessage } from '../../../utils/Toast';

class UserTypeModal extends Component {
  _isMounted = false;
  state = {
    open: false,
  };

  componentDidMount() {
    this.setState({
      open: true,
    });
  }
  onSelectUserType(value, userType) {
    //to select the role of user
    try {
      if (this.props.onSelectUserType) {
        this.setState({
          open: false,
        });
        this.props.onSelectUserType(value, userType);
      }
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }
  render() {
    let { open } = this.state;
    return (
      <div className={`bts-popup ${open ? 'is-visible' : ''}`} role="alert">
        <div className="bts-popup-container">
          <div className="row">
            <div className="col-12">
              <div className="card card-block">
                <button
                  className="btn btn-success"
                  onClick={() => this.onSelectUserType(true, 'chef')}
                >
                  {s.I_AM_A_CHEF}
                </button>
              </div>
            </div>
          </div>
          <br></br>
          <div className="row">
            <div className="col-12">
              <div className="card card-block">
                <button
                  className="btn btn-success"
                  onClick={() => this.onSelectUserType(true, 'customer')}
                >
                  {s.I_AM_A_CUSTOMER}
                </button>
              </div>
            </div>
          </div>
          <Link href="#">
            <a onClick={() => this.onSelectUserType(null, null)} className="bts-popup-close"></a>
          </Link>
        </div>
      </div>
    );
  }
}

export default UserTypeModal;
