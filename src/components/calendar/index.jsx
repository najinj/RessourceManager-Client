
/* eslint-disable react/button-has-type */
import React,{useState} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick



const Calendar = () => {
  const [calendarWeekends,SetCalendarWeekends] = useState(true);
  const [calendarEvents,SetCalendarEvents] = useState([
    { title: 'Event Now', start: new Date() }
  ]);
  const calendarComponentRef = React.createRef();

  const toggleWeekends = () => {
    SetCalendarWeekends(!calendarWeekends);
  }

  const gotoPast = () => {
    const calendarApi = calendarComponentRef.current.getApi();
    calendarApi.gotoDate('2000-01-01') // call a method on the Calendar object
  }

  const handleDateClick = (arg) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Would you like to add an event to ${arg.dateStr} ?`)) {
        SetCalendarEvents({  // add new event data
            calendarEvents: calendarEvents.concat({ // creates a new array
              title: 'New Event',
              start: arg.date,
              allDay: arg.allDay
            })
          })
    }
  }


  return (
    <div className='demo-app'>
      <div className='demo-app-top'>
        <button onClick={ toggleWeekends }>toggle weekends</button>
        <button onClick={gotoPast }>go to a date in the past</button>
        (also, click a date/time to add an event)
      </div>
      <div className='demo-app-calendar'>
        <FullCalendar
          defaultView="dayGridMonth"
          header={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
          ref={ calendarComponentRef }
          weekends={ calendarWeekends }
          events={ calendarEvents }
          dateClick={ handleDateClick }
          />
      </div>
    </div>
  )
}


export default Calendar;
