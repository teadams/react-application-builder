import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import {Link, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel,RadioGroup,Radio } from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';


function ACSDate(props) {
  const {mode, row_data,  data, object_type, data_field, pretty_name, display_field=props.field_name, references_field, field_name, form_field_name=props.field_name, field_model={}, object_models, formdata, formValues, disable_underline=false, onChange, autoFocus, fullWidth=true, image_size="small", model_valid_values, valid_values, 
  variant="outlined", required, helperText, placeholder, multiline=false, more_link_cutoff="", more_link_list_cutoff=props.more_link_cutoff, prevent_edit, input_type, data_type, key_id} = props
  const [test_state, setTestState] = useState("foo")
  let {with_thumbnail="", with_url="", more_detail=false, toggleMoreDetail} = props


  const  handleDateChange = (date => {
    let date_event = {}
    date_event.target = {name:field_name, value:date}
    if(onChange) {
        onChange(date_event)
    }
  })

  let field_value
  if (data) {
    field_value = data[display_field]
  }

  if (!field_value) {
      field_value = null
  }

  if (field_value === "now()") {
      field_value = new Date()
  }

  // XX field model passed due to referenced change. May 
  // be done server side later

  const date_view = (value) => {
    let date = new Date(Date.parse(value))
    return (date.getMonth()+1 + "/"+ date.getDate() +"/"+ date.getFullYear())
  }
  let value
  switch (mode) {
    case "edit":
    case "create":
    case "filter":
      value = formValues[form_field_name]
      if (value === "now()") {
        value = new Date()
      }
      if (!value) {
        value = null
      }
     return (
        <div style={{minWidth:"20em"}}>
          {field_model.summary &&  <div style={{marginBottom:"5px"}}>{field_model.summary}</div>}
          <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                disableToolbar
                autoOk
                required={false}
                clearable={true}
                placeholder={placeholder}
                autoFocus={autoFocus}
                helperText={helperText}
                variant="inline"
                inputVariant="outlined"
                format="MM/DD/yyyy"
                margin="normal"
                name={form_field_name}
                id = {form_field_name+key_id}
                label = {pretty_name}
                key={form_field_name+key_id}
                value={value}
                fullWidth={true}
                disabled={prevent_edit}
                onChange={handleDateChange}
                InputLabelProps={{
                   shrink: true,
                 }}

                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
          </MuiPickersUtilsProvider>
        </div>
        )
      
      break
      case "list_edit":
      case "list_create":
        value = formValues[form_field_name]
        if (value === "now()") {
            value = new Date()
        }
        if (!value) {
            value = null
        }
        return (
          <MuiPickersUtilsProvider utils={MomentUtils}>
          <KeyboardDatePicker
            disableToolbar
            autoOk
            inputProps={{style:{paddingTop:"0px"}}}
            clearable={true}
            variant="inline"
            format="MM/DD/yyyy"
            margin="dense"
            name={form_field_name}
            id = {form_field_name+key_id}
            key={form_field_name+key_id}
            value={value}
            fullWidth={false}
            disabled={prevent_edit}
            onChange={handleDateChange}
            InputLabelProps={{
               shrink: true,
             }}
            KeyboardButtonProps={{
              
              'aria-label': 'change date',
            }}
          />
      </MuiPickersUtilsProvider>)
        break;
    case "csv":
      return '"'+date_view(field_value)+'""'
      break
    case "text":
      return date_view(field_value)
      break
    default:
      return <Fragment>{date_view(field_value)}</Fragment>
  }
}

export default ACSDate;
