import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React,  {useContext, useState, Fragment} from 'react';
import {Paper,  Typography, Button, Grid, Popover} from '@material-ui/core';
//import * as meta from '../../Utils/meta.js'
import {AuthContext} from '../../Components/User';

import ACSObjectCount from '../../Functional/Text/ACSObjectCount.js'
import ACSCreateButton from '../../Functional/Buttons/ACSCreateButton.js'

// XX TODO
import ObjectView from '../../RABComponents/ObjectView.js'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import * as u from '../../Utils/utils.js'
import { BrowserRouter as Router,  Switch,  Route,  Link,  Redirect, useHistory } from "react-router-dom";
import ACSMap from "../Lists/ACSMap.js"
import SubsiteApply from "../../Components/NowWeAct/SubsiteApply.js"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    learn_button: {
      display:'flex',
      justifyContent:'center'
    },
    grow: {
      flexGrow: 1,
      display:'flex'
    },
    head_row: {
      display:'flex',
      padding:'10px'
    }, 
    head_count_wrapper: {
      display:'flex',
      justifyContent:'flex-end'
    },
    head_count_item: {
      display:'flex',
      padding:'0px',
      paddingRight:'20px'
    }, 
    paper: {
      backgroundColor: '#DDDDDD',
      maxWidth:'40%',
      maxHeight:'75%',
      alight:'center',
      border: '2px solid #000',
      borderRadius: '25px',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

function ACSMapAndFilter (props) {
  // map params
  const {object_type, icon_type_field="job_type", onClick, latitude, longitude, latitude_field="latitude", longitude_field="longitude", initial_zoom=3, onMarkerClick, onMapClick, onMouseover, PopupComponent, centerAroundCurrentLocation=false, maxPopoverWidth=250, centerAroundSubsiteLocation=true, summary_cutoff=100, description_cutoff=""} = props

  const {field_list, layout, sections, dialog_size} = props
  const classes = useStyles();
  const context = useContext(AuthContext)
  const history = useHistory({});

  const [marker_data, setMarkerData] = useState("")
  const [showInfoWindow, setShowInfoWindow] =useState(false)
  const [showSideWindow, setShowSideWindow] =useState(false)
  const [showVolunteerDialog, setShowVolunteerDialog] = useState(false)

  const [selectedPlace, setSelectedPlace]= useState({subsite_data:{}})

  const [create_project_open, setCreateProjectOpen]= useState(false)

  const handleCreateProjectOpen = () =>  {
        setCreateProjectOpen(false)
  }
  const handleProjectCreated= (event,action, project_data, inserted_id) => {
    // most of this will go server side
    // setCreateProjectOpen(false)
    // // this will all move server side
    // if (!inserted_id) {
    //     return
    // }
    // 
    // let options = {}
    // options.id = inserted_id
    // const role_add_obj = {
    //     user_id: context.user.id,
    //     subsite_id: inserted_id,
    //     role_name: "Admin",
    //     status: "Accepted"
    // }
    // data.callAPI("auth/create-subsite-role", {}, role_add_obj, "post", (role_add_result, error ) => {
    //     if (Object.keys(role_add_result).length > 0) {
    //       // will need a way to get updated context
    //       let new_user_context = context.user
    //         new_user_context.context_list = role_add_result.context_list
    //         new_user_context.authorization_object = role_add_result.authorization_object
    //         context.login(new_user_context)
    //         context.setContextId(inserted_id)
    //         // direct to project page
    //     }
    //       let path = `/OneProject`
    //       history.push(path);
    // 
    //   })
    //   // Let this happen in parallel. User will be redirected so we do not have to wait
    //   let params = {}
    //   params.address= project_data.street_address  + ", " + project_data.city  +", " + project_data["state"] +",  " + project_data["country"] +", " + project_data.zip_code
    //   params.key = google_map.get_key() 
    //   data.getURL("https://maps.googleapis.com/maps/api/geocode/json", params, (result, error) => { 
    //       options.latitude = result.results[0].geometry.location.lat
    //       options.longitude = result.results[0].geometry.location.lng 
    // 
    //       data.putData("nwn_project", options, {}, (data, error) => { 
    //           if (error) {
    //                 alert ('error is ' + error.message)
    //           } 
    //       })     
    //     })

  }



  const handleOnMarkerClick = (id, marker, e) => {
    setSelectedPlace(id.marker_data)
    if (!showSideWindow) {
      setShowSideWindow(true)
    }
  };

  const handleOnMapClick = (id, marker, e) => {
    if (showSideWindow) {
      setShowSideWindow(false)
    }
  };
  
  const handleMoreClick = event => {
       window.scrollTo(0,0)
       context.setContextId(selectedPlace.id)
       let path = `/OneProject`
       history.push(path);
   }

  const handleVolunteerClose= event => {
      setShowVolunteerDialog(false)
  }

  const handleVolunteerClick = event => {
      setShowVolunteerDialog(true)
  }

  
  const create_button = (props) => { 
      return (<Button variant="contained" {...props}>Create a Project</Button>)
  }
//const create_button = Button
  return (
    <Fragment>
      {showSideWindow && <div style={{width:400, height:"85%", zIndex:1, position:"absolute", backgroundColor:"white"}}>
      
      </div>}
      <ACSMap onMarkerClick={handleOnMarkerClick} onMapClick={handleOnMapClick} object_type={object_type} container_height="85%" container_width="98%"/>
    </Fragment>
    )
  }



export default ACSMapAndFilter;
