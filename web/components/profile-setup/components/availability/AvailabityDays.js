import React, { useState, useEffect, useContext } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { cloneDeep } from 'lodash';
import TimePicker from 'react-times';
// use material theme
import 'react-times/css/material/default.css';
// or you can use classic theme
import 'react-times/css/classic/default.css';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import AvailabilityCalendar from './AvailabilityCalendar';
import UnAvailabiltyModal from './UnAvailabilityModal';
import * as gqlTag from '../../../../common/gql';
import { availabilityDays } from '../../const/Availability';
import * as util from '../../../../utils/checkEmptycondition';
import { toastMessage, error, renderError, success } from '../../../../utils/Toast';
import { loginTo } from './Navigation';
import {
  initialStartTime,
  convert12to24Format,
  convert12to24Hours,
  endTimeLimit,
} from '../../../../utils/DateTimeFormat';
import {
  getChefId,
  getCustomerId,
  chefId,
  chef,
  customer,
  getUserTypeRole,
  customerId,
} from '../../../../utils/UserType';
import s from '../../ProfileSetup.String';
import { AppContext } from '../../../../context/appContext';
import { futureMonthReversed, fromDateReversed } from '../../../../utils/DateTimeFormat';
import { StoreInLocal, GetValueFromLocal } from '../../../../utils/LocalStorage';

const getChefAvailabilityData = gqlTag.query.availability.listChefAvailabilityForWeekGQLTAG;
const updateChefAvailabilityData = gqlTag.mutation.chef.updateAvailabilityGQLTAG;
const getChefUnavailibility = gqlTag.query.availability.listChefNotAvailabilityGQLTAG;

//getting chef availability for weeks
const UPDATE_CHEF_AVAILABILITY = gql`
  ${updateChefAvailabilityData}
`;

//for updating specialization
const GET_CHEF_AVAILABILITY = gql`
  ${getChefAvailabilityData}
`;

const availabilitySubscription = gqlTag.subscription.chef.availabilityGQLTAG;
const AVAILABILITY_SUBSCRIPTION = gql`
  ${availabilitySubscription}
`;

const GET_CHEF_UNAVAILABILITY = gql`
  ${getChefUnavailibility}
`;

//update screen
const updateScreens = gqlTag.mutation.chef.updateScreensGQLTAG;

const UPDATE_SCREENS = gql`
  ${updateScreens}
`;

