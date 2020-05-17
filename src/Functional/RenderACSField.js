import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../Utils/utils.js';
import useGetObject from '../Hooks/useGetObject';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell } from '@material-ui/core';

// <TextField    
//   InputLabelProps={{shrink:true}}
//   name={.name}
//   label={field.pretty_name}
//   disabled={options.disabled?options.disabled:true}
//   type="text"
//   helperText={field.helper_text}
//   value=  {this.getDisplayView(object_type,field,prefix)}
//  style={{width:"90%"}}



function RABTextField(props) {
  const {mode, data, field_name, formdata, formValues,  onChange, autoFocus} = props
  const field_value = data[field_name]
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

function form_wrap(props) {
  if (props.form && props.mode === "edit") {
    return (<form onSubmit={props.onSubmit}>
      {props.children}
    </form>)
  } else {
    return (<Fragment>{props.children}</Fragment>)
  }
}

function RenderACSField(props) {
  const {...params} = props
  const {data, rab_component_model, field_name, mode="view", form="true"} = props
  // Responsible for the layouts
// Storing the state?
// Deciding the mode?
  function handleFieldClick(event) {
    if (props.onFieldClick) {
        props.onFieldClick(event, data.id, "field", field_name, data)
    }
  }

  function handleMouseOver(event) {
    if (props.onMouseOver) {
        props.onMouseOver(event, data.id, "field", field_name, data)
    }
  }

  const FormWrap = form_wrap
  const {field_wrap:FieldWrap, field:Field=RABTextField} = rab_component_model.field.components 

  if (data) {

  return (
      <FieldWrap 
        onClick={handleFieldClick}  onMouseOver={handleMouseOver} >
         <FormWrap mode={mode} form={form} onSubmit={props.onSubmit}>
          <Field {...params}
            data={data}
            autoFocus={props.autoFocus}
            formValues={props.formValues}
            mode={mode}
            onBlur={props.onFieldBlur}
            field_name={field_name}
            onChange={props.onChange}/>
        </FormWrap>
      </FieldWrap>
   )

  } else {
      return null
  }
}

export default RenderACSField;
