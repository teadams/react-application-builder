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
import GoogleMap from "./GoogleMap.js"

function get_image_url (image_object) {
    const image_base = (process.env.NODE_ENV ==="production")? "https://storage.googleapis.com/acs_full_stack/":""

    if (image_object && image_object.path && image_object.name) {
      return (image_base  + image_object.path +"/"+ image_object.name)
    } else {
      return ""
    }     
}

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

function NWAMap (props) {
  const {object_type, field_list, layout, sections, dialog_size} = props
  const classes = useStyles();
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

  const handleCreateProjectOpen = () =>  {
        setCreateProjectOpen(false)
  }

  const handleProjectCreated= (event,action, project_data, inserted_id) => {
    // most of this will go server side
    setCreateProjectOpen(false)
    // this will all move server side
    if (!inserted_id) {
        return
    }
    
    let options = {}
    options.id = inserted_id
    const role_add_obj = {
        user_id: context.user.id,
        subsite_id: inserted_id,
        role_name: "Admin",
        status: "Accepted"
    }
    data.callAPI("auth/create-subsite-role", {}, role_add_obj, "post", (role_add_result, error ) => {
        if (Object.keys(role_add_result).length > 0) {
          // will need a way to get updated context
          let new_user_context = context.user
            new_user_context.context_list = role_add_result.context_list
            new_user_context.authorization_object = role_add_result.authorization_object
            context.login(new_user_context)
            context.setContextId(inserted_id)
            // direct to project page
        }
          let path = `/OneProject`
          history.push(path);

      })
      // Let this happen in parallel. User will be redirected so we do not have to wait
      let params = {}
      params.address= project_data.street_address  + ", " + project_data.city  +", " + project_data["state"] +",  " + project_data["country"] +", " + project_data.zip_code
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

  }


  const handleOnClick = (id, marker, e) => {
    setSelectedPlace(id)
    if (!showSideWindow) {
      setShowSideWindow(true)
    }
  };

    
  const handleMoreClick = event => {
       window.scrollTo(0,0)
       context.setContextId(activeMarker.id)
       let path = `/OneProject`
       history.push(path);
   }
   const handlePopoverClose= () => {
      setShowInfoWindow(false)
   }

  
  const create_button = (props) => { 
      return (<Button variant="contained" {...props}>Create a Project</Button>)
  }
//const create_button = Button
  return (
      <Fragment>
      <div className={classes.grow}>
           <Typography variant="h4" classes={{root:classes.head_row}}>{props.title}</Typography>
          <div className={classes.head_row}>
            <ACSCreateButton onSubmit={handleProjectCreated}
              layout={layout}
              sections={sections}
              Component={create_button}
              dialog_size={dialog_size}
              auth_action="read"
              object_type={object_type}/>
          </div>
          <div className={classes.grow} />
          <div className={classes.head_count_wrapper}>
            <div className={classes.head_count_item}>
              <ACSObjectCount api_options={{get_count:true, num_rows:1,}} text="Active Projects:" object_type="nwn_project"/>
            </div>
            <div className={classes.head_count_item}>
              <ACSObjectCount api_options={{get_count:true, num_rows:1, filter_id:"Success", filter_field:"status"}} text="Sucessful Projects:" object_type="nwn_project"/>
            </div>
            <div className={classes.head_count_item}>
              <ACSObjectCount api_options={{get_count:true, num_rows:1}} text="Volunteers:" object_type="nwn_project_volunteer"/> 
            </div>
          </div>
        </div>
        <Grid container style={{paddingTop:20, height:"75%"}}>
        <Grid item style={{width:"20%", padding:10, height:"75%"}}>
            {showSideWindow && <Fragment>     
            <Typography>
                <ObjectView  object_type =  {props.object_type}
                  id = {selectedPlace.id}
                  field_mode = "view"
                  field_list = {field_list}
                  field_click_to_edit = {false}
                  num_columns={1}
                  row_header_image_size="medium"
                handleMoreClick = {handleMoreClick}/>
              </Typography>
              <Button   variant="contained" onClick={handleMoreClick}>Learn More</Button>
            
            </Fragment>}  

            {!showSideWindow &&      
              <Typography>
              Welcome!!!!! Click on a pin to learn more.  Zac and Jesse provide text.
              </Typography>
            }  
        </Grid>
        <Grid item style={{width:"75%", height:"75%"}}>
          <GoogleMap onClick={handleOnClick} object_type={object_type} field_list={field_list} layout={layout} sections={sections} dialog_size={dialog_size}/>
        </Grid>
      </Grid>


      </Fragment>
    )
  }

export default NWAMap;
