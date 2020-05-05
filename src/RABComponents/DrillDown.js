import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import ObjectView from './ObjectView.js'
import NavMenu from './NavMenu.js'
import TreeMenu from './TreeMenu.js'

//import RenderFieldSetList from './RenderFieldSetList.js'

import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

function DrillDown(props)  {
  const {object_type:props_object_type, api_options={}, selected_id:props_selected_id, target_menu_name, target_filter_field="id", ...params} = props

  const {grouping_field} = api_options
  // ensure everything changes together so data and meta_model match
  const [state, setState] = useState([props_selected_id, props_object_type])
  const [selected_id,object_type] = state

  if (object_type != props_object_type) {
      setState(["", props_object_type])
  }

  const handleSelect = (id, event) => {
      if (grouping_field && id.toString().split("-").length >1) {
          id = ""
      }
      setState([id, object_type])
  }

  let selected_filter = {}
  selected_filter[target_filter_field] = selected_id
  const {...filter_params} = selected_filter

  return (
  <Grid spacing={4} conta
iner>
    <Grid  sm={2} item>
      <TreeMenu {...params} api_options={api_options} object_type={object_type}
       onClick={handleSelect}/>
    </Grid>
    <Grid  sm={10} item>
      <ObjectView  {...params} {...filter_params} api_options={api_options} object_type={object_type} menu_name={target_menu_name}/>
    </Grid>
  </Grid>

);
    
}

export default DrillDown;
