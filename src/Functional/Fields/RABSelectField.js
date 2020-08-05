import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import * as control from '../../Utils/control.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import ACSListController from '../ACSListController.js'
import rab_component_models from '../../Utils/component.js'
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

function selectItems(data, select_key_field, select_display_field, field_component, limit_value) {
    data=formTreeData(data)
    return (
      data.map ((row, index) => {
        if (limit_value && limit_value !== row[select_key_field]) {
          return null
        } else {
          return(
            <MenuItem key={index}  value={row[select_key_field]}>{padding(row.tree_depth)}{field_component({data:row, field_name:select_display_field, mode:"text"})}</MenuItem>
            )
        }
      })
    )
}

function RABSelectList(props) {
  let field_models = useGetModel("fields")
  if (props.field_models) {
    field_models = props.field_models
  }
  const {disable_underline=true, prevent_edit=false, select_key_field, select_display_field, object_type, add_none, data:props_data, dependent_filter} = props

  let data = props_data
  if (add_none) {
    let any_row = [{[select_key_field]:"", [select_display_field]:add_none}]
    if (typeof add_none !== "boolean") {
      any_row =[{[select_key_field]:"_none_", [select_display_field]:add_none}]
    }
    data = any_row.concat(props_data)
  }

  const select_field_model=field_models[props.object_type][props.select_display_field]
  const field_component_name = select_field_model.field_component 
  // plain function on purpose, will just get text
  const field_component = control.componentByName(field_component_name?field_component_name:"RABTextField")
  function handleSelectChange(event) {
    const value=event.target.value
    let row
    for (row of data) {
        if (row[select_key_field] === value) {
          event.target.selected_data = row
          break
        }

    }
    if (props.onChange) {
      props.onChange(event)
    }
  }

//props.select_key_field,props.select_display_field
  return (<Fragment>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      name={props.select_form_name}
      value={props.value}
      autoFocus={props.autoFocus}
      onBlur={props.onBlur}
      style={props.style}
  //    disabled={prevent_edit}
      disableUnderline = {disable_underline}
      onChange={handleSelectChange}>
      {data && selectItems(data,props.select_key_field,props.select_display_field, field_component, prevent_edit?props.value:"")}
    </Select>
    </Fragment>)
}

function RABSelectField(props) {

// data, data_field 
// if RABSelect, the final model should be 
///    -- viewing - data_type, component, object_type - taken from references

  const {mode, data=[], add_none, base_field_name, parent_field_name, base_object_type, parent_object_type,   formValues, onSubmit, onFieldBlur,  onChange, autoFocus, object_type, field_model={}, value="", display_value=" ", disable_underline, style, api_options={}} = props
  let {form_field_name, field_name} = props
  const {field_name:discard_field_name, ...params} = props

  let {dependent_filter_field, dependent_data_field} = field_model
  if (dependent_filter_field && formValues && ["create","edit"].includes(mode)) {
      // XXX HAVE TO ADD THE ORIGINAL FIELD NAME HERE
      if (parent_object_type !== base_object_type) {
        dependent_data_field = base_field_name+"."+dependent_data_field
      }
      if (api_options.filter_field) { 
        api_options.filter_field = api_options.filter_field.push(dependent_filter_field)
      } else {
        api_options.filter_field = dependent_filter_field
      }
      if (api_options.filter_id) {
        api_options.filter_id = api_options.filter_id.push(formValues[dependent_data_field])
      } else {
        api_options.filter_id = formValues[dependent_data_field]
    }

  }
  // 2 use cases:
  // 1. Called from a create/edit form (formValues is present)
  //   View will show field_display_value takend from data object.
  //   Edit/create uses controlled values from formValues
  // 2. Called directly 
  //     dispaly_value is display_value, value is value
  const object_type_model = useGetModel("object_types", object_type)
  if (!form_field_name) {
    ///????
    form_field_name = formValues?field_model.formValues_name:object_type_model.select_key_id
   }

  const field_value = formValues?formValues[form_field_name]:value

  // Viewing
  const view_field_component_name = field_model.final_field_component?field_model.final_field_component:"RABTextField"
  const Field = control.componentByName(view_field_component_name)
  const final_field_name= field_model.render_field
  const data_field_value = data[field_model.data_field]
  // precedence: p"rops, field_model, keys
  let {select_key_field = field_model.select_key_field, select_display_field = field_model.select_display_field, prevent_edit=field_model.prevent_edit} = props 
  
  select_key_field = select_key_field?select_key_field:object_type_model.select_key_field
  select_display_field = select_display_field?select_display_field:object_type_model.select_display_field
  // XX - make a "select" in the library
  let rab_component_model = rab_component_models.shell
  rab_component_model.list.components.list_wrap = RABSelectList
  rab_component_model.list.names.header = "RABVoid"
  rab_component_model.list.props.add_none = add_none
  
  function onBlur() {
    if (props.form && props.onSubmit) {
      props.onSubmit()
    }
    if (props.onBlur) {
      props.onBlur()
    }
  }
  // data_field was used to navigate to the right data set
  field_model.data_field = ""
  switch (mode) {   
    case "edit":
    case "create":
      return (<ACSListController object_type={object_type} api_options={api_options} rab_component_model={rab_component_model} list_select_form_name={form_field_name} list_onSubmit={onSubmit}
      list_onBlur = {onBlur}
      list_add_none = {add_none}
      list_disable_underline = {disable_underline}
      list_field_value={field_value} list_onChange={onChange} list_select_key_field={select_key_field} list_style={style} list_select_display_field={select_display_field} list_prevent_edit={prevent_edit}
      list_autoFocus={autoFocus} />)
    case "csv":
      return '"'+Field({data:data, field_name:final_field_name, mode:"text"})+'""'
      break
    case "list":
    case "view":
      return (<Field field_model={field_model} data={data} field_name={final_field_name}/>)
      break
    default:
      // text, view, list
      return (<Field field_model={field_model} data={data} field_name={final_field_name} mode="text"/>) 
  }
}

export default RABSelectField;
