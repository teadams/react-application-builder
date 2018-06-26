//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import { Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper } from '@material-ui/core';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import {SelectField, EditButton} from "../Layouts/index.js";
import {MappingForm, Field} from "./index.js"
import * as data from '../../Utils/data.js';
import update from 'immutability-helper';

class ViewForm extends React.Component {

  constructor(props) {
    super(props);           

  // props
  // object_type
  // selected_id
  // grouping_field_name
  // onDataChange

    this.state = {
        item_data: "",
        pretty_name_edit: false,
        props_object_type: '',
        formValues: {},
        formChanged: {},
        formUnderlined:{}
    }  
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleDBUpdate = this.handleDBUpdate.bind(this);
    this.handleMappingClose = this.handleMappingClose.bind(this);
    this.renderField = this.renderField.bind(this);
    this.loadData = this.loadData.bind(this);
  } 


  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.object_type && nextProps.object_type != prevState.props_object_type) {
      const refreshed_state =    {
              item_data: "",
              pretty_name_edit: false,
              props_object_type: nextProps.object_type,
              formValues: {},
              formChanged: {},
              formUnderlined: {}
          }  
      return refreshed_state
    }
    return null
  }

  loadData() {
//    window.scrollTo(0,0)
    data.getData (this.props.object_type, {id:this.props.selected_id}, (item_data, error) => { 
          // set completed new state
          var new_state = this.state;
          new_state.item_data = item_data;
          new_state.pretty_name_edit = false;
          meta.fields(this.props.object_type).map(field => {
            if (!field.mapping) {
              new_state.formValues[field.name] = (item_data[field.name] !== null)?item_data[field.name]:""
              new_state.formChanged[field.name] = false
              new_state.formUnderlined[field.name] =  (item_data[field.name]===null || item_data[field.name===""])?true:false
          } 
          this.setState(new_state)
          })})   
  }


  componentDidMount() {
//    alert ("drill mount")
      this.loadData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      if (prevProps.selected_id !== this.props.selected_id || 
          prevProps.object_type !== this.props.object_type) {
          this.loadData();
      }
  }  

  handleMappingClose = field_name => {
      this.loadMappedData(meta.field(this.props.object_type, field_name))
      this.setState({mapping_open:false});
  }

  
  handleChange = name => event => {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      // TODO make ummutable
      var new_state =this.State
      new_state.formValues[name] = value;
      new_state.formChanged[name ] = true
      //alert ('handle change ' + name)
      this.setState(new_state);
  }

/// Beleive this will move down a level
  handleFocus = event => {
      var new_state = {}
      new_state.formUnderlined[event.target.name ] = true
      this.setState(new_state);
  }

// BELIEVE this will move donw a leve
  handleSubmit = name => event => {
      event.preventDefault();
      if (this.state.formChanged[name]) {
        this.handleDBUpdate(name);
      } else {
          var new_state=this.state;
          new_state.pretty_name_edit = false;
          new_state.formUnderlined[name ] = false;
          this.setState(new_state);
      }
  }

