import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React,  {useContext, useState, Fragment} from 'react';
import {Paper,  Typography, Button, Grid, Popover} from '@material-ui/core';
//import * as meta from '../../Utils/meta.js'
import {AuthContext} from '../User';

import ACSObjectCount from '../../Functional/Text/ACSObjectCount.js'
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: '#DDDDDD',
      maxWidth:'75%',
      maxHeight:'75%',
      alight:'center',
      border: '2px solid #000',
      borderRadius: '25px',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

function GoogleMap (props) {
  const {object_type} = props
  const classes = useStyles();
  const context = useContext(AuthContext)
  const [marker_data, setMarkerData] = useState("")
  const [showInfoWindow, setShowInfoWindow] =useState(false)
  const [activeMarker, setActiveMarker] = useState({})
  const [selectedPlace, setSelectedPlace]= useState({})
  const [create_project_open, setCreateProjectOpen]= useState(false)

  const handleCreateProjectOpen = () =>  {
        setCreateProjectOpen(false)
  }

  const handleProjectCreated= (action_text, inserted_id, formValues) => {
    // most of this will go server side
    setCreateProjectOpen(true)
    this.setState({create_project_open:false})
    // though we have access to formValues, state and Country
    //  are id's and not the text name.   Simplest path forward
    // (unfortunately) is to query back the project infor from
    // the server

    if (!inserted_id) {
        return
    }

    let options = {}
    options.id = inserted_id

    data.getData("nwn_project", options, (project_data, error) => { 

      const other_fields = {
        leader_notes: 'Creator',
        creation_user: this.context.user.id
      }

      const role_add_obj = {
        user_id: this.context.user.id,
        subsite_id: inserted_id,
        role_name: "Admin",
        status: "Accepted",
        other_fields: other_fields
      }

      data.callAPI("auth/create-subsite-role", {}, role_add_obj, "post", (role_add_result, error ) => {
          let new_user_context = context.user
          new_user_context.context_list = role_add_result.context_list
          new_user_context.authorization_object = role_add_result.authorization_object
          context.login(new_user_context)
          context.setContextId(inserted_id)
          // direct to project page
        
          props.onMenuChange("",5)

      })
          // Let this happen in parallel. User will be redirected so we do not have to wait
      let params = {}
      params.address= project_data.street_address  + ", " + project_data.city  +", " + project_data["state_name"] +",  " + project_data["country_name"] +", " + project_data.zip_code
      params.key = google_map.get_key() 
      data.getURL("https://maps.googleapis.com/maps/api/geocode/json", params, (result, error) => { 
          options.latitude = result.results[0].geometry.location.lat
          options.longitude = result.results[0].geometry.location.lng 

          data.putData("nwn_project", options, {}, (data, error) => { 
              if (error) {
                    alert ('error is ' + error.message)
              } 
          })     
        })
    })

  }

  const handleMoreClick = event => {
      console.log('button has been clicked')
      alert ('handle clik')
  }
  const handlePopoverClose= () => {

    setShowInfoWindow(false)

  }
  const onMouseover = (props, marker, e) => {
    setSelectedPlace(props)
    setActiveMarker(marker)
    setShowInfoWindow(true)
  };
  
  if (!marker_data) {
    data.getData(object_type, "", (marker_data, error) => {
      setMarkerData(marker_data)
    })
  }
    
  if (!marker_data) {
    return null
  }
  return (
      <Fragment>
        <Grid container >
          <Grid item  style={{padding:20}}>
          <Typography variant="headline">
           {props.title}
          </Typography>
          </Grid>
          <Grid item  style={{padding:20}}> <Button variant="contained" onClick={handleCreateProjectOpen}>Create a Project</Button></Grid>
          <Grid item  style={{padding:20}}>
            <ACSObjectCount api_options={{get_count:true, num_rows:1,}} text="Number of active projects:" object_type="nwn_project"/> 

            <ACSObjectCount api_options={{get_count:true, num_rows:1, filter_id:"Success", filter_field:"status"}} text="Number of sucessful projects:" object_type="nwn_project"/>

            <ACSObjectCount api_options={{get_count:true, num_rows:1}} text="Number of volunteers:" object_type="nwn_project_volunteer"/> 
          </Grid>
          </Grid>
        
        {create_project_open &&
          <CreateForm
            object_type="nwn_project" 
            open={create_project_open}
            hidden={{leader:true}}
            onClose={this.handleProjectCreated}
          />}
        <Typography variant="body1" style={{padding:10}}>
            {props.text}
          <Map google={props.google} zoom={3}>
            {marker_data.map(marker => {
              var icon
              if (marker.type.thumbnail) {
                const thumbnail = JSON.parse(marker.type.thumbnail)
                const icon_name = thumbnail.name
                const path = thumbnail.path
                const url = path+icon_name
                icon = {url:url, 
                        scaledSize:{"width":20,"height":20}}
              }  else  {
                icon = ""
              }

              var position = {}
              position.lat = marker.latitude
              position.lng = marker.longitude
            
              return (
              <Marker onMouseover={onMouseover}
              name={marker.name}
              full_marker = {marker}
              onMore= {props.onMore}
              icon = {icon}
              id = {marker.id}
              position={position}></Marker>
              )
            })}
            
            <Popover  classes={{paper: classes.paper}} open={showInfoWindow}                   onClose={handlePopoverClose}
>
            <Typography
              onMouseLeave={handlePopoverClose}>
                <ObjectView  object_type =        {props.object_type}
                  id = {selectedPlace.id}
                  field_mode = "view"
                  click_to_edit = {false}
                  num_columns={1}
                handleMoreClick = {handleMoreClick}/>
              </Typography>

            </Popover>

            
        </Map>
        </Typography>

      </Fragment>
    )
  }


export default GoogleApiWrapper({
  apiKey: google_map.get_key()
})(GoogleMap)