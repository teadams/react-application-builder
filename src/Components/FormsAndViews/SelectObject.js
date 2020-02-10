import React from 'react';
import {FormControl, MenuItem, InputLabel, Select, FormHelperText} from '@material-ui/core';
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
          selectTouched: false,
          value : this.props.value?this.props.value:'',
          prop_value : this.props.value?this.props.value:'',
          prop_form_values: this.props.form_values?this.props.form_values:''
        }
        this.submithandleChange = this.submithandleChange.bind(this);
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

    
  submithandleChange = event => {
//        alert ('submit event target is '  + event.target.value)
        this.setState({ value: event.target.value , selectTouched: true});
        this.props.onChange(event);
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
    const {  open,  id, shrink } = this.props;
    
    var shrink_label = (this.state.value || this.state.value === false)?true:false
    if (shrink) {
        shrink_label = true
    }
    return (<FormControl style={this.props.style}>
      <InputLabel shrink={shrink_label}  htmlFor="{field.pretty_name}">{field.pretty_name}</InputLabel>
      <Select
      autoFocus={this.props.autoFocus?true:false}
      value={this.state.value}
      disabled = {this.props.disabled}  
      disableUnderline  = {this.props.disableUnderline}
      InputLableProps = {this.props.InputLableProps}
      onChange={this.submithandleChange} 
      onBlur={this.props.onBlur}
      id={id}
      inputProps={{
        name: field.pretty_name,
        id: id
      }}
    >

    {this.state.select_menu_options.map(menu_option => {
      return <MenuItem  key={menu_option[0]} value={menu_option[0]}>{menu_option[1]}</MenuItem>
    })}
  </Select>
 <FormHelperText>{field.helper_text}</FormHelperText>
</FormControl>
)

}}

export default SelectObject;
