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


// <TextField    
//   InputLabelProps={{shrink:true}}
//   name={.name}
//   label={field.pretty_name}
//   disabled={options.disabled?options.disabled:true}
//   type="text"
//   helperText={field.helper_text}
//   value=  {this.getDisplayView(object_type,field,prefix)}
//  style={{width:"90%"}}

// Make the loop a Function
// Call from top  
// Put in the child
// Get correct query
// add levels
function formTreeData(data, tree_depth=0) {
  let tree_data = []
  data.map(row => {
      row.tree_depth = tree_depth
      tree_data.push(row)
      if (data.children && data.children.length >0) {
          tree_depth +=1
          tree_data = tree_data.concat(formTreeData(data.children, tree_depth))
      }
  })
  return tree_data
}

function padding(num) {
  let i;  
  let padding = ""
  for (i = 0; i < num; i++) {
    padding = padding + "&npsp;&nbsp;"
  }
  return padding
}

function selectItems(data, select_key_field, select_display_field) {
    return (
      data.map (row => {
        return(
          <MenuItem value={row[select_key_field]}>{padding(row.tree_depth)}{row[select_display_field]}</MenuItem>
          )
        })
    )
}

function RABSelectObject(props) {

  return (<Fragment>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      name={props.select_form_name}
      value={props.value}
      autoFocus={props.autoFocus}
      onBlur={props.onSubmit}
      style={props.style}
      onChange={props.onChange}>  
      {props.data && selectItems(props.data,props.select_key_field,props.select_display_field)}
    </Select>
    </Fragment>)
}

function RABSelectField(props) {
  const {mode, data, field_name, formdata, formValues, onSubmit, onFieldBlur,  onChange, autoFocus, object_type, field_model, value, style} = props
  //data and field name specific the selected value for View mode
  // field_model specificy the select and dispaly fileds
  // formValues holds the controlled data
  const formValues_name = formValues?field_model.formValues_name:""
  const field_value = formValues?formValues[formValues_name]:value
  const field_display_value = data?data[field_name]:""
  const select_key_field = field_model?field_model.select_key_field:meta.keys(object_type).key_id;
  const select_display_field = field_model? field_model.select_display_field:meta.keys(object_type).pretty_key_id;
  let rab_component_model = rab_component_models.shell
  rab_component_model.list.components.list_wrap = RABSelectObject
  switch (mode) {
    case "text", "view":
      return field_display_value?field_display_value:" "
      break   
    case "edit":
    case "create":
      return (<ACSListController object_type={object_type}  rab_component_model={rab_component_model} list_select_form_name={formValues_name} list_onSubmit={onSubmit} list_field_value={field_value} list_onChange={onChange} list_select_key_field={select_key_field} list_style={style} list_select_display_field={select_display_field} list_autoFocus={autoFocus} />)
      break
    case "csv":
      return '"'+field_display_value+'""'
      break
    default:
      return field_display_value
  }
}

export default RABSelectField;
