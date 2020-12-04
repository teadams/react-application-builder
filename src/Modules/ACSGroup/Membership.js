// Copyright Teadams Holding Company 2019
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import * as api from '../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { ListItem, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import * as meta from '../../Utils/meta.js';
import {ACSTabMenu, ACSObjectType} from '../../ACSLibrary'
import {ACSFilterController} from '../../ACSRenderEngine'
import AuthContext from '../../Modules/User/AuthContext';

function Membership(props) {
  const {id} = props
  const [core_roles, setCoreRoles] = useState([])
  const [members, setMembers] = useState([])

  const context = useContext(AuthContext)

  const filters = [
    {select_label:"Role", name:"key", default_value:1, object_type:"core_role",  select_field_name:"name", filter_field_name:"core_role", any_display_label:"Any"},
    {select_label:"Status", name:"status", default_value:"Accepted", object_type:"core_subsite_role",  select_field_name:"status", filter_field_name:"status", any_display_label:"Any"}
    ]

  if (id && id !=context.context_id && id !== "context") {
    context.setContextId(id)
    return null
  }
  // Get the roles 
  const handleOnData = (api_results) => {
      setCoreRoles(api_results)
  }

  const handleFilterChange = (props) => {
    const api_options = Object.assign({},props)
    const object_type = "core_subsite_role"
    api_options.filter_field.push("core_subsite")
    api_options.filter_id.push(context.context_id)
    api_options.filter_join="AND"
    api.getData(object_type, api_options, (api_data, error) => {
      setMembers(api_data)
    })
    
  }

  return (
    <Fragment>
      {context.context_id &&
      <ACSFilterController filters={filters} default_value={3} alingSelf="flex-start" label_direction="row" label_variant="subtitle1" onChange={handleFilterChange}/>}
      {members.map ((member_data,index) => {
          const member = member_data.data_core_user
          return (<ListItem  key={index} value={index} name={index}>{member.first_name} {member.last_name}</ListItem>)
      })}
    </Fragment>
  )
}

//valid_values:"Applied, Accepted, Denied, Retired", default:"Accepted"

export default Membership
