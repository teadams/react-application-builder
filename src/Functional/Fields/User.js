import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js'
import * as data from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

function User(props) {
  const {row_data, data, field_name, form_field_name, formdata, formAttributes=[], display, mode="view", field_model={}, image_size,  ...params} = props
  const [formValues, formVisibility, formValidated] = formAttributes

  const {with_thumbnail} = field_model

  let {size="tiny"} = props
  let thumbnail = ""
  // XX get rid of size. depricate
  if (props.image_size) {
    size=props.image_size
  }
 
  if (data) {
    const first_name = data.first_name?data.first_name:""
    const last_name = data.last_name?data.last_name:""
    if (with_thumbnail) {
      thumbnail = data[with_thumbnail]?data[with_thumbnail]:""
    }
    switch (mode) {
      case "text":
        return (first_name + " " + last_name)
        break;
      default:  
          return (<Fragment>{first_name} {last_name}</Fragment>)
    } 
  } else {
    return null
  } 
}

export default User;
