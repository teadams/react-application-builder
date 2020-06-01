import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import * as control from '../../Utils/control.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import ACSListController from '../ACSListController.js'
import rab_component_models from '../../Models/HealthMe/component.js'
import * as meta from '../../Utils/meta.js';
import useGetModel from '../../Hooks/useGetModel';


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
      if (row.children && row.children.length >0) {
          tree_data = tree_data.concat(formTreeData(row.children, tree_depth+1))
      }
  })
  return tree_data
}

function padding(num) {
  let i;  
  let padding = ""
  for (i = 0; i < num; i++) {
    padding = padding + ".."
  }  
  return <Fragment>{padding}</Fragment>
}

function selectItems(data, select_key_field, select_display_field, field_component) {
    data=formTreeData(data)
    return (
      data.map ((row, index) => {

        return(
          <MenuItem key={index} value={row[select_key_field]}>{padding(row.tree_depth)}{field_component({data:row, field_name:select_display_field, mode:"text"})}</MenuItem>
          )
        })
    )
}

function RABSelectList(props) {
  const field_models = useGetModel("fields")
  const {disable_underline=true, prevent_edit=false} = props
  const select_field_model=field_models[props.object_type][props.select_display_field]
  const field_component_name = select_field_model.field_component 
  // plain function on purpose, will just get text
  const field_component = control.componentByName(field_component_name?field_component_name:"RABTextField")

  return (<Fragment>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      name={props.select_form_name}
      value={props.value}
      autoFocus={props.autoFocus}
      onBlur={props.onBlur}
      style={props.style}
      disabled={prevent_edit}
      disableUnderline = {disable_underline}
      onChange={props.onChange}>
      {props.data && selectItems(props.data,props.select_key_field,props.select_display_field, field_component)}
    </Select>
    </Fragment>)
}

function RABSelectField(props) {

  const {mode, data=[], field_name, formValues, onSubmit, onFieldBlur,  onChange, autoFocus, object_type, field_model={}, value="", display_value=" ", style, api_options} = props
  // 2 use cases:
  // 1. Called from a create/edit form (formValues is present)
  //   View will show field_display_value takend from data object.
  //   Edit/create uses controlled values from formValues
  
  // 2. Called directly 
  //     dispaly_value is display_value, value is value
  const object_type_model = useGetModel("object_types", object_type)
  const form_field_name = formValues?field_model.formValues_name:object_type_model.key_id

  const field_value = formValues?formValues[form_field_name]:value
  // convert to final field
  const data_field_value = data[field_model.final_field_name?field_model.final_field_name:field_name]
  
  const field_display_value = data?data_field_value:display_value
  // precedence: props, field_model, keys
  let {select_key_field = field_model.select_key_field, select_display_field = field_model.select_display_field, prevent_edit=field_model.prevent_edit} = props 
  
  select_key_field = select_key_field?select_key_field:object_type_model.key_id
  select_display_field = select_display_field?select_display_field:object_type_model.pretty_key_id

  // XX - make a "select" in the library
  let rab_component_model = rab_component_models.shell
  rab_component_model.list.components.list_wrap = RABSelectList
  rab_component_model.list.names.header = "RABVoid"

  function onBlur() {
    if (props.form) {
      props.onSubmit()
    }
    if (props.onBlur) {
      props.onBlur()
    }
  }
  switch (mode) {   
    case "edit":
    case "create":
      return (<ACSListController object_type={object_type} api_options={api_options} rab_component_model={rab_component_model} list_select_form_name={form_field_name} list_onSubmit={onSubmit}
      list_onBlur = {onBlur}
      list_field_value={field_value} list_onChange={onChange} list_select_key_field={select_key_field} list_style={style} list_select_display_field={select_display_field} list_prevent_edit={prevent_edit}
      list_autoFocus={autoFocus} />)
      break
    case "csv":
      return '"'+field_display_value+'""'
      break
    default:
      // text, view, list
      return field_display_value?field_display_value:" "
  }
}

export default RABSelectField;
