/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable prefer-template */
/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import {
  getReservationsByResource,
  addReservations
} from "../../actions/reservation-action/action";

const mapStateToProps = state => {
  return {
    reservations: state.reservationReducer.calendarState.reservations,
    resourceId: state.reservationReducer.calendarState.resourceId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadReservations: resourceId =>
      dispatch(getReservationsByResource(resourceId)),
    addReservation: reservation => dispatch(addReservations(reservation))
  };
};

const Calendar = ({
  reservations,
  resourceId,
  loadReservations,
  addReservation
}) => {
  // eslint-disable-next-line no-unused-vars
  const [calendarWeekends, SetCalendarWeekends] = useState(true);
  const [calendarEvents, SetCalendarEvents] = useState([
    { title: "Event Now", start: new Date() }
  ]);
  const calendarComponentRef = React.createRef();

  useEffect(() => {
    loadReservations("5dbb45b226c6e640dc563ba0");
  }, []);

  /*
  const toggleWeekends = () => {
    SetCalendarWeekends(!calendarWeekends);
  };

 
  const gotoPast = () => {
    const calendarApi = calendarComponentRef.current.getApi();
    calendarApi.gotoDate("2000-01-01"); // call a method on the Calendar object
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

    // change the border color just for fun
  };

  return (
    <div className="demo-app">
      <div className="demo-app-calendar">
        <FullCalendar
          defaultView="timeGridWeek"
          header={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek"
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
          height="parent"
          firstDay={1}
          eventClick={eventClick}
        />
      </div>
    </div>
  );
};

const ConnectedCalendar = connect(
  mapStateToProps,
  mapDispatchToProps
)(Calendar);

export default ConnectedCalendar;
