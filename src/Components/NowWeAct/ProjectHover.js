//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import { Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import {SelectField, EditButton, MenuLink} from "../Layouts/index.js";
//import {ObjectMapping, Field} from "./index.js"
import * as data from '../../Utils/data.js';
import update from 'immutability-helper';
import {  BrowserRouter as Router,  Switch,  Route,  Link,  Redirect, useHistory } from "react-router-dom";


class ProjectHover extends React.Component {

  constructor(props) {
    super(props);           
    this.state = {
        item_data: {},      
        props_object_type: ''
    }  
    this.handleClick = this.handleClick.bind(this);
    
  } 

  handleClick = event => {
      alert ('handle clik')

      //this.props.onMore(event, this.props.link_menu_index, this.props.filter_id, this.props.menu_link_field, this.props.link_object_type, this.props.menu_link_reference_field)
  }

  render () {
      var marker_data = this.props.full_marker
      if (marker_data) {
        //alert ("marker data is " + JSON.stringify(marker_data.thumbnail))
        var thumbnail_data = {};
        var img_src
        if (marker_data["thumbnail"]) {
          thumbnail_data = JSON.parse(marker_data["thumbnail"])
        // alert ("thumbnail data is " + JSON.stringify(thumbnail_data))
        // TODO - pass in object type and file
          img_src = "/images/nwn_project/thumbnail/"+thumbnail_data.name
        } else {
          img_src = ""
        }
        thumbnail_data.width = 300
        thumbnail_data.height = 287

//        alert ("image source is " +img_src)
        let path="/app_menu/5/" +this.props.selected_id
        return (
      
        <Fragment>
          <Paper>
            <div style={{ padding: 10 }}>
              <Grid container spacing={4}>
                <Grid item>
                <div style={{ padding: 5 }}>
            <img width = {thumbnail_data.width} height={thumbnail_data.height} src={img_src} />
            </div>
          </Grid>
          <Grid item>
          <div style={{ padding: 5 }}>
            <Typography variant="title" gutterBottom>
             {this.props.name} 
            </Typography>
           <Typography variant="subtitle">
              {this.props.summary} 
            </Typography>
            <Typography variant="body">
            Led by {this.props.leader_first_name}
            {this.props.leader_last_name}
            </Typography>
            <Typography>
                <Divider/>
            </Typography>
            <Typography>
            {this.props.description}
            </Typography>
          </div><center>
          <Router>
          <Link to={path}>Learn More</Link>
          </Router>
        
          </center>
        </Grid>
        </Grid>
</div>
</Paper>
</Fragment>
      ) 
      } else {
        // marker data is not loaded yet
        return ("")
      }   
  } 
}

export default ProjectHover;

