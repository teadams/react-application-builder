import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {useState, useContext, Fragment} from 'react';
import {Typography} from '@material-ui/core';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js'
import * as google_map from './api.js'
import {AuthContext} from '../../Components/User';


function get_image_url (image_object) {
    const image_base = (process.env.NODE_ENV ==="production")? "https://storage.googleapis.com/acs_full_stack/":""

    if (image_object && image_object.path && image_object.name) {
      return (image_base  + image_object.path +"/"+ image_object.name)
    } else {
      return 
    }     
}

function ACSMap (props) {
  const {object_type, onClick, latitude, longitude, latitude_field="latitude", longitude_field="longitude", initial_zoom=3, onMarkerClick, onMapClick, onMouseover, PopupComponent, centerAroundCurrentLocation=false, centerAroundSubsiteLocation=true} = props
  const [map_data, setMapData] = useState(props.map_data)
  const [subsite_data, setSubsiteData] = useState(props.subsite_data)

  const [showInfoWindow, setShowInfoWindow] =useState(false)
  const [activeMarker, setActiveMarker] = useState({})
  const [selectedPlace, setSelectedPlace]= useState({marker_data:{}})

  const [anchor, setAnchor] = useState(null);
  //const [center, setCenter] = useState({lat:"26.599674",	lng:"-81.853839"});
  const [prior_props_center, setPriorPropsCenter] = useState({lat:latitude, lng:longitude});
  const [center, setCenter] = useState({});

  const context = useContext(AuthContext)

  if (!map_data) {
    api.getData(object_type, "", (map_data, error) => {
      setMapData(map_data)
    })
  }

  // take initial center from subsite
  if (map_data && !subsite_data && context.context_id && centerAroundSubsiteLocation && !centerAroundCurrentLocation) {
    api.getData("core_subsite", {id:context.context_id}, (api_subsite_data, error) => {
      setSubsiteData(api_subsite_data[0])
      if  (api_subsite_data[0].latitude && api_subsite_data[0].longitude)  {
        setCenter({lat:api_subsite_data[0].latitude,	lng:api_subsite_data[0].longitude});
      }
    })
  }

  if (!map_data) {
    return null
  }

  // Handles latitude and longitude changing from props 
  if  (latitude !== prior_props_center.latitude || longitude !== prior_props_center.longitude)  {
          setCenter({lat:latitude,	lng:longitude})
          setPriorPropsCenter({lat:latitude,	lng:longitude})
  }

  
// TODO - play with drawing on map
// TODO - pop up component 
// TODO - show_popup_thumbnail, show_popup_summary, show_popup_description
// TOOD - lengths  
  const handleMouseover = (props, marker, e) => {
    //setSelectedPlace(props)
    if (marker.id !== activeMarker.id) {
      setActiveMarker(marker)
      setSelectedPlace(props)
      setShowInfoWindow(true)
    }
  };

/// TODO - get id, name, thumbnail, description from object_type
//  Type field (get type field then thumbnail)
  const handleMarkerClick = (id, marker, e) => {
    if (onMarkerClick) {
       onClick(id, marker, e)
    }
  };

  const handleMapClick = (props, marker, e) => {
    if (onMapClick) {
        onClick(props, marker, e)
    }
  };


  return (
      <Fragment> 
      <Map   const containerStyle = {{position: 'absolute',  width: '75%',height: '75%'}} style = {{position: 'absolute',  width: '100%', height: '100%'}} google={props.google}  onClick={handleMapClick} zoom={initial_zoom} center={center}  centerAroundCurrentLocation={centerAroundCurrentLocation}>
            {map_data.map(marker => {
              var icon
              if (marker.type && marker.type.thumbnail) {
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
              position.lat = marker[latitude_field]
              position.lng = marker[longitude_field]
              return (
              <Marker 
              onMouseover={handleMouseover}
              onClick={handleMarkerClick}
              name={marker.name}
              marker_data={marker}
              icon = {icon}
              id = {marker.id}
              key = {marker.id}
              position={position}></Marker>
              )
            })}
            <InfoWindow
               marker={activeMarker}
               visible={showInfoWindow}>
             <Fragment><Typography>{selectedPlace.marker_data.name}</Typography> <Typography>{selectedPlace.marker_data.summary}</Typography></Fragment>
           </InfoWindow>         
        </Map>
      </Fragment>
    )
  }


export default GoogleApiWrapper({
  apiKey: google_map.get_key()
})(ACSMap)