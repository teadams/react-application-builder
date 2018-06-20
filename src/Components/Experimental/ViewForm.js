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



class ViewForm extends React.Component {

  constructor(props) {
    super(props);           

    this.state = {
        item_data: "",
        pretty_name_edit: false,
        props_object_type: ''
    }  
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleDBUpdate = this.handleDBUpdate.bind(this);
    this.handleMappingClose = this.handleMappingClose.bind(this);
    this.renderField = this.renderField.bind(this);
    this.loadData = this.loadData.bind(this);
    this.loadMappedData = this.loadMappedData.bind(this);
  } 

  static getDerivedStateFromProps(nextProps, prevState) {
    // in order for our dynamically managed form elements to be controlled,
    // we need initialized them with values set in the state.  Otherwise
    // we get "you are changing uncontrolled components to controlled" warnings
    if (nextProps.object_type && nextProps.object_type != prevState.props_object_type) {
      var new_state = {};
      new_state.props_object_type = nextProps.object_type;
      meta.fields(nextProps.object_type).map(field => {
            // We choose to stare each form value in the state with field name
            // pre-pended by "form"
            //  a) No chance of name collision with other state variables
            //  b) We avoid complications with storing objects in the state.
            //     (because javascript passes objects by reference, it takes
            //      work/resources to avoid changing the state directly)
              new_state["form_" + field.name] = "";
            // Keep track of this field has changed since last db update
              new_state["form_changed_" + field.name] = false
              new_state["form_underlined_" + field.name] = false
      })
    // alert ('new state is ' + JSON.stringify(new_state))
      return new_state
    }
    return null
  }

