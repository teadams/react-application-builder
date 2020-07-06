import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React,  {useContext, useState, Fragment} from 'react';
import {Paper,  Typography, Button, Grid, Popover} from '@material-ui/core';
//import * as meta from '../../Utils/meta.js'
import {AuthContext} from '../User';

import ACSObjectCount from '../../Functional/Text/ACSObjectCount.js'
import ACSCreateButton from '../../Functional/Buttons/ACSCreateButton.js'
import ObjectView from '../../RABComponents/ObjectView.js'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import {CreateForm} from "../Layouts/index.js";
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import * as u from '../../Utils/utils.js'
import * as google_map from './api.js'
import {  BrowserRouter as Router,  Switch,  Route,  Link,  Redirect, useHistory } from "react-router-dom";
//import GoogleAPIWrapper from "./GoogleAPIWrapper.js"

function get_image_url (image_object) {
    const image_base = (process.env.NODE_ENV ==="production")? "https://storage.googleapis.com/acs_full_stack/":""

    if (image_object && image_object.path && image_object.name) {
      return (image_base  + image_object.path +"/"+ image_object.name)
    } else {
      return 
    }     
}

function GoogleMap (props) {
  const {object_type, field_list, layout, sections, dialog_size} = props
  const context = useContext(AuthContext)
  const history = useHistory({});

  const [marker_data, setMarkerData] = useState("")
  const [showInfoWindow, setShowInfoWindow] =useState(false)
  const [showSideWindow, setShowSideWindow] =useState(false)
  const [activeMarker, setActiveMarker] = useState({})
  const [selectedPlace, setSelectedPlace]= useState({subsite_data:{}})

  const [create_project_open, setCreateProjectOpen]= useState(false)
  const [anchor, setAnchor] = useState(null);
  const [center, setCenter] = useState({});

  const {onClick} = props

  const handleMouseover = (props, marker, e) => {
    //setSelectedPlace(props)
    if (marker.id !== activeMarker.id) {
      setActiveMarker(marker)
      setSelectedPlace(props)
      setShowInfoWindow(true)
    }
  };

  const handleClick = (id, marker, e) => {
    if (onClick) {
       onClick(id, marker, e)
    }
  };

  const handleMapClick = (props, marker, e) => {
    setShowInfoWindow(false)
  };

  if (!marker_data) {
    data.getData(object_type, "", (marker_data, error) => {
      setMarkerData(marker_data)
    })
  }
    
  if (!marker_data) {
    return null
  }

   const handlePopoverClose= () => {
      setShowInfoWindow(false)
   }

  //const create_button = Button
  return (
      <Fragment> 
      <Map   const containerStyle = {{position: 'absolute',  width: '75%',height: '75%'}} style = {{position: 'absolute',  width: '100%', height: '100%'}} google={props.google}  onClick={handleMapClick} zoom={3} center={center}>
            {marker_data.map(marker => {
              var icon
              if (marker.type.thumbnail) {
                const thumbnail = JSON.parse(marker.type.thumbnail)
                const icon_name = thumbnail.name
                const path = thumbnail.path
                const url = get_image_url(thumbnail)
                
                icon = {url:url, 
                        scaledSize:{"width":20,"height":20}}
              }  else  {
                icon = ""
              }
              var position = {}
              position.lat = marker.latitude
              position.lng = marker.longitude
              return (
              <Marker 
              onMouseover={handleMouseover}
              onClick={handleClick}
              name={marker.name}
              subsite_data={marker}
              icon = {icon}
              id = {marker.id}
              key = {marker.id}
              position={position}></Marker>
              )
            })}
            <InfoWindow
               marker={activeMarker}
               visible={showInfoWindow}>
             <Fragment><Typography>{selectedPlace.subsite_data.name}</Typography> <Typography>{selectedPlace.subsite_data.summary}</Typography></Fragment>
           </InfoWindow>         
        </Map>

      </Fragment>
    )
  }


export default GoogleApiWrapper({
  apiKey: google_map.get_key()
})(GoogleMap)