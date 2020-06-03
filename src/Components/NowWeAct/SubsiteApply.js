import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import AuthContext from '../User/AuthContext';
import useForm from '../../Hooks/useForm';
import useGetObject  from '../../Hooks/useGetObject';


import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import {Container, Box,  TableHead, TableContainer, Table, TableBody, TableRow, TableCell} from '@material-ui/core';

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

function ProjectInfo(props) {
  const project_data = props.project_data
  if (project_data) {
    return (<Fragment>
      <Box>
      <Typography variant="h6">{project_data.name} Details</Typography>
      <TableContainer>
        <Table size="small">
          <TableRow>
            <TableCell>Summary</TableCell>
            <TableCell>{project_data.summary}</TableCell>
          </TableRow>
          <TableRow>
          <TableCell>Description</TableCell>
          <TableCell>{project_data.description}</TableCell>
        </TableRow>
        <TableRow>
            <TableCell>Location</TableCell>
            <TableCell>{project_data.address} {project_data.city} {project_data.core_state_name} {project_data.core_country_name} {project_data.zip_code}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Leader</TableCell>
            <TableCell>{project_data.leader_first_name} {project_data.leader_last_name}</TableCell>
          </TableRow>
        </Table>
      </TableContainer>
      </Box>
      </Fragment>
    )
  } else {
    return ""
  }
}

function SubsiteApply(props) {
  const context = useContext(AuthContext)
  const [project_id, setProjectId] = useState(props.project_id);
  const [project_name, setProjectName] = useState("");
  const [role_type_id, setRoleTypeId] = useState(props.role_type_id);
  const [role_name, setRoleName] = useState("");
  const [project_needs, setProjectNeeds] = useState([]);
  const [selected_touch, setSelectedTouched] = useState(false);
  const project_field = meta.field("nwn_project", "name")
  const project_data = useGetObject("nwn_project", project_id);
  const {formValues, handleFormChange, handleFormSubmit} = useForm({email_perm:true}, handleVolunteerSubmit);
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
            volunteer_object.creation_user = context.user_id
            volunteer_object.email_perm = formValues.email_perm
            data.postData("nwn_project_volunteer", volunteer_object, {}, (result, error) => { 
              if (error) {
                log.val("error is " + error)
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
                        log.val("error is " + error)
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
                log.val("error is " + error)
            } 
        })
      }
      alert ("You interest has been submitted to the project leader")
      setProjectId("")
      setRoleTypeId("")      
  }

  let need_idx = 0

  function handleProjectChange(value, project_name) {
        if (value != project_id) {
          setProjectName(project_name)
          setProjectId(value)
          setSelectedTouched(true)
        }
  }
  function handleRoleTypeChange(value, role_name) {
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
        header = `Volunteer Opportunities in Project ${project_name}`
        custom_intro = `The table below lists the volunteer opportunities a ${project_name}.`
    } else if (role_type_id && !project_id) {
        header = `Volunteer Opportunities for Role ${role_name}`
        custom_intro = `The table below lists the volunteer opportunities for ${role_name} accoss all the Now was Act project.`
    } else {
        header = `Volunteer Opportunities for Project ${project_name} Role ${role_name}`
        custom_intro = `The table below lists the volunteer opportunities for ${role_name} in the ${project_name} project.`
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
  
  return (
    <Fragment>
      <Typography variant="h5" style={{padding:10}}>Volunteer Opportunities</Typography>
      <Typography style={{padding:5}}>
          Thank you for your interest in helping the Now We Act community. You may start the process by picking either a specific project or a specific role below.  The lower part of the page will update with the needs available. 
      </Typography>
      <Grid container style={{padding:20}}>
        <Grid  item xs={4}>
          <SelectObject object_type="nwn_project" shrink="false" style={{width:"90%"}} value={project_id} add_any={true} onChange={handleProjectChange}/>
        </Grid> 
        <Grid   item xs={2}>
          <SelectObject object_type="core_role" input_type="radio" shrink="false" style={{width:"90%"}}   filter_id={true} filter_field="accept_signups" add_any={true} value={role_type_id} onChange={handleRoleTypeChange}/>
        </Grid>
      {project_data &&
        <Grid style={box_style} item xs={6}>
              <ProjectInfo project_data={project_data}/>
        </Grid>}
    </Grid> 
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
                      <TableCell>{need.nwn_project_descrtion}</TableCell>
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