  loadData() {
    data.getData (this.props.object_type, {id:this.props.selected_id}, (item_data, error) => { 
          var new_state = {};
//          alert ("get data")
          new_state.item_data = item_data;
          meta.fields(this.props.object_type).map(field => {
            if (!field.mapping) {
              new_state["form_" + field.name] = (item_data[field.name] !== null)?item_data[field.name]:""
              new_state["form_changed_" + field.name] = false
              new_state["form_underlined_" + field.name] =  (item_data[field.name]===null || item_data[field.name===""])?true:false
          } else {
//              alert ('new get data for ' + this.props.selected_id)
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
    data.getData (field.mapping, options, (mapped_data, error) => { 
      var mapped_state = {}
//      alert ('mapped data for ' + field.name + ' is  '+ JSON.stringify(mapped_data))
      mapped_state["form_" + field.name] = mapped_data
      mapped_state["form_changed_" + field.name] = false
      this.setState(mapped_state)
    })
  }
  componentDidMount() {
      this.loadData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  //  alert('DID UPDATE upate and form values is ' + JSON.stringify(formValues))
//alert("coponent id update " + this.props.selected_id )
      if (prevProps.selected_id !== this.props.selected_id) {
  //  alert("outside getting datat")
          this.loadData();
      }
  }  

  handleMappingClose = field_name => {
//      alert('in maping close ' + field_name)
      this.loadMappedData(meta.field(this.props.object_type, field_name))
      this.setState({mapping_open:false});
  }

  
  handleChange = name => event => {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      var new_state = {}
      new_state["form_"+name] = value;
      new_state["form_changed_" +name ] = true
      //alert ('handle change ' + name)
      this.setState(new_state);
  }

  handleFocus = event => {
      var new_state = {}
      new_state["form_underlined_" +event.target.name ] = true
      this.setState(new_state);
  }

  handleSubmit = name => event => {
      event.preventDefault();
      if (this.state["form_changed_"+name]) {
        this.handleDBUpdate(name);
      } else {
          var new_state={};
          new_state.pretty_name_edit = false;
          new_state["form_underlined_" + name ] = false;
          this.setState(new_state);
      }
  }
  
  handleDBUpdate(field_name) {
      const object_type = this.props.object_type;
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
                if (field_name == this.props.grouping_field_name || field_name == meta.keys(object_type).pretty_key_id) {
//                  alert("field name, grouping field "  + field_name + ' ' + this.props.grouping_field_name)
                    this.props.onDataChange();

                }
            }).catch(error => {
              alert ('error is ' + error.message)
      });
  }

  renderField(field, grid_col) {
    const object_attributes = meta.object(this.props.object_type);
    const object_fields = meta.fields(this.props.object_type);
    const keys = meta.keys(this.props.object_type);
    const id = this.state["form_"+meta.keys(this.props.object_type).key_id]
    const pretty_name_field = meta.pretty_name_column(this.props.object_type)
    grid_col = grid_col?grid_col:4

    if (field.name != keys.key_id && field.name != keys.pretty_key_id) {
        var disable_underline = !this.state["form_underlined_" + field.name]
          if (field.mapping) {
//            const mapping_field = meta.field(object_type, mapping_field_name);
            const mapping_object_type = field.mapping;
            const mapped_field_name = field.mapped_field;
            const unmapped_field = meta.unmapped_field(mapping_object_type, mapped_field_name)
            const other_mapped_table = unmapped_field.references;  
        //    alert ('mapping object type'+mapping_object_type)
        //    alert ('mapepd field name ' + mapped_field_name)
        //    alert (' unmapped_field ' + JSON.stringify(unmapped_field))
          //  alert ('other mapped table ' +other_mapped_table)
            return(
              <Grid item style={{padding:10, boxBorder:"border-box"}}  sm={grid_col}>
                <Typography style={{padding:0, border:0}}>{field.pretty_name}
               <EditButton size="small" onClick={()=>{this.setState({mapping_open:true, mapping_field_name:field.name})}} value={field.name}/><div>
                {this.state["form_" + field.name] &&
                    this.state["form_" + field.name].map(row => {
//                    alert('alert is ' + JSON.stringify(row[meta.keys[other_mapped_table].pretty_key_id
  //alert ('field is ' + unmapped_field.name +"_"+ meta.keys(other_mapped_table).pretty_key_id)
                      return (<Chip label={row[unmapped_field.name +"_" + meta.keys(other_mapped_table).pretty_key_id]} />)
                    })
                }
                </div>
                </Typography>
              </Grid>
              )

          }  else if (field.valid_values || field.references || field.data_type === "boolean" || (field.data_type === "integer" && field.input_type !== "text" || field.input_type === "color_picker")) {
          return (            
          <Grid item style={{padding:10, boxBorder:"border-box"}}  sm={grid_col}>
              <form onSubmit={this.handleSubmit(field.name)}  id={id+'-'+field.name}>
                <SelectField 
                   key={field.name}           
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
                   style={{width:200}}/> 
              </form>
            </Grid>
          
        )  
    } else {
      return (
        <Grid item style={{padding:10, boxBorder:"border-box"}} sm={grid_col}>
            <form onSubmit={this.handleSubmit(field.name)}  id={id+'-'+field.name}>
                  <TextField    
                  InputProps={{disableUnderline:disable_underline}}
                  InputLabelProps={{shrink:true}}
                  name={field.name}
                  label={field.pretty_name}
                  type="text"
                  helperText={field.helper_text}
                  value=  {this.state["form_"+field.name]}
                  onFocus={this.handleFocus}
                  onChange={this.handleChange(field.name)}
                  onBlur={this.handleSubmit(field.name)}
                 />
            </form>
       </Grid>
      )
    }    
    }
  }

  render () {
    const object_attributes = meta.object(this.props.object_type);
    const object_fields = meta.fields(this.props.object_type);
    const keys = meta.keys(this.props.object_type);
    const id = this.state["form_"+meta.keys(this.props.object_type).key_id]
    const pretty_name_field = meta.pretty_name_column(this.props.object_type)
    const sections = meta.sections(this.props.object_type);
    const flex_direction= sections?"column":"row"

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
          mapping_field_pretty_name ={this.state["form_" + pretty_name_field]}
        />}

      {this.state.pretty_name_edit ? 
        <form onSubmit={this.handleSubmit(pretty_name_field)}
        id={id+'-'+this.state.item_data[keys.pretty_key_id]}>
        <TextField    
        margin="normal"
        name={keys.pretty_key_id}
        type="text"
        value=  {this.state["form_"+pretty_name_field]}
        onChange={this.handleChange(pretty_name_field)}
        onBlur={this.handleSubmit(pretty_name_field)}
        />
      </form>
          : <Typography onClick={()=>{this.setState({pretty_name_edit:true})}} variant="headline" gutterBottom>{this.state["form_" + pretty_name_field]} </Typography>} 
      <Grid container alignItems="stretch"   direction={flex_direction} wrap="wrap" sm={12}>
      {this.state.item_data && !sections && object_fields.map(field => {
//  alert ('trying to render '+ field.name)
          return (this.renderField(field))
      })}

      {this.state.item_data && sections && sections.map(section => {
        var section_fields = meta.section_fields(this.props.object_type, section.name)
        if (section_fields.length > 0) {
          var field_render = (section_fields.map(field=>{
                return (this.renderField(field))
          }))
           return (
              <Grid item style={{padding:10}} sm={12}>
                  <Paper style={{boxSizing:"border-box", padding:10, height:"100%"}}>
                    <Typography variant="title" > {section.title} </Typography>
                    <Divider style={{marginBottom:10}}/>
                    <Grid container sm={12}>
                    {field_render}
                    </Grid>
                  </Paper>
              </Grid>)
        } else {
                return ""
        }
//              alert ('foo is ' + foo)
  //            return (<Typography variant="title"> {section.name} </Typography>)
        //  })
        //  return (<Typography>{section}</Typography>
    //      var form_text = meta.section_fields(this.props.object_type, section).map(field => {
      //      return (this.renderField(field))
        //  })
      //    return {section.name}
      })}
  </Grid>
  </Fragment>
)}
}


export default ViewForm;

