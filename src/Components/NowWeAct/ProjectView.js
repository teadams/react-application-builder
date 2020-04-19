import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import { Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import {ProjectVolunteers, ProjectVideo, ProjectNeeds, ProjectAnnouncements, ProjectDocuments} from './index.js';
import { withStyles } from '@material-ui/core/styles';
import {AuthContext} from '../User';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as utils from '../../Utils/utils.js';
import {SelectField, EditButton, CreateForm} from "../Layouts/index.js";
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
        formUnderlined:{},
        create_message_open:false
    }  
    this.loadData = this.loadData.bind(this);
    this.handleCreateMessageOpen = this.handleCreateMessageOpen.bind(this);
    this.handleMessageCreated = this.handleMessageCreated.bind(this);
  } 

  handleCreateMessageOpen()  {
    this.setState({create_message_open:true});
  }

  handleMessageCreated()  {
    this.setState({create_message_open:false});
  }

  componentDidMount() {
  //   alert ("view data mount")
      this.loadData();
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
  //    alert ("view data update")
      if (prevProps.project_id !== this.props.project_id || 
          prevProps.object_type !== this.props.object_type ) {
          this.loadData();
      }
  } 

  loadData() {
  //alert ('upper projet id is ' + this.props.project_id)
//    window.scrollTo(0,0)
    //alert ("loading data with " + this. props.project_id)
    data.getData ("nwn_project", {id:this.props.project_id}, (item_data, error) => { 
          let updated_state = {};
          updated_state.item_data = item_data;
          updated_state.pretty_name_edit = false;
              this.setState(updated_state)
          })   
  }

  render () {
    var project_data = this.state.item_data
    let hidden = {}
    hidden["from_user"] = true;
    hidden["to_user"] = true;
    hidden["nwn_project"] = true;
  //  alert ("project_id = " + JSON.stringify(project_data))
    if (!utils.isEmptyObject(project_data)) {
    //  alert ("about to return object")
      return (  
        <Fragment>


          <Paper elevation={24} square={false}>
          <Grid container>
              <Grid item xs={3}>
              <Paper elavatrion={10} style={{  backgroundColor:"white",padding:20}}>
              <Paper style={{padding:20}}>
              <center>          
              {project_data.thumbnail && 
              <Image avatar={true} object_type="nwn_project"
              size="medium" fix="height"
              image_object={JSON.parse(project_data.thumbnail)} field_name="thumbnail"/>
              }
            </center>
            
            <Typography variant="title">
              <center> {project_data.name} </center>
            </Typography>
            <Typography variant="body">
              <center> {project_data.summary} </center>
            </Typography>
              </Paper>

            <Paper elevation = {10} style={{padding:10}}>
              <center>
              <Typography>{project_data.street_address}</Typography>
              <Typography>{project_data.city}</Typography>
              <Typography>{project_data.state_name},  {project_data.country_name} {project_data.zip_code}</Typography>
              </center>
            </Paper>
            <Paper elevation={10} style={{backgrounColor:"white", padding:20}}>
            <center>
            <Button variant="contained" onClick={this.handleCreateMessageOpen}>Send a Message</Button>
            </center>
            {this.state.create_message_open &&
              <CreateForm
                object_type="nwn_project_message" 
                subject= {"Interested in your project:"+ project_data.name}
                nwn_project = {project_data.id}
                to_user = {project_data.leader}
                open={this.state.create_message_open}
                onClose={this.handleMessageCreated}
                hidden = {hidden}
                sections="basic"

              />
            }
            </Paper>
          
            <Paper  elevation={10} style={{marginBottom:20, marginTop:20, 
            backgroundColor:"rgba(200, 200, 200, 0.5)", padding:20, border:'5px solid "rgba(255, 99, 71, 0.8)"'}}>    
              <Image avatar={true} object_type="nwn_project_type"
            size="tiny"
            image_object={JSON.parse(project_data.type_thumbnail)} field_name="thumbnail"/>        
              {project_data.description}

            </Paper>

      <Divider/>
      <Paper style={{padding:20, marginBottom:20}} >
      <ProjectDocuments project_id={this.props.project_id} object_type="nwn_project" />
      </Paper>

              </Paper>
              </Grid>
              <Grid style={{padding:20}} item xs={6}>
              <Paper style={{padding:20}}>
              <Paper style={{padding:20, marginBottom:20}} >
              <ProjectVideo project_id={project_data.id}/>
              </Paper>

              <Paper style={{padding:20}}>
              <ProjectAnnouncements  project_id={project_data.id}/>
              </Paper>
              </Paper>
              </Grid>
              <Grid xs={3}>
              <Paper style={{padding:20}}>
              <Paper style={{padding:20, marginBottom:20}} >
              <center>
              {project_data.leader_thumbnail &&
                <Image avatar={true} object_type="core_user"
                size="medium" fix="height"
                image_object={JSON.parse(project_data.leader_thumbnail)} field_name="thumbnail"/>
              }
              </center>
              <Typography variant="title">
                <center> {project_data.leader_first_name} {project_data.leader_last_name} </center>
              </Typography>
              <Typography variant="body">
                <center> Project Leader </center>
              </Typography>
    
                </Paper>
                <Paper style={{padding:20, marginBottom:20}} >
                <ProjectVolunteers project_id={this.context.context_id} object_type="nwn_project" />
  
                </Paper>
                <Paper style={{padding:20, marginBottom:20}} >
                <ProjectNeeds project_id={this.context.context_id} object_type="nwn_project" />
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


ProjectView.contextType = AuthContext;
export default ProjectView;

