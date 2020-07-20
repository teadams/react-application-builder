import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {AuthContext, Auth, LoginForm} from '../User/index.js';

import useForm from '../../Hooks/useForm';
import useGetObject  from '../../Hooks/useGetObject';
import ACSRowController from '../../Functional/ACSRowController.js'
import ACSHeadlessObjectView from '../../Functional/Rows/ACSHeadlessObjectView.js'
import RABSelectField from '../../Functional/Fields/RABSelectField.js'
import RABTextField from '../../Functional/Fields/RABTextField.js'

import ObjectView from '../../RABComponents/ObjectView.js'

import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import {Container, Box, Card, TableHead, TableContainer, Table, TableBody, TableRow, TableCell} from '@material-ui/core';
import useGetModel from '../../Hooks/useGetModel.js'

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
  const [subsite_data, setSubsiteData] = useState("");
  const [subsite_needs, setSubsiteNeeds] = useState("");
  const [volunteer_confirm, setVolunteerConfirm] = useState(false);

  const [selected_touch, setSelectedTouched] = useState(false);

  const field_models = useGetModel("fields", "core_subsite")
  const project_field_model = field_models["name"]

  const {formValues, lastTouched, handleFormChange, handleFormSubmit} = useForm("core_subsite_role", "", "", "", "create", "true", {email_perm:true, status:"Applied"}, ["id", "core_subsite", "core_role", "status", "message", "email_perm"]);

  let show_needs = subsite_data?true:false

  function handleOnClose() {
    if (props.onClose) {
      props.onClose()
    }
  }

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
            let need = subsite_needs[need_idx]
            let project_id = need.nwn_project_id
            let need_id = need.id1
            let volunteer_object = {}
            volunteer_object.core_subsite  = need.core_subsite.id
            volunteer_object.core_user = context.user.id
            volunteer_object.core_role = need.role_name.id
            volunteer_object.email_perm = formValues.email_perm
            volunteer_object.status = formValues.status
            data.postData("core_subsite_role", volunteer_object, {}, (result, error) => { 
              if (error) {
                alert("error is " + error)
              } else { 
                let volunteer_record = result.rows[0].id;
                let message_object = {}
                message_object.from_user = context.user.id;
                message_object.to_user = need.nwn_project_leader;
                message_object.applicant_subsite_role = volunteer_record;
                message_object.core_subsite = need.core_subsite.id;
                message_object.subject  = "Volunteer Application for " + need.role_name_name;
                message_object.body = formValues.message;
                message_object.creation_user = context.user.id
                message_object.read_p = false
                data.postData("nwn_project_message", message_object, {}, (result, error) => {       
                    if (error) {
                        alert("error is " + error)
                    } else {
                      context.setDirty();    
                    }
                })
              }
            })
          }
      }

      if (num_needs === 0 && subsite_data) {
        let message_object = {}
        message_object.from_user = context.user.id;
        message_object.to_user = subsite_data.leader.id;
        message_object.nwn_project = subsite_data.id;
        message_object.subject  = "Interest in your project: "+subsite_data.name;
        message_object.body = formValues.message;
        message_object.creation_user = context.user.id
        message_object.read_p = false
        data.postData("core_message", message_object, {}, (result, error) => {       
            if (error) {
                alert("error is " + error)
            } else {
              context.setDirty();    
            }
        })
      }
      setVolunteerConfirm(true)
  }

  let need_idx = 0

  if (selected_touch) {
    setSelectedTouched(false)
  }

  if (!subsite_needs && (props.id || subsite_data.id)) {
      loadNeedData()
  }

  function loadNeedData () {
      const object_type = "nwn_project_need"
      let filter_id = []
      let filter_field = []
      filter_id.push(props.id?props.id:subsite_data.id)
      filter_id.push(true) 
      filter_id.push("Recruiting")
      filter_field.push("core_subsite")
      filter_field.push("role_name.accept_signups")
      filter_field.push("status")
      let options = {filter_id:filter_id, filter_field:filter_field, filter_join:"AND"}
      data.getData(object_type, options, (data, error) => {       
            setSubsiteNeeds(data)
      })
  }

  const onData=(data) => {
    setSubsiteData(data)
  }

  return (
    <Fragment>
      <ACSHeadlessObjectView object_type="core_subsite" api_options={props.api_options} id={props.id} onData={onData}/>
      {subsite_data && <Dialog fullWidth={true} open={true}  onClose={handleOnClose}>
        <DialogTitle id="form-dialog-title">Volunteer for {u.capitalize(subsite_data.name)}</DialogTitle>
        <DialogContent>
          {volunteer_confirm ?
            <Fragment>
              <Typography>Your interest have been sumbitted to the project leader</Typography>
              <DialogActions>
                <Button onClick={handleOnClose} color="primary">Close</Button>
              </DialogActions>  
            </Fragment>
          :
            <form onSubmit={handleFormSubmit}>
              <VolunteerNeedsIntroduction subsite_needs={subsite_needs}/> 
              <FormControl>
                {subsite_needs && subsite_needs.length > 0 &&
                <FormGroup name="core_subsite" area-label="Available Needs">
            <TableContainer>
              <Table>
              <TableBody>
                {subsite_needs.map(need => {     
                  let need_field_name = "need_" + need_idx 
                  need_idx += 1   
                  return (
                    <TableRow>
                      <TableCell>
                        <Checkbox onChange={handleFormChange} name={need_field_name} value={formValues[need_field_name]} id={need_field_name}/>
                      </TableCell>   
                      <TableCell>{need.role_name.name} - {need.description}</TableCell>
                    </TableRow>
                  )
              })}
          </TableBody>
          </Table>
        </TableContainer>
                </FormGroup>}
                <Typography style={{paddingBottom:10}}>Use the area below to  send a message to the project leader:</Typography>
                <TextField  id="message" name="message"  onChange={handleFormChange} rows="5" rowsMax="10" value ={formValues.message} multiline />
                <FormControlLabel style={{paddingTop:40, align:"top"}} name="email_perm" id="email_id" default={true} checked={formValues.email_perm} label="Check here if it is ok to share your email address with the project leader. This will allow you to continue your conversation in email directly." control={<Checkbox onChange={handleFormChange}/>}/>  
              <DialogActions>
                <DelayedAuthButton onClick={handleVolunteerSubmit} color="primary">Submit</DelayedAuthButton>
                <Button onClick={handleOnClose} color="primary">Close</Button>
              </DialogActions>  
            </FormControl>
            </form>
            }
        </DialogContent>
      </Dialog>}
    </Fragment>
  )
}

