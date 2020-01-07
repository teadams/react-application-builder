//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import { Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import {SelectField, EditButton} from "../Layouts/index.js";
//import {ObjectMapping, Field} from "./index.js"
import * as data from '../../Utils/data.js';
import update from 'immutability-helper';

class ProjectHover extends React.Component {

  constructor(props) {
    super(props);           
    this.state = {
        item_data: {},      
        props_object_type: ''
    }  
    this.loadData = this.loadData.bind(this);
  } 

  loadData() {
    alert("loading data")
//    window.scrollTo(0,0)
//alert ('load data in view')
    data.getData (this.props.object_type, {id:this.props.selected_id}, (item_data, error) => { 
          let updated_state = {};
          updated_state.item_data = item_data;
          updated_state.pretty_name_edit = false;
              this.setState(updated_state)
          })   
  }

  componentDidMount() {
     alert ("view data mount")
      this.loadData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    alert ("view data update")
  }  

  render () {
      return (
        <Fragment>
        <Paper>
         <div style={{ padding: 10 }}>
        <Grid container spacing={4}>
          <Grid item>
          <div style={{ padding: 5 }}>
            <img width='102' height='68' src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Photovoltaik_Dachanlage_Hannover_-_Schwarze_Heide_-_1_MW.jpg/1200px-Photovoltaik_Dachanlage_Hannover_-_Schwarze_Heide_-_1_MW.jpg'/>
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
          <Button variant="contained">Learn More</Button>
          </center>
        </Grid>
        </Grid>
</div>
</Paper>
</Fragment>
      )    
  } 
}

export default ProjectHover;

