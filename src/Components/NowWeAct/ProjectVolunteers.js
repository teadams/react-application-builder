//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import { Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import {SelectField, EditButton} from "../Layouts/index.js";
import {ObjectMapping, Field} from "../index.js"
import * as data from '../../Utils/data.js';
import update from 'immutability-helper';

class ProjectVolunteers extends React.Component {

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
//    window.scrollTo(0,0)
    const object_type  = "nwn_project_volunteer";
    const project_id = this.props.project_id
//  alert ('project id is ' + project_id)
    // note leader is misnamed
//  alert ('loading mapped data for ' + field_name)
    var options = {}
    options.filter_field = "nwn_project";
    options.filter_id = project_id;
    options.key_type = "key_id";
    data.getData("nwn_project_volunteer", options, (data, error) => { 
        let updated_state = [];
        updated_state.data = data;
        this.setState(updated_state)

//            alert ("data is " + JSON.stringify(data))
      })
  }

  render () {
      return (
      <Fragment>Project Volunteers
      {this.state.data.map(row=>{
          //alert ('row is ' + JSON.stringify(row))  
          return(<Typography>{row.name_first_name} {row.name_last_name} </Typography>)   
      })}
      </Fragment>  
  )}
}

export default ProjectVolunteers;

