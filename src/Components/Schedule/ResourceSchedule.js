import React from 'react'
import BigCalendar from 'react-big-calendar'
import { Typography} from '@material-ui/core'

import moment from 'moment'
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import 'react-big-calendar/lib/css/react-big-calendar.css'

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))
let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])


let MyCustomHeader = () => (
  <div>
    CUSTOM HEADER:

     BUTTOn
  </div>
)

class ResourceSchedule extends React.Component {
  constructor(props) {
      super(props)
      const calendar_date = new Date();
      this.state  = {
        resource_list: [],
        event_list: [],
        calendar_date: calendar_date
      }
      this.onNavigate = this.onNavigate.bind(this);
      this.getResourceList = this.getResourceList.bind(this);
      this.getEventList = this.getEventList.bind(this);
  }

  onNavigate(date) {
    this.setState({ calendar_date: date, foo:"123"})
//    alert ('on navigate ' + date)
  }
  getResourceList () {
    const { resource_object_type} = this.props;
    data.getData (resource_object_type, "", (resource_list, error) => {
          resource_list.forEach((resource, index, resource_list) => {

              resource_list[index]["resourceIDAccessor"] = resource[meta.keys(resource_object_type).key_id]

              resource_list[index]["resourceTitleAccessor"] = meta.get_display_value(resource_object_type, meta.keys(resource_object_type).pretty_key_id, resource)  
//resource_list[index]["resourceTitleAccessor"] = "<Typography variant='headline' >HELLO</Typography>"
         
          })
            this.setState({ resource_list: resource_list})
    })
  }

  getEventList() {
    const {calendar_date} = this.state;
    const calendar_date_sunday = moment(calendar_date).subtract(calendar_date.getDay(),'days');
    //alert ("sunday is " + calendar_date_sunday.format("dddd, MMMM Do YYYY, h:mm:ss a"))

//    const calendar_year = calendar_date.getFullYear();
//    const calendar_month = calendar_date.getMonth();
//    const calendar_day = calendar_date.getDate();
//    const calendar_dow = calendar_date.getDay();
    let event_list = []

//      alert ("day of week is " + calendar_dow)
    data.getData ("schedule_resource_base", "", (schedule, error) => {

          if (error) {
              alert ('error is ' + error.message)
          }
          schedule.forEach((event, index, schedule) => {
            //  const event_year = '1999'
            //  const event_month ='2'
            //  const event_day ='2'
              let event_date = moment(calendar_date_sunday).add(event.day_of_week,'days');
            //  alert ('event date is'  + event_date)
              let event_year = event_date.year();
              let event_month = event_date.month();
              let event_day = event_date.date();
            //  alert ('event date is ' + event_year + ' ' + event_month + ' ' + event_day)
              const start_hour = (event.start_am_pm == "PM")?(event.start_hour+12): event.start_hour
              const end_hour = (event.end_am_pm == "PM")?(event.end_hour+12): event.end_hour
              event_list.push ( {
                  id: index,
                  title: 'Base',
                  allDay: false,
                  start: new Date(event_year, event_month, event_day, start_hour,event.start_minute, 0),
                  end: new Date(event_year, event_month, event_day, end_hour, event.end_minute, 0),
                  resourceId: event.employee
              })
          })
//          alert ('event_list is ' + JSON.stringify(event_list))
          this.setState({ event_list: event_list})
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  //    alert ('component did update')
      if (this.state.calendar_date !== prevState.calendar_date) {
    //    alert ("getting event list")
        this.getEventList();  
      }
  }

  componentDidMount() {
      this.getResourceList();
      this.getEventList();
  }
  
  render() {
    //alert ('render ' + this.state.foo)
    const { resource_object_type} = this.props;
    const components = {
      day: {
        header: MyCustomHeader,
      }
    }
const TimeGutter = () => <p>Custom gutter text</p>
  //  alert ('events is ' + JSON.stringify(this.state.event_list))
//    alert ("resource list is " + JSON.stringify(this.state.resource_list))
    return (
    <div style={{height:"600px",margin:"20px"}}> 
    <BigCalendar
      events={this.state.event_list}
      defaultView={BigCalendar.Views.DAY}
  popup
      views={['day', 'week']}
      step={60}
      showMultiDayTimes
      components={{
        timeGutterHeader: TimeGutter,
      }}
      defaultDate={this.state.calendar_date}
  //    resources={this.state.resource_list}
  //    resourceIdAccessor="resourceIDAccessor"
  //    resourceTitleAccessor="resourceTitleAccessor"
      onNavigate={this.onNavigate}
      />
  </div>
  )
}
}

export default ResourceSchedule