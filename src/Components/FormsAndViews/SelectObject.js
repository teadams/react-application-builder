
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, { Component, Fragment} from 'react';
import {FormControl, FormLabel,  MenuItem, InputLabel, Select, FormHelperText, RadioGroup, FormControlLabel, Radio}  from '@material-ui/core';
import axios from 'axios';
import * as meta from '../../Utils/meta.js';
import * as log from '../../Utils/log.js'
import * as data from '../../Utils/data.js';

// Widget to simply select on object from an object type


class SelectObject extends React.Component {
  constructor(props) {
        super(props);
      //  log.func("SelectField: constructor", "props", props);
//       alert('in select field with' + JSON.stringify(this.props));
        this.state = {
          select_menu_options : [],
          value : this.props.value?this.props.value:'',
          prop_value : this.props.value?this.props.value:'',
          prop_form_values: this.props.form_values?this.props.form_values:''
        }
        this.handleChange = this.handleChange.bind(this);
        this.loadData = this.loadData.bind(this);

  }

  loadData () {
        let options = {}
        options.context_limit = this.props.context_limit
        options.user_id = this.props.user_id
        if (this.props.filter_id) {
          options.filter_id = this.props.filter_id
        }
        if (this.props.filter_field) {
            options.filter_field = this.props.filter_field
        }
        data.getData(this.props.object_type, options, (data, error) => { 
          const id_column_name =meta.keys(this.props.object_type).key_id;
          const name_column_name = meta.keys(this.props.object_type).pretty_key_id;
          var select_menu_options = data.map (row => {
            return [row[id_column_name], meta.get_display_value(this.props.object_type, name_column_name, row)];
          })
          if (this.props.add_any) {
            select_menu_options.push(["","Any"])
          }
          this.setState({ select_menu_options: select_menu_options})          
        })
  }

    
  handleChange = event => {
      let value = event.target.value
      // Unfortunatly, have to find the pretty prop as
      // I could not get anything but the value to pass 
      // in the event.  So I use the original array of
      // options

      let selected_option = this.state.select_menu_options.filter(menu_option => menu_option[0].toString() == value)
      let pretty_value = selected_option[0][1]
        if (this.props.onChange) {
          this.props.onChange(value, pretty_value);
        } 
    }

  componentDidMount() {
      this.loadData()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.object_type !==  prevProps.object_type) {
        this.loadData()
    }
  }
  

  static getDerivedStateFromProps(nextProps, prevState) {
    //  alert ("derived state from props " + nextProps.value)
    if (nextProps.value !==  prevState.prop_value) {
      return {
        prop_value : nextProps.value,
        value: nextProps.value,
        prop_form_values: nextProps.form_values?nextProps.form_values:''
      }
    } 
    return null;
  }
  
  
  render() {
    const name_column_name = meta.keys(this.props.object_type).pretty_key_id;
    const field = meta.field(this.props.object_type, name_column_name)
    const input_label = this.props.noLabel?false:true
    if (this.props.input_type == "radio") {
      return (<Fragment>
          <FormControl style={this.props.style}>
          <FormLabel component="legend">{field.pretty_name}</FormLabel>
          <RadioGroup name={this.props.object_type} area-label={this.props.object_type} onChange={this.handleChange} value={this.props.value}>
          {this.state.select_menu_options.map(menu_option => {
            // Not sure why, radio group did not work where
            // value was an integer
            let radio_value = menu_option[0].toString()
            return (
         <FormControlLabel key={menu_option[1]} name={menu_option[1]} value={radio_value} label={menu_option[1]} control={<Radio key={radio_value}/>}/>) 
          })}
          </RadioGroup>
          </FormControl></Fragment>
        )
    } else {

      return (<Fragment>
      {input_label &&
      <FormLabel style={this.props.style} component="legend">{field.pretty_name}</FormLabel>}
      <Select
      autoFocus={this.props.autoFocus?true:false}
      value={this.props.value}
      id = {field.pretty_name}
      label = {field.pretty_name}
      style={this.props.style}
      name = {field.pretty_name}
      disabled = {this.props.disabled}  
      disableUnderline  = {this.props.disableUnderline}
      InputLableProps = {this.props.InputLableProps}
      onChange={this.handleChange} 
      inputProps={{
        name: field.pretty_name,
      }}
    >

    {this.state.select_menu_options.map(menu_option => {
      let option_value = menu_option[0].toString()
      return <MenuItem  key={menu_option[0]} id={menu_option[1]} name={menu_option[1]} label={menu_option[1]} value={option_value}>{menu_option[1]}</MenuItem>
    })}
  </Select>

  </Fragment>
      )
    }

}}

export default SelectObject;
