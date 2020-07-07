import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
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
  const [project_id, setProjectId] = useState();

  const [role_type_id, setRoleTypeId] = useState(props.role_type_id);
  const [role_name, setRoleName] = useState("");

  const [project_needs, setProjectNeeds] = useState([]);

  const [selected_touch, setSelectedTouched] = useState(false);

  const field_models = useGetModel("fields", "core_subsite")
  const project_field_model = field_models["name"]

  const [project_data, setProjectData] = useState("")

  const project_info_fields= ["summary", "leader", "description", "street_address", "city", "state", "country", "zip_code"]

  const {formValues, lastTouched, handleFormChange, handleFormSubmit} = useForm("core_subsite_role", "", "", "", "create", "true", {email_perm:true, status:"Applied"}, ["id", "core_subsite", "core_role", "status", "message", "email_perm"]);

  let show_needs = (project_id ||role_type_id)?true:false

  let need_idx = 0

  function handleProjectChange(event) {
        const value=event.target.value
        if (value !== project_id) {
          setProjectData(event.target.selected_data)
//          setProjectName(project_name)
          setProjectId(value)
          setSelectedTouched(true)
        }
  }
  function handleRoleTypeChange(event) {
    const value = event.target.value
    const role_name = event.target.selected_data.name
    if (value != role_type_id) {
        setRoleName(role_name)
        setRoleTypeId(value)
        setSelectedTouched(true)
    }
  }


  if (selected_touch) {
      setSelectedTouched(false)
  }

  const handleProjectData = (project_data) => {
      setProjectData(project_data)
  }
  return (
    <Fragment>
      <Typography variant="h5" style={{padding:10}}>Volunteer Opportunities</Typography>
      <Typography style={{padding:5}}>
          Thank you for your interest in helping the Now We Act community. You may start the process by picking either a specific project or a specific role below.  The lower part of the page will update with the needs available. 
      </Typography>
      <div style={{paddingLeft:10, paddingRight:40, paddingTop:10, display:'flex'}}>       
        <div style={{display:'inline', width:'30%'}}>
          <div style={{display:'block'}}> <Typography variant="h5">Project:</Typography> </div>
          <div style={{paddingBottom:20}}><RABSelectField object_type = "core_subsite"
                  mode="edit" form="true"
                  add_any={true}
                  value = {project_id}
                  style = {{width:"90%"}}
                  onChange={handleProjectChange}
                  noLabel= {true}
                  disable_underline={false}
                />
            </div>
            <div style={{display:"block"}}><Typography variant="h5">Role:</Typography></div>
            <div>
              <RABSelectField object_type = "core_role"
                  mode="edit" form="true"
                  add_any={true}
                  value = {role_type_id}
                  style = {{width:"90%"}}
                  onChange={handleRoleTypeChange}
                  noLabel= {true}
                  disable_underline={false}
                  api_options={{filter_field:"accept_signups", filter_id:true}}
                />
            </div>
        </div>
        <div style={{width:"70%"}}>
          {project_id &&
          <Card variant="outlined" style={{padding:30,backgroundColor:"#DDDDDD"}}>
          <ACSRowController data={project_data} field_list={project_info_fields} object_type="core_subsite" mode="view" id={project_id} num_columns={1}  />
          </Card>}        
         </div>
     </div>
   
  
  </Fragment>)
}


//export default withStyles(styles, { withTheme: true })(VolunteerNew);
export default SubsiteSelect;

