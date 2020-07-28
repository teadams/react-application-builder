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
      return '"'+Field({data:data, field_name:final_field_name, mode:"text"})+'""'
      break
    default:
      return (<ACSListController object_type={object_type} api_options={api_options} rab_component_model={rab_component_model} list_select_form_name={form_field_name} list_onSubmit={onSubmit}
      list_onBlur = {onBlur}
      list_add_none = {add_none}
      list_disable_underline = {disable_underline}
      list_field_value={field_value} list_onChange={onChange} list_select_key_field={select_key_field} list_style={style} list_select_display_field={select_display_field} list_prevent_edit={prevent_edit}
      list_autoFocus={autoFocus} />)
      // text, view, list
  }
}

export default ACSReferencesField;
