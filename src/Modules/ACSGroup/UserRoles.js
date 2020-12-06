import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js'
import * as data from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import IconEdit from "@material-ui/icons/Edit";
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { IconButton, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import {ACSObjectView, ACSEditButton, ACSField, ACSText, ACSTabMenu, ACSObjectType} from '../../ACSLibrary'
import EditRoleForm from "./EditRoleForm.js"

function UserRoles(props) {
  const {data, core_user, core_subsite} = props
  const [user_roles, setUserRoles] = useState(props.data)

  const [edit_dialog, setEditDialog] = useState(false);
  const [edit_role, setEditRole] = useState(null)

  const api_options = {core_user:core_user, core_subsite:core_subsite}
  const handleOnData = (api_results) => {
      setUserRoles(api_results)
  }

  const handleOnEditClick = (event, user_role, index) => {
    setEditRole(user_role)
    setEditDialog(true)
  }

  const handleOnEditClose= event => {
    setEditDialog(false)
    setEditRole(null)
  }


  return (<Fragment> 
  <ACSObjectType object_type="core_subsite_role" data={data} api_option={api_options} onData={handleOnData} headless={true}/>
  {user_roles && 
  user_roles.map((user_role,index)=> {
    return (<Fragment key={index}>{user_role.data_core_role.name} ({user_role.status})
    <IconButton variant="fab" color="primary"  style={{ display:"inline"}} onClick={(event) => handleOnEditClick(event, user_role, index)}>
    <IconEdit style={{height:15, width:15}}/>
    </IconButton>
    </Fragment> )
  })}  
  {edit_dialog && 
    <Dialog open={true}>
<DialogTitle>Edit Role</DialogTitle>
<DialogContent>
<EditRoleForm open={true} data={edit_role} id={edit_role.id} mode="edit" row_form="true"  onClose={handleOnEditClose} dialog_size="lg"/>

</DialogContent>
</Dialog>
  }
  </Fragment>
  )
}

export default UserRoles;
