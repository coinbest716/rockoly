import React, { Component } from 'react';
import { pagings } from './const/pagings';

export default class Pagination extends Component {
  render() {
    try {
      return (
        <div className="col-lg-12 col-md-12">
          <div className="pagination-area">
            <a href="#" className="prev page-numbers"><i className="fas fa-angle-double-left"></i></a>
            {pagings.map((paging) => (
              <a href={paging.route}
                key={paging.id}
                className="page-numbers">
                {paging.id}
              </a>
            ))

            }
            <a href="#" className="next page-numbers"><i className="fas fa-angle-double-right"></i></a>
          </div>
        </div>
      )
    }
    catch (error) {
      console.log(error);
    }
  }
}