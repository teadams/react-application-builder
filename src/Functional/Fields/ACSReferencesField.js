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
  const {mode, data=[], add_none, base_field_name, parent_field_name, base_object_type, parent_object_type, field_name, formValues, onSubmit, onChange, object_type, field_model={}} = props
  let {form_field_name} = props
  const {...params} = props

  let api_options ={}
  api_options.filter_field = [field_model.referenced_by_object_type_field, field_model.referenced_by_field]
  api_options.filter_id = [object_type, data.id]
  api_options.filter_join = "AND"

  // object_type 
  // which column it has
//referenced_by_field = data[id]
//referenced_by_object_type_field = object_type
//u.a(field_model.referenced_by)

  switch (mode) {   
    case "list":
      return (null)
      break
    case "edit":
    case "create":
    case "csv":
    default:
      return (<ACSListController field_list={field_model.list_field_list} object_type={field_model.referenced_by} api_options={api_options}/>)
      // text, view, list
  }
}

export default ACSReferencesField;
