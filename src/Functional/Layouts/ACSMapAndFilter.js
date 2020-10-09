import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React,  {useContext, useState, Fragment} from 'react';
import {Switch,  Button} from '@material-ui/core';
//import * as meta from '../../Utils/meta.js'
import {ACSFilterController} from '../../ACSRenderEngine'
import {ACSCreateButton, ACSCreateDialogButton , ACSObjectView, ACSObjectType} from '../../ACSLibrary'

// XX TODO
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import useGetModel from '../../Hooks/useGetModel';

import * as u from '../../Utils/utils.js'
import { useHistory } from "react-router-dom";
import ACSMap from "../Lists/ACSMap.js"
import ACSMapAndFilterFilter from "./SubComponents/ACSMapAndFilterFilter.js"
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
    return (<Button variant="contained" color="primary" style={{margin:10, borderRadius: '12px'}} {...props}>{props.text}</Button>)
}

const ListViewButton = function(props) {
  return (<Button onClick={props.onChange} variant="contained" color="primary" style={{margin:10,   borderRadius: '12px'}}>View Projects as a List</Button>)

}

const MapViewButton = function(props) {
  return (<Button onClick={props.onChange} variant="contained" color="primary" style={{margin:10,   borderRadius: '12px'}}>View Projects on a Map</Button>)

}


const UpperLeftNavigation = function(props) {

  return (<Fragment>
<MapViewButton checked={props.filter_view} onChange={props.onChange} size="small"  color="default" name="view" /> 
 <ACSCreateButton   ButtonComponent={CreateMarkerButton} text={props.text} object_type={props.object_type} layout={props.layout} sections={props.sections} dialog_size={props.dialog_size} onSubmit={props.onSubmit} require_authorization={false} action_props={props.create_action_props} menu={props.create_action_menu}/>

</Fragment>)
}

const CreateButton = function(props) {
  return (<Fragment>
 <ACSCreateButton   ButtonComponent={CreateMarkerButton} text={props.text}  object_type={props.object_type} layout={props.layout} sections={props.sections} dialog_size={props.dialog_size} onSubmit={props.onSubmit} require_authorization={false} action_props={props.create_action_props} menu={props.create_action_menu}/> 
</Fragment>)

}

const UpperRightControls = function(props) {
  return (<Fragment><ACSFilterController filters={props.filters} default_filter_values={props.filter_form_values} label_direction="row" label_variant="subtitle1" onChange={props.handleFilterChange}/></Fragment>)
}

const MapOverlay = function(props) {

  return (
  <div style={{ zindex:2, marginTop:"0px", position:"absolute",width:'97%', alignItems:"flex-start", display:"flex", flexDirection:"row"}}>
    <div  style={{zIndex:2, display:"flex", flexDirection:"row", alignItems:"center", }}>
    </div>
    <div style={{zIndex:2, display:"flex", flexGrow:50}}></div>
    <div style={{zIndex:2, display:"flex", flexGrow:0, flexBasis:"5px", flexDirection:"column"}}>
      <div style={{zIndex:2, display:"flex", flexDirection:"column", backgroundColor:"#fffffa",  borderRadius:"25px", padding:"15px", marginTop:"10px", boxShadow:"5px 10px 18px #888888"}}>
      <div style={{fontSize:"20px", marginBottom:"10px", fontWeight:"bold", color:"#3f51b5"}}>Join a Project</div>
        <div>Find a project and get involved today.</div>
        <div><UpperRightControls  default_filter_values={props.filter_form_values} filter_form_values={props.filter_form_values} filters={props.filters} handleFilterChange={props.handleFilterChange}/></div>
        <div style={{marginTop:"20px"}}>Do you prefer a text-based listing of projects instead of a map? </div> 
        <div style={{alignSelf:"center"}}><ListViewButton onChange={props.toggleFilterView}/></div>
      </div>
      <div style={{zIndex:2, display:"flex", flexDirection:"column", backgroundColor:"#fffffa", padding:"15px",borderRadius:"25px", marginTop:"10px", boxShadow:"5px 10px 18px #888888"}}>
        <div style={{fontSize:"20px", marginBottom:"10px", fontWeight:"bold", color:"#3f51b5", }}>Do you lead a project?</div>
        <div>The Now We Act Community will help you recruit volunteers and succeed in your cause.</div>
        <div style={{alignSelf:"center"}}><CreateButton text={props.create_marker_button_text} object_type={props.object_type} layout={props.layout} sections={props.sections} dialog_size={props.dialog_size} onSubmit={props.onSubmit} create_action_props={props.create_action_props} create_action_menu={props.create_action_menu} require_authorization={false} checked={props.filter_view} onChange={props.toggleFilterView}/></div>
      </div>
    
    </div>
  </div>)
}


