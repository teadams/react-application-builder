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


function SubsiteApply(props) {
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

  const {formValues, lastTouched, handleFormChange, handleFormSubmit} = useForm("core_subsite_role", "", "", handleVolunteerSubmit, "create", "true", {email_perm:true}, ["id", "core_subsite", "core_role", "status", "message", "email_perm"]);

  let show_needs = (project_id ||role_type_id)?true:false

  function handleVolunteerSubmit() {
      let volunteer_object = {}
      volunteer_object.email_perm = formValues.email_perm
      volunteer_object.message =    formValues.message
      let key=""
      let num_needs = 0
      for (key of Object.keys(formValues)) {
          if (key.search("need_") == 0) {
            num_needs += 1
            let need_idx =  key.replace("need_","")
            let need = project_needs[need_idx]
            let project_id = need.nwn_project_id
            let need_id = need.id
            let volunteer_object = {}
            volunteer_object.core_subsite  = need.nwn_project
            volunteer_object.core_user = context.user.id
            volunteer_object.core_role = need.role_name
            volunteer_object.email_perm = formValues.email_perm
            data.postData("nwn_project_volunteer", volunteer_object, {}, (result, error) => { 
              if (error) {
                alert("error is " + error)
              } else { 
                let volunteer_record = result.rows[0].id;
                let message_object = {}
                message_object.from_user = context.user.id;
                message_object.to_user = need.nwn_project_leader;
                message_object.nwn_project_volunteer = volunteer_record;
                message_object.nwn_project = need.nwn_project;
                message_object.subject  = "Volunteer Application for " + need.role_name_name;
                message_object.body = formValues.message;
                message_object.creation_user = context.user.id
                message_object.read_p = false
                data.postData("nwn_project_message", message_object, {}, (result, error) => {       
                    if (error) {
                        alert("error is " + error)
                    } 
                })
              }
            })
          }
      }
      if (num_needs == 0 && project_data) {
        let message_object = {}
        message_object.from_user = context.user.id;
        message_object.to_user = project_data.project_leader;
        message_object.nwn_project = project_data.id;
        message_object.subject  = "Interest in your project";
        message_object.body = formValues.message;
        message_object.creation_user = context.user.id
        message_object.read_p = false
        data.postData("nwn_project_message", message_object, {}, (result, error) => {       
            if (error) {
                alert("error is " + error)
            } 
        })
      }
      alert ("You interest has been submitted to the project leader")
      setProjectId("")
      setRoleTypeId("")      
  }

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
      loadNeedData()
      setSelectedTouched(false)
  }

  function loadNeedData () {
      const object_type = "nwn_project_need"
    
      let filter_id = []
      let filter_field = []
      if (project_id) {
          filter_id.push(project_id)
          filter_field.push("nwn_project")
      } 
      if (role_type_id) {
          filter_id.push(role_type_id)
          filter_field.push("role_name")
      }
      let options = {filter_id:filter_id, filter_field:filter_field, filter_join:"AND"}
      data.getData(object_type, options, (data, error) => {           
          setProjectNeeds(data)
      })
  }

  function VolunteerNeedsIntroduction(props) {
     const standard_text =  "You may select more than one.  Fill out a message to the project leader and hit Submit.  The project leader will be sent a notificaton to review and repond to your interest.   Check the volunteer opportunities you are interested in. Thank you."
     let header = ""
     let custom_intro =""
    if (!show_needs) {
        return null
    } else if (project_id && !role_type_id) {
        header = `Volunteer Opportunities in Project ${project_data.name}`
        custom_intro = `The table below lists the volunteer opportunities a ${project_data.name}.`
    } else if (role_type_id && !project_id) {
        header = `Volunteer Opportunities for Role ${role_name}`
        custom_intro = `The table below lists the volunteer opportunities for ${role_name} accoss all the Now was Act project.`
    } else {
        header = `Volunteer Opportunities for Project ${project_data.name} Role ${role_name}`
        custom_intro = `The table below lists the volunteer opportunities for ${role_name} in the ${project_data._name} project.`
    }
    if ((!project_needs || project_needs.length == 0)) {
        return  ( <Fragment><Typography variant="h6">{header}</Typography>
          <Typography> There are no advertised volunteer needs available. {project_id && "However, please use the form below to connect with the project leader about your interest."}</Typography>
          </Fragment>
        )
    } else {
      return (
        <Fragment><Typography variant="h6">{header}</Typography>
            <p/>
            {custom_intro}
            {standard_text}
            <p/>
        </Fragment>
        )
    }
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
      <div style={{paddingLeft:40, paddingTop:10, display:'flex'}}>       
        <div style={{display:'inline', width:'40%'}}>
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
                />
            </div>
        </div>
        <div style={{width:"50%"}}>
          {project_id &&
          <Card variant="outlined" style={{padding:30,backgroundColor:"#DDDDDD"}}>
          <ACSRowController data={project_data} field_list={project_info_fields} object_type="core_subsite" mode="view" id={project_id} num_columns={1}  />
          </Card>}
         </div>
          <div style={{width:"10%"}}/>
     </div>
     
    {show_needs  && <Fragment>
      <Paper style={box_style}   elevation={1} style={{padding:20, backgroundColor:"lightGray"}}>
      <form onSubmit={handleFormSubmit}>
      <VolunteerNeedsIntroduction /> 
      <FormControl>
      {project_needs && project_needs.length > 0 &&
      <FormGroup name="nwn_project" area-label="Available Needs">
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow><TableCell></TableCell><TableCell>Role</TableCell>
                <TableCell>Role Description</TableCell><TableCell>Project Name</TableCell>
                <TableCell>Project Summary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
        {project_needs.map(need => {     
          let need_field_name = "need_" + need_idx 
          need_idx += 1   
            return (<Fragment>              
      
                  <TableRow>
                      <TableCell>
                        <Checkbox onChange={handleFormChange} name={need_field_name} value={formValues[need_field_name]} id={need_field_name}/>
                      </TableCell>
                      <TableCell>{need.role_name_name}</TableCell>
                      <TableCell>{need.description}  {need.role_name_descritpion}</TableCell>
                      <TableCell>{need.nwn_project_name}</TableCell>
                      <TableCell>{need.nwn_project_description}</TableCell>
                  </TableRow>
              </Fragment>
          ) 
      })}
        </TableBody>
        </Table>
      </TableContainer>
      </FormGroup>}
      {((project_needs && project_needs.length > 0) || project_id) &&
      <Fragment>
      <TextField  id="message" name="message"  onChange={handleFormChange} rows="5" rowsMax="10" value ={formValues.message} label= "Use the area below to  send a message to the project leader." multiline />
      <FormControlLabel name="email_perm" id="email_id" default={true} checked={formValues.email_perm} label="Check here if it is ok to share your email address with the project email. This will allow you to continue your conversation with email directly.  This is highly recommended as you will be able to talk about the project directly." control={<Checkbox onChange={handleFormChange}/>}/>  
          <Button type="submit" value="Submit">Submit</Button></Fragment>
      }
      </FormControl>
    </form>
    </Paper> </Fragment>
    }
  </Fragment>)
}

//export default withStyles(styles, { withTheme: true })(VolunteerNew);
export default SubsiteApply;

