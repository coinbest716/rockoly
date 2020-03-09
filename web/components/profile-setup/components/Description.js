import React, { useState, useEffect } from 'react';
import { toastMessage, success, renderError, error } from '../../../utils/Toast';
import * as gqlTag from '../../../common/gql';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as util from '../../../utils/checkEmptycondition';
import s from '../ProfileSetup.String';
import { getChefId, profileExtendId,getUserTypeRole } from '../../../utils/UserType';
import TimePicker from 'react-times';
import {
  initialStartTime,
  getCurrentDate,
  convert12to24Hours,
  convert12to24Format,
  getDate,
  getDateFormat,
  endTimeLimit,
} from '../../../utils/DateTimeFormat';

const updateChefData = gqlTag.mutation.chef.updateDetailsGQLTag;

//for updating chef details
const UPDATE_CHEF_DATA = gql`
  ${updateChefData}
`;

const Description = props => {
  const [experience, setexperience] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [lincenseNumber, setLincenseNumber] = useState('');
  const [extendedId,setExtendedId] = useState('')
  const [businessHourStartTime, setBusinessHourStartTime] = useState(initialStartTime);
  const [businessHourEndTime, setBusinessHourEndTime] = useState(endTimeLimit);
  const [minimumBooking, setMinimumBooking] = useState();
  const [chefProfileExtendedsByChefId, setChefProfileExtendedsByChefId] = useState('');
  //set cuisine list data

  useEffect(() => {
    //get user role
    getUserTypeRole()
      .then(async res => {
        if (res === "chef") {
          //customer user
           //chef user
           getChefId(profileExtendId)
           .then(async chefResult => {
             await setExtendedId(chefResult);
           })
           .catch(err => { });
        }
      })
      .catch(err => { });
  }, [extendedId]);

  useEffect(() => {
    let chefData = props.chefDetails;
    if (
      util.isObjectEmpty(chefData) &&
      util.hasProperty(chefData, 'chefProfileExtendedsByChefId') &&
      util.isObjectEmpty(chefData.chefProfileExtendedsByChefId) &&
      util.isObjectEmpty(chefData.chefProfileExtendedsByChefId) &&
      util.isArrayEmpty(chefData.chefProfileExtendedsByChefId.nodes) &&
      util.isObjectEmpty(chefData.chefProfileExtendedsByChefId.nodes[0])
    ) {
      let data = chefData.chefProfileExtendedsByChefId.nodes[0];
      setexperience(util.isStringEmpty(data.chefExperience) ? parseInt(data.chefExperience) : '');
      setDescription(util.isStringEmpty(data.chefDesc) ? data.chefDesc : '');
      setPrice(util.isStringEmpty(data.chefPricePerHour) ? data.chefPricePerHour : '');
      setFacebookUrl(util.isStringEmpty(data.chefFacebookUrl) ? data.chefFacebookUrl : '');
      setTwitterUrl(util.isStringEmpty(data.chefTwitterUrl) ? data.chefTwitterUrl : '');
      setBusinessHourStartTime(
        util.isStringEmpty(data.chefBusinessHoursFromTime)
          ? data.chefBusinessHoursFromTime
          : '09:00:00'
      );
      setBusinessHourEndTime(
        util.isStringEmpty(data.chefBusinessHoursToTime) ? data.chefBusinessHoursToTime : '20:00:00'
      );
      setLincenseNumber(
        util.isStringEmpty(data.chefDrivingLicenseNo) ? data.chefDrivingLicenseNo : ''
      );
      setMinimumBooking(
        util.isStringEmpty(data.minimumNoOfMinutesForBooking)
          ? data.minimumNoOfMinutesForBooking / 60
          : ''
      );
      // setChefProfileExtendedsByChefId(data.chefProfileExtendedId ? data.chefProfileExtendedId : '');
    }
  }, [props]);

  //for updating chef details
  const [updateChefDetails, { data,error }] = useMutation(UPDATE_CHEF_DATA, {
    onCompleted: data => {
      toastMessage(success, s.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });
  if(error){
    toastMessage('error',error)
  }
  //when onchaning value of fields
  function onChangeValue(event, stateAssign) {
    try {
      if (util.isObjectEmpty(event)) {
        stateAssign(event.target.value);
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }
  //when saving data
  function onSaveData() {
    try {
      if (businessHourStartTime < businessHourEndTime) {
        let startTime = calcluateMin(businessHourStartTime);
        let endTime = calcluateMin(businessHourEndTime);
        let diffHours = (endTime - startTime) / 60;
        if (minimumBooking) {
          if (diffHours >= minimumBooking) {
            qglCall();
          } else {
            let hourData = minimumBooking === 1 ? s.HOUR : s.HOURS;
            let alert =
              s.MINIMUM_HOUR + ' ' + minimumBooking + ' ' + hourData + ' ' + s.MINIMUM_HOUR_ALERT;
            toastMessage(renderError, alert);
          }
        } else {
          qglCall();
        }
      } else {
        toastMessage(renderError, s.DATE_AVAILABLE);
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }
  //Call gql for save data
  function qglCall() {
    if (price) {
      let variables = {
        chefProfileExtendedId: extendedId,
        chefDesc: description,
        chefExperience: experience.toString(),
        chefDrivingLicenseNo: lincenseNumber,
        chefFacebookUrl: facebookUrl,
        chefTwitterUrl: twitterUrl,
        chefPricePerHour: parseInt(price),
        chefPriceUnit: 'USD',
        chefBusinessHoursFromTime: businessHourStartTime,
        chefBusinessHoursToTime: businessHourEndTime,
        minimumNoOfMinutesForBooking: minimumBooking ? minimumBooking * 60 : null,
      };
      updateChefDetails({
        variables,
      });
    } else {
      toastMessage('error', 'Please fill service cost');
    }
  }

  //calculate mins
  function calcluateMin(value) {
    let hour = convert12to24Hours(value, 'Hours');
    let min = convert12to24Hours(value, 'Mins');
    let totalMins = parseInt(hour) * 60 + parseInt(min);
    return totalMins;
  }

  //render time picker (start and end time picker)
  function renderTimePicker(value, stateAssign, type) {
    try {
      return (
        <TimePicker
          theme="classic"
          time={value}
          withoutIcon={true}
          timeConfig={{
            from: type === 'end' ? value : 1,
            to: 24,
            step: 30,
          }}
          timeMode="12"
          timeFormatter={({ hour, minute, meridiem }) => {
            if (hour == '00') {
              return `12:${minute} ${meridiem}`;
            } else {
              return `${hour}:${minute} ${meridiem}`;
            }
          }}
          onTimeChange={event => onChangeAvailabilityTime(event, stateAssign, type)}
        />
      );
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  //when changing times in picker
  function onChangeAvailabilityTime(event, stateValue, type) {
    try {
      const { hour, minute, meridiem } = event;
      //convert 12 hours format time to 24 hours format
      let fromTime = convert12to24Format(`${hour}:${minute} ${meridiem}`);

      //if start time
      if (type === 'start') {
        let toTime = null;
        if (minute == '30') {
          if (hour == '11' && meridiem == 'AM') {
            toTime = convert12to24Format(`${parseInt(hour) + 1}:${parseInt(minute) - 30} PM`);
          } else if (hour == '11' && meridiem == 'PM') {
            toTime = convert12to24Format(`${parseInt(hour) + 1}:${parseInt(minute) - 30} AM`);
          } else {
            toTime = convert12to24Format(
              `${parseInt(hour) + 1}:${parseInt(minute) - 30} ${meridiem}`
            );
          }
        } else {
          toTime = convert12to24Format(`${parseInt(hour)}:${parseInt(minute) + 30} ${meridiem}`);
        }

        stateValue(fromTime);
        setBusinessHourEndTime(toTime);
      }
      //if end time
      else if (type === 'end') {
        stateValue(fromTime);
      }
    } catch (err) {
      toastMessage(renderError, error.message);
    }
  }

  //To validate time value
  useEffect(() => {
    if (
      businessHourStartTime != '' &&
      businessHourStartTime !== null &&
      businessHourEndTime != '' &&
      businessHourEndTime != null &&
      businessHourStartTime >= businessHourEndTime
    ) {
      toastMessage(error, `Please select time greater than start time`);
    }
  }, [businessHourStartTime, businessHourEndTime]);

  try {
    return (
      <section className="products-collections-area ptb-60 ProfileSetup">
        <form className="login-form">
          <div className="row">
            <div className="col-sm-12">
              <div className="login-content">
                <div className="container">
                  <div className="signup-content">
                    <div className="section-title">
                      <h2>Chef Profile</h2>
                    </div>
                    <form className="signup-form">
                      <div className="form-group">
                        <label>{s.EXPERIENCE}</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter your experience"
                          id="name"
                          name="name"
                          required={true}
                          value={experience}
                          data-error="Please enter your experience"
                          onChange={event => onChangeValue(event, setexperience)}
                        />
                      </div>

                      {/* <div className="form-group">
                        <label htmlFor="comment">{s.DESCRIPTION}</label>
                        <textarea
                          style={{
                            height: '85px',
                            paddingBottom: 10,
                            paddingTop: 10,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          id="comment"
                          className="form-control"
                          rows="8"
                          placeholder="Enter your description"
                          required={true}
                          value={description}
                          data-error="Please enter your experience"
                          onChange={event => onChangeValue(event, setDescription)}
                        />
                      </div> */}

                      <div className="form-group">
                        <label>SERVICE COST</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="$"
                          id="name"
                          required
                          name="name"
                          value={price}
                          data-error="Please enter amount"
                          onChange={event => onChangeValue(event, setPrice)}
                        />
                        <p>(Example : $20)</p>
                      </div>

                      <div className="form-group">
                        <label>Business Hours</label>
                        <div className="row">
                          <div className="col-sm-6">
                            {renderTimePicker(
                              businessHourStartTime,
                              setBusinessHourStartTime,
                              'start'
                            )}
                          </div>
                          <div className="col-sm-6">
                            {' '}
                            {renderTimePicker(businessHourEndTime, setBusinessHourEndTime, 'end')}
                          </div>
                        </div>

                        {/* <input
                          type="number"
                          className="form-control"
                          placeholder="Enter amount"
                          id="name"
                          name="name"
                          required={true}
                          value={price}
                          data-error="Please enter amount"
                          onChange={event => onChangeValue(event, setPrice)}
                        /> */}
                      </div>

                      <div className="form-group">
                        <label>{s.FACEBOOK_URL}</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your facebook page url"
                          id="name"
                          name="name"
                          value={facebookUrl}
                          onChange={event => onChangeValue(event, setFacebookUrl)}
                        />
                      </div>
                      <div className="form-group">
                        <label>{s.TWITTER_URL}</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your twitter page url"
                          id="name"
                          name="name"
                          value={twitterUrl}
                          onChange={event => onChangeValue(event, setTwitterUrl)}
                        />
                      </div>
                      <div className="form-group">
                        <label>{s.LICENCE_NUMBER}</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter driving license number"
                          id="name"
                          name="name"
                          value={lincenseNumber}
                          onChange={event => onChangeValue(event, setLincenseNumber)}
                        />
                      </div>
                      <div className="form-group">
                        <label>{s.MINIMUN_HOUR_BOOKING}</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter minimnum number of booking"
                          required
                          id="name"
                          name="name"
                          value={minimumBooking}
                          onChange={event => onChangeValue(event, setMinimumBooking)}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className="saveButton">
          <button type="button" className="btn btn-primary" onClick={() => onSaveData()}>
            {s.SAVE}
          </button>
        </div>
      </section>
    );
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

export default Description;
