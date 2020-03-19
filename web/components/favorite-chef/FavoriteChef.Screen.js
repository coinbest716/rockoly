import React, { useState } from 'react';
import Page from '../shared/layout/Main';
import FavoriteChef from './components/FavoriteChef';
import FavoriteFilterOption from './components/FavoriteFilterOptions';

const FavoriteChefScreen = () => {
  const [gridClass, setgridClass] = useState(null);
  const [totalCountValue, setTotalCountValue] = useState();
  const [resultCountValue, setResultCountValue] = useState();

  function handleGrid(e) {
    //handling grid styles
    try {
      setgridClass(e);
    } catch (error) {
      //console.log('error', error.message);
    }
  }

  function setCountValue(totalCount, resultCount) {
    setTotalCountValue(totalCount);
    setResultCountValue(resultCount);
  }

  return (
    <React.Fragment>
      <Page>
        <section className="products-collections-area ptb-60 cart-area ptb-60">
          <div className="container cart-totals">
            <div className="section-title">
              <h2>
                <span className="dot"></span> Favorite Chef List
              </h2>
            </div>
            <div className="row" id="favorite-chef-row">
              <FavoriteFilterOption totalCount={totalCountValue} resultCount={resultCountValue} />
              <div
                id="products-filter"
                className={`products-collections-listing row ${4}`}
                style={{ width: '100%' }}
              >
                <FavoriteChef setCountValue={setCountValue} />
              </div>
            </div>
          </div>
        </section>
      </Page>
    </React.Fragment>
  );
};
export default FavoriteChefScreen;
