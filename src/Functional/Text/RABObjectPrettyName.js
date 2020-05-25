import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
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
  const pretty_field_name = object_type_model.pretty_key_id
  return (<RABText header={header} text={data[pretty_field_name]} variant={variant}/>)

}
export default RABObjectPrettyName
