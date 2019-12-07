import React, { Component } from 'react';
import Link from 'next/link';
import { mexican, swedish, latvian, italian } from '../const/BannerData';
import { toastMessage } from '../../../utils/Toast';

class CategoryList extends Component {
  //render image view based on option
  renderView = option => {
    return (
      <div className={option.class}>
        <div className="single-category-box">
          <img src={option.image} alt="image" />

          <div className="category-content">
            <h3>{option.title}</h3>
            <a href="/chef-list" className="btn btn-light">View More</a>
          </div>

          <Link href="/chef-list">
            <a className="link-btn"></a>
          </Link>
        </div>
      </div>
    );
  };

  render() {
    try {
      return (
        <section className="category-products-area pb-60">
          <div className="container">
            <div className="row">
              {this.renderView(mexican)}
              <div className="col-lg-8 col-md-12">
                <div className="row">
                  {this.renderView(swedish)}
                  {this.renderView(latvian)}
                  {this.renderView(italian)}
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }
}

export default CategoryList;
