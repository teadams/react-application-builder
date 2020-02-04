//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import { Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import {ProjectVolunteers} from './index.js';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import {SelectField, EditButton} from "../Layouts/index.js";
import {ObjectMapping, Image, Field} from "../index.js"
import * as data from '../../Utils/data.js';
import update from 'immutability-helper';

class ProjectView extends React.Component {

  constructor(props) {
    super(props);           

    this.state = {
        item_data: {},
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
//          alert ('item data is is ' + JSON.stringify(item_data))
    //      meta.fields(this.props.object_type).map(field => {
      //      if (field.mapping) {
      //        this.loadMappedData(field.name)
      //      }
    //      })
              this.setState(updated_state)
          })   
  }

  render () {
  
        var project_data = this.state.item_data
//        alert ('project data is ' + JSON.stringify(project_data))
        var thumbnail_data = {};
        var img_src = "";
        if (project_data["thumbnail"]) {
            thumbnail_data = JSON.parse(project_data["thumbnail"])
            img_src = "/images/nwn_project/thumbnail/"+thumbnail_data.name
        } else {
          img_src = ""
        }
        thumbnail_data.width = 150
        thumbnail_data.height = 143
      var icon_src
      var type_thumbnail_data
      if (project_data["type_thumbnail"]) {
        type_thumbnail_data = JSON.parse(project_data["type_thumbnail"])
        icon_src = "/images/nwn_project_type/thumbnail/"+type_thumbnail_data.name
      }
      var leader_src = ""
      var leader_thumbnail_data = {}
      if (project_data["leader_thumbnail"]) {
        leader_thumbnail_data = JSON.parse(project_data["leader_thumbnail"])
        leader_src = "/images/nwn_user/thumbnail/"+leader_thumbnail_data.name
      }
      leader_thumbnail_data.width = 150
      leader_thumbnail_data.height = 143
      //  alert ("data is " +JSON.stringify(this.state.item_data))
        if (project_data) {
          return (
        <Fragment>
          <Paper elevation={24} square={false}>
          <Grid container>
              <Grid item xs={3}>
              <Paper elavatrion={10} style={{  backgroundColor:"white",padding:20}}>
            
              <Paper style={{padding:20}}>
              <center>
              <Avatar  style={{ height:thumbnail_data.height, width:thumbnail_data.width}} src={img_src}/>
            
              <Image avatar={true} object_type="nwn_project"
              size="tiny"
              image_object={thumbnail_data} field_name="thumbnail"/>
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
              {project_data.description}
              <Avatar style={{align:"right"}} src={icon_src}/>
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
              <Paper style={{padding:20, marginBottom:20}} ><center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/_Ett1KsKQi4?start=4&autoplay=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> </center>
              </Paper>
              <Paper style={{padding:20}}>
                Project Posts of all types go here newest to oldest
              </Paper>
              </Paper>
              </Grid>
              <Grid xs={3}>
              <Paper style={{padding:20}}>
              <Paper style={{padding:20, marginBottom:20}} >
              <center>
              <Avatar  style={{ height:leader_thumbnail_data.height, width:leader_thumbnail_data.width}} src={leader_src}/>
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
                Project needs <br/>
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

