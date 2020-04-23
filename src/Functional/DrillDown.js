import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as utils from '../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import ObjectList from "./ObjectList.js"
import {ObjectView} from "../Components/Experimental/index.js"


import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

function DrillDown(props) {
return (
  <Grid container>
    <Grid item>
        <ObjectList {...props}/>
    </Grid><Grid item>
        <ObjectView
            object_type = {props.object_type}
            selected_id = "3"
//            grouping_field_name = {props.grouping_field}
//            onDataChange = {this.handleDataChange}
//            onMenuChange = {this.props.onMenuChange}
          />
     </Grid>
  </Grid>
);
    
}

export default DrillDown;
