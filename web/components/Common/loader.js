import React, { Component } from 'react';
import { toastMessage } from '../../utils/Toast';

const Loader = () => {
  return (
    <div className="text-center">
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
