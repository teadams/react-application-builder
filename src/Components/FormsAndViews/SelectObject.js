
import React, { Component, Fragment} from 'react';
import {FormControl, FormLabel,  MenuItem, InputLabel, Select, FormHelperText, RadioGroup, FormControlLabel, Radio}  from '@material-ui/core';
import axios from 'axios';
import * as meta from '../../Utils/meta.js';
import * as log from '../../Utils/log.js'
import * as data from '../../Utils/data.js';



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
        data.getData(this.props.object_type, "", (data, error) => { 
          const id_column_name =meta.keys(this.props.object_type).key_id;
          const name_column_name = meta.keys(this.props.object_type).pretty_key_id;
          var select_menu_options = data.map (row => {
            return [row[id_column_name], meta.get_display_value(this.props.object_type, name_column_name, row)];
          })
          this.setState({ select_menu_options: select_menu_options})          
        })
  }

    
  handleChange = event => {
//        alert ('submit event target is '  + event.target.value)
//        this.setState({ value: event.target.value , selectTouched: true});
        if (this.props.onChange) {
          this.props.onChange(event);
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
         <FormControlLabel  value={radio_value} label={menu_option[1]} control={<Radio key={radio_value}/>}/>) 
          })}
          </RadioGroup>
          </FormControl></Fragment>
        )
    } else {
      return (<FormControl style={this.props.style}>
      <FormLabel component="legend">{field.pretty_name}</FormLabel>
      <Select
      autoFocus={this.props.autoFocus?true:false}
      value={this.props.value}
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
      return <MenuItem  key={menu_option[0]} value={option_value}>{menu_option[1]}</MenuItem>
    })}
  </Select>
 <FormHelperText>{field.helper_text}</FormHelperText>
</FormControl>
      )
    }

}}

export default SelectObject;
