import React, { Component } from 'react';
import { toastMessage } from '../../../utils/Toast';

class NoData extends Component {
  render() {
    try {
      return (
        <div class="nodata-icon">
          <img
            src={require('../../../images/mock-image/no-data.png')}
            alt="image"
            className="icon-images"
            style={{ width: '20%' }}
          />
          <p className="no-data-text">No data available for this request</p>
        </div>
      );
    } catch (error) {
      const errorMessage = error.message;
      toastMessage('renderError', errorMessage);
    }
  }
}

export default NoData;
