import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React,  {useContext, useState, Fragment} from 'react';
import {Paper,  Typography, Button, Grid, Popover} from '@material-ui/core';
//import * as meta from '../../Utils/meta.js'
import {AuthContext} from '../../Components/User';

import ACSObjectCount from '../../Functional/Text/ACSObjectCount.js'
import ACSCreateButton from '../../Functional/Buttons/ACSCreateButton.js'
import ACSCreateDialogButton from '../../Functional/Buttons/ACSCreateDialogButton.js'
import ACSObjectView from '../../Functional/Rows/ACSObjectView.js'
// XX TODO
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import useGetModel from '../../Hooks/useGetModel';

import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import * as u from '../../Utils/utils.js'
import { useHistory } from "react-router-dom";
import ACSMap from "../Lists/ACSMap.js"
import * as control from '../../Utils/control.js'


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
  // layout params
  const { object_type, details_screen_field_list, create_field_list, layout, sections, dialog_size, more_path="ProjectOne", more_button_text="Learn More", action_button_text="Apply", action_component_name="ACSObjectView", action_link_field="job_listing", action_object_type="job_listing", create_marker_button_text="Create Job Listing"} = props

  const ActionComponent = control.componentByName(action_component_name)

  const {icon_type_field="job_type", onClick, latitude, longitude, latitude_field="latitude", longitude_field="longitude", initial_zoom=3, onMarkerClick, onMapClick, onMouseover, PopupComponent, centerAroundCurrentLocation=false, maxPopoverWidth=250, centerAroundSubsiteLocation=true, summary_cutoff=100, description_cutoff="", show_popup_summary=true, show_popup_thumbnail=true, show_popup_description=false} = props

  const classes = useStyles();
  const context = useContext(AuthContext)
  const history = useHistory({});
  const object_model = useGetModel("object_types", object_type)
  const [marker_data, setMarkerData] = useState("")
  const [show_side_window, setShowSideWindow] =useState(false)
  const [selected_place, setSelectedPlace]= useState({subsite_data:{}})


  function redirectToMore(inserted_id) {
      window.scrollTo(0,0)
      const redirect_id = inserted_id?inserted_id:selected_place.id
      if (object_model.name === "core_subsite" || object_model.extends_object === "core_subsite") {
          context.setContextId(redirect_id)
      }
      let path = `/${more_path}/${redirect_id}`
      history.push(path);
  }

  const handleActionSubmit= (event,action, project_data, inserted_id) => {
  }

  const handleCreateMarkerSubmit= (event,action, project_data, inserted_id) => {
      redirectToMore(inserted_id)
  }

  const handleOnMarkerClick = (marker, m, e) => {
    if (selected_place.id !== marker.marker_data.id) {
      setSelectedPlace(marker.marker_data)
    }
    if (!show_side_window) {
      setShowSideWindow(true)
    }
  };

  const handleOnMapClick = (id, marker, e) => {
    if (show_side_window) {
      setShowSideWindow(false)
    }
  };
  
  const handleMoreClick = event => {
    redirectToMore()
  }
  

  
 let id, action_props
 if (action_link_field) {
      action_props = {[action_link_field]:selected_place.id}
  } else {
      id = selected_place.id
  }
  
  const ActionButton = function(props) {
      return (<Button {...props}>{action_button_text}</Button>)
  }

  const CreateMarkerButton = function(props) {
      return (<Button variant="contained" color="primary" style={{margin:10}} {...props}>{create_marker_button_text}</Button>)
  }



  return (
    <Fragment>
      {show_side_window && 
      <div style={{width:400, height:"85%", zIndex:1, position:"absolute", backgroundColor:"white"}}>
        <ACSCreateButton   ButtonComponent={CreateMarkerButton} object_type={object_type} layout={layout} sections={sections} dialog_size={dialog_size} onSubmit={handleCreateMarkerSubmit} require_authorization={false}/>
        <Typography>
          <ACSObjectView  object_type =  {object_type}
            id = {selected_place.id}
            data = {selected_place}
            field_mode = "view"
            field_list = {details_screen_field_list}
            field_click_to_edit = {false}
            num_columns={1}
            row_header_image_size="medium"
            handleMoreClick = {handleMoreClick}/>
        </Typography>
        <div style={{display:"flex", width:"100%", justifyContent:"space-evenly"}}>
          <ACSCreateDialogButton   ButtonComponent={ActionButton} DialogComponent={ActionComponent} object_type={object_type} row_mode="create" row_form="true"  id={id}  action_props={action_props} onSubmit={handleActionSubmit}/>
          <Button   onClick={handleMoreClick}>{more_button_text}</Button>
        </div> 
      </div>}
      {!show_side_window &&
      <div  style={{zIndex:1, position:"absolute"}}>
      <ACSCreateButton   ButtonComponent={CreateMarkerButton} object_type={object_type} layout={layout} sections={sections} dialog_size={dialog_size} onSubmit={handleCreateMarkerSubmit} require_authorization={false}/>
      </div>}
      <ACSMap 
          icon_type_field={icon_type_field}
          latitude={latitude}
          longitude={longitude}
          latitude_field={latitude_field} 
          longitude_field={longitude_field}
          show_popup_summary={show_popup_summary}
          show_popup_description={show_popup_description}
          show_popup_thumbnail={show_popup_thumbnail}
          initial_zoom={initial_zoom}
          onMouseover={onMouseover}
          PopupComponent={PopupComponent}
          centerAroundCurrentLocation={centerAroundCurrentLocation} 
          maxPopoverWidth={maxPopoverWidth}
          centerAroundSubsiteLocation={centerAroundSubsiteLocation} 
          summary_cutoff={summary_cutoff}
          description_cutoff={description_cutoff}
          icon_type_field={icon_type_field} 
          onMarkerClick={handleOnMarkerClick} 
          onMapClick={handleOnMapClick} 
          object_type={object_type} 
          container_height="85%" 
          container_width="98%"/>
    </Fragment>
    )
  }



export default ACSMapAndFilter;
