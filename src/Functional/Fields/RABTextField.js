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


function RABTextField(props) {
  const {mode, data, field_name, field_model, formdata, formValues,  onChange, autoFocus} = props
  // XX field model passed due to referenced change. May 
  // be done server side later
  const field_value = data[field_model.final_field_name?field_model.final_field_name:field_name]
  switch (mode) {
    case "text", "view":
      return field_value?field_value:" "
      break 
    case "edit":
    case "create":
      return (
          <TextField 
            autoFocus={autoFocus}
            name={field_name} 
            key={field_name}
            onBlur={props.onFieldBlur}
            value={formValues[props.field_name]}
            onChange={onChange}/>
        )
      break
    case "csv":
      return '"'+field_value+'""'
      break
    default:
      return field_value
  }
}

export default RABTextField;
