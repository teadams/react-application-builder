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

class ProjectNeeds extends React.Component {

  constructor(props) {
    super(props);           

    this.state = {
        data: [],
    }  
    this.loadData = this.loadData.bind(this);
  } 

  componentDidMount() {
  //   alert ("view data mount")
      this.loadData();
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
  //    alert ("view data update")
      if (prevProps.id !== this.props.id || 
          prevProps.object_type !== this.props.object_type) {
          this.loadData();
      }
  } 

  loadData() {
    var options = {}
    options.key_type = "key_id";
    data.getData("nwn_project_need", options, (data, error) => { 
        let updated_state = [];
        updated_state.data = data;
        this.setState(updated_state)
      })
  }

  render () {
      return (
      <Fragment>
      <Grid container spacing='32' direction='column'>
      <Grid item>
      <Typography variant="title">Project Needs</Typography>
      </Grid>
      <Grid>
      <List>
      {this.state.data.map(row=>{
          //alert ('row is ' + JSON.stringify(row))  
          return(
              <ListItem>
                <ListItemText>
                {row.name_name}   
                </ListItemText>
                <ListItemText>
                {row.description}
                </ListItemText>
              </ListItem>
            )   
      })}
      </List>
      </Grid>
      </Grid>
      </Fragment>  
  )}
}

export default ProjectNeeds;

