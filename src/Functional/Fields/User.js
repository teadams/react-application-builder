import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js'
import * as data from '../../Utils/data.js';
import * as utils from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

function User(props) {
  const {data, field_name, mode, ...params} = props
  if (data) {
    const first_name = data.first_name?data.first_name:""
    const last_name = data.last_name?data.last_name:""
    switch (mode) {
      case "view":
        return (<Fragment>PIC {first_name} {last_name}</Fragment>)
        break;
      default:
        return (first_name + " " + last_name)
    }
  }
}

export default User;
