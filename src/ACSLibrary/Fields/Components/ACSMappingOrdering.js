import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../../Utils/utils.js'
import {ACSListController} from '../../../ACSRenderEngine'
import {Link, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel,RadioGroup,Radio } from '@material-ui/core';

import React, {Fragment,useEffect} from 'react';


function ACSMappingOrdering(props)  {
  const {object_type, mode,  field_name, field_list, num_add=3, allow_add=true, data, allow_save=false,field_model, valid_values,
  formAttributes=[],form_field_name=props.field_name, pretty_name,onChange,...params} = props

  if (!data) return null
  return (
      <Fragment>
      {data.map(row => {
        return (row[field_name])
      })} 
      </Fragment>
  )
}
export default ACSMappingOrdering;


