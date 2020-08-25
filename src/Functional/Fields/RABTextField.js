import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import {Link, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel,RadioGroup,Radio } from '@material-ui/core';
import ACSImage from './ACSImage.js'
import ACSListController from '../ACSListController.js'
import * as meta from '../../Utils/meta.js';

const RadioLabel = (props=> {
  const {value, display_field, summary_key, description_key} = props

  return (<div> {value[display_field]} {value[summary_key]}</div>)
})

function RABTextField(props) {
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
      const value_field = references_field?references_field:"value"
      return (
        valid_values.map ((value, index) => {
          return (<MenuItem key={index}  value={value[value_field]}>{value[display_field]}</MenuItem>)
          })
      )
  }

  function radioItems(valid_values) {
    if (!valid_values || valid_values === "transition") {
      return null
    }

    const value_field = references_field?references_field:"value"
    let summary_key = ""
    let description_key = ""
    const object_model = field_model.references?object_models[field_model.references]:object_models[object_type]
    if (field_model.references) {
        summary_key = object_model.summary_key
        description_key = object_model.description_key
    }
    return (
      valid_values.map ((value, index) => {
        return (<FormControlLabel value={value[value_field]} control={<Radio />} label={<RadioLabel value={value} display_field={display_field} summary_key={summary_key} description_key={description_key}/>}> {value[summary_key]}</FormControlLabel>)
        })
      )
   }


  function handleSelectChange(event) {
    const value=event.target.value
    let row
    for (row of valid_values) {
        if (row[data_field] === value) {
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
      let widget_type = "text" 
      let value = formValues[form_field_name]
      if (model_valid_values) {
        widget_type=input_type?input_type:"select"

        if (valid_values === "transition") {
          return null
        }
       }

      if (widget_type === "radio") {
  
        return (
        <FormControl>
         <FormLabel>{pretty_name}</FormLabel>
          <RadioGroup row={props.radio_row} aria-label={field_name} name={field_name} value={value} onChange={onChange}>  
            {radioItems(valid_values)}
           </RadioGroup>
        </FormControl>
        )
      } else {
        return (
        <div style={{minWidth:"20em"}}>
          <TextField
            select={widget_type==="select"?true:false}
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
            rows={rows}
            fullWidth={true}
            disabled={prevent_edit}
            type={input_type}
            onBlur={props.onFieldBlur}
            value={value}
            onChange={onChange}>{(widget_type==="select") && selectItems(valid_values)}</TextField>
        </div>
        )
      }
      break
    case "csv":
      return '"'+field_value+'""'
      break
    case "text":
      return field_value
    default:
          if (data_type == "boolean") {
              field_value = field_value?"Yes":"No"
          }
          if (more_link) {
            return <div>{field_value}{more_link}</div>  
          } else {
            return <Fragment>{field_value}</Fragment>
          }
  }
}

export default RABTextField;
