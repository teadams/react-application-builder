import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';


function getYouTubeURL (initial_url) {
    // URLS from the YouTube Share button have format
    // https://youtu.be/_Ett1KsKQi4
    // Embedded format is https://www.youtube.com/embed/_Ett1KsKQi4
    // This function with extract the key from the shared format
    // Note - Future upgrade may do this upon creation
    let key = initial_url.replace("https://youtu.be/","")
    let src = "https://www.youtube.com/embed/"+key+"?start=4&autoplay=0"
    return src
  }

function ACSYouTube(props) {
  const {mode, data, field_name, field_model={}, formdata, formValues, disable_underline=false, onChange, autoFocus, fullWidth=true, image_size="small"} = props
  const field_value = data[field_model.final_field_name?field_model.final_field_name:field_name]
  const url = getYouTubeURL(field_value)
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
      return (
        <Fragment>
        <center>
        <iframe   frameborder="0" src={url} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> </center>
        </Fragment>
      )
  }
}

export default ACSYouTube;
