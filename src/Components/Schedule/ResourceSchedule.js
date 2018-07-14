import React from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))
//import events from '../events'

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

const events = [
  {
    id: 0,
    title: 'All Day Event very long title',
    allDay: true,
    start: new Date(2018, 6, 14),
    end: new Date(2018, 6, 14),
  }
]

let ResourceSchedule = () => (
  <div style={{height:"600px",margin:"20px"}}> 
  <BigCalendar
    height="600"
    events={events}
    views={allViews}
    step={60}
    showMultiDayTimes
    defaultDate={new Date(2018, 6, 1)}
  />
</div>
)

export default ResourceSchedule