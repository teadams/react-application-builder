import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import {Link, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel,RadioGroup,Radio } from '@material-ui/core';
import * as meta from '../../../Utils/meta.js';


function ACSDate(props) {
  const {mode, row_data,  data, object_type, data_field, pretty_name, display_field=props.field_name, references_field, field_name, form_field_name=props.field_name, field_model={}, object_models, formdata, formValues, disable_underline=false, onChange, autoFocus, fullWidth=true, image_size="small", model_valid_values, valid_values, 
  variant="outlined", required, helperText, placeholder, multiline=false, more_link_cutoff="", more_link_list_cutoff=props.more_link_cutoff, prevent_edit, input_type, data_type} = props
  const [test_state, setTestState] = useState("foo")
  let {with_thumbnail="", with_url="", more_detail=false, toggleMoreDetail} = props


  // XX field model passed due to referenced change. May 
  // be done server side later
  let field_value
  if (data) {
    field_value = data[display_field]
  }

  if (!field_value && (field_value === null || field_value === undefined)) {
      field_value =" "
  }


  switch (mode) {
    case "edit":
    case "create":
    case "filter":

    const today= new Date()
//u.a(today)
   const value = today.getFullYear()+'-'+today.getUTCMonth().toString().padStart(2, '0')+'-'+today.getDate();
    const shrink=input_type==="date"?true:false

     return (
        <div style={{minWidth:"20em"}}>
          {field_model.summary &&  <div style={{marginBottom:"5px"}}>{field_model.summary}</div>}
          <TextField
            required={required} 
            placeholder={placeholder}
            autoFocus={autoFocus}
            name={form_field_name}
            id = {form_field_name}
            label = {pretty_name}
            key={form_field_name}
            multiline={multiline}
            helperText={helperText}
            variant={variant}
            fullWidth={true}
            disabled={prevent_edit}
            type={input_type}
 
            onBlur={props.onFieldBlur}
            value={value}
            //value={value}
            InputLabelProps={{
               shrink: true,
             }}
            onChange={onChange}></TextField>
        </div>
        )
      
      break
    case "csv":
      return '"'+field_value+'""'
      break
    case "text":
      return field_value
      break
    default:
            return <Fragment>{field_value}</Fragment>
  }
}

export default ACSDate;
