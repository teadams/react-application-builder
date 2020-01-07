import React,  {Fragment} from 'react';
import {Paper,  Typography} from '@material-ui/core';
//import * as meta from '../../Utils/meta.js'
import {Field, ObjectView} from "../Experimental"
import {ProjectHover} from "../NowWeAct"
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
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
      })

  }

  render() {
  //alert ('about  to render object' + JSON.stringify(this.state.marker_data))
//  alert ("market data is "  + this.state.marker_data)

    return (
      <Fragment>
        <Typography variant="headline">
           {this.props.title}
        </Typography>
        <Typography variant="body1" style={{padding:10}}>
            {this.props.text}
          <Map google={this.props.google} zoom={3}>
            {this.state.marker_data.map(marker => {
            //  alert ("maker is " + JSON.stringify(marker))
              
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
                  summary = {this.state.selectedPlace.summary}/>
                  
            </InfoWindow>
        </Map>
        </Typography>

      </Fragment>
    )
  }
}


export default GoogleApiWrapper({
  apiKey: ("AIzaSyA-6-xjmefANA9RLDL6d2xnatCBNr-lwnA")
})(GoogleMap)