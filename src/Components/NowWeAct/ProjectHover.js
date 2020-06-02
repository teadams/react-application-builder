import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, { Component, Fragment} from 'react';
import { Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js'
import * as meta from '../../Utils/meta.js';
import ObjectView from '../../RABComponents/ObjectView.js'
//import {  BrowserRouter as Router,  Switch,  Route,  Link,  Redirect, useHistory } from "react-router-dom";
//let path="/app_menu/5/" +this.props.selected_id

function ProjectHover(props) {
  const {full_marker, object_type, id}  = props
  if (full_marker) {
    return (
      <Fragment>
        <ObjectView object_type={object_type} id={id} num_columns={1}/>
      </Fragment>        
    ) 
  } else {
    return null
  }   
}
//<Router>
//<Link to={path}>Learn More</Link>
//</Router>

export default ProjectHover;

