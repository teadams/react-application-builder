import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import * as control from '../../Utils/control.js';

import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import ACSListController from '../ACSListController.js'
import * as meta from '../../Utils/meta.js';
import RABText from './RABText.js';
import useGetModel from "../../Hooks/useGetModel.js"


function RABObjectPrettyName(props) {
  const { object_type, action, variant, header=true, image_size="small"} = props
  let {data} = props
  const object_type_model = useGetModel("object_types", object_type)
  const field_models = useGetModel("fields", object_type)
  
  const pretty_field_name = object_type_model.pretty_key_id
  const field_model = field_models[pretty_field_name]
  const field_component_name = field_model.final_field_component?field_model.final_field_component:field_model.field_component
  if (field_model.references) {
    data=data[field_model.references]
  }
  const field_component = control.componentByName(field_component_name?field_component_name:"RABTextField")
  const text = field_component({data:data, trace:true,field_model:field_model, field_name:pretty_field_name, mode:"view", image_size:image_size})

  return (<RABText {...props} header={header} text={text} variant={variant}/>)
}
export default RABObjectPrettyName
