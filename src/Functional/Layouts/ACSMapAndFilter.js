import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React,  {useContext, useState, Fragment} from 'react';
import {Paper,  Switch, Typography, Button, Grid, Popover} from '@material-ui/core';
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
import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js'
import { useHistory } from "react-router-dom";
import ACSMap from "../Lists/ACSMap.js"
import ACSFinder from "../Lists/ACSFinder.js"
import ACSFilters from "../Filters/ACSFilters.js"
import ACSSelectFilter from "../Filters/ACSSelectFilter.js"
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

const CreateMarkerButton = function(props) {
    return (<Button variant="contained" color="primary" style={{margin:10}} {...props}>{props.text}</Button>)
}




const UpperLeftNavigation = function(props) {
  return (<Fragment>
 <ACSCreateButton   ButtonComponent={CreateMarkerButton} text={props.text} object_type={props.object_type} layout={props.layout} sections={props.sections} dialog_size={props.dialog_size} onSubmit={props.handleCreateMarkerSubmit} require_authorization={false}/>
 Map <Switch checked={props.filter_view} onChange={props.onChange} size="small"  color="default" name="view" /> Filter
</Fragment>)
}

const UpperRightControls = function(props) {
  return (<Fragment><ACSFilters filters={props.filters} default_filter_values={props.filter_form_values} label_direction="row" label_variant="subtitle1" onChange={props.handleFilterChange}/></Fragment>)
}

const MapOverlay = function(props) {
  return (
  <div style={{ zindex:2, position:"absolute",width:'95%', alignItems:"flex-start", display:"flex", flexDirection:"row"}}>
    <div  style={{zIndex:2, display:"flex", flexDirection:"row", alignItems:"center"}}><UpperLeftNavigation text={props.create_marker_button_text} object_type={props.object_type} layout={props.layout} sections={props.sections} dialog_size={props.dialog_size} onSubmit={props.handleCreateMarkerSubmit} require_authorization={false} checked={props.filter_view} onChange={props.toggleFilterView}/></div>
    <div style={{zIndex:2, display:"flex", flexGrow:2}}></div>
    <div style={{zIndex:2, display:"flex", backgroundColor:"white", padding:10, marginTop:10}}><UpperRightControls filter_form_values={props.filter_form_values} filters={props.filters} handleFilterChange={props.handleFilterChange}/></div>
  </div>)
}