function DelayedAuthButton(props) {
  const [auth_tag, setAuthTag] = useState(false)
  const {auth_action="create", object_type="nwn_project_volunteer",  onClick} = props

  function handleOnClick(event) {
    setAuthTag(true)
  }

  function handleOnClose(event) {
    setAuthTag(false)
  }
  
  function handleOnClickAuth(event) {
    setAuthTag(false)
    if (onClick) {
        onClick()
    }
  }
  if (auth_tag) {
    return (<Auth onAuthorized={handleOnClickAuth} auth_action={auth_action} object_type={object_type} onClose={handleOnClose}/>)
  } else {
      return <Button onClick={handleOnClick}>{props.children}</Button>
  }
}

function VolunteerNeedsIntroduction(props) {
   const {subsite_needs} = props
   let custom_intro =""
   if (subsite_needs.length === 1) {
     custom_intro = `The project leader has requested specific help with ${subsite_needs[0].name}. Select this role if you are interested. Otherwise, fill out the message to share with the project leader how you can help.`
   } else if (subsite_needs.length > 1){
     custom_intro = `Select the roles you are interested in.`
  } 
    
  if (custom_intro) {
    return (<Typography>{custom_intro}</Typography>)
  } else {
    return null
  }
}

//export default withStyles(styles, { withTheme: true })(VolunteerNew);
export default SubsiteApply;

