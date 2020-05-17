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

function RABSelectField(props) {
  const {mode, data, field_name, formdata, formValues,  onChange, autoFocus, onBlur, object_type, field_model} = props
//  u.aa("in select, field_name", field_name, formValues)
  const formValues_name = field_model.formValues_name
//  const field_value = "foo"
  const field_value = formValues[formValues_name]
  const field_display_value = data[field_name]
  let rab_component_model = rab_component_models.shell

  //u.a(formValues_name, field_value) // original name... reference field name
  // object_type, dispaly_typex

//    <TextField 
//      autoFocus={autoFocus}
//      name={field_name} 
//      value={field_value}
//      onChange={onChange}/>

//<ACSListController object_type={object_type}  rab_component_model={rab_component_model}/>)

   const [age, setAge] = React.useState('10');
  switch (mode) {
    case "text", "view":
      return field_display_value?field_display_value:" "
      break   
    case "edit":
    case "create":
      return (
        <Fragment><form>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            autoFocus={autoFocus}
            onBlur={onBlur}
            onChange={onChange}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl></form></Fragment>)

      break
    case "csv":
      return '"'+field_display_value+'""'
      break
    default:
      return field_display_value
  }
}

export default RABSelectField;
