/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable prefer-template */
/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import { Calendar, Select } from "antd";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import {
  getReservationsByResource,
  addReservations
} from "../../actions/reservation-action/action";
import { fetchSpaces } from "../../actions/space-actions/actions";

import "./index.css";

const mapStateToProps = state => {
  return {
    reservations: state.reservationReducer.calendarState.reservations,
    resourceId: state.reservationReducer.calendarState.resourceId,
    spaces: state.spaceReducer.spaces
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadReservations: resourceId =>
      dispatch(getReservationsByResource(resourceId)),
    addReservation: reservation => dispatch(addReservations(reservation)),
    loadSpaces: () => dispatch(fetchSpaces())
  };
};
const { Option } = Select;

const CalendarView = ({
  reservations,
  resourceId,
  loadReservations,
  addReservation,
  loadSpaces,
  spaces
}) => {
  // eslint-disable-next-line no-unused-vars
  const [calendarWeekends, SetCalendarWeekends] = useState(true);
  const [calendarEvents, SetCalendarEvents] = useState([
    { title: "Event Now", start: new Date() }
  ]);
  const calendarComponentRef = React.createRef();

  useEffect(() => {
    loadSpaces();
  }, []);

  const spaceOptions = spaces.map(space => {
    return {
      text: space.name,
      value: space.id
    };
  });

  /*
  const toggleWeekends = () => {
    SetCalendarWeekends(!calendarWeekends);
  };

 
  const gotoPast = () => {
    
  };

*/
  const mappedReservations = reservations.map(reservation => {
    return {
      ...reservation,
      startRecur: null,
      endRecur: null,
      daysOfWeek: null
    };
  });
  const handleDateClick = arg => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Would you like to add an event to ${arg.dateStr} ?`)) {
      SetCalendarEvents(
        [
          ...calendarEvents,
          {
            title: "New Event",
            start: arg.start,
            end: arg.end
          }
        ]
        // add new event data
      );
      console.log(calendarEvents);
      console.log("start", arg.start);
    }
  };
  const eventClick = info => {
    console.log(info.event);
    alert("Event: " + info.event.title);
    alert("Coordinates: " + info.jsEvent.pageX + "," + info.jsEvent.pageY);
    alert("View: " + info.view.type);
  };
  const onPanelChange = (value, mode) => {
    const calendarApi = calendarComponentRef.current.getApi();
    calendarApi.gotoDate(value.format("YYYY-MM-DD")); // call a method on the Calendar object
  };

  const hadnleSpaceChange = value => {
    loadReservations(value);
  };

  return (
    <div className="calendar-container">
      <div className="select-container">
        <div className="space-select-container">
          <Select
            initialValue=""
            style={{ width: 120 }}
            onChange={hadnleSpaceChange}
            placeholder="Select a space"
          >
            {spaceOptions.map(option => (
              <Option value={option.value} key={option.value}>
                {option.text}
              </Option>
            ))}
          </Select>
        </div>
        <div className="monthly-sideview-calendar">
          <Calendar fullscreen={false} onChange={onPanelChange} />
        </div>
      </div>

      <div className="demo-app-calendar">
        <FullCalendar
          defaultView="timeGridWeek"
          header={{
            left: "prev,next today",
            center: "title",
            right: null
          }}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          ref={calendarComponentRef}
          weekends={calendarWeekends}
          events={mappedReservations}
          selectable
          select={handleDateClick}
          allDaySlot={false}
          minTime="08:00:00"
          maxTime="18:00:00"
          height="auto"
          firstDay={1}
          eventClick={eventClick}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          }}
        >
          <div className="fc-right">
            <button
              type="button"
              className="fc-timeGridWeek-button fc-button fc-button-primary fc-button-active"
            >
              week
            </button>
          </div>
        </FullCalendar>
      </div>
    </div>
  );
};

const ConnectedCalendar = connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarView);

export default ConnectedCalendar;
