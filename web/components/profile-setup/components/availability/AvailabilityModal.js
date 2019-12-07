import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import moment from 'moment';
import TimePicker from 'react-times';
// use material theme
import 'react-times/css/material/default.css';
// or you can use classic theme
import 'react-times/css/classic/default.css';
import { toastMessage, error, renderError } from '../../../../utils/Toast';
import * as util from '../../../../utils/checkEmptycondition';
import {
  initialStartTime,
  getCurrentDate,
  convert12to24Format,
  getDateFormat,
} from '../../../../utils/DateTimeFormat';
import s from '../../ProfileSetup.String';

const AvailabilityModal = props => {
  const [_isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(props.isOpenAvailabiltyModal);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialStartTime);
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState(null);

  //get selected date in calendar to show in modal
  useEffect(() => {
    if (util.isObjectEmpty(props.selectedSlotData)) {
      //set selected start date
      setSelectedDate(
        util.isStringEmpty(props.selectedSlotData.startTime)
          ? props.selectedSlotData.startTime
          : getCurrentDate()
      );
    }
  }, [props.selectedSlotData]);

  //render time picker (start and end time picker)
  function renderTimePicker(value, stateAssign, type) {
    try {
      return (
        <TimePicker
          theme="classic"
          time={value}
          withoutIcon={true}
          timeConfig={{
            from: 1,
            to: 24,
            step: 30,
          }}
          timeMode="12"
          // timeFormat="AM"
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
      var convertedTime = convert12to24Format(`${hour}:${minute} ${meridiem}`);
      stateValue(convertedTime);
      if (type === 'start') {
        var convertedTime1 = convert12to24Format(`${parseInt(hour) + 1}:${minute} ${meridiem}`);
        setEndTime(convertedTime1);
      }
    } catch (err) {
      toastMessage(renderError, error.message);
    }
  }

  //when onchaning value of fields (notes)
  function onChangeValue(event, stateAssign) {
    try {
      if (util.isObjectEmpty(event)) {
        stateAssign(event.target.value);
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  //when saving
  function onSaveTime() {
    try {
      if (startTime < endTime) {
        if (props.onSaveAvailability) {
          props.onSaveAvailability(getDateFormat(selectedDate), startTime, endTime, notes);
        }
      } else {
        toastMessage(renderError, s.DATE_AVAILABLE);
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  //when closing modal
  function closeModal() {
    try {
      if (props.onCloseModal) {
        props.onCloseModal();
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  //To validate time
  useEffect(() => {
    if (endTime <= startTime) {
      toastMessage(error, s.DATE_AVAILABLE);
    }
  }, [startTime, endTime]);
  try {
    return (
      <div className={`bts-popup ${open ? 'is-visible' : ''}`} role="alert">
        <div className="bts-popup-container">
          <p className="availabilityModalDate">{moment(selectedDate).format('DD/MM/YYYY')}</p>
          <div className="row">
            <div className="col-sm-4">
              <p>Start Time</p>
            </div>
            <div className="col-sm-8">{renderTimePicker(startTime, setStartTime, 'start')}</div>
          </div>
          <div className="row" id="AvailabilityModalRow">
            <div className="col-sm-4">
              <p>End Time</p>
            </div>

            <div className="col-sm-8">{renderTimePicker(endTime, setEndTime, 'end')}</div>
          </div>

          <div className="row" id="AvailabilityModalRow">
            <div className="col-sm-4">
              <p>Notes</p>
            </div>
            <div className="col-sm-8">
              <div className="form-group">
                <textarea
                  id="comment"
                  className="form-control"
                  rows="8"
                  required={true}
                  data-error="Please enter your experience"
                  onChange={event => onChangeValue(event, setNotes)}
                />
              </div>
            </div>
          </div>

          <div className="availabilityModalSaveButton">
            <button type="submit" className="btn btn-primary" onClick={() => onSaveTime()}>
              Save
            </button>
          </div>
          <Link href="#">
            <a onClick={() => closeModal()} className="bts-popup-close"></a>
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

export default AvailabilityModal;