const AvailabilityDays = props => {
  const [showNotAvailabity, setShowNotAvailabity] = useState(false);
  const [availabilityDaysData, setAvailabilityDaysData] = useState(availabilityDays);
  const [chefIdValue, setChefId] = useState(null);
  const [minimumBooking, setMinimumBooking] = useState();
  const [state, setState] = useContext(AppContext);
  const [fromTimeValue, setFromTimeValue] = useState(null);
  const [unAvailableData, setUnAvailableData] = useState(null);

  //getting chef availability days based on chef_id
  const [getChefAvailability, dataValue] = useLazyQuery(GET_CHEF_AVAILABILITY, {
    variables: {
      chefId: util.isStringEmpty(props.currentChefId) ? props.currentChefId : null,
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  //getting chef availaibity data
  const [getChefUnAvailabilityData, unavailableData] = useLazyQuery(GET_CHEF_UNAVAILABILITY, {
    variables: {
      chefId: props.currentChefId,
      fromDate: fromDateReversed(),
      toDate: futureMonthReversed(),
      offset: 0,
      first: 100,
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  //update chef availability days
  const [updateChefAvailability, { data }] = useMutation(UPDATE_CHEF_AVAILABILITY, {
    onCompleted: data => {
      if (props.screen && props.screen === 'register') {
        // To get the updated screens value
        let screensValue = [];
        GetValueFromLocal('SharedProfileScreens')
          .then(result => {
            if (result && result.length > 0) {
              screensValue = result;
            }
            screensValue.push('AVAILABILITY');
            screensValue = _.uniq(screensValue);
            let variables = {
              chefId: props.currentChefId,
              chefUpdatedScreens: screensValue,
            };
            updateScreenTag({ variables });
            if (props && props.nextStep) {
              props.nextStep();
            }
            StoreInLocal('SharedProfileScreens', screensValue);
          })
          .catch(err => {
            console.log('err', err);
          });
      }
      toastMessage(success, 'Availability saved Successfully');
    },
    onError: err => {
      toastMessage(renderError, err);
    },
  });

  const [updateScreenTag, { loading, error }] = useMutation(UPDATE_SCREENS, {
    onCompleted: data => {
      // toastMessage(success, 'Favourite cuisines updated successfully');
    },
    onError: err => {},
  });

  const { customerAvailabilitySubs } = useSubscription(AVAILABILITY_SUBSCRIPTION, {
    variables: { chefId: chefIdValue },
    onSubscriptionData: res => {
      // console.log("res", res)
      if (res.subscriptionData.data.chefAvailabilityProfile) {
        getChefAvailability();
      }
    },
  });

  //set chef data after getting from backend
  useEffect(() => {
    if (
      util.isObjectEmpty(unavailableData) &&
      util.isObjectEmpty(unavailableData.data) &&
      util.isObjectEmpty(unavailableData.data.allChefNotAvailabilityProfiles) &&
      util.isArrayEmpty(unavailableData.data.allChefNotAvailabilityProfiles.nodes)
    ) {
      let chefData = [];
      let details = unavailableData.data.allChefNotAvailabilityProfiles.nodes;
      let dowCount = 0;
      //pushed data based on calendar objects
      details.map((res, index) => {
        if (util.isObjectEmpty(res) && util.isStringEmpty(res.chefNotAvailDate)) {
          let data = {
            title: res.chefNotAvailDate,
            dow: dowCount++,
            checkedValue: false,
            id: res.chefNotAvailId,
          };
          chefData.push(data);
        }
      });
      setUnAvailableData(chefData);
    }
  }, [unavailableData]);

  //get chef id
  useEffect(() => {
    //get user role
    getChefUnAvailabilityData();
    getUserTypeRole()
      .then(async res => {
        if (res === chef) {
          getChefId(chefId)
            .then(chefResult => {
              setChefId(chefResult);
              getChefAvailability();
            })
            .catch(err => {});
        }
      })
      .catch(err => {});
  }, []);
  //getting chef saved availability days from backend
  useEffect(() => {
    // if(util.hasProperty(dataValue,'error')&&

    // util.isStringEmpty(dataValue.error)){
    //   toastMessage('error',error)
    // }
    if (
      util.isObjectEmpty(dataValue) &&
      util.hasProperty(dataValue, 'data') &&
      util.isObjectEmpty(dataValue.data) &&
      util.hasProperty(dataValue.data, 'allChefAvailabilityProfiles') &&
      util.isObjectEmpty(dataValue.data.allChefAvailabilityProfiles) &&
      util.isArrayEmpty(dataValue.data.allChefAvailabilityProfiles.nodes)
    ) {
      let data = cloneDeep(availabilityDaysData);
      // console.log('daslkdjlakjsdlk123123123', availabilityDaysData);
      //compare all days with already saved days of chef (to set checkbox true ,start & end time)
      availabilityDaysData.map((res, index) => {
        dataValue.data.allChefAvailabilityProfiles.nodes.map((chefRes, key) => {
          if (parseInt(chefRes.chefAvailDow) === res.dow) {
            data[index].checkedValue = true;
            data[index].fromTime = chefRes.chefAvailFromTime;
            data[index].toTime = chefRes.chefAvailToTime;
          }
        });
        setAvailabilityDaysData(data);
      });
    }
  }, [dataValue]);

  //set minimum hours
  useEffect(() => {
    if (
      util.isObjectEmpty(state) &&
      util.isObjectEmpty(state.chefProfile) &&
      util.isObjectEmpty(state.chefProfile) &&
      util.hasProperty(state.chefProfile, 'chefProfileExtendedsByChefId') &&
      util.isObjectEmpty(state.chefProfile.chefProfileExtendedsByChefId) &&
      util.hasProperty(state.chefProfile.chefProfileExtendedsByChefId, 'nodes') &&
      util.isObjectEmpty(state.chefProfile.chefProfileExtendedsByChefId.nodes[0])
    ) {
      let data = state.chefProfile.chefProfileExtendedsByChefId.nodes[0];
      setMinimumBooking(
        util.isStringEmpty(data.minimumNoOfMinutesForBooking)
          ? data.minimumNoOfMinutesForBooking / 60
          : ''
      );
    }
  }, [state]);

  //render time picker (start and end time picker)
  function renderTimePicker(value, option, index) {
    try {
      return (
        <TimePicker
          theme="classic"
          time={value}
          withoutIcon={true}
          timeConfig={{
            from: option === 1,
            to: 24,
            step: 5,
          }}
          timeFormatter={({ hour, minute, meridiem }) => {
            if (hour == '00') {
              return `12:${minute} ${meridiem}`;
            } else {
              return `${hour}:${minute} ${meridiem}`;
            }
          }}
          timeMode="12"
          onTimeChange={event => onChangeAvailabilityTime(event, option, index)}
        />
      );
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  //when selecting / unselecting days
  function onChangeDays(value, indexValue) {
    try {
      if (util.isObjectEmpty(value)) {
        let data = cloneDeep(availabilityDaysData);
        data[indexValue].checkedValue = value.target.checked;
        setAvailabilityDaysData(data);
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  //when changing times in picker
  function onChangeAvailabilityTime(event, option, indexValue) {
    try {
      const { hour, minute, meridiem } = event;
      //convert 12 hours format time to 24 hours format
      let fromTime = convert12to24Format(`${hour}:${minute} ${meridiem}`);
      let data = cloneDeep(availabilityDaysData);
      //if start time
      if (option === 'startTime') {
        let toTime = null;

        // if (minute == '30') {
        //   if (hour == '11' && meridiem == 'AM') {
        //     toTime = convert12to24Format(`${parseInt(hour) + 1}:${parseInt(minute) - 30} PM`);
        //   } else if (hour == '11' && meridiem == 'PM') {
        //     toTime = convert12to24Format(`${parseInt(hour) + 1}:${parseInt(minute) - 30} AM`);
        //   } else {
        //     toTime = convert12to24Format(
        //       `${parseInt(hour) + 1}:${parseInt(minute) - 30} ${meridiem}`
        //     );
        //   }
        // } else {
        //   toTime = convert12to24Format(`${parseInt(hour)}:${parseInt(minute) + 30} ${meridiem}`);
        // }

        // toTime = convert12to24Format(`${parseInt(hour)}:${parseInt(minute) + 5} ${meridiem}`);
        if (fromTime >= data[indexValue].toTime) {
          toastMessage(renderError, 'Form time should be less than To time');
          data[indexValue].fromTime = data[indexValue].fromTime;
        } else {
          data[indexValue].fromTime = fromTime;
        }
        // data[indexValue].toTime = toTime;

        //if end time
      } else if (option === 'endTime') {
        if (fromTime <= data[indexValue].fromTime) {
          toastMessage(renderError, s.TIME_AVAILABLE);
          data[indexValue].toTime = data[indexValue].toTime;
        } else {
          data[indexValue].toTime = fromTime;
        }
      }
      setAvailabilityDaysData(data);
    } catch (err) {
      toastMessage(renderError, error.message);
    }
  }

  //when selecting unavailabl days
  function onSelectNotAvailability() {
    try {
      setShowNotAvailabity(true);
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }
  // console.log('rrrrrrrrrrrrrrr', minimumBooking, state);
  //when saving availability days
  function handleSubmit() {
    let isAnyDateSelected = false;
    try {
      if (util.isArrayEmpty(availabilityDaysData)) {
        let data = [];
        let checkedData = true;
        let checkedData1 = true;
        availabilityDaysData.map(res => {
          if (util.isObjectEmpty(res)) {
            if (res.fromTime < res.toTime) {
              let startTime = calcluateMin(res.fromTime);
              let endTime = calcluateMin(res.toTime);
              let diffHours = (endTime - startTime) / 60;
              if (minimumBooking) {
                if (diffHours >= minimumBooking) {
                  let option = {
                    dow: res.dow,
                    fromTime: res.fromTime,
                    toTime: res.toTime,
                    type: res.checkedValue === false ? 'NOT_AVAILABLE' : 'AVAILABLE',
                  };
                  data.push(option);
                } else {
                  checkedData1 = false;
                }
              } else {
                let option = {
                  dow: res.dow,
                  fromTime: res.fromTime,
                  toTime: res.toTime,
                  type: res.checkedValue === false ? 'NOT_AVAILABLE' : 'AVAILABLE',
                };
                data.push(option);
              }
            } else {
              checkedData = false;
            }
          }
          if (res.checkedValue) {
            isAnyDateSelected = true;
          }
        });
        // console.log('checkedData', checkedData);
        if (checkedData === true && checkedData1 === true) {
          if (isAnyDateSelected)
            updateChefAvailability({
              variables: {
                pChefId: util.isStringEmpty(props.currentChefId) ? props.currentChefId : null,
                pData: util.isArrayEmpty(data) ? JSON.stringify(data) : [],
              },
            });
          else toastMessage('error', 'Please select any one availability day');
        } else {
          if (checkedData1 === false) {
            let hourData = minimumBooking === 1 ? s.HOUR : s.HOURS;
            let alert =
              s.MINIMUM_HOUR + ' ' + minimumBooking + ' ' + hourData + ' ' + s.MINIMUM_HOUR_ALERT;
            toastMessage(renderError, alert);
          } else if (checkedData === false) {
            toastMessage(renderError, s.DATE_AVAILABLE);
          }
        }
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  //calculate mins
  function calcluateMin(value) {
    let hour = convert12to24Hours(value, 'Hours');
    let min = convert12to24Hours(value, 'Mins');
    let totalMins = parseInt(hour) * 60 + parseInt(min);
    return totalMins;
  }

  //when closinf unavailable calendar
  function onCloseCalendar() {
    try {
      setShowNotAvailabity(false);
      getChefUnAvailabilityData();
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  return (
    <React.Fragment>
      <div>
        <br />
        {showNotAvailabity === false && (
          <div style={{ paddingLeft: '2%' }}>
            <div>
              <h5 style={{ color: '#08AB93' }}>Availability Days</h5>
              <p style={{ fontSize: '17px' }}>Please provide your general availability.</p>
              <div style={{ fontWeight: 'bold' }}>Unavailable days:</div>
              <div>
                {unAvailableData &&
                  unAvailableData.map((res, index) => {
                    return (
                      <div className="row">
                        <div className="col-sm-8">
                          <div className="buy-checkbox-btn" id="checkBoxView">
                            <div className="item">
                              {/* <input
                            className="inp-cbx"
                            id={res.dow}
                            type="checkbox"
                            checked={
                              util.isBooleanEmpty(res.checkedValue) ? res.checkedValue : false
                            }
                            onChange={value => onChangeDays(value, index)}
                          /> */}
                              {/* <label className="cbx" htmlFor={res.dow}> */}
                              {/* <span id="checkboxStyle">
                              <svg width="12px" height="10px" viewBox="0 0 12 10">
                                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                              </svg>
                            </span> */}
                              <span style={{ fontSize: '14px' }}>{res.title}</span>
                              {/* </label> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <p className="nonAvailability-shared" onClick={() => onSelectNotAvailability()}>
                Set unavailable days
              </p>
            </div>
            <section className="blog-details-area ptb-30" style={{ paddingBottom: '50px' }}>
              <div className="container">
                {availabilityDaysData &&
                  availabilityDaysData.map((res, index) => {
                    return (
                      <div className="row" id="availabilityRow">
                        {/* checkbox */}
                        <div
                          className="col-sm-4"
                          style={{ paddingLeft: '0px', paddingRight: '0px' }}
                        >
                          <div className="buy-checkbox-btn" id="checkBoxView">
                            <div className="item">
                              <input
                                className="inp-cbx"
                                id={res.dow}
                                type="checkbox"
                                checked={
                                  util.isBooleanEmpty(res.checkedValue) ? res.checkedValue : false
                                }
                                onChange={value => onChangeDays(value, index)}
                              />
                              <label className="cbx" htmlFor={res.dow}>
                                <span>
                                  <svg width="12px" height="10px" viewBox="0 0 12 10">
                                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                  </svg>
                                </span>
                                <span>{res.title}</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        {/* start time */}
                        <div
                          className="col-sm-4"
                          style={{ paddingLeft: '0px', paddingRight: '2%' }}
                        >
                          {renderTimePicker(res.fromTime, 'startTime', index)}
                        </div>
                        {/* end time */}
                        <div
                          className="col-sm-4"
                          style={{ paddingLeft: '0px', paddingRight: '2%' }}
                        >
                          {renderTimePicker(res.toTime, 'endTime', index)}
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="basicInfoSave" style={{ paddingRight: '2%' }}>
                <button type="submit" onClick={() => handleSubmit()} className="btn btn-primary">
                  Save
                </button>
              </div>
            </section>
          </div>
        )}

        {/* unavailable calendar */}
        {showNotAvailabity === true && (
          // <AvailabilityCalendar
          //   calendarFrom="chefEditProfile"
          //   currentChefIdValue={props.currentChefId}
          //   onCloseCalendar={onCloseCalendar}
          // />
          <UnAvailabiltyModal
            calendarFrom="chefEditProfile"
            currentChefIdValue={props.currentChefId}
            onCloseCalendar={onCloseCalendar}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default AvailabilityDays;
