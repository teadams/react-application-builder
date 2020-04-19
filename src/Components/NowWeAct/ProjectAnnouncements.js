import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import { Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import { Image, YouTube} from "../index.js"
import * as data from '../../Utils/data.js';
import update from 'immutability-helper';


class ProjectAnnouncements extends React.Component {

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
    const object_type  = "nwn_project_post";
    const project_id = this.props.project_id

    // note leader is misnamed
//  alert ('loading mapped data for ' + field_name)
    var options = {}
    options.filter_field = "nwn_project";
    options.filter_id = project_id;
    options.key_type = "key_id";
    data.getData("nwn_project_post", options, (data, error) => { 
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
      <Typography variant="title">Project Announcements</Typography>
      </Grid>
      <Grid>
      {this.state.data.map(row=>{

          return(
              <Paper style={{padding:20}}>
                  <Typography variant='title' gutterBottom>
                    {row.name}
                  </Typography>
                  <Typography  gutterBottom>
                  {row.body}
                  </Typography>
                  {row.role_type && 
                      <Button variant='contained'>I can help!</Button>
                  }
                  {row.url && <YouTube initial_url={row.url}/>}
                  {row.image && <Image object_type="nwn_project_post"
                  size="medium" fix="width"
                  image_object={JSON.parse(row.image)} field_name="image"/>}
              </Paper>
            )   
      })}
      </Grid>
      </Grid>
      </Fragment>  
  )}
}

export default ProjectAnnouncements;

