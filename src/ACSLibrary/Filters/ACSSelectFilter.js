import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js'
import * as meta from '../../Utils/meta.js';
import * as api from '../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField

, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import {Link, Container, Box, Card, TableHead, TableContainer, Table, TableBody, TableRow, TableCell} from '@material-ui/core';

function selectItems(select_options, value_field="value", display_field) {
  // XX todo Any option, calling field for display ( like full name), tree vuew
    if (!select_options) {
      return null
    }
    return (
      select_options.map ((value, index) => {
        return (<MenuItem key={index}  value={value[value_field]}>{value[display_field]}</MenuItem>)
        })
    )
}

// default_value, object_type, label, 
function ACSSelectFilter(props) {
  //XX could get default select field by object type from proc?
  const {default_value, object_type, label, field_name, select_display_field, select_value_field="id", filter_name=props.object_type, onChange, api_options, any_display_label="Any", select_style, disable_underline=true} = props
  const [_value, setValue]= useState(default_value)
  const value = props.hasOwnProperty("value")?props.value:_value
  const [select_options, setSelectOptions] = useState(props.data)

  if (!select_options) {
    api.getData (object_type, api_options, (results, error) => {         
          if (error) {
              alert ("error retrieving object in filter" + object_type + " " + error.message)
          } else {
                let new_value = {}
                new_value.id = "_none_"
                new_value[select_display_field] = any_display_label
                results.unshift(new_value)
            //    new_value = {}
            //    new_value.id = "_none_"
            //    new_value[select_display_field] = `** Filter by ${label} **`
            //    results.unshift(new_value)
                setSelectOptions(results)
          }
      })
  }


  const handleChange = (event) => {
    const event_value=event.target.value
    if (value !== event_value) {
        setValue(event_value)
    }
    if (onChange) {
      onChange(event)
    }
  }
  return (
      <TextField
        select={true}
        name={filter_name}
        id={filter_name}
        key={filter_name}
        label={label}
        fullWidth={true}
        value={value}
        style={select_style}
        SelectProps={{
          disableUnderline:true
        }}
        onChange={handleChange}>
        {select_options && selectItems(select_options,select_value_field,select_display_field)}
        </TextField>
  )
}

export default ACSSelectFilter;


