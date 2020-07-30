import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import {Link, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import ACSImage from './ACSImage.js'
import ACSListController from '../ACSListController.js'
import * as meta from '../../Utils/meta.js';


function RABTextField(props) {
  const {mode, data, field_name, form_field_name=props.field_name, field_model={}, formdata, formValues, disable_underline=false, onChange, autoFocus, fullWidth=true, image_size="small"} = props


  let {with_thumbnail="", with_url="", more_detail=false, toggleMoreDetail} = props


  // XX field model passed due to referenced change. May 
  // be done server side later
  let field_value=""
  let more_link = ""
  let less_link = ""
  let more_link_cutoff = field_model.more_link_cutoff?field_model.more_link_cutoff:""
  if (mode === "list") {
    more_link_cutoff = field_model.more_link_list_cutoff?field_model.more_link_list_cutoff:more_link_cutoff
  }
  // XX everything will be changed to final field_name

  field_value = data[field_model.data_field]

  if (!field_value && (field_value === null || field_value === undefined)) {
      field_value =""
  }
  const field_length = field_value.length 

  if (toggleMoreDetail && more_link_cutoff && field_value.length > more_link_cutoff) {
    if (!more_detail) {
      field_value = field_value.substr(0, more_link_cutoff)
      more_link = <Link key="more_link" id="more_link" name="more_link" onClick={toggleMoreDetail}>(...more)</Link>
    } else {
      more_link = <Link key="more_link" id="more_link" name="more_link" onClick={toggleMoreDetail}>(...less)</Link>
    }
  }
  if (mode === "list") {
    with_thumbnail = ""
  } else {
    with_thumbnail = with_thumbnail?with_thumbnail:field_model.with_thumbnail
  }

  with_url = with_url?with_url:field_model.with_url

  switch (mode) {
    case "edit":
    case "create":
    case "filter":
      const multiline = field_model.multiline?true:false
      const rows = field_model.multiline?field_model.multiline:1
      return (
          <TextField 
            autoFocus={autoFocus}
            name={form_field_name} 
            key={form_field_name}
            fullWidth={fullWidth}
            multiline={multiline}
            rows={rows}
            InputProps={{disableUnderline:disable_underline}}
            disabled={field_model.prevent_edit}
            type={field_model.input_type}
            onBlur={props.onFieldBlur}
            value={formValues[form_field_name]}
            onChange={onChange}/>
        )
      break
    case "csv":
      return '"'+field_value.toString()+'""'
      break
    case "text":
      return field_value.toString()
    default:
      if (!with_thumbnail && (!with_url || (with_url && !data[with_url]))) {    
          return <Fragment>{field_value.toString()} {more_link}</Fragment>
      } else if (!with_thumbnail && with_url) {
        return (<Link href={data[with_url]}>{field_value}{more_link}</Link>)
      } else {
          const thumbnail = data[with_thumbnail]
          let url = with_url?data[with_url]:""
          if (thumbnail) { 
            if (url) {
              return (<div style={{display:"flex", alignItems:"center"}}> <ACSImage image_object={thumbnail} fix="width" size={image_size}/>&nbsp;<Link href={url}>{field_value}{more_link}</Link></div>)
            } else {
              return (<div style={{display:"flex", alignItems:"center"}}> <ACSImage image_object={thumbnail} fix="width" size={image_size}/><div>&nbsp;{field_value}{more_link}</div></div>)
            }
          } else {
            const letters = field_value?field_value.charAt(0):""
            if (url) {
              return (<div style={{display:"flex"}}><ACSImage letters={letters}  fix="width" size={image_size}/>&nbsp;<Link href={url}>{field_value}{more_link}</Link></div>)    
            } else {
              return (<div style={{display:"flex"}}><ACSImage letters={letters}  fix="width" size={image_size}/>&nbsp;{field_value}{more_link}</div>)
            }
          }
      }
  }
}

export default RABTextField;
