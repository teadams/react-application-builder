import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../Utils/utils.js';
import useGetObject from '../Hooks/useGetObject';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell } from '@material-ui/core';
import useGetModel from '../Hooks/useGetModel';
import RABTextField from "./Fields/RABTextField.js"
// <TextField    
//   InputLabelProps={{shrink:true}}
//   name={.name}
//   label={field.pretty_name}
//   disabled={options.disabled?options.disabled:true}
//   type="text"
//   helperText={field.helper_text}
//   value=  {this.getDisplayView(object_type,field,prefix)}
//  style={{width:"90%"}}



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
  // XX field model passed from controller as controller makes 
  // modification due to reference fields.  May change if we 
  // can do all modifications server side
  // const field_models =  useGetModel("fields")
 //  if (!field_models) {return null} 

  // api_options not passed further (they were used)
  // to get the data set. Different API options will be 
  // needed for select lists, referenced, mapping
  const {api_options,...params} = props
  const {data, object_type, field_display="field", rab_component_model, field_name, field_model, mode="view", form="true"} = props
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
  if (!data) {return null}

  params.data = data 
  params.autoFocus = props.autoFocus
  params.formValues = props.formValues
  params.mode = props.mode
  params.form = props.form
  params.onSubmit = props.onSubmit 
  params.onBlur = props.onFieldBlur 
  params.field_name = field_name 
  params.onChange = props.onChange 
  switch (field_display) {
    case "name_value_wrapped":
    let col_span = props.col_span*2 -1
    return (
    <Fragment>
      <FieldWrap key={field_name+"_wrap1"} col_span={1} align="right"><b>{field_model.pretty_name}:</b></FieldWrap>
      <FieldWrap key={field_name+"_wrap2"} field_name={field_name}   col_span={col_span}
        onClick={handleFieldClick}  onMouseOver={handleMouseOver} >
       <FormWrap mode={mode} form={form} onSubmit={props.onSubmit}>
        <Field {...params}
          data={data} key={field_name+"_field"}/>
      </FormWrap>
      </FieldWrap>
    </Fragment>
    )
    break;
    case "name_above_value":
    return (
    <Fragment>
      <FieldWrap key={field_name+"_wrap1"}
        onClick={handleFieldClick}  onMouseOver={handleMouseOver} cols_span={props.col_span}>
        <b>{field_model.pretty_name}:</b><br/>&nbsp;&nbsp;
       <FormWrap mode={mode} form={form} onSubmit={props.onSubmit}>
        <Field {...params} key={field_name+"_field"}/>
      </FormWrap>
      </FieldWrap>
    </Fragment>
    )
    break;
    case "name_value":
    return (
    <Fragment>
      <FieldWrap key={field_name+"_wrap1"}
        onClick={handleFieldClick}  onMouseOver={handleMouseOver} >
        <b>{field_model.pretty_name}: </b>
       <FormWrap mode={mode} form={form} onSubmit={props.onSubmit}>
        <Field {...params}  key={field_name+"_field"}/>
      </FormWrap>
      </FieldWrap>
    </Fragment>
    )
    break;
  default:
      return (
      <FieldWrap key={field_name+"_wrap1"}
        onClick={handleFieldClick}  onMouseOver={handleMouseOver} >
         <FormWrap mode={mode} form={form} onSubmit={props.onSubmit}>
          <Field {...params} key={field_name+"field"}/>
        </FormWrap>
      </FieldWrap>)
  }
}

export default RenderACSField;
