// Copyright Teadams Holding Company 2019

import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import * as meta from '../../Utils/meta.js';
import {ACSTabMenu} from '../../ACSLibrary'
import AuthContext from '../../Modules/User/AuthContext';



function ACSGroup(props) {
  const {object_type,id,force_context} = props
  const context = useContext(AuthContext)
  if (id && id !==context.context_id && id !== "context") {
    // special case when context is not set but the URL params 
    // in template 
    if (force_context) {
      context.setContextId(id)
    }
    return null
  }
  const root_path = "/ACSGroup/core_subsite/"+id
  if (context.subsite) {
    return <ACSTabMenu root_path={root_path} menu_type="core_subsite_admin"/>
  } else {
    return null
  }
}

export default ACSGroup
