/* eslint-disable react/button-has-type */
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import { Button } from "antd";

const Calendar = () => {
  const [calendarWeekends, SetCalendarWeekends] = useState(true);
  const [calendarEvents, SetCalendarEvents] = useState([
    { title: "Event Now", start: new Date() }
  ]);
  const calendarComponentRef = React.createRef();

  const toggleWeekends = () => {
    SetCalendarWeekends(!calendarWeekends);
  };

  const gotoPast = () => {
    const calendarApi = calendarComponentRef.current.getApi();
    calendarApi.gotoDate("2000-01-01"); // call a method on the Calendar object
  };

  const handleDateClick = arg => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Would you like to add an event to ${arg.dateStr} ?`)) {
      SetCalendarEvents(
        [
          ...calendarEvents,
          {
            title: "New Event",
            start: arg.start,
            end: arg.end,
            allDay: arg.allDay
          }
        ]
        // add new event data
      );
      console.log(calendarEvents);
    }
  };

  return (
    <div className="demo-app">
      <div className="demo-app-top">
        <Button onClick={toggleWeekends}>toggle weekends</Button>
        <Button onClick={gotoPast}>go to a date in the past</Button>
        (also, click a date/time to add an event)
      </div>
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
          events={calendarEvents}
          selectable
          select={handleDateClick}
        />
      </div>
    </div>
  );
};

export default Calendar;
