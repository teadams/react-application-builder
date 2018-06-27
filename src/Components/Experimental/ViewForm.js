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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMappingOpen = this.handleMappingOpen.bind(this);
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
//alert ('load data in view')
    data.getData (this.props.object_type, {id:this.props.selected_id}, (item_data, error) => { 

          let updated_state = {};
          updated_state.formValues = {};
          updated_state.item_data = item_data;
          updated_state.pretty_name_edit = false;
          meta.fields(this.props.object_type).map(field => {
            if (!field.mapping) {
              updated_state.formValues[field.name] = (item_data[field.name] !== null)?item_data[field.name]:""
            } else {
              this.loadMappedData(field.name)
            }
          })
              this.setState(updated_state)
          })   
  }

  loadMappedData(field_name) {
//    alert ('loading mapping data')
    const { object_type } = this.props;
    const field = meta.field(object_type,field_name);
  //  alert ('loading mapped data for ' + field_name)
    var options = {}
    options.filter_field = field.mapped_field;
    options.filter_id = this.props.selected_id;
    options.key_type = "key_id";
    data.getData(field.mapping, options, (mapped_data, error) => { 
    //  alert ("mapped data is " + JSON.stringify(mapped_data))
      let formValues  = update(this.state.formValues,{
                  [field_name]: {$set: mapped_data}
                  })
    //  alert ('mapped state is ' + formValues[field_name].length)
      this.setState({formValues:formValues})
    })
  }

  componentDidMount() {
  //   alert ("view data mount")
      this.loadData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  //    alert ("view data update")
      if (prevProps.selected_id !== this.props.selected_id || 
          prevProps.object_type !== this.props.object_type) {
          this.loadData();
      }
  }  

  handleMappingOpen(field_name) {
    this.setState({mapping_open:true, mapping_field_name:field_name})
  } 

  handleMappingClose = field_name => {
      this.loadMappedData(field_name)
      this.setState({mapping_open:false});
  }

  
  handleChange (field_name, value)  {
      let formValues  = update(this.state.formValues,{
                  [field_name]: {$set: value}
                  })
      this.setState({formValues:formValues});
  }

  handleSubmit(field_name) {
      const object_type = this.props.object_type;
      const pretty_field_name = meta.keys(object_type).pretty_key_id;
      this.props.onDataChange('','',field_name);
  }

  
  renderField(field, disableUnderline) {

      return (
        <Field object_type = {this.props.object_type} 
          field_name = {field.name}  
          data_object={this.state.formValues}
          mode="form"
          disableUnderline={disableUnderline?disableUnderline:false}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          onMappingClick={this.handleMappingOpen}
          id = {this.props.selected_id}
        /> 
        )
  }

  render () {
    const object_fields = meta.fields(this.props.object_type);
    const keys = meta.keys(this.props.object_type);
    const id = this.state.formValues[meta.keys(this.props.object_type).key_id]  
    const sections = meta.sections(this.props.object_type);
    return (
      <Fragment>
        {this.state.mapping_open &&
        <MappingForm 
          open={this.state.mapping_open}
          onClose={this.handleMappingClose}
          object_type={this.props.object_type}
          mapping_field_name = {this.state.mapping_field_name}
          mapping_field_value = {id}
          mapping_field_pretty_name ={this.state.formValues[keys.pretty_key_id]}
        />}
        <Grid container  alignContent='flex-start'  justify="flex-start" wrap="wrap" >
        <Grid style={{padding:10, boxBorder:"border-box"}} item sm={4}>
        {this.renderField(meta.field(this.props.object_type,keys.pretty_key_id))}
        </Grid>
        <Grid item sm={8}/>
        {this.state.item_data && !sections && object_fields.map(field => {
          let grid_col = field.grid_col?field.grid_col:4
          return (
            <Grid key={field.name} item style={{padding:10, boxBorder:"border-box"}} sm={grid_col}>
              {this.renderField(field)}
            </Grid>)
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
              {meta.section_fields(this.props.object_type, section.name).map(field=> {
                  if (field.name != keys.key_id && field.name != keys.pretty_key_id) {
                      let grid_col = field.grid_col?field.grid_col:4
                      return (
                        <Grid key={field.name} item style={{padding:10, boxBorder:"border-box"}} sm={grid_col}>
                          {this.renderField(field)}
                        </Grid>)
              }})}
            </Grid>
          </Paper>
          </Grid>  
        )})}    
        </Grid>        
      </Fragment>
    )
  } 
}

export default ViewForm;

