import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import {Link, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import * as meta from '../../Utils/meta.js';
import {ACSImageView} from '../../ACSLibrary'

function ACSURLField(props) {
  const {mode, row_data,  data, object_type, data_field, pretty_name, display_field=props.field_name, references_field, field_name, form_field_name=props.field_name, field_model={}, formdata, formAttributes, disable_underline=false, onChange, autoFocus, fullWidth=true, image_size="small", model_valid_values, valid_values,  db_data_field, 
  variant="outlined", required, helperText, placeholder
} = props
  let {with_thumbnail=""} = props
  const [formValues, formVisibility, formValidated] = formAttributes

  // XX field model passed due to referenced change. May 
  // be done server side later
  let field_value=""
  field_value = data[display_field]
  with_thumbnail = with_thumbnail?with_thumbnail:field_model.with_thumbnail
                        
  switch (mode) {
    case "edit":
    case "create":
      let value = formValues[form_field_name]

      return (
        <TextField
            required={required} 
            placeholder={placeholder}
            autoFocus={autoFocus}
            name={form_field_name}
            id = {form_field_name}
            label = {pretty_name}
            key={form_field_name}
            fullWidth={fullWidth}
            helperText={helperText}
            variant={variant}
            disabled={field_model.prevent_edit}
            type={field_model.input_type}
            onBlur={props.onFieldBlur}
            value={value}
            onChange={onChange}>
          </TextField>
        )
      break
    case "csv":
      return '"'+field_value+'""'
      break
    case "text":
      return field_value?field_value:" "
    default:
      if (!with_thumbnail) {    
        return (<Link href={field_value}>{field_value?field_value:""}</Link>)
      } else {
          const thumbnail = data[with_thumbnail]
          if (thumbnail) {  
            return (<div style={{display:"flex"}}> <ACSImageView image_object={thumbnail} fix="width" size={image_size}/>&nbsp; 
            <Link href={field_value}>{field_value}</Link></div>)
          } else {
            const letters = field_value?field_value.charAt(0):""
            return (<div style={{display:"flex"}}><ACSImageView letters={letters}  fix="width" size={image_size}/>&nbsp;  <Link href={field_value}>{field_value}</Link>
          </div>)
          }
      }
  }
}

export default ACSURLField;
