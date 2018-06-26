//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import { Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper } from '@material-ui/core';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import {SelectField, EditButton} from "../Layouts/index.js";
import {MappingForm} from "./index.js"
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
    this.loadMappedData = this.loadMappedData.bind(this);
    this.convertDerived = this.convertDerived.bind(this);
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
          } else {
                this.loadMappedData(field);
          }})
          this.setState(new_state)
    })   
  }

  loadMappedData(field) {
    var options = {}
    options.filter_field = field.mapped_field
    options.filter_id = this.props.selected_id;
    options.key_type = "key_id"
  //  alert ("getting mapped data for " + JSON.stringify(options))
    data.getData (field.mapping, options, (mapped_data, error) => { 
// TODO - fix this to be ummuatable
      var mapped_state = this.state
      mapped_state.formValues[field.name] = mapped_data
      mapped_state.formChanged[field.name] = false
      this.setState(mapped_state)
    })
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

  

// This will move down a level
  convertDerived(derived_pattern, source, row, field_base) {
    const state = this.state  
    function derivedMatch(match, p1, offset, string) {
       return (state.formValues[p1])
    }
    function derivedMappingMatch(match, p1, offset, string) {
//  alert ('derive mapping match with p1 ' + p1 )
//alert ('and here is teh row ' + JSON.stringify(row))
       return (row[field_base + '_'+ p1])
    }

    if (source === "mapping") {
    //alert ('getting mapping with field base ' + field_base)
      return (derived_pattern.replace(/{(.*?)}/ig, derivedMappingMatch));  
    } else {
      return (derived_pattern.replace(/{(.*?)}/ig, derivedMatch));
    }
  }
  
  renderField(field) {
    const object_attributes = meta.object(this.props.object_type);
    const object_fields = meta.fields(this.props.object_type);
    const keys = meta.keys(this.props.object_type);
    const id = this.state["form_"+meta.keys(this.props.object_type).key_id]
    const pretty_name_field_name = meta.pretty_name_column(this.props.object_type)
    const grid_col = field.grid_col?field.grid_col:4
    const width= grid_col * 75
    const multiline = (field.size=="large")?true:false

    if (field.name != keys.key_id && field.name != keys.pretty_key_id) {
        const disable_underline = !this.state["form_underlined_" + field.name]
        const dependent_field = field.dependent_field
        let disabled = false
        let visible = true
//        alert ('depednent field  for ' +field.name + ' is' + this.state["form_"+dependent_field])
        if (dependent_field && !this.state["form_"+dependent_field]) {
            disabled = true
            if (field.dependent_action ===  "visible") {
                visible = false
//              alert ("visible is false")
            }
        }
        if (!visible) {
            return ""
        }
          
          if (field.mapping) {
//            const mapping_field = meta.field(object_type, mapping_field_name);
            const mapping_object_type = field.mapping;
            const mapped_field_name = field.mapped_field;
            const unmapped_field = meta.unmapped_field(mapping_object_type, mapped_field_name)
            const other_mapped_table = unmapped_field.references;  
            const other_mapped_pretty_field = meta.field(other_mapped_table, meta.keys(other_mapped_table).pretty_key_id)
            const other_mapped_pretty_derived = other_mapped_pretty_field.derived
            const width= grid_col * 70
            return(
              <Grid key={field.name} item style={{padding:10, boxBorder:"border-box"}}  sm={grid_col}>
                <Typography style={{padding:0, border:0, width:width}}>{field.pretty_name} 
    
              {!disabled && <EditButton float="right" size="small" onClick={()=>{this.setState({mapping_open:true, mapping_field_name:field.name})}} value={field.name}/>} </Typography>
                {this.state["form_" + field.name] &&
                    this.state["form_" + field.name].map(row => {
                      let chip_label = other_mapped_pretty_derived ?
                            this.convertDerived(other_mapped_pretty_derived, "mapping", row, unmapped_field.name)
                          :row[unmapped_field.name +"_" + meta.keys(other_mapped_table).pretty_key_id]
                      return (<Chip style={{marginRight:10}} label={chip_label}/>)
                    })
                }
                
              </Grid>
              )
          } else if (field.derived )  { 
            const derived_value = this.convertDerived(field.derived)
            return (<Grid key={field.name}  item style={{padding:10, boxBorder:"border-box"}}  sm={grid_col}>
              <Fragment>
                <Typography style={{padding:0, border:0, width:width}}>{field.pretty_name}</Typography>
                <Typography>{derived_value}</Typography>
              </Fragment>
            </Grid>)
          } else if ( field.valid_values || field.references || field.data_type === "boolean" || (field.data_type === "integer" && field.input_type !== "" || field.input_type === "color_picker")) {
          return (            
          <Grid key={field.name}  item style={{padding:10, boxBorder:"border-box"}}  sm={grid_col}>
              <form onSubmit={this.handleSubmit(field.name)}  id={id+'-'+field.name}>
                <SelectField 
                   key={field.name}    
                   disabled={disabled}
                   object_type={field.references}
                   valid_values={field.valid_values}
                   shrink="true"
                   field={field}
                   disableUnderline = {disable_underline}
                   helperText={field.helper_text}
                   form_object_type={this.props.object_type}
                   label={field.pretty_name}
                   value= {this.state["form_"+field.name]}
                   open="true"
                   onBlur={this.handleSubmit(field.name)}
                   onChange={this.handleChange(field.name)}
                   style={{width:width}}/> 
              </form>
            </Grid>
          
        )  
      } else {
      return (
        <Grid key={field.name} item style={{padding:10, boxBorder:"border-box"}} sm={grid_col}>
            <form onSubmit={this.handleSubmit(field.name)}  id={id+'-'+field.name}>
                  <TextField    
                  InputProps={{disableUnderline:disable_underline}}
                  InputLabelProps={{shrink:true}}
                  name={field.name}
                  label={field.pretty_name}
                  disabled={disabled}
                  type="text"
                  multiline={multiline}
                  helperText={field.helper_text}
                  value=  {this.state["form_"+field.name]}
                  onFocus={this.handleFocus}
                  onChange={this.handleChange(field.name)}
                  onBlur={this.handleSubmit(field.name)}
                  style={{width:width}}
                 />
            </form>
       </Grid>
      )
    }    
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