// THIS will move down a level  
  handleDBUpdate(field_name) {
      const object_type = this.props.object_type;
      const pretty_field_name = meta.keys(object_type).pretty_key_id;
      var data_object = Object();
      data_object[field_name] = this.state["form_"+field_name];
      const id = this.state["form_"+meta.keys(object_type).key_id]
      var urltext = '/api/v1/'+ object_type +'/'+ id ;
      axios({
              method: 'put',
              url: urltext,
              data: { data_object }
      }).then (result => {
                var new_state={};
                new_state.pretty_name_edit = false;
                new_state["form_changed_"+field_name] = false;
                new_state["form_underlined_" + field_name ] = false;
                this.setState(new_state);
                if (field_name == this.props.grouping_field_name || 
                  field_name == pretty_field_name || meta.field(object_type, pretty_field_name).derived) {
//                  if the pretty field name is derived, we will update the drill down at
// every data change. (if this prove inefficient, we'll have to track which fields contribute to the
// derived fields). Made engineering choice to streamline this for now.
                    this.props.onDataChange();

                }
  
            }).catch(error => {
              alert ('error is ' + error.message)
      });
  }

  
  
  renderField(field) {
    const keys = meta.keys(this.props.object_type);
    const grid_col = field.grid_col?field.grid_col:4
    const width= grid_col * 75

    if (field.name != keys.key_id && field.name != keys.pretty_key_id) {
      return (
      <Grid key={field.name} item style={{padding:10, boxBorder:"border-box"}} sm={grid_col}>
        <Field object_type = {this.props.object_type} 
          field_name = {field.name}  
          data_object={this.state.item_data}
          mode="form"
          id = {this.props.selected_id}
        /> 
      </Grid>)
    } else {
        return null
    }  
  }

  render () {
  //  alert ('in render')
    const object_attributes = meta.object(this.props.object_type);
    const object_fields = meta.fields(this.props.object_type);
    const keys = meta.keys(this.props.object_type);
    const id = this.state["form_"+meta.keys(this.props.object_type).key_id]
    const pretty_name_field_name = meta.pretty_name_column(this.props.object_type)
    const pretty_name_field_derived = meta.field(this.props.object_type,pretty_name_field_name).derived
  //  alert ("pretty name derived" + pretty_name_field_derived)    
    const sections = meta.sections(this.props.object_type);

  //  alert ('render with selected id ' + this.props.selected_id)
    return (
      <Fragment>
        {this.state.mapping_open &&
        <MappingForm 
          open={this.state.mapping_open}
          onClose={this.handleMappingClose}
          object_type={this.props.object_type}
          mapping_field_name = {this.state.mapping_field_name}
          mapping_field_value = {id}
          mapping_field_pretty_name ={this.state["form_" + pretty_name_field_name]}
        />}

        {this.state.pretty_name_edit  ? 
        <form onSubmit={this.handleSubmit(pretty_name_field_name)}
        id={id+'-'+this.state.item_data[keys.pretty_key_id]}>
        <TextField    
        margin="normal"
        name={keys.pretty_key_id}
        type="text"
        value=  {this.state.formValues[pretty_name_field_name]}
        onChange={this.handleChange(pretty_name_field_name)}
        onBlur={this.handleSubmit(pretty_name_field_name)}
        />
        </form>
          : (pretty_name_field_derived)? <Typography  style= {{textTransform:"capitalize"}}        variant="headline" gutterBottom>{this.convertDerived(pretty_name_field_derived)}</Typography>
          : <Typography  style= {{textTransform:"capitalize"}}  onClick={()=>{this.setState({pretty_name_edit:true})}} variant="headline" gutterBottom>{this.state.formValues[pretty_name_field_name]} </Typography>
        }
        <Grid container  alignContent='flex-start'  justify="flex-start" wrap="wrap" >
        {this.state.item_data && !sections && object_fields.map(field => {
          return (this.renderField(field))
      })}
        {this.state.item_data && sections && sections.map(section => {
        return (
          <Grid item style={{padding:10}} sm={12}>
          <Paper style={{boxSizing:"border-box", padding:10, height:"100%"}}>  
          <Grid container  alignContent='flex-start'  justify="flex-start"  wrap="wrap" >
            {section.title &&
                <Grid item sm={12}>
                  <Typography variant="title" > {section.title} </Typography>
                  <Divider style={{marginBottom:10}}/>
                </Grid>
            }
            {section.text && 
                  <Grid item style={{padding:10}} sm={12}>
                    {section.text}
                  </Grid>
            }
            
                {meta.section_fields(this.props.object_type, section.name).map(field=>{
                      return (this.renderField(field))
                })
              }
              
            </Grid>
          </Paper>
          </Grid>)  
        })}    
        </Grid>        
      </Fragment>
    )
  } 
}


export default ViewForm;

