//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import { Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, ListItemSecondaryAction, List, ListItem, ListItemText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import { Image} from "../index.js"
import { ButtonCreate, EditButton, CreateForm} from "../Layouts/index.js"
import * as data from '../../Utils/data.js';
import update from 'immutability-helper';
import 'typeface-roboto'

class ProjectDocuments extends React.Component {

  constructor(props) {
    super(props);           

    this.state = {
        data: [],
        form_open:false,
        current_id:""
    }  
    this.loadData = this.loadData.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnClose = this.handleOnClose.bind(this);
  } 

  handleOnClick()  {
    this.setState({form_open:true});
  }

  handleOnClose(action_text, inserted_id, formValues)  {
    this.setState({form_open:false, current_id:""});
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
    const object_type  = "nwn_project_need";
    const project_id = this.props.project_id
//  alert ('project id is ' + project_id)
    // note leader is misnamed
//  alert ('loading mapped data for ' + field_name)
    var options = {}
    options.filter_field = "nwn_project";
    options.filter_id = project_id;
    options.key_type = "key_id";
    data.getData("nwn_project_document", options, (data, error) => { 
        let updated_state = [];
        updated_state.data = data;
        this.setState(updated_state)
      })
  }

  render () {
      return (
      <Fragment>
      {this.state.form_open && 
      <CreateForm open={this.state.form_open} id={this.state.current_id} nwn_project={this.props.project_id} hidden={{nwn_project:true}} onClose={this.handleOnClose } object_type="nwn_project_document" />}

      <Grid container spacing='32' direction='column'>
      <Grid item>
        <Grid container direction='row'>
           <Grid item>
              <Typography variant="title">Project Documents</Typography>
            </Grid><Grid  style={{paddingLeft:10}} item>
              <ButtonCreate onClick={this.handleOnClick} />
            </Grid>
        </Grid>
      </Grid>
      <Grid>
      <List>
      {this.state.data.map(row=>{
          //alert ('row is ' + JSON.stringify(row))  
          return(
            <ListItem>
              <ListItemText>
              {row.name} -
              {row.description}
              </ListItemText>
              <ListItemSecondaryAction><EditButton name={row.id} onClick={this.handleOnClick} /></ListItemSecondaryAction>
            </ListItem>
            )   
      })}
      </List>
      </Grid>
      </Grid>
      </Fragment>  
  )}
}

export default ProjectDocuments;

