import React,  {Fragment} from 'react';
import {Paper,  Typography, Button, Grid} from '@material-ui/core';
//import * as meta from '../../Utils/meta.js'
import {Field, ObjectView} from "../Experimental"
import {ProjectHover} from "../NowWeAct"
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import {CreateForm} from "../Layouts/index.js";
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';

class GoogleMap extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
            marker_data: [],
            showInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
        }   
        this.handleMoreClick = this.handleMoreClick.bind(this);
        this.handleCreateProjectOpen = this.handleCreateProjectOpen.bind(this);
        this.handleProjectCreated = this.handleProjectCreated.bind(this);
  }

  handleCreateProjectOpen()  {
    this.setState({create_project_open:true});
  }

  handleProjectCreated(action_text, inserted_id)  {
    this.setState({create_project_open:false});
    this.props.onMenuChange("", 5, inserted_id, this.props.menu_link_field, this.props.link_object_type, this.props.menu_link_reference_field)
  }

  handleMoreClick = event => {
      console.log('button has been clicked')
      alert ('handle clik')
      //this.props.onMore(event, this.props.link_menu_index, this.props.filter_id, this.props.menu_link_field, this.props.link_object_type, this.props.menu_link_reference_field)
  }

  onMouseover = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showInfoWindow: true
  });
  
componentDidMount() {
      log.val('drill down did mount')

      //alert('object type is ' + this.props.object_type)
      data.getData (this.props.object_type, "", (marker_data, error) => {
//  alert ('data is '  + JSON.stringify(marker_data))
             this.setState({ marker_data:marker_data})
  //alert ('after set set')
            //  alert ('maker data is ' + JSON.stringify(marker_data))
      })

  }

  render() {
  //alert ('about  to render object' + JSON.stringify(this.state.marker_data))
//  alert ("market data is "  + this.state.marker_data)

    return (
      <Fragment>
        <Grid container >
          <Grid item  style={{padding:20}}>
          <Typography variant="headline">
           {this.props.title}
          </Typography>
          </Grid>
          <Grid item  style={{padding:20}}> <Button variant="contained" onClick={this.handleCreateProjectOpen}>Create a Project</Button></Grid>
          <Grid item  style={{padding:20}}>
              Number of active Projects:    Number of successful projects:   Number of Volunteers: 
          </Grid>
          </Grid>
        
        {this.state.create_project_open &&
          <CreateForm
            object_type="nwn_project" 
            open={this.state.create_project_open}
            hidden={{leader:true}}
            onClose={this.handleProjectCreated}
            sections="basic"
          />}
        <Typography variant="body1" style={{padding:10}}>
            {this.props.text}
          <Map google={this.props.google} zoom={3}>
            {this.state.marker_data.map(marker => {
            //  alert ("maker is " + JSON.stringify(marker))
              var icon
              if (marker["type_thumbnail"]) {   
                var icon_name = JSON.parse(marker["type_thumbnail"]).name
                var url = "/images/nwn_project_type/thumbnail/"+icon_name
                icon = {}
                icon.url = url;
                icon.scaledSize ={"width":20,"height":20}
              }  else  {
                icon = ""
              }

              var position = {}
              position.lat = marker.latitude
              position.lng = marker.longitude
            
              return (
              <Marker onMouseover={this.onMouseover}
              name={marker.name}
              project_type = {marker.project_type}
              summary = {marker.summary}
              description = {marker.description}
              leader_first_name = {marker.leader_first_name}
              leader_last_name = {marker.leader_last_name}
              full_marker = {marker}
              onMore= {this.props.onMore}
              icon = {icon}


              id = {marker.id}
              position={position}></Marker>
              )
            })}
    
            <InfoWindow maxWidth="100%" marker={this.state.activeMarker}  visible={this.state.showInfoWindow}>
                <ProjectHover   object_type = {this.props.object_type}
                  name = {this.state.selectedPlace.name}
                  selected_id = {this.state.selectedPlace.id}
                  description = {this.state.selectedPlace.description}
                leader_first_name = {this.state.selectedPlace.leader_first_name}
                leader_last_name = {this.state.selectedPlace.leader_last_name}
                  summary = {this.state.selectedPlace.summary}
                full_marker = {this.state.selectedPlace.full_marker}
                handleMoreClick = {this.handleMoreClick}/>
            </InfoWindow>
        </Map>
        </Typography>

      </Fragment>
    )
  }
}


export default GoogleApiWrapper({
  apiKey: ("AIzaSyB7xya0w0DAsz0kODQ0_MWlApayXELLBGo")
})(GoogleMap)