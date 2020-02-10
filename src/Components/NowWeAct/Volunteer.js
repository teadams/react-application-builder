//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import { Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import { Image} from "../index.js"
import * as data from '../../Utils/data.js';
import update from 'immutability-helper';
import {SelectObject} from "../index.js";

class Volunteer extends React.Component {

  constructor(props) {
    super(props);           

    this.state = {
        data: [],
    }  
    this.loadData = this.loadData.bind(this);
  } 

  componentDidMount() {
  //   alert ("view data mount")
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {

  } 

  loadData() {

  }

  render () {
      let project_field = meta.field("nwn_project", "name")
      return (
      <Fragment>
      <Typography style={{padding:20}}>
      Thank you for your interest in helping our community. 
      </Typography>
      <Typography style={{padding:20}}>
      You may start the process by picking either a specific project or a specific role below.  The lower part of the page will update with the needs available.
      </Typography>
      <Grid container>
      <Grid item xs={4}>
        <SelectObject object_type="nwn_project"/>
      </Grid> <Grid item xs={4}>
        <SelectObject object_type="nwn_role_type"/>
      </Grid>
      </Grid>
      PROJECT - Project Box,
      ROLE -- ROLE Multiple check,
      If project is selected, then the roles will narrow.
      If role is select, then the project will narrow,
      If project is selected, then will show information about the project,
      Are you willing to share your email?,
      Message,
      Process one,
      Process Multiple
      </Fragment>  )
  }
}

export default Volunteer;

