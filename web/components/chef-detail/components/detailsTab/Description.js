import React, { Component, useEffect } from 'react';
import moment from 'moment';
import { toastMessage } from '../../../../utils/Toast';
import * as util from '../../../../utils/checkEmptycondition';

function convertDateFormat(date) {
  // changing date format
  var str = date;
  var res = str.split(':');
  let hour = res[0];
  let min = res[1];
  let sec = res[2];
  var event = new Date();
  event.setHours(hour, min, sec);
  return moment(event).format('h:mm a');
}

const Description = props => {

  try {
    return (
      <div className="products-details-tab-content chefDetail">
        {props.chefDetails &&
          util.isStringEmpty(props.chefDetails.chefId) &&
          util.hasProperty(props.chefDetails, 'chefProfileExtendedsByChefId') &&
          util.hasProperty(props.chefDetails.chefProfileExtendedsByChefId, 'nodes') &&
          props.chefDetails.chefProfileExtendedsByChefId.nodes.map(node => {
            return (
              <div key={props.chefDetails.chefId}>
                <div>
                  {util.isStringEmpty(node.chefDesc) && (
                    <div>
                      <div class="card" style={{ marginBottom: '2%' }}>
                        <div class="card-header" id="card-header-view">
                          <label key={node.chefProfileExtendedId} id="describe-booking">
                            Description:
                          </label>
                        </div>

                        {/* </div> */}
                        <a
                          className="description-content text"
                          id="description-full-view"
                          style={{
                            paddingLeft: '1%',
                            paddingTop: '1%',
                            paddingBottom: '1%',
                            fontSize: '16px',
                          }}
                        >
                          {node.chefDesc}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                {/* <br /> */}
                {/* <br /> */}
                {/* {util.isStringEmpty(node.chefGratuity) && (
                  <div className="row">
                    <div
                      className="col-sm-2"
                      id="describe-content"
                      key={node.chefGratuity}
                    >
                      Gratuity:
                    </div>
                    <a className="description-content text">
                      {node.chefGratuity} %
                    </a>
                  </div>
                )} */}
                {/* <br /> */}
                {/* <br /> */}
                <div>
                  {util.isStringEmpty(node.noOfGuestsCanServe) && (
                    <div class="card" style={{ marginBottom: '2%' }}>
                      <div
                        style={{
                          paddingLeft: '1%',
                          paddingTop: '1%',
                          paddingBottom: '1%',
                          fontSize: '16px',
                        }}
                      >
                        Each guest an additional {node.noOfGuestsCanServe} * chef rate. Discount of{' '}
                        {node.discount ? node.discount : 0} % for each guest after{' '}
                        {node.personsCount ? node.personsCount : 0}
                      </div>
                    </div>
                  )}
                  {/* <br /> */}
                  <div>
                    {util.isStringEmpty(node.chefAvailableAroundRadiusInValue) && (
                      <div className="card" style={{ marginBottom: '2%' }}>
                        <div
                          id="describe-miles"
                          key={node.chefProfileExtendedId}
                          style={{
                            // paddingLeft: '1%',
                            paddingTop: '1%',
                            paddingBottom: '1%',
                            fontSize: '16px',
                          }}
                        >
                          This chef can travel up to {node.chefAvailableAroundRadiusInValue} miles
                          to provide the service
                        </div>
                      </div>
                    )}
                  </div>
                  {/* <br /> */}
                  {util.isStringEmpty(node.noOfGuestsMax && node.noOfGuestsMin) && (
                    <div class="card" style={{ marginBottom: '2%' }}>
                      <div
                        style={{
                          paddingLeft: '1%',
                          paddingTop: '1%',
                          paddingBottom: '1%',
                          fontSize: '16px',
                        }}
                      >
                        Chef can cook for minimum {node.noOfGuestsMin} and maximum{' '}
                        {node.noOfGuestsMax} guests
                      </div>
                    </div>
                  )}
                </div>
                {/* <br /> */}
                {/* <br /> */}

                {util.isStringEmpty(node.additionalServiceDetails) && (
                  <div className="card" style={{ marginBottom: '2%' }}>
                    {/* <div> */}
                    <div className="card-header" id="card-header-view">
                      <label id="describe-booking">Additional Services Provided:</label>
                    </div>

                    <div
                      id="services-mobile"
                      style={{ paddingLeft: '1%', paddingTop: '1%', paddingBottom: '1%' }}
                    >
                      {util.isStringEmpty(node.additionalServiceDetails) &&
                        JSON.parse(node.additionalServiceDetails) &&
                        JSON.parse(node.additionalServiceDetails).map(data => {
                          return (
                            <div
                              className="cuisineDisplay description-content text "
                              id="Additional-mobile-view"
                            >
                              <p
                                className="cuisine-type"
                                id="cuisine-dish-type"
                                style={{ fontSize: '16px' }}
                              >
                                {data.desc} - ${data.price}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
                <div className="card" style={{ marginBottom: '2%' }}>
                  {util.isStringEmpty(node.chefComplexity) && (
                    <div className="card-header" id="card-header-view">
                      <label id="describe-booking">Complexity</label>
                    </div>
                  )}
                  <div className="row">
                    {util.isStringEmpty(node.chefComplexity) &&
                      JSON.parse(node.chefComplexity) &&
                      JSON.parse(node.chefComplexity).map(data => {
                        return (
                          <div
                            className="description-content text col-sm-4"
                            id="complexity-level-modal"
                            style={{ paddingLeft: '2%', paddingTop: '1%', paddingBottom: '1%' }}
                          >
                            <p
                              style={{ fontWeight: 'bold', color: 'black', fontSize: '16px' }}
                              className="description-content text"
                              id="description-full-view"
                            >
                              Complexity level : {data.complexcityLevel}
                            </p>
                            <p
                              className="description-content text"
                              id="description-full-view"
                              style={{ fontSize: '16px' }}
                            >
                              Desired Dishes : {data.dishes}
                            </p>
                            <p
                              className="description-content text"
                              id="description-full-view"
                              style={{ fontSize: '16px' }}
                            >
                              Between {data.noOfItems.min} - {data.noOfItems.max} Menu items
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div>
                  {util.isStringEmpty(node.chefAwards) &&
                    JSON.parse(node.chefAwards) !== '' &&
                    JSON.parse(node.chefAwards) !== null && (
                      <div className="card" style={{ marginBottom: '2%', display: 'flex' }}>
                        <div className="card-header" id="card-header-view">
                          <label id="describe-booking"> Awards Won: </label>
                        </div>
                        <a
                          className="description-content text"
                          style={{
                            paddingLeft: '1%',
                            paddingTop: '1%',
                            paddingBottom: '1%',
                            fontSize: '16px',
                          }}
                        >
                          {JSON.parse(node.chefAwards)}
                        </a>
                      </div>
                    )}
                </div>
                {/* <br /> */}
                <div className="card" style={{ marginBottom: '2%' }}>
                  {util.hasProperty(node, 'certificationsTypes') &&
                    util.hasProperty(node.certificationsTypes, 'nodes') &&
                    util.isArrayEmpty(node.certificationsTypes.nodes) && (
                      <div className="card-header" id="card-header-view">
                        <label id="describe-booking">Certifications Won </label>
                      </div>
                    )}
                  {/* <div id="details-description"> */}
                  <div>
                    {node.certificationsTypes.nodes.map(data => {
                      return (
                        <div
                          className="description-content text cuisineDisplay"
                          style={{ paddingLeft: '1%', paddingBottom: '1%', paddingTop: '1%' }}
                        >
                          <a
                            className="cuisine-type description-content text"
                            id="cuisine-dish-type"
                            style={{ fontSize: '16px' }}
                          >
                            {data.certificateTypeDesc}
                          </a>
                        </div>
                      );
                    })}
                    {/* </div> */}
                  </div>
                </div>
                {/* <br /> */}
              </div>
            );
          })}

        {props.chefDetails &&
          util.hasProperty(props.chefDetails, 'chefSpecializationProfilesByChefId') &&
          util.isObjectEmpty(props.chefDetails.chefSpecializationProfilesByChefId) &&
          util.hasProperty(props.chefDetails.chefSpecializationProfilesByChefId, 'nodes') &&
          props.chefDetails.chefSpecializationProfilesByChefId.nodes.length > 0 &&
          props.chefDetails.chefSpecializationProfilesByChefId.nodes.map(node => {
            return (
              <div>
                {util.hasProperty(node, 'chefCuisineTypeDesc') &&
                  util.isObjectEmpty(node.chefCuisineTypeDesc) && (
                    <div className="card" style={{ marginBottom: '2%' }}>
                      <div className="card-header" id="card-header-view">
                        <label id="describe-booking">Cuisine Type</label>
                      </div>
                      <div style={{ paddingLeft: '1%', paddingTop: '1%', paddingBottom: '1%' }}>
                        {node.chefCuisineTypeDesc.map(cuisineType => {
                          return (
                            <div className="cuisineDisplay" style={{ paddingRight: '1%' }}>
                              <div>
                                <a
                                  className="cuisine-type description-content"
                                  id="cuisine-dish-type"
                                  style={{ fontSize: '16px' }}
                                >
                                  {cuisineType}
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                {/* <br /> */}
                {util.isStringEmpty(node.chefSpecializationId) &&
                  util.hasProperty(node, 'chefDishTypeDesc') &&
                  util.isObjectEmpty(node.chefDishTypeDesc) && (
                    <div className="card" style={{ marginBottom: '2%' }}>
                      <div className="card-header" id="card-header-view">
                        <label id="describe-booking">Dish Specialty</label>
                      </div>
                      <div style={{ paddingLeft: '1%', paddingTop: '1%', paddingBottom: '1%' }}>
                        {node.chefDishTypeDesc.map(dishType => {
                          return (
                            <div className="cuisineDisplay" style={{ paddingRight: '1%' }}>
                              <div>
                                <a
                                  className="cuisine-type description-content"
                                  id="cuisine-dish-type"
                                  style={{ fontSize: '16px' }}
                                >
                                  {dishType}
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
      </div>
    );
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
};
export default Description;
