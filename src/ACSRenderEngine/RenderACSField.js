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
import {ACSTextField} from "../ACSLibrary";


function form_wrap(props) {
  // objects are always created at the row level
  // filters always use the filter component 
  if (props.form && (props.mode === "edit")) {
    return (<form onSubmit={props.onSubmit}>
      {props.children}
    </form>)
  } else {
    return (<Fragment>{props.children}</Fragment>)
  }
}

function RenderACSField(props) {

  // api_options not needed
  const {api_options,...params} = props
  const {data, row_data, object_type, data_field,  field_name, form_field_name, rab_component_model, field_model, 
        mode="view", form="true", formValues, autoFocus, onSubmit, onBlur, onChange, 
        more_detail,toggleMoreDetail} = props
  // everything regarding field presentation will be in field_model
  
  function handleFieldClick(event) {
    if (props.onFieldClick && event.target.name !== "more_link") {
      props.onFieldClick(event, data.id, "field", field_name, row_data, data)
    }
  }

  function handleMouseOver(event) {
    if (props.onMouseOver) {
        props.onMouseOver(event, data.id, "field", field_name, row_data, data)
    }
  }

  const FormWrap = form_wrap
  const {field_wrap:FieldWrap, field:Field=ACSTextField} = rab_component_model.field.components 

  if (!data) {return null}
  params.data = data 
  // form params
  params = {mode, formValues, form, autoFocus, onSubmit, onBlur, onChange} 
  
u.a(field_name, data)
  return ( 
    <FormWrap mode={mode} form={form} onSubmit={props.onSubmit}>
      <Field {...params} {...field_model} key={field_name+"field"}/>
    </FormWrap>
  )

}

export default RenderACSField;
