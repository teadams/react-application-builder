import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import ACSObjectTypeView from "../../Functional/Lists/ACSObjectTypeView.js"
import AuthContext from '../User/AuthContext';
import useForm from '../../Hooks/useForm';
import useGetObject  from '../../Hooks/useGetObject';
import ACSRowController from '../../Functional/ACSRowController.js'
import RABSelectField from '../../Functional/Fields/RABSelectField.js'
import ACSField from '../../Functional/ACSField2.js'
import ObjectView from '../../RABComponents/ObjectView.js'
import NWAProjectSummary from './NWAProjectSummary.js'
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField

, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import {Link, Container, Box, Card, TableHead, TableContainer, Table, TableBody, TableRow, TableCell} from '@material-ui/core';
import useGetModel from '../../Hooks/useGetModel.js'
import {SelectObject} from "../index.js";
import { Image} from "../index.js"

const styles = theme => ({
drawerHeader: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 8px',
  ...theme.mixins.toolbar,
},
});

const box_style = { 
  padding:10,
  backgroundColor:"lightGray",
  borderColor:"darkGray",
  borderWidth:"thin",
  borderStyle:"solid",
  display:"inline"
}


function SubsiteSelect(props) {
  const context = useContext(AuthContext)
  //XX could get default select field by object type from proc?
  const [form_values, setFormValues]= useState({
    core_subsite:"_none_",
    nwn_project_type:"_none_",
    core_role:"_none_",
    core_country:"US",
    core_state_province:"_none_",
    zip_code:"",
  })
  const [form_touched, setFormTouched] = useState(false)
  const [subsite_data, setSubsiteData] = useState("")
  const [show_details, setShowDetails] = useState(false)
  const [active_data, setActiveData] = useState("")
  //const [api_options, setApiOptions] = useState("")
  const subsite_info_fields= ["summary", "leader", "description", "address"]

  function handleSubsiteDetailsClose(event) {
      setActiveData("")
  }


  function SubsiteMoreInfo (props) {
      function handleSetActiveData(event) {
        setActiveData(props.data)
      }
      return (<Link name={props.data} onClick={handleSetActiveData}>Details</Link>)
  }
  
  const field_models = {core_subsite:{
                        more:{pretty_name:"More",
                          rab_component_model:{field:{components:{field:SubsiteMoreInfo}}}
                          }
                        }}


  const handleChange = (event) => {
        const value=event.target.value
        const name=event.target.name
        if (form_values[name] !== value) {
            setFormTouched(true)
          }
          setFormValues(form_values=>({...form_values,[name]:value}))
  }

  const handleTextSubmit = (event, name, filter_form_values) => {
    if (event) {
      event.preventDefault();
    }
  
    const value=filter_form_values[name]

    if (value) {
      setFormTouched(true)
    }
    setFormValues(form_values=>({...form_values,[name]:value}))
  } 

  let api_options = {filter_id:[], filter_field:[], filter_join:"AND", referenced_by:[]}
  if (form_values.core_subsite && form_values.core_subsite !== "_none_") {
    api_options.filter_id.push(form_values.core_subsite)
    api_options.filter_field.push("id")
  }
  if (form_values.nwn_project_type && form_values.nwn_project_type !== "_none_") {
    api_options.filter_id.push(form_values.nwn_project_type)
    api_options.filter_field.push("type")
  }

  let state_api_options = {filter_field:"country_alpha_2", filter_id:"US"}
  if (form_values.core_country && form_values.core_country !== "_none_") {
    api_options.filter_id.push(form_values.core_country)
    api_options.filter_field.push("country")
    state_api_options = {filter_field:"country_alpha_2", filter_id:form_values.core_country}
  }

  if (form_values.core_role && form_values.core_role !== "_none_") {
    api_options.filter_id.push(form_values.core_role)
    api_options.filter_id.push("Recruiting")
    api_options.filter_field.push("project_needs.role_name")
    api_options.filter_field.push("project_needs.status")
    api_options.referenced_by.push("project_needs")
    api_options.filter_join="AND"
  
  }
  if (form_values.core_state_province && form_values.core_state_province !== "_none_") {
    api_options.filter_id.push(form_values.core_state_province)
    api_options.filter_field.push("state")
  }

  if (form_values.zip_code) {
    api_options.filter_id.push(form_values.zip_code)
    api_options.filter_field.push("zip_code")
  }

  const handleSubsiteData = (api_data) => {
      setSubsiteData(api_data)
  }

  
  return (
    <Fragment>
      {active_data && <Dialog fullWidth={true} open={true}  onClose={handleSubsiteDetailsClose}>
        <DialogContent>
              <NWAProjectSummary data={active_data} field_list={subsite_info_fields} object_type="core_subsite" mode="view" num_columns={1}  />
              <DialogActions>
                <Button onClick={handleSubsiteDetailsClose} color="primary">Close</Button>
              </DialogActions>  
        </DialogContent>
      </Dialog>}
      {api_options && form_touched && <ACSObjectTypeView headless={true} api_options={api_options} object_type="core_subsite" onData={handleSubsiteData}/>}
      <Typography variant="h5" style={{padding:10}}>Search for a project</Typography>
      <div style={{paddingLeft:20, paddingRight:40, paddingTop:10, display:'flex'}}>       
        <div style={{display:'inline', width:'30%'}}>
          <div style={{display:'block'}}> <Typography variant="h6">Project:</Typography> </div>
          <div style={{paddingBottom:20}}><RABSelectField object_type = "core_subsite"
                  mode="edit" form="true"
                  add_none="Any"
                  form_field_name="core_subsite"
                  field_value = {form_values.core_subsite}
                  style = {{width:"90%"}}
                  onChange={handleChange}
                  noLabel= {true}
                  disable_underline={false}
                />
            </div>
            <div style={{display:"block"}}><Typography variant="h6">Project Type:</Typography></div>
            <div style={{paddingBottom:20}}>
              <RABSelectField object_type = "nwn_project_type"
                  mode="edit" form="true"
                  add_none="Any"
                  form_field_name="nwn_project_type"
                  value = {form_values.nwn_project_type}
                  name = "nwn_project_type"
                  style = {{width:"90%"}}
                  onChange={handleChange}
                  noLabel= {true}
                  disable_underline={false}
                />
            </div>
            <div style={{display:"block"}}><Typography variant="h6">Role:</Typography></div>
            <div  style={{paddingBottom:20}}>
              <RABSelectField object_type = "core_role"
                  mode="edit" form="true"
                  add_none="Any"
                  form_field_name="core_role"
                  value = {form_values.core_role}
                  name="core_role"
                  style = {{width:"90%"}}
                  onChange={handleChange}
                  noLabel= {true}
                  disable_underline={false}
                  api_options={{filter_field:"accept_signups", filter_id:true}}
                />
            </div>
            <div style={{display:"block"}}><Typography variant="h6">Country:</Typography></div>
            <div style={{paddingBottom:20}}>
              <RABSelectField object_type = "core_country"
                  mode="edit" form="true"
                  add_none="Any"
                  form_field_name="core_country"
                  value = {form_values.core_country}
                  name="core_country"
                  style = {{width:"90%"}}
                  onChange={handleChange}
                  noLabel= {true}
                  disable_underline={false}
                />
            </div>
            <div style={{display:"block"}}><Typography variant="h6">State or Province:</Typography></div>
            <div style={{paddingBottom:20}}>
              <RABSelectField object_type = "core_state_province"
                  mode="edit" form="true"
                  add_none="Any"
                  form_field_name="core_state_province"
                  value = {form_values.core_state_province}
                  name="core_state_province"
                  style = {{width:"90%"}}
                  onChange={handleChange}
                  noLabel= {true}
                  disable_underline={false}
                  api_options={state_api_options}
                />
            </div>
            <div style={{display:"block"}}><Typography variant="h6">Postal Code:</Typography></div>
            <div style={{paddingBottom:20, width:'90%'}}>      
              <ACSField 
                  object_type="core_subsite"
                  field_mode="filter" field_form={true}
                  field_name="zip_code"
                  data = {form_values}
                  name="zip_code"
                  style = {{width:"90%"}}
                  id="zip_code" key="zip_code"
                  onFieldSubmit={handleTextSubmit}
                  noLabel= {true}
                  autoFocus={false}
                  disable_underline={false}
                />
            </div>

        </div>
        <div style={{width:"70%"}}>
          {form_touched && subsite_data !== "" && subsite_data.length ===0 &&
          <Card variant="outlined" style={{padding:30,backgroundColor:"#DDDDDD"}}>
            There are no results that meet your criteria.
          </Card>
          }
          {subsite_data.length ===1 &&
          <Card variant="outlined" style={{padding:30,backgroundColor:"#DDDDDD"}}>
          <NWAProjectSummary data={subsite_data[0]} field_list={subsite_info_fields} object_type="core_subsite" mode="view" num_columns={1}  />
          </Card>}
          {subsite_data.length >1 &&
            <ACSObjectTypeView data={subsite_data} field_click_to_edit={false} rab_component_model={{list:{names:{header_wrap:"RABVoid"}}}} field_models={field_models} field_list={["more", "name","summary","address"]} object_type="core_subsite" mode="view" num_columns={1}  />
          }
         </div>
     </div>
   
  
  </Fragment>)
}


//export default withStyles(styles, { withTheme: true })(VolunteerNew);
export default SubsiteSelect;

