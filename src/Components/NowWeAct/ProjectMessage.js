//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import { Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, List, ListItem, ListItemText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import { Image} from "../index.js"
import * as data from '../../Utils/data.js';
import update from 'immutability-helper';
import 'typeface-roboto'

class ProjectMessage extends React.Component {

  constructor(props) {
    super(props);    
    this.handleSubjectClick = this.handleSubjectClick.bind(this);       
  } 


  handleSubjectClick = event => {
      alert ("subject is clicked")
  }


  render () {
    
    if (this.props.row.read_p) {
      return (
              <ListItem>
                <ListItemText>
                  <Grid direction="horizonal" container>
                  <Grid item style={{width:100}}>{this.props.row.creation_date}</Grid><Grid item style={{paddingLeft:20, width:300}}>   
                  {this.props.row.from_user_first_name} {this.props.row.from_user_last_name} 
                  </Grid>
                  <Grid  item style={{paddingLeft:20}}>
                  <Typography onClick={this.handleSubjectClick}>{this.props.row.subject}</Typography>
                  </Grid></Grid>
                  </ListItemText>
              </ListItem>
            )  
    } else {

      return (
              <ListItem>
                <ListItemText>
                  <Grid direction="horizonal" container>
                  <Grid item style={{width:100}}>{this.props.row.creation_date}</Grid><Grid item style={{paddingLeft:20, width:300}}>   
                  {this.props.row.from_user_first_name} {this.props.row.from_user_last_name} 
                  </Grid>
                  <Grid item style={{paddingLeft:20}}>
                  <b>{this.props.row.subject}</b>
                  </Grid></Grid>
                  </ListItemText>
              </ListItem>
            )
    } 
  }
}

export default ProjectMessage;

