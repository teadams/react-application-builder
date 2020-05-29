import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import * as control from '../../Utils/control.js';

import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import ACSListController from '../ACSListController.js'
import rab_component_models from '../../Models/HealthMe/component.js'
import * as meta from '../../Utils/meta.js';
import RABText from './RABText.js';
import useGetModel from "../../Hooks/useGetModel.js"


function RABObjectPrettyName(props) {
  const {data, object_type, variant, header=true} = props

  const object_type_model = useGetModel("object_types", object_type)
  const field_model = useGetModel("fields", object_type)

  const pretty_field_name = object_type_model.pretty_key_id
  const field_component_name = field_model[pretty_field_name].field_component

  const field_component = control.componentByName(field_component_name?field_component_name:"RABTextField")

  const text = field_component({data:data, field_name:pretty_field_name, mode:"text"})
  return (<RABText header={header} text={text} variant={variant}/>)
}
export default RABObjectPrettyName