function ACSMapAndFilter (props) {
  // layout params
  const { object_type, api_options, details_screen_field_list, create_field_list, layout, sections, dialog_size, more_path="ProjectOne", more_button_text="Learn More", action_button_text="Apply", action_component_name="ACSObjectView", action_link_field="job_listing", action_object_type="job_listing", create_marker_button_text="Create Job Listing"} = props

  const ActionComponent = control.componentByName(action_component_name)

  const {icon_type_field="job_type", onClick, latitude, longitude, latitude_field="latitude", longitude_field="longitude", initial_zoom=3, onMarkerClick, onMapClick, onMouseover, PopupComponent, centerAroundCurrentLocation=false, maxPopoverWidth=250, centerAroundSubsiteLocation=true, summary_cutoff=100, description_cutoff="", show_popup_summary=true, show_popup_thumbnail=true, show_popup_description=false} = props

  // TODO select_api_options, addition_api_options, referenced_by, filter_field_name
  const map_filters = [
    {label:"Type", name:"nwn_project_type", default_value:"_none_", object_type:"nwn_project_type",  select_field_name:"name", filter_field_name:"type"},
      
    {label:"Role", name:"core_role", default_value:"_none_", object_type:"core_role",  select_field_name:"core_role", filter_field_name:"project_needs.role_name", 
    referenced_by:"project_needs", select_api_options:{filter_field:"accept_signups", filter_id:true},
    additional_api_options:{filter_field:"project_needs.status", filter_id:"Recruiting"}}]

  const finder_filters = [
    {label:"Project", name:"nwn_project", object_type:"nwn_project",  select_field_name:"name", filter_field_name:"id", default_value:"_none_"},

    {label:"Type", name:"nwn_project_type",  object_type:"nwn_project_type",  select_field_name:"name", filter_field_name:"type", default_value:"_none_"},
  
    {label:"Role", name:"core_role",  object_type:"core_role",  select_field_name:"core_role", filter_field_name:"project_needs.role_name", referenced_by:"project_needs", select_api_options:{filter_field:"accept_signups", filter_id:true}, additional_api_options:{filter_field:"project_needs.status", filter_id:"Recruiting"}, default_value:"_none_"},

    {label:"Country", name:"core_country", default_value:"US", object_type:"core_country", filter_field_name:"country", default_value:"_none_"},
  
    {label:"State or Province", name:"core_state_province", default_value:"",     object_type:"core_state_province", filter_field_name:"state",
    select_api_options:{filter_field:"country_alpha_2", filter_dependent_field:"core_country"}, default_value:"_none_"
    },
    ]
    

  const classes = useStyles();
  const context = useContext(AuthContext)
  const history = useHistory({});
  const object_model = useGetModel("object_types", object_type)
  const [data, setData] = useState("")
  const [marker_data, setMarkerData] = useState("")
  const [show_side_window, setShowSideWindow] =useState(false)
  const [selected_place, setSelectedPlace]= useState({subsite_data:{}})
  const [filter_view, setFilterView] = useState(false)
  const [filter_form_values, setFilterFormValues] = useState()
  function loadData(api_options="") {
    api.getData(object_type, api_options, (api_data, error) => {
      setData(api_data)
    })
  }

  if (!data) {loadData("")}
  const handleFilterChange = (api_options, filter_form_values) => {
      setFilterFormValues(filter_form_values)
      loadData(api_options)
  }

  function toggleFilterView(event) {
    setFilterView(!filter_view)
    setShowSideWindow(false)
  } 

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


  return (
    <Fragment>
      {show_side_window && 
      <Fragment>
        <MapOverlay filters={map_filters} filter_form_values={filter_form_values} handleFilterChange={handleFilterChange} create_marker_button_text={create_marker_button_text} object_type={object_type} layout={layout} sections={sections} dialog_size={dialog_size} onSubmit={handleCreateMarkerSubmit} require_authorization={false} checked={filter_view} toggleFilterView={toggleFilterView}/>/>
        <div style={{width:400, paddingTop:60, height:"85%", zIndex:1, position:"absolute", backgroundColor:"white"}}>
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
            <ACSCreateDialogButton  require_authorization={false} ButtonComponent={ActionButton} DialogComponent={ActionComponent} object_type={object_type} row_mode="create" row_form="true"  id={id}  action_props={action_props} onSubmit={handleActionSubmit}/>
            <Button   onClick={handleMoreClick}>{more_button_text}</Button>
          </div> 
        </div>
      </Fragment>}
      {!show_side_window && !filter_view &&
          <MapOverlay  filters={map_filters}
          filter_form_values={filter_form_values}
          handleFilterChange={handleFilterChange} create_marker_button_text={create_marker_button_text} object_type={object_type} layout={layout} sections={sections} dialog_size={dialog_size} onSubmit={handleCreateMarkerSubmit} require_authorization={false} checked={filter_view} toggleFilterView={toggleFilterView}/>
      }
      {filter_view &&
        <ACSFinder UpperLeftNavagationComponent={UpperLeftNavigation} object_type={object_type} filters={finder_filters}
        filter_form_values={filter_form_values}
        toggleFilterView={toggleFilterView} text={create_marker_button_text}  layout={layout} sections={sections} dialog_size={props.dialog_size} onSubmit={handleCreateMarkerSubmit} filter_view={filter_view}/>
      }
        {!filter_view  &&  <ACSMap 
          map_data={data}
          load_own_data={false}
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
      }
    </Fragment>
    )
  }



export default ACSMapAndFilter;
