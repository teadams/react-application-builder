import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js'
import * as data from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import {ACSField, ACSText, ACSTabMenu, ACSObjectType} from '../../ACSLibrary'


function UserRoles(props) {
  const {data, core_user, core_subsite} = props
  const [user_roles, setUserRoles] = useState(props.data)

  const api_options = {core_user:core_user, core_subsite:core_subsite}
  const handleOnData = (api_results) => {
      setUserRoles(api_results)
  }

  return (<Fragment> 
  <ACSObjectType object_type="core_subsite_role" data={data} api_option={api_options} onData={handleOnData} headless={true}/>
  {user_roles && 
  user_roles.map((user_role,index)=> {
    return (<Fragment key={index}>{user_role.data_core_role.name} ({user_role.status}) </Fragment>)
  })}  
  </Fragment>
  )
}

export default UserRoles;
