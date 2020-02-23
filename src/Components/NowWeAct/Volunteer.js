//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
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
        project_id: this.props.project_id?this.props.project_id:'',
        role_type_id: this.props.role_type_id?this.props.role_type_id:'',
        project_needs: [],
        email_p:true
    }  
    this.loadData = this.loadData.bind(this);
    this.handleRoleTypeChange = this.handleRoleTypeChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  } 

  handleSubmit(event) {
      event.preventDefault();
      log.val(JSON.stringify(this.state))
    //  alert ("submitting the form" + JSON.stringify(this.state))
      let data_object = {}
      data_object.email_p = this.state.email_p
      data_object.message = this.state.message
      let needs_object = this.state.project_need
      log.val(JSON.stringify(this.state))
      for (var key in this.state) {
          if (this.state.hasOwnProperty(key)) {
            log.val ("keey is " + key)
            alert ("key searc is "  + key + " " + key.search("need_"))
            if (key.search("need_") == 0) {
               alert ("in a need")
                // need it is the index of the need from project_needs
                // not the id in the database
                let need_idx =  key.replace("need_","")
                log.val("need is " +need_idx)   
                let need = this.state.project_needs[need_idx]
                log.val(JSON.stringify(need))
                let project_id = need.nwn_project_id
                let need_id = need.id
                let user = 4
                let volunteer_object = {}
                volunteer_object.nwn_project  = need.nwn_project_id
                volunteer_object.name = 4
                volunteer_object.role_type = need.name
        //        alert ('volunteer object is ' + JSON.stringify(volunteer_object))
                data.postData("nwn_project_volunteer", volunteer_object, {}, (result, error) => { 
                  log.val("callback of postdata")
                  if (error) {
                      log.val("error is " + error)
                  } else { 
                      log.val("need submitted for " + need_idx)
                  }
                })
               // create volunteer application
                // have to get the user
               // create project Message      
            } 
          }
          alert ("done with property")
      }
  
      //alert ("about to finish submit")
      // for each need_   
        // parse out the need 
        // get the project 
        // send a message
  }

  handleChange = event => {
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    let state_object={}
    state_object[event.target.name] = value
    this.setState(state_object)   
  }

  loadData () {
      let object_type = "nwn_project_need"
      data.getData(object_type, "", (data, error) => { 
        const id_column_name =meta.keys(object_type).key_id;
        const name_column_name = meta.keys(object_type).pretty_key_id;
        this.setState({ project_needs: data})          
      })
      
  }

  handleProjectChange = event => {
      //  alert ("changeing project id")
//        alert ('submit event target is '  + event.target.value)
        if (event.target.value != this.state.project_id) {
          this.setState({ project_id: event.target.value , selectTouched: true});
          this.loadData()
        }
  }

  handleRoleTypeChange = event => {
      //alert ("chageing role")
//        alert ('submit event target is '  + event.target.value)
    if (event.target.value != this.state.role_type_id) {
        this.setState({ role_type_id: event.target.value , selectTouched: true});
        this.loadData()
    }
  }

  componentDidMount() {
  //   alert ("view data mount")
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {

  } 



  render () {
      let need_idx = 0
      let project_field = meta.field("nwn_project", "name")
      let show_needs = false
      if (this.state.project_id || this.state.role_type_id) {
        show_needs = true
      }
      return (
      <Fragment>
      <Typography style={{padding:20}}>
      Thank you for your interest in helping our community. 
      </Typography>
      <Typography style={{padding:20}}>
      You may start the process by picking either a specific project or a specific role below.  The lower part of the page will update with the needs available.
      </Typography>
      <Grid container style={{padding:20}}>
      <Grid item xs={4}>
        <SelectObject object_type="nwn_project" shrink="false" style={{width:"90%"}} value={this.state.project_id}     onChange={this.handleProjectChange}/>
      </Grid> <Grid item xs={4}>
        <SelectObject object_type="nwn_role_type" input_type="radio" shrink="false" style={{width:"90%"}} value={this.state.role_type_id}
        onChange={this.handleRoleTypeChange}
        />
      </Grid>
      </Grid> 
      {show_needs &&  
      <Fragment>
      <form onSubmit={this.handleSubmit}>
      <FormControl>
      <FormLabel>Avaialable Needs</FormLabel>
      <Typography>Check the volunteer opportunities you are interested in.  You may select more than 1. </Typography>
    
      <FormGroup name={this.props.object_type} area-label="Available Needs">
      {this.state.project_needs.map(need => {
          let need_field_name = "need_" + need_idx
          // for the next loop
          need_idx += 1
          return (  
            <Fragment>
            <FormControlLabel name={need_field_name} value={this.state["need_name"]} id={need_field_name} label={need.name_name} control={<Checkbox onChange={this.handleChange}/>}/>
            <Typography> Project: {need.nwn_project_name}: {need.nwn_project}</Typography>
            </Fragment>
          ) 


      })}
      </FormGroup>
      <TextField
        id="message"
        name="message"
        rows="5"
        rowsMax="10"
        value = {this.state.message}
        onChange={this.handleChange}
        label= "Use the area below to  send a message to the project leader."
        multiline />
      <FormControlLabel name="email_name" id="email_id" value={this.state.email_name} label="Check here if it is ok to share your email address with the project email.  This will allow you to continue your conversation with email directly." control={<Checkbox onChange={this.handleChange} defaultChecked/>}/>    
      <Button type="submit" value="Submit">Submit</Button>
    </FormControl>
    </form>
      </Fragment>

      }
      </Fragment>  )
  }
}

export default Volunteer;

