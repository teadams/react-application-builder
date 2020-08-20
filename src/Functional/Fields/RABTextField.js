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
  const {mode, row_data,  data, object_type, data_field, pretty_name, display_field=props.field_name, references_field, field_name, form_field_name=props.field_name, field_model={}, formdata, formValues, disable_underline=false, onChange, autoFocus, fullWidth=true, image_size="small", model_valid_values, valid_values,  db_data_field, 
  variant="outlined", required, helperText, placeholder, multiline=false, more_link_cutoff="", more_link_list_cutoff=props.more_link_cutoff, prevent_edit, input_type} = props
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

  const field_length = field_value.length 
  let more_link = ""
  let less_link = ""
  let final_more_link_cutoff = more_link_cutoff
  if (mode === "list") {
    final_more_link_cutoff = more_link_list_cutoff?more_link_list_cutoff:more_link_cutoff
  }
  if (toggleMoreDetail && final_more_link_cutoff && field_value.length > final_more_link_cutoff) {
    if (!more_detail) {
      field_value = field_value.substr(0, final_more_link_cutoff)
      more_link = <Link key="more_link" id="more_link" name="more_link" onClick={toggleMoreDetail}>(...more)</Link>
    } else {
      more_link = <Link key="more_link" id="more_link" name="more_link" onClick={toggleMoreDetail}>(...less)</Link>
    }
  }


  function selectItems(valid_values, trace) {

    // XX todo Any option, calling field for display ( like full name), tree vuew
      if (!valid_values || valid_values === "transition") {
        return null
      }

      return (
        valid_values.map ((value, index) => {
          return (<MenuItem key={index}  value={value[references_field]}>{value[display_field]}</MenuItem>)
//            return(
//              <MenuItem key={index}  value={row[select_key_field]}>{padding(row.tree_depth)}{field_component({data:row, field_name:select_display_field, mode:"text"})}</MenuItem>
              //)
          })
      )
  }

  function handleSelectChange(event) {
    const value=event.target.value
    let row
    for (row of valid_values) {
        if (row[db_data_field] === value) {
          event.target.selected_data = row
          break
        }
    }
    if (props.onChange) {
      props.onChange(event)
    }
  }


  switch (mode) {
    case "edit":
    case "create":
    case "filter":
      const rows = multiline?multiline:1
      let select = false 
      let value = formValues[form_field_name]
      if (model_valid_values) {
//        if ( !value && valid_values) {
      //      value = valid_values[0][references_field]
  //      }
//u.a(field_name, value)
        select=true 
       }
        return (
        <TextField
            select={select}
            required={required} 
            placeholder={placeholder}
            autoFocus={autoFocus}
            name={form_field_name}
            id = {form_field_name}
            label = {pretty_name}
            key={form_field_name}
            fullWidth={fullWidth}
            multiline={multiline}
            helperText={helperText}
            variant={variant}
            rows={rows}
            disabled={prevent_edit}
            type={input_type}
            onBlur={props.onFieldBlur}
            value={value}
            onChange={onChange}>
            {select && selectItems(valid_values)}
          </TextField>
        )
      break
    case "csv":
      return '"'+field_value+'""'
      break
    case "text":
      return field_value
    default:
          if (more_link) {
            return <div>{field_value}{more_link}</div>  
          } else {
            return <Fragment>{field_value}</Fragment>
          }
  }
}

export default RABTextField;
