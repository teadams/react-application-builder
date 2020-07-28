import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import * as control from '../../Utils/control.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import ACSListController from '../ACSListController.js'
import rab_component_models from '../../Utils/component.js'
import * as meta from '../../Utils/meta.js';
import useGetModel from '../../Hooks/useGetModel';


function ACSReferencesField(props) {
  const {mode, data=[], add_none, base_field_name, parent_field_name, base_object_type, parent_object_type, field_name,   formValues, onSubmit, onFieldBlur,  onChange, autoFocus, object_type, field_model={}, value="", display_value=" ", disable_underline, style, api_options={}} = props
  let {form_field_name} = props
  const {...params} = props

  // object_type 
  // which column it has
//referenced_by_field = data[id]
//referenced_by_object_type_field = object_type

  switch (mode) {   
    case "edit":
    case "create":

    case "csv":
      return '"'+Field({data:data, field_name:field_name, mode:"text"})+'""'
      break
    default:
      return (<ACSListController object_type={object_type} api_options={api_options}/>)
      // text, view, list
  }
}

export default ACSReferencesField;
