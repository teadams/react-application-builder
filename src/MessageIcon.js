import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { fade, withStyles, makeStyles } from '@material-ui/core/styles';
import React, { Component, Fragment, useState, useContext} from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import TabMenu from './RABComponents/TabMenu';
import MailIcon from '@material-ui/icons/Mail';
import DrawerMenu from './RABComponents/DrawerMenu';
import {Grid} from 'material-ui'
import ACSObjectCount from './Functional/Text/ACSObjectCount.js'
import ACSObjectTypeView from './Functional/Lists/ACSObjectTypeView.js'
import ACSObjectView from './Functional/Rows/ACSObjectView.js'
import ACSField from './Functional/ACSField2.js'
import {ContextSelect, AuthToggleLink, AuthContext, AuthContextProvider, Auth} from './Modules/User';
import Body from "./Body"
import Debug from "./Debug.js"
import * as meta from './Utils/meta.js'
import * as u from './Utils/utils.js'
import * as api from './Utils/data.js'

import {Container, AppBar, Toolbar, Typography, Paper, Popover, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@material-ui/core';
import useGetModel from "./Hooks/useGetModel.js"


function MessageIcon(props) {
  const context = useContext(AuthContext)
  const user_id = context.user.id
  const [message_count, setMessageCount] = useState(0)

  const [anchorEl, setAnchorEl] = useState(null);
  const [message_data, setMessageData] = useState(null);
  const [message_open, setMessageOpen] = useState(false);
  const [role_data, setRoleData] = useState(null)

  function handleMessageClick(event, id, type,field_name, data) {
    if (message_open) {
        handleMessageClose()
    } else {
        handleMessageOpen(data)
    }
  }

  function handleMessageOpen(data) {
      setMessageOpen(data)  
      if (!data.read_p) {
        const read_object = {id:data.id, read_p:true}
        api.postData("core_message", read_object, {}, (result, error) => { 
            if (error) {
              alert("error is " + error)
            } else {
              // could also refetch data
              let read_update_message_data = Array.from(message_data)
              let message
              for (message of read_update_message_data) {
                  if (message.id === data.id) {
                    message.read_p = true
                    continue
                  }
                  setMessageData(read_update_message_data)
              }
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

  function handleRoleApprove() {

    const approve_object = {id:message_open.applicant_subsite_role.id, status:"Approved"}
    api.postData("core_subsite_role", approve_object, {}, (result, error) => { 
        if (error) {
          alert("error is " + error)
        } else {
          let approve_update_message_data = Array.from(message_data)
          let message
          for (message of approve_update_message_data) {
              if (message.id === message_open.id) {
                message.applicant_subsite_role.status = "Approved"
                continue
              }
              setMessageData(approve_update_message_data)
          }
        }
    })
    handleMessageClose()
  }

  function MessageRow(row_props) {
    const {mode, form, field_chunk, data, field, rab_component_model, handleFormChange, handleFormSubmit, formValues, key_id, field_list, s_index, f_index} = row_props
    const {...row_params} = row_props
    return (
      <Fragment>
        {field_list.map(field_name =>{
          const emphasis = data.read_p?"":"bold"
          return <ACSField onFieldClick={handleMessageClick} field_mode={mode} field_form={false} field_name={field_name} emphasis={emphasis} {...row_params} key={field_name} key_id={field_name}/>
        })}
        {message_open && (!message_open.applicant_subsite_role || message_open.applicant_subsite_role.status !== "Applied" || role_data) &&
        <Dialog fullWidth={true} open={message_open} onClose={handleMessageClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{message_open.subject}</DialogTitle>
            <DialogContent>
              <div style={{display:'flex'}}>
                <div><Typography>From:&nbsp;</Typography></div><div><Typography><ACSField data={message_open} object_type="core_message" field_mode="view" field_model={{with_thumbnail:false}} field_form={false} with_thumbnail={false} field_name="from_user" key="from_user" key_id="from_user"/></Typography></div>
                <div style={{flexGrow:1}}/>
                <div><Typography>Date: <ACSField data={message_open} object_type="core_message" field_mode="view" field_form={false} field_name="last_updated_date" key="last_updated_date" key_id="last_updated_date"/>  </Typography></div>
              
              </div>
              <div style={{paddingBottom:20}}/><Typography style={{paddingBottom:20}}>
              <ACSField data={message_open} object_type="core_message" field_mode="view" field_form={false} field_name="body" key="body" key_id="body"/></Typography>
              {role_data &&
                  <Typography><i>This message is an application for the role <b>role_data.name}</b> in <b>{message_open.core_subsite.name}</b>.  To accept, click "Approve". Otherwise, click "Close".</i></Typography>
              }
            </DialogContent>
          <DialogActions>
          {role_data &&
          <Button onClick={handleRoleApprove} color="primary">
            Approve
          </Button>
          }
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

    {message_open && message_open.applicant_subsite_role && message_open.applicant_subsite_role.status === "Applied" &&         
        <ACSObjectView onData={handleRoleData} headless={true} object_type="core_role"  api_options={{filter_id:message_open.applicant_subsite_role.core_role, filter_field:"id"}}/>}

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



