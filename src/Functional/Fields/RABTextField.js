import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import {Link, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import ACSImage from './ACSImage.js'
import ACSListController from '../ACSListController.js'
import rab_component_models from '../../Models/HealthMe/component.js'
import * as meta from '../../Utils/meta.js';


function RABTextField(props) {
  const {mode, data, field_name, field_model={}, formdata, formValues, disable_underline=false, onChange, autoFocus, fullWidth=true, image_size="small"} = props
  let {with_thumbnail="", with_url=""} = props
  // XX field model passed due to referenced change. May 
  // be done server side later
  let field_value=""
  field_value = data[field_model.final_field_name?field_model.final_field_name:field_name]

  with_thumbnail = with_thumbnail?with_thumbnail:field_model.with_thumbnail
  with_url = with_url?with_url:field_model.with_url
  switch (mode) {
    case "edit":
    case "create":
      return (
          <TextField 
            autoFocus={autoFocus}
            name={field_name} 
            key={field_name}
            fullWidth={fullWidth}
            InputProps={{disableUnderline:disable_underline}}
            disabled={field_model.prevent_edit}
            type={field_model.input_type}
            onBlur={props.onFieldBlur}
            value={formValues[props.field_name]}
            onChange={onChange}/>
        )
      break
    case "csv":
      return '"'+field_value+'""'
      break
    case "text":
      return field_value?field_value:" "
    default:
      if (!with_thumbnail && !with_url || (with_url && !data[with_url])) {    
        return field_value?field_value:" "
      } else if (!with_thumbnail && with_url) {
        return (<Link href={data[with_url]}>{field_value}</Link>)
      } else {
          const thumbnail = data[with_thumbnail]
          let url = with_url?data[with_url]:""
          if (thumbnail) { 
            if (url) {
              return (<div style={{display:"flex"}}> <ACSImage image_object={thumbnail} fix="width" size={image_size}/>&nbsp;<Link href={url}>{field_value}</Link></div>)
            } else {
              return (<div style={{display:"flex"}}> <ACSImage image_object={thumbnail} fix="width" size={image_size}/>&nbsp; {field_value}</div>)
            }
          } else {
            const letters = field_value?field_value.charAt(0):""
            if (url) {
              return (<div style={{display:"flex"}}><ACSImage letters={letters}  fix="width" size={image_size}/>&nbsp;<Link href={url}>{field_value}</Link></div>)    
            } else {
              return (<div style={{display:"flex"}}><ACSImage letters={letters}  fix="width" size={image_size}/>&nbsp;{field_value}</div>)
            }
          }
      }
  }
}

export default RABTextField;
