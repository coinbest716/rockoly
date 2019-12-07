import React, { Component } from 'react';
import { toastMessage } from '../../../utils/Toast';
const SocialLinks = () => {
  return (
    <section className="products-collections-area ptb-60">
      <div className="login-form">
        <div className="section-title">
          <h2>Social Media Links</h2>
        </div>

        <div className="row">
          <form className="login-content">
            <div className="form-group">
              <label>Facebook URL</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your facebook page url"
                id="name"
                name="name"
              />
            </div>
            <div className="form-group">
              <label>Twitter URL</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your twitter page url"
                id="name"
                name="name"
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SocialLinks;
