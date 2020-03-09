import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toastMessage } from '../../../utils/Toast';
import { convertDateandTime } from '../../../utils/DateTimeFormat';
const localizer = momentLocalizer(moment);
const now = new Date();

let clickValue = 0;

// Appointment title view(text inside appt)
function EventView({ event }) {
  return null;
}

const BookingCalendar = props => {
  const [myEventsList, setMyEventList] = useState([]);

  useEffect(() => {
    let count = 0,
      data = [];
    if (props.RequestAvailableDate) {
      props.RequestAvailableDate.map(dateValue => {
        let eventObj = {
          id: count,
          title: 'All Day Event very long title',
          allDay: true,
          start: new Date(dateValue),
          end: new Date(dateValue),
        };
        count = count + 1;
        data.push(eventObj);
      });
      setMyEventList(data);
    }
  }, [props.RequestAvailableDate]);

  function selectedTimeSlot(slotInfo) {
    let SelectedDate = moment(slotInfo.start).format('YYYY-MM-DD');
    if (props.onChangeCalendar) {
      props.onChangeCalendar(SelectedDate, slotInfo);
    }
  }

  //Callback function for month change
  function monthChange(date) {
    props.onChangeMonth(date);
  }

  try {
    return (
      <React.Fragment>
        <div className="card-body">
          <Calendar
            selectable
            className="bookingRequestCalendar calendarHeigth"
            style={{ width: '100%' }}
            events={myEventsList}
            startAccessor="start"
            endAccessor="end"
            defaultDate={moment().toDate()}
            localizer={localizer}
            views={{ month: true }}
            onNavigate={res => monthChange(res)}
            onSelectSlot={slotInfo => selectedTimeSlot(slotInfo)}
            selectable={true}
            components={{
              month: {
                event: EventView,
              },
            }}
            min={new Date('2017, 1, 7, 08:00')}
            max={new Date('2017, 1, 7, 20:00')}
            onSelectEvent={slotInfo => selectedTimeSlot(slotInfo)}
          />
        </div>
      </React.Fragment>
    );
  } catch (error) {
    toastMessage('renderError', error.message);
  }
};

export default BookingCalendar;