function ACSMapAndFilter (props) {
  // params - map view
  const { object_type,  details_screen_field_list, details_screen_no_header=false, create_field_list, layout, sections, dialog_size, more_path="ProjectOne", more_button_text="Learn More", action_button_text="Apply", action_component_name="ACSObjectView", action_link_field="id", action_object_type="job_application", create_marker_button_text="Create Job Listing", map_filters=[], finder_filters=[], create_action_props={}, create_action_menu} = props

  // params - fitler filter_view 
  const {more_field_list, list_field_list} = props
  const ActionComponent = control.componentByName(action_component_name)

  // map params
  const {icon_type_field="job_type", onClick, latitude, longitude, latitude_field="core_address_latitude", longitude_field="core_address_longitude", initial_zoom=9, onMarkerClick, onMapClick, onMouseover, PopupComponent,  maxPopoverWidth=250, map_center="current", summary_cutoff=100, description_cutoff="", show_popup_summary=true, show_popup_thumbnail=true, show_popup_description=false} = props

  // TODO select_api_options, addition_api_options, referenced_by, filter_field_name

  
  const classes = useStyles();
  const history = useHistory({});
  const object_model = useGetModel("object_types", object_type)
  const [data, setData] = useState("")
  const [marker_data, setMarkerData] = useState("")
  const [show_side_window, setShowSideWindow] =useState(false)
  const [selected_place, setSelectedPlace]= useState({subsite_data:{}})
  const [filter_view, setFilterView] = useState(false)
  const [filter_form_values, setFilterFormValues] = useState()
  const [api_options, setApiOptions] = useState(props.api_options)

  function loadData(api_results) {
    setData(api_results)
  }

  const handleFilterChange = (api_options, filter_form_values) => {
      setApiOptions(api_options)
      setFilterFormValues(filter_form_values)
  }

  function toggleFilterView(event) {
    setFilterView(!filter_view)
    setShowSideWindow(false)
  } 

  function redirectToMore(inserted_id) {
      window.scrollTo(0,0)
      const redirect_id = inserted_id?inserted_id:selected_place.id
      let path = `/${more_path}/${redirect_id}/`
      if (object_model.name === "core_subsite" || object_model.extends_object === "core_subsite") {
    //      context.setContextId(redirect_id)
      }
      history.push(path);
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
  let side_visibility = "hidden"
  if (show_side_window) {side_visibility="visible"}
  return (
    <Fragment>
      <ACSObjectType headless={true} object_type={object_type} api_options={api_options} onData={loadData}/>
      {!filter_view &&
      <Fragment>
        <MapOverlay filters={map_filters} filter_form_values={filter_form_values} create_action_props={create_action_props} create_action_menu={create_action_menu} handleFilterChange={handleFilterChange} create_marker_button_text={create_marker_button_text} object_type={object_type} layout={layout} sections={sections} dialog_size={dialog_size} onSubmit={handleCreateMarkerSubmit} require_authorization={false} checked={filter_view} toggleFilterView={toggleFilterView}/>
        <div style={{width:400, paddingTop:"10px", height:"90%",  zIndex:1, position:"absolute", backgroundColor:"white", visibility:side_visibility, backgroundColor:"#fffffa"}}>
            {selected_place.id && 
            <Fragment><ACSObjectView  row_type="div_row" object_type =  {object_type}
            id = {selected_place.id}
            data = {selected_place}
            field_mode = "view"
            field_list = {details_screen_field_list}
            no_header = {details_screen_no_header}
            row_field_click_to_edit = {false}
            num_columns={1}
            row_header_image_size="medium"
            handleMoreClick = {handleMoreClick}/>
    
          <div style={{display:"flex", width:"100%", justifyContent:"space-evenly"}}>
            {1==2 && <ACSCreateDialogButton  require_authorization={false} ButtonComponent={ActionButton} DialogComponent={ActionComponent}  object_type={action_object_type} row_mode="create" row_form="true"  id={id}  action_props={action_props}/>}
            <Button   onClick={handleMoreClick}>{more_button_text}</Button>
          </div> </Fragment>
          }
        </div>
        <ACSMap 
         data={data}
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
         map_center={map_center}
         maxPopoverWidth={maxPopoverWidth}
         summary_cutoff={summary_cutoff}
         description_cutoff={description_cutoff}
         icon_type_field={icon_type_field} 
         onMarkerClick={handleOnMarkerClick} 
         onMapClick={handleOnMapClick} 
         object_type={object_type} 
         container_height="90%" 
         container_width="98%"/>
    
      </Fragment>}
      {filter_view &&
        <ACSMapAndFilterFilter
        UpperLeftNavagationComponent={UpperLeftNavigation} object_type={object_type} filters={finder_filters}
        filter_form_values={filter_form_values}
        setFilterFormValues={setFilterFormValues}
        more_field_list = {more_field_list}
        list_field_list = {list_field_list}
        toggleFilterView={toggleFilterView} text={create_marker_button_text}  layout={layout} sections={sections} dialog_size={props.dialog_size}
        action_link_field={action_link_field}
        ActionButton={ActionButton} ActionComponent={ActionComponent}
        onSubmit={handleCreateMarkerSubmit} filter_view={filter_view}/>
      }

    </Fragment>
    )
  }



export default ACSMapAndFilter;
