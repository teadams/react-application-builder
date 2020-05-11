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
//   name={field.name}
//   label={field.pretty_name}
//   disabled={options.disabled?options.disabled:true}
//   type="text"
//   helperText={field.helper_text}
//   value=  {this.getDisplayView(object_type,field,prefix)}
//  style={{width:"90%"}}


function RABTextField(props) {
  const {mode, data, field_name, formdata, formValues, onSubmit, onChange} = props
  if (!data) {return ""}

  switch (mode) {
    case "text", "view":
      return data
      break 
    case "edit":
      return (
        <form onSubmit={onSubmit}>
          <TextField 
            autoFocus={true}
            name={field_name} 
            value={formValues[props.field_name]}
            onChange={onChange}/>
        </form> )
    case "csv":
      return '"'+data+'""'
    default:
      return data
  }
}

function RenderACSField(props) {
  const {...params} = props
  const {data, rab_component_model, field_name, mode="view"} = props
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

  function handleFieldBlur(event) {
    if (props.onFieldBlur) {
        props.onFieldBlur(event, data.id, "field", field_name, data)
    }
  }
  
  const {field_wrap:FieldWrap, field:Field} = rab_component_model.field.components 
  console.log("RERENDER")
  if (data) {
  return (
      <FieldWrap 
        onClick={handleFieldClick} onMouseOut={handleFieldBlur} onMouseOver={handleMouseOver}>
        <form onSubmit={props.onSubmit}>
          <RABTextField 
            data={data[field_name]} 
            formValues={props.formValues}
            mode={mode}
            field_name={field_name}
            onSubmit={props.onSubmit}
            onChange={props.onChange}/>
        </form>
      </FieldWrap>
   )

  } else {
      return null
  }
}

export default RenderACSField;
