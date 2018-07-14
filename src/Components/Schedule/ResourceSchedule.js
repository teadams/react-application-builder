import React from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import 'react-big-calendar/lib/css/react-big-calendar.css'

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))
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


class ResourceSchedule extends React.Component {
  constructor(props) {
      super(props)
      this.state  = {
        resource_list: [],
        event_list: []
      }
  }

  componentDidMount() {
    const { resource_object_type} = this.props;
    data.getData (resource_object_type, "", (resource_list, error) => {
            this.setState({ resource_list: resource_list})
    })
  }
  
  render() {
    const { resource_object_type} = this.props;

    alert ("resource list is " + JSON.stringify(this.state.resource_list))
    return (
    <div style={{height:"600px",margin:"20px"}}> 
    <BigCalendar
      events={events}
      defaultView={BigCalendar.Views.DAY}
      views={['day', 'week']}
      step={60}
      showMultiDayTimes
      defaultDate={new Date(2018, 6, 1)}
      resources={this.state.resource_list}
      resourceIdAccessor="{meta.keys(resource_object_type).key_id}"
      resourceTitleAccessor="first_name"
      />
  </div>
  )
}
}

export default ResourceSchedule