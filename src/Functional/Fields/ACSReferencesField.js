import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import * as control from '../../Utils/control.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import {ACSListController} from '../../ACSRenderEngine'
import rab_component_models from '../../Utils/component.js'
import * as meta from '../../Utils/meta.js';
import useGetModel from '../../Hooks/useGetModel';
import _ from 'lodash/object'


function ACSReferencesField(props) {
  const {mode, data=[], add_none, base_field_name, parent_field_name, base_object_type, parent_object_type, field_name, formValues, onSubmit, onChange, object_type, field_model={}} = props
  let {form_field_name, list_display="div"} = props
  const {...params} = props

  if (field_model.list_display) {
      list_display = field_model.list_display
  }

  let api_options ={}
  api_options.filter_field = [field_model.referenced_by_object_type_field, field_model.referenced_by_field]
  api_options.filter_id = [object_type, data.id]
  api_options.filter_join = "AND"

  let default_create_props = {}
  default_create_props[field_model.referenced_by_object_type_field] = object_type 
  default_create_props[field_model.referenced_by_field] = data.id
  if (field_model.referenced_display_type) {
      list_display = field_model.referenced_display_type
  }
  let rab_component_model 
  switch (list_display) {
    case "table":
      rab_component_model = _.merge({},rab_component_models.list)
      break;
    case "div":
      rab_component_model = _.merge({},rab_component_models.tag_list)
      rab_component_model.list.props.tag = "div"
      rab_component_model.row.props.tag = "div"
      break;
    case "ul":
      rab_component_model = _.merge({},rab_component_models.tag_list)
      rab_component_model.list.props.tag = "ul"
      rab_component_model.row.props.tag = "li"
      break;
    case "ol":
      rab_component_model = _.merge({},rab_component_models.tag_list)
      rab_component_model.list.props.tag = "ol"
      rab_component_model.row.props.tag = "li"

      break;
  }

  switch (mode) {   
    case "list":
      return (null)
      break
    case "edit":
    case "create":
    case "csv":
    default:
      return (<ACSListController field_list={field_model.list_field_list} object_type={field_model.referenced_by} rab_component_model={rab_component_model} api_options={api_options}/>)
      // text, view, list
  }
}

export default ACSReferencesField;
