import React from 'react';
import {FormControl, MenuItem, InputLabel, Select} from '@material-ui/core';
import axios from 'axios';
import * as meta from '../../Utils/meta.js';
import * as log from '../../Utils/log.js'


function getSelectOptions (object_type, field, form_object_type, dependent_value, callback) {
  log.func("SelectField: Get Select Options", "object type, field, dependent_value", object_type, field, dependent_value);
  
    if (field && field.dependent_field) {
      log.func("NEED TO DO SOMETHING DIFFERENT", "dep field, form object type", field.dependent_field, form_object_type)
      log.val('dependent field ', dependent_value)
  
      if (dependent_value) {
        const form_object_type_keys = meta.keys(form_object_type)
        const id_column_name =form_object_type_keys.key_id
        const name_column_name = form_object_type_keys.pretty_key_id;
        log.val('dependent field set, id co name, name col name', dependent_value, id_column_name, name_column_name)
        axios.get('/api/v1/custom/' + form_object_type +'/'+field.name +'/dependent_query/where_id/' + dependent_value).then(function (response) {
            log.val("response data", response.data);
             var select_menu_options = response.data.map (row => {
               return [row[id_column_name], row[name_column_name] ];
             })
             callback(select_menu_options);
           }).catch(function (error) {
             alert('error with db' + JSON.stringify(error));
           });
      }
    }  else {
      var urltext = '/api/v1/'+object_type;
      axios({
        method: 'get',
        url: urltext
      }).then(function (response) {
        //    log.val("response ", response.data)
          const id_column_name =meta.keys(object_type).key_id;
          const name_column_name = meta.keys(object_type).pretty_key_id;
          //  log.val(" ID Col, Nam Col",  id_column_name, name_column_name);
          var select_menu_options = response.data.map (row => {
            //   log.val("row", row);
            return [row[id_column_name], row[name_column_name] ];
          })
          // log.val("menu options", select_menu_options);
          callback(select_menu_options); 
        }).catch(function (error) {
          log.val("error with db" + JSON.stringify(error.message));
        });
      }
}


class SelectField extends React.Component {
  constructor(props) {
        super(props);
      //  log.func("SelectField: constructor", "props", props);
//       alert('in select field with' + JSON.stringify(this.props));
        this.state = {
          select_menu_options : [],
          selectTouched: false,
//          displayed_value = this.props.displayed_value?this.props.displayed_value:'',
          value : this.props.value?this.props.value:'',
          prop_value : this.props.value?this.props.value:'',
          prop_form_values: this.props.form_values?this.props.form_values:''
        }
        this.submithandleChange = this.submithandleChange.bind(this);

  }

   submithandleChange = event => {
       log.func("select handle change", "value", event.target.value);
      //  console.log('in select handle change');
      // alert("in select field name " + JSON.stringify(event.target.name) + ' ID ' + event.target.id)
        this.setState({ value: event.target.value , selectTouched: true});
        this.props.onChange(event);
    }

  componentDidMount() {
    log.func("Select Field: Did Mount", "props", this.props);
  //  alert ('select field mounted with '+ JSON.stringify(this.props));
      const { open} = this.props;
      if (open)  {
          if (this.props.valid_values) {
              var select_menu_options = this.props.valid_values.split(",").map(value=>{
                  return [value, value];
              })
              this.setState({ select_menu_options: select_menu_options})
          } else {
              getSelectOptions (this.props.object_type, this.props.field, this.props.form_object_type, this.props.dependent_value, (select_menu_options) => {
                log.func("Return from select value options db", "select menu options", select_menu_options);
                this.setState({ select_menu_options: select_menu_options});                
             })
           }
        }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const field = this.props.field;
    const dependent_value = this.props.dependent_value;
    log.func("Select Field: Did Update", "props, field, form_values, prev props, prev state", this.props, field, dependent_value, prevProps,prevState);
  if (field) {
    log.val("prev, this", prevProps.dependent_value, dependent_value);
  }
    // Get a new list if
    // a) the form was closed and now it is create_form_open
    // b) the field that this select list depends on changes
    // c) The object_type
  
    if (this.props.open && !prevProps.open || this.props.object_type !==  prevProps.object_type ||
      (field && field.dependent_field && dependent_value !== prevProps.dependent_value))  {
        log.func("Updating", "field, props", field, this.props)
    //  log.func("Select Field: Did update", "props, prevProps, prevState", this.props, prevProps, prevState);
      //      log.val("Did Update retrieving options", "prps object type", this.props.object_type);
            getSelectOptions (this.props.object_type, this.props.field,  this.props.form_object_type, dependent_value, (select_menu_options) => {
        //      log.func("got select options", "select menu options", select_menu_options);              
              this.setState({ select_menu_options: select_menu_options});                
           })
    }
  }
  
 
  static getDerivedStateFromProps(nextProps, prevState) {
     log.func("SelectField: Derived State", "next props, prevstate", nextProps, prevState)
    if (nextProps.value !==  prevState.prop_value) {
      console.log('setting the value  to ' +nextProps.value);
      return {
        prop_value : nextProps.value,
        value: nextProps.value,
        prop_form_values: nextProps.form_values?nextProps.form_values:''

      }
    } 
    return null;
  }
  
  
  render() {
    log.func("selectfield Render", "props", this.props)

//alert ('select menu options is ' + this.state.select_menu_options)
//alert ('value is ' + this.state.value)
//  alert ('select value is ' + this.props.value + ' state ' + this.state.value)
  //  log.func("SelectField: Render", "field name, value, select menu options", this.props.field_name, this.state.value, this.state.select_menu_options);
    // Note, this.props.value may be either the value of the menu option or the pretty text that shows in the text checkbox
    // after onChange, this.state.value is the value of the menu option
    const {  open, field, label,id, shrink } = this.props;
    const shrink_label = shrink?true:false
    const { value} = this.state;
    return (<FormControl style={this.props.style}>
      <InputLabel shrink={shrink_label}  htmlFor="{this.props.label}">{this.props.label}</InputLabel>
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
      name: label,
      id: id
    }}
  >

    {this.state.select_menu_options.map(menu_option => {
    //  log.val("menu option, state value", menu_option, this.state.value)
//      var selected = (this.state.value == menu_option[0] || this.props.value == menu_option[1])?true:false
    //  log.val("selected", selected);
      return <MenuItem  key={menu_option[0]} value={menu_option[0]}>{menu_option[1]}</MenuItem>

    })}
  </Select>
</FormControl>
)

}}

export default SelectField;
