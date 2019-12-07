import React, { Component } from 'react';
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
  // console.log('dsalkdjlkjlk123123123', props.chefDetails);
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
                {util.isStringEmpty(node.chefDesc) && (
                  <div className="row">
                    <div
                      className="col-sm-2"
                      id="describe-content"
                      key={node.chefProfileExtendedId}
                    >
                      {/* {console.log(node)} */}
                      {/* <img
                        src={require('../../../../images/mock-image/description-icon.png')}
                        alt="image"
                        className="icon-images"
                        id="describe-content"
                      /> */}
                      Description:
                    </div>
                    <a className="description-content text" id="description-full-view">
                      {node.chefDesc}
                    </a>
                  </div>
                )}
                <br />

                {util.isStringEmpty(node.chefBusinessHoursFromTime) &&
                  util.isStringEmpty(node.chefBusinessHoursToTime) && (
                    <div className="row">
                      <div className="col-sm-2" id="describe-content">
                        {/* <img
                          src={require('../../../../images/mock-image/clock-icon.png')}
                          alt="image"
                          className="icon-images"
                        /> */}
                        Business Hours:
                      </div>
                      <a className="description-content text" id="description-full-view">
                        Daily {convertDateFormat(node.chefBusinessHoursFromTime)} to{' '}
                        {convertDateFormat(node.chefBusinessHoursToTime)}
                      </a>
                    </div>
                  )}
                <br />

                {util.isStringEmpty(node.chefAvailableAroundRadiusInValue) && (
                  <div className="row">
                    <div id="describe-miles" key={node.chefProfileExtendedId}>
                      Chef can travel around {node.chefAvailableAroundRadiusInValue} miles to
                      provide the service
                    </div>
                  </div>
                )}
                {util.isStringEmpty(node.minimumNoOfMinutesForBooking) && (
                  <div className="row">
                    <div id="describe-min" key={node.chefProfileExtendedId}>
                      Chef can work for {Math.round(node.minimumNoOfMinutesForBooking / 60)} hours
                      per booking
                    </div>
                  </div>
                )}
                <br />
              </div>
            );
          })}

        {props.chefDetails &&
          util.hasProperty(props.chefDetails, 'chefSpecializationProfilesByChefId') &&
          util.hasProperty(props.chefDetails.chefSpecializationProfilesByChefId, 'nodes') &&
          props.chefDetails.chefSpecializationProfilesByChefId.nodes.map(node => {
            return (
              <div>
                {util.isStringEmpty(node.chefSpecializationId) &&
                  util.hasProperty(node, 'chefCuisineTypeDesc') &&
                  util.isObjectEmpty(node.chefCuisineTypeDesc) && (
                    <div>
                      <div id="specializationProfiles-content">Cuisine Type</div>
                      {node.chefCuisineTypeDesc.map(cuisineType => {
                        return (
                          <div className="cuisineDisplay">
                            <a className="cuisine-type description-content" id="cuisine-dish-type">
                              {cuisineType}
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  )}
                <br />
                {util.isStringEmpty(node.chefSpecializationId) &&
                  util.hasProperty(node, 'chefDishTypeDesc') &&
                  util.isObjectEmpty(node.chefDishTypeDesc) && (
                    <div>
                      <div id="specializationProfiles-content">
                        {/* <img
                      src={require('../../../../images/mock-image/cuisine type.png')}
                      alt="image"
                      className="icon-images"
                    /> */}
                        Dish Type
                      </div>
                      {node.chefDishTypeDesc.map(dishType => {
                        return (
                          <div className="cuisineDisplay">
                            <div className="dish-type description-content" id="desc-dish-type">
                              {dishType}
                            </div>
                          </div>
                        );
                      })}
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
