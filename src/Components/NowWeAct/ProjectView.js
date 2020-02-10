//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import { Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import {ProjectVolunteers, ProjectNeeds, ProjectAnnouncements} from './index.js';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as utils from '../../Utils/utils.js';
import {SelectField, EditButton} from "../Layouts/index.js";
import {ObjectMapping, Image, YouTube, Field} from "../index.js"
import * as data from '../../Utils/data.js';
import update from 'immutability-helper';

class ProjectView extends React.Component {

  constructor(props) {
    super(props);           

    this.state = {
        pretty_name_edit: false,
        props_object_type: '',
        formChanged: {},
        formUnderlined:{}
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
  //alert ('upper projet id is ' + this.props.project_id)
//    window.scrollTo(0,0)
    data.getData ("nwn_project", {id:this.props.project_id}, (item_data, error) => { 
          let updated_state = {};
          updated_state.item_data = item_data;
          updated_state.pretty_name_edit = false;
              this.setState(updated_state)
          })   
  }

  render () {
    var project_data = this.state.item_data
    
    if (!utils.isEmptyObject(project_data)) {
      return (  
        <Fragment>
          <Paper elevation={24} square={false}>
          <Grid container>
              <Grid item xs={3}>
              <Paper elavatrion={10} style={{  backgroundColor:"white",padding:20}}>
              <Paper style={{padding:20}}>
              <center>          

              <Image avatar={true} object_type="nwn_project"
              size="medium" fix="height"
              image_object={JSON.parse(project_data.thumbnail)} field_name="thumbnail"/>
            </center>
            
            <Typography variant="title">
              <center> {project_data.name} </center>
            </Typography>
            <Typography variant="body">
              <center> {project_data.summary} </center>
            </Typography>
            </Paper>
            
            <Paper  elevation={10} style={{marginBottom:20, marginTop:20, 
            backgroundColor:"rgba(200, 200, 200, 0.5)", padding:20, border:'5px solid "rgba(255, 99, 71, 0.8)"'}}>    
              <Image avatar={true} object_type="nwn_project_type"
            size="tiny"
            image_object={JSON.parse(project_data.type_thumbnail)} field_name="thumbnail"/>        
              {project_data.description}

            </Paper>

      <Divider/>

              <Paper elevation={10} style={{backgrounColor:"white", padding:20}}>
              <center>
              <Button variant="contained">Send a Message</Button>
              </center>
              </Paper>
  
              </Paper>
              </Grid>
              <Grid style={{padding:20}} item xs={6}>
              <Paper style={{padding:20}}>
              <Paper style={{padding:20, marginBottom:20}} >
              <YouTube
              size="medium" fix="height"
              initial_url="https://youtu.be/_Ett1KsKQi4"/>
              </Paper>

              <Paper style={{padding:20}}>
              <ProjectAnnouncements/>
              </Paper>
              </Paper>
              </Grid>
              <Grid xs={3}>
              <Paper style={{padding:20}}>
              <Paper style={{padding:20, marginBottom:20}} >
              <center>
              <Image avatar={true} object_type="nwn_user"
              size="medium" fix="height"
              image_object={JSON.parse(project_data.leader_thumbnail)} field_name="thumbnail"/>
              </center>
              <Typography variant="title">
                <center> {project_data.leader_first_name} {project_data.leader_last_name} </center>
              </Typography>
              <Typography variant="body">
                <center> Project Leader </center>
              </Typography>
    
                </Paper>
                <Paper style={{padding:20, marginBottom:20}} >
                <ProjectVolunteers project_id={this.props.project_id} object_type="nwn_project" />
  
                </Paper>
                <Paper style={{padding:20, marginBottom:20}} >
                <ProjectNeeds project_id={this.props.project_id} object_type="nwn_project" />
                </Paper>
              </Paper>
              </Grid>
          </Grid>               
      </Paper>
        </Fragment>)
        } else {
          return ("")
        }
  }  
}

export default ProjectView;

