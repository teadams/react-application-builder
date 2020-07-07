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
import ObjectView from '../../RABComponents/ObjectView.js'

import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import {Container, Box, Card, TableHead, TableContainer, Table, TableBody, TableRow, TableCell} from '@material-ui/core';
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
    core_subsite:"",
    nwn_project_type:"",
    core_role:"",
    core_country:"US",
    core_state_province:""
  })
  const [form_touched, setFormTouched] = useState(false)
  const [subsite_data, setSubsiteData] = useState("")
  //const [api_options, setApiOptions] = useState("")
  const subsite_info_fields= ["summary", "leader", "description", "address"]

  function handleChange(event) {
        const value=event.target.value
        const name=event.target.name
        if (form_values[name] !== value) {
          setFormTouched(true)
          setFormValues(form_values=>({...form_values,[name]:value}))
        }
  }

  let api_options = {filter_id:[], filter_field:[], filter_join:"AND"}
  if (form_values.core_subsite) {
    api_options.filter_id.push(form_values.core_subsite)
    api_options.filter_field.push("id")
  }
  if (form_values.nwn_project_type) {
    api_options.filter_id.push(form_values.nwn_project_type)
    api_options.filter_field.push("type")
  }

  if (form_values.core_country) {
    api_options.filter_id.push(form_values.core_country)
    api_options.filter_field.push("country")
  }
  if (form_values.core_state_province) {
    api_options.filter_id.push(form_values.core_state_province)
    api_options.filter_field.push("state")
  }


  const handleSubsiteData = (api_data) => {
      setSubsiteData(api_data)
  }
  return (
    <Fragment>
      {api_options && form_touched && <ACSObjectTypeView headless={true} api_options={api_options} object_type="core_subsite" onData={handleSubsiteData}/>}
      <Typography variant="h5" style={{padding:10}}>Search for a project</Typography>
      <div style={{paddingLeft:20, paddingRight:40, paddingTop:10, display:'flex'}}>       
        <div style={{display:'inline', width:'30%'}}>
          <div style={{display:'block'}}> <Typography variant="h6">Project:</Typography> </div>
          <div style={{paddingBottom:20}}><RABSelectField object_type = "core_subsite"
                  mode="edit" form="true"
                  add_any={true}
                  form_field_name="core_subsite"
                  value = {form_values.core_subsite}
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
                  add_any={true}
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
                  add_any={true}
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
                  add_any={true}
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
                  add_any={true}
                  form_field_name="core_state_province"
                  value = {form_values.core_state_province}
                  name="core_state_province"
                  style = {{width:"90%"}}
                  onChange={handleChange}
                  noLabel= {true}
                  disable_underline={false}
                  api_options={{filter_field:"country_alpha_2", filter_id:form_values.core_country}}
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
          <ACSRowController data={subsite_data[0]} field_list={subsite_info_fields} object_type="core_subsite" mode="view" num_columns={1}  />
          </Card>}
          {subsite_data.length >1 &&
            <ACSObjectTypeView data={subsite_data} field_click_to_edit={false} rab_component_model={{list:{names:{header_wrap:"RABVoid"}}}} field_list={["name","summary","address"]} object_type="core_subsite" mode="view" num_columns={1}  />
          }
         </div>
     </div>
   
  
  </Fragment>)
}


//export default withStyles(styles, { withTheme: true })(VolunteerNew);
export default SubsiteSelect;

