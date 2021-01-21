import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { fade, withStyles, makeStyles } from '@material-ui/core/styles';
import React, { Component, Fragment, useState, useContext} from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import {Grid} from 'material-ui'
import ACSObjectCount from '../Functional/Text/ACSObjectCount.js'
import ACSObjectTypeView from '../Functional/Lists/ACSObjectTypeView.js'
import ACSObjectView from '../Functional/Rows/ACSObjectView.js'
import {ACSFieldController} from '../ACSRenderEngine'

import {ContextSelect, AuthToggleLink, AuthContext, AuthContextProvider, Auth} from '../Modules/User';
import * as meta from '../Utils/meta.js'
import * as u from '../Utils/utils.js'
import * as api from '../Utils/data.js'

import {Container, AppBar, Toolbar, Typography, Paper, Popover, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@material-ui/core';
import useGetModel from "../Hooks/useGetModel.js"


function MessageIcon(props) {
  const context = useContext(AuthContext)
  const user_id = context.user.id
  const [message_count, setMessageCount] = useState(0)

  const [anchorEl, setAnchorEl] = useState(null);

  const [message_data, setMessageData] = useState(null);
  const [message_open, setMessageOpen] = useState(false);

  const [workflow_object, setWorkflowObject] = useState({});

  const [role_data, setRoleData] = useState(null)

  function handleMessageClick(event, id, type,field_name, data) {
    if (message_open) {
        handleMessageClose()
        setWorkflowObject({})
    } else {
        if (!data.from_user) {
            data.from_user = "System"
        }
        handleMessageOpen(data)
    }
  }

  function handleMessageOpen(data) {
      if (data.core_workflow_object) {
        const object_id = data.data_core_workflow_object.object_id
        const object_object_type = data.data_core_workflow_object.object_type
        api.getData (object_object_type, {id:object_id}, (results, error) => { 
            setWorkflowObject(results[0])
        })
      }
      setMessageOpen(data)  
      if (!data.read_p) {
        const read_object = {id:data.id, read_p:true}
        api.postData("core_message", read_object, {}, (result, error) => { 
            if (error) {
              alert("error is " + error)
            } 
      })
    }
  }

  function handleMessageClose() {
    setMessageOpen(false)
    setRoleData(null)
  }

  function handleRoleData(role_data) {
    setRoleData(role_data)
  }

  function handleApprove() {
    const approve_object = {id:message_open.core_workflow_object, acs_workflow_action:"approve"}
    api.postData("core_workflow_object", approve_object, {}, (result, error) => { 
        if (error) {
          alert("error is " + error)
        } else {
          u.a("approved")
        }
    })
    handleMessageClose()
  }

  function MessageRow(row_props) {
    const {mode, form, field_chunk, data, field, rab_component_model, handleFormChange, handleFormSubmit, formAttributes=[], key_id, field_list, s_index, f_index} = row_props
    const {...row_params} = row_props
    const [formValues, formVisibility, formValidated] = formAttributes

    return (
      <Fragment>
        {field_list.map(field_name =>{
          const emphasis = data.read_p?"":"bold"
          return <ACSFieldController onFieldClick={handleMessageClick} field_mode={mode} field_form={false} field_name={field_name} emphasis={emphasis} {...row_params} key={field_name} key_id={field_name}/>
        })}
        {message_open &&
        <Dialog fullWidth={true} open={message_open} onClose={handleMessageClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{message_open.subject}</DialogTitle>
            <DialogContent>
              <div style={{display:'flex'}}>
                <div><Typography>From:&nbsp;</Typography></div><div><Typography><ACSFieldController data={message_open} object_type="core_message" field_mode="view" field_model={{with_thumbnail:false}} field_form={false} with_thumbnail={false} field_name="from_user" key="from_user" key_id="from_user"/></Typography></div>
                <div style={{flexGrow:1}}/>

                <div><Typography>Date: <ACSFieldController data={message_open} object_type="core_message" field_mode="view" field_form={false} field_name="last_updated_date" key="last_updated_date" key_id="last_updated_date"/>  </Typography></div>              
              </div>
              <div style={{paddingBottom:20}}/><Typography style={{paddingBottom:20}}>
              <ACSFieldController data={message_open} object_type="core_message" field_mode="view" field_form={false} field_name="body" key="body" key_id="body"/></Typography>
              {message_open.core_workflow_object&& 
                <Fragment>  
                  {workflow_object &&
                  <ACSObjectView id={workflow_object.id} data={workflow_object}
                  field_list={["license_purpose","new_renew","free_form_description"]}
                  object_type="license_application" />
                  }
                  <Button variant="contained" onClick={handleApprove} color="primary">
                       Approve
                  </Button>

                </Fragment>
              }
            </DialogContent>
          <DialogActions>
          <Button onClick={handleMessageClose} color="primary">
            Close
          </Button>
        </DialogActions>
        </Dialog> }
      </Fragment>)

  }

// if applicant_subsite_role -- 
// and status is Applied
// core_role
// leader notes
// Then ask for approval

  function handleMessageCount(count) {
    setMessageCount(count)
  }

  function handleMessageData(message_data) {
    setMessageData(message_data)
  }


  const handleClick = (event) => {
     setAnchorEl(event.currentTarget);
   };
 
   const handleClose = () => {
     setAnchorEl(null);
   };
  
   const open = Boolean(anchorEl);
   const id = open ? 'simple-popover' : undefined;

  return    ( 
    <Fragment>
    {user_id && <ACSObjectCount headless={true} object_type="core_message" api_options={{get_count:true, num_rows:1, filter_id:user_id+","+false, filter_join:"and", filter_field:"to_user,read_p"}} onData={handleMessageCount}/> }

    <IconButton aria-label="show new mails" color="inherit" onClick={handleClick}>
        <Badge badgeContent={message_count} color="secondary">
            <MailIcon />
        </Badge>
    </IconButton>
    {open &&<Auth object_type="core_message"/>}
    {user_id && open && 
        <ACSObjectTypeView onData={handleMessageData} headless={true} object_type="core_message"  api_options={{filter_id:user_id ,filter_join:"and", filter_field:"to_user"}}/>}
    {user_id && open && message_data &&
      <Popover  
        PaperProps={{style:{padding:"20px"}}}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    ><div>
        <ACSObjectTypeView data={message_data} field_list={[ "from_user","subject","read_p"]}
        rab_component_model={{list:{props:{action:""}},row:{components:{row:MessageRow}}}}  object_type="core_message"  api_options={{filter_id:user_id ,filter_join:"and", filter_field:"to_user"}}/>
      </div>
    </Popover>}
    </Fragment>
  )
}

export default MessageIcon;



