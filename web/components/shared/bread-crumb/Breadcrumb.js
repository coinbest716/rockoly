import React, { Component } from 'react';
import Link from 'next/link';
import { toastMessage } from '../../../utils/Toast';

class Breadcrumb extends Component {
  render() {
    try {
      return (
        <div className="page-title-area">
          <div className="container">
            <ul>
              <li>
                <Link href="/">
                  <a>Home</a>
                </Link>
              </li>
              <li>{this.props.title}</li>
            </ul>
          </div>
        </div>
      );
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }
}

export default Breadcrumb;
