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
//import RenderFieldSetList from './RenderFieldSetList.js'

import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

function DrillDown(props)  {
  const {object_type} = props
  const [selected_id, setSelectedId] = useState(props.selected_id);
// think about changing object_type.. should object_type be in stsate. or should it be place in tree. "Protect state"

  const handleSelect = (id, object_type) => {
        setSelectedId(id)
  }

  return (
  <Grid container>
    <Grid sm={2} item>
      <NavMenu object_type={object_type}
       onClick={{field_wrap:handleSelect}}
//      onClick={{field:handleClick}}
 />
    </Grid>
    <Grid sm={6} item>
      <ObjectView object_type={object_type} 
      id={selected_id}/>
    </Grid>
  </Grid>
);
    
}

export default DrillDown;
