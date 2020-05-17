import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import ACSListController from '../ACSListController.js'
import rab_component_models from '../../Models/HealthMe/component.js'


// <TextField    
//   InputLabelProps={{shrink:true}}
//   name={.name}
//   label={field.pretty_name}
//   disabled={options.disabled?options.disabled:true}
//   type="text"
//   helperText={field.helper_text}
//   value=  {this.getDisplayView(object_type,field,prefix)}
//  style={{width:"90%"}}
function RABSelectObject(props) {
  return (<FormControl>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      name={props.select_form_name}
      value={props.value}
      autoFocus={props.autoFocus}
      onBlur={props.onSubmit}
      onChange={props.onChange}
    >{props.data.map (row => {
      return (<MenuItem value={row[props.select_key_field]}>{row[props.select_display_field]}</MenuItem>)
      })}
    </Select>
  </FormControl>)
}

function RABSelectField(props) {
  const {mode, data, field_name, formdata, formValues, onSubmit, onFieldBlur,  onChange, autoFocus, object_type, field_model} = props
  const formValues_name = field_model.formValues_name
  const field_value = formValues[formValues_name]
  const field_display_value = data[field_name]
  const select_key_field = field_model.select_key_field
  const select_display_field = field_model.select_display_field
  let rab_component_model = rab_component_models.shell
  rab_component_model.list.components.list = RABSelectObject
  switch (mode) {
    case "text", "view":
      return field_display_value?field_display_value:" "
      break   
    case "edit":
    case "create":
      return (<ACSListController object_type={object_type} field_list={["alpha_2", "name"]} rab_component_model={rab_component_model} list_select_form_name={formValues_name} list_onSubmit={onSubmit} list_field_value={field_value} list_onChange={onChange} list_select_key_field={select_key_field} list_select_display_field={select_display_field} list_autoFocus={autoFocus} />)
      break
    case "csv":
      return '"'+field_display_value+'""'
      break
    default:
      return field_display_value
  }
}

export default RABSelectField;
