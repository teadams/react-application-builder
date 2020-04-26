import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as utils from '../Utils/utils.js';
import useGetObject from '../Hooks/useGetObject';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

function RenderField(props) {
  const {data, field_name} = props
  if (data) {
      if (data[field_name]) {
        return <Fragment>
    <div style={{borderWidth:1, borderStyle:"solid", borderColor:"lightGray"}}>
      {data[field_name]}</div>
    </Fragment>
      } else {
        return <Fragment><div style={{borderWidth:1, borderStyle:"solid", borderColor:"lightGray"}}>&nbsp;</div></Fragment>
      }
  } else {
      return null
  }
}

export default React.memo(RenderField);
