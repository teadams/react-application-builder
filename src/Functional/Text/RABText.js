import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import ACSListController from '../ACSListController.js'
import rab_component_models from '../../Models/HealthMe/component.js'
import * as meta from '../../Utils/meta.js';
import ACSCreateButton from '../Buttons/ACSCreateButton.js'
import ACSEditButton from '../Buttons/ACSEditButton.js'


function RABText(props) {
  const {object_type, action=""} = props
  let ActionButton = ""
  
  switch (action) {
    case "create":
      ActionButton = ACSCreateButton 
      break
    case "edit":
      ActionButton = ACSEditButton 
      break
  }

  const {header=false, variant=header?"h5":"body1", text} = props
  let {style} = props
  if (!header) {
    style = Object.assign({display:"inline"}, style)
  }
  return (<Typography variant={variant} style={style}>{text}
{action && <ActionButton object_type={object_type}/>}</Typography>)
}

export default RABText
