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
  const {object_type:props_object_type, selected_id:props_selected_id} = props
  // ensure everything changes together so data and meta_model match
  const [state, setState] = useState([props_selected_id, props_object_type])
  const [selected_id,object_type] = state

  if (object_type != props_object_type) {
      setState(["", props_object_type])
  }

  const handleSelect = (id) => {
      setState([id, object_type])
  }

  return (
  <Grid spacing={4} container>
    <Grid  sm={4} item>
      <TreeMenu object_type={object_type}
       onSelect={handleSelect}/>
    </Grid>
    <Grid  sm={8} item>
      <ObjectView object_type={object_type} 
      id={selected_id}/>
    </Grid>
  </Grid>

);
    
}

export default DrillDown;
