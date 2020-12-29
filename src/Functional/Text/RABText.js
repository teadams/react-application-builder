// Copyright Teadams Holding Company 2019

import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import * as meta from '../../Utils/meta.js';

import {ACSCreateButton, ACSEditButton,ACSMapButton} from '../../ACSLibrary'


function RABText(props) {
  const {object_type, action=""} = props
  let ActionButton = ""
  switch (action) {
    case "create":
      ActionButton = ACSCreateButton 
      break
    case "edit":  
      ActionButton = ACSEditButton 
      break
    case "map":
      ActionButton = ACSMapButton
  }
  const {header=false, variant=header?"h5":"body1", text} = props
  let {style} = props
  style = Object.assign({display:"flex",alignItems:"center"}, style)
  return (<Typography  variant={variant} style={style}>{text}{action && <ActionButton {...props} style={{paddingTop:0}} />}</Typography>)
}

export default RABText
