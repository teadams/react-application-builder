import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../Utils/utils.js';
import useGetObject from '../Hooks/useGetObject';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell } from '@material-ui/core';

function RenderACSField(props) {
  const {...params} = props
  const {data, rab_component_model, field_name} = props
  // Responsible for the layouts
// Storing the state?
// Deciding the mode?
  function handleFieldClick(event) {
    if (props.onFieldClick) {
        props.onFieldClick(event, data.id, "field", field_name, data)
    }
  }

  const {field_wrap:FieldWrap, field:Field} = rab_component_model.field.components 
  if (data) {
  return (<FieldWrap onClick={handleFieldClick}>
      {data[field_name] && 
       <Fragment>{data[field_name]}</Fragment>
      } 
      </FieldWrap>)

  } else {
      return null
  }
}

export default RenderACSField;
