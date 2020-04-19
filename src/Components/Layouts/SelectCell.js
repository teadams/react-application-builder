import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from 'react';
import { FormControl, InputLabel, Select, MenuItem} from '@material-ui/core';
import axios from 'axios';
import * as meta from '../../Utils/meta.js';
import * as log from '../../Utils/log.js'



function getSelectOptions (field, row, table_columns, object_type, callback) {
    const references = field.references;
    const dependent_field = field.dependent_field;
    const id_column_name =meta.keys(references).key_id
    const name_column_name = meta.keys(references).pretty_key_id;
    log.func("get select options","id column name, name column name, dependent_field, field, references, table_columns",
     id_column_name, name_column_name, dependent_field, field, references, table_columns);
    
  //  alert ('select cell get data')
    if (dependent_field) {
      log.func("Need to do something different", 'dependent_field', dependent_field)
      const dependent_field_index = meta.get_index(table_columns, 'name', dependent_field)
      log.val("depened field index, row", dependent_field_index,row)
      const dependent_field_value = row[dependent_field_index].split('//**//')[1];
      log.val("depended field index, dependent_field_value", dependent_field_index, dependent_field_value);
    
    
      axios.get('/api/v1/custom/' + object_type +'/'+field.name +'/dependent_query/where_pretty/' + dependent_field_value).then(function (response) {
          log.val("response data", response.data);
           var select_menu_options = response.data.map (row => {
             return [row[id_column_name], row[name_column_name] ];
           })
           callback(select_menu_options);
         }).catch(function (error) {
           alert('error with db' + JSON.stringify(error));
         });
      
    } else {
    
        axios.get('/api/v1/' + references).then(function (response) {
            log.val("response data", response.data);
             var select_menu_options = response.data.map (row => {
               return [row[id_column_name], row[name_column_name] ];
             })
             callback(select_menu_options);
           }).catch(function (error) {
             alert('error with db' + JSON.stringify(error));
           });
     }
}


class SelectCell extends React.Component {

  constructor(props) {
        super(props);        
        this.state = {
          select_menu_options : [],
          value : '',
          selectTouched: false,
          pretty_value : this.props.value?this.props.value:''
        }
        this.submitHandleChange = this.submitHandleChange.bind(this);

  }

   submitHandleChange = event => {
        console.log('in select handle change');
        this.setState({ value: event.target.value , selectTouched: true});
        this.props.onChange(event);
    }

  componentDidMount() {
      const { open} = this.props;
//      alert ("select cell mount")
      console.log('Select field did mount');
      //console.log('in select and props are ' +JSON.stringify(this.props));
  //    alert ('mounted in ' + JSON.stringify('field'))
      if (open && (this.props.field.valid_values || this.props.field.references))  {
          console.log('getting the values '+ JSON.stringify(this.props));
          console.log('props vlaue is' + this.props.value);
          
          if (this.props.field.valid_values) {
              console.log('getting field values');
              var select_menu_options = this.props.field.valid_values.split(",").map(value=>{
                  return [value, value];
              })
              this.setState({ select_menu_options: select_menu_options, value : this.props.value})
          } else {
              var selected_menu = this.state.value;
              getSelectOptions (this.props.field, this.props.row, this.props.table_columns, this.props.object_type,  (select_menu_options) => {
                  select_menu_options.map(menu_option => {
                      if (menu_option[1] == this.state.pretty_value) {
                          selected_menu = menu_option[0];
                      }
                  })
                  console.log('menu options are ' +select_menu_options);
              //    alert ("setting state " + JSON.stringify(select_menu_options) + " and select menu is " + selected_menu)
                  this.setState({ select_menu_options: select_menu_options,
                                    value: selected_menu})
              })
          }
      }
  }

  

  
  render() {
  if (this.state.select_menu_options.length===0) {
      return null
  } 
//    alert ("in render")
//  alert ("this.state.select_menu_options" +JSON.stringify(this.state.select_menu_options))
  //  alert ('render with ' + this.state.value);
  log.func("mapping menu options", "menu options", this.state.select_menu_options);
    const {  open, field, ...other } = this.props;
    return (<div><FormControl style={this.props.style}>
  <InputLabel  htmlFor="{field.name}">{field.pretty_name}</InputLabel>
  <Select
  //  autoFocus={this.props.autoFocus?true:false}
    value={this.state.value}
   onChange={this.submitHandleChange} 
     onBlur={this.props.onBlur}
    inputProps={{
      name: '{field.name}',
      id: '{field.name}',
    }}
  >
    {this.state.select_menu_options.map(menu_option => {
      const shown_value=menu_option[1];
      console.log('shown value is ' + shown_value);
      console.log('state value is ' + this.state.value);
      var selected = (shown_value == this.state.value)?true:false
      log.val('key', menu_option[0]);
      if (selected) {
        return <MenuItem key={menu_option[0]} value={menu_option[0]} selected>{menu_option[1]} </MenuItem>
    } else {
      return <MenuItem   key={menu_option[0]} value={menu_option[0]} >{menu_option[1]} </MenuItem>
    }
    })}
  </Select>
</FormControl>
</div>)

}}

export default SelectCell;
