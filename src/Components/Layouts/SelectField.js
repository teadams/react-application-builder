import React from 'react';
import {FormControl, MenuItem, InputLabel, Select, FormHelperText} from '@material-ui/core';
import axios from 'axios';
import * as meta from '../../Utils/meta.js';
import * as log from '../../Utils/log.js'


function getSelectOptions (select_object_type, field, form_object_type, dependent_value, callback) {

    if (field && field.dependent_field) {  
      if (dependent_value) {
        const form_object_type_keys = meta.keys(form_object_type)
        const id_column_name =form_object_type_keys.key_id
        const name_column_name = form_object_type_keys.pretty_key_id;
        log.val('dependent field set, id co name, name col name', dependent_value, id_column_name, name_column_name)

        // get data - Option - custom --
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
      var urltext = '/api/v1/'+select_object_type;
      axios({
        method: 'get',
        url: urltext
      }).then(function (response) {
          const id_column_name =meta.keys(select_object_type).key_id;
          const name_column_name = meta.keys(select_object_type).pretty_key_id;
          var select_menu_options = response.data.map (row => {
            return [row[id_column_name], meta.get_display_value(select_object_type, name_column_name, row)];
          })
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
          value : this.props.value?this.props.value:'',
          prop_value : this.props.value?this.props.value:'',
          prop_form_values: this.props.form_values?this.props.form_values:''
        }
        this.submithandleChange = this.submithandleChange.bind(this);

  }

   submithandleChange = event => {
//        alert ('submit event target is '  + event.target.value)
        this.setState({ value: event.target.value , selectTouched: true});
        this.props.onChange(event);
    }

  componentDidMount() {
    log.func("Select Field: Did Mount", "props", this.props);
      const { open, field} = this.props;
      if (open)  {
          if (field && field.valid_values) {
              var select_menu_options = field.valid_values.split(",").map(value=>{
                  return [value, value];
              })
              this.setState({ select_menu_options: select_menu_options})
          } else if (field && field.data_type == "boolean") {
                var select_menu_options = [[true, "Yes"], [false, "No"]]
                this.setState({ select_menu_options: select_menu_options})

          } else if (field && field.data_type == "integer") {
            var select_menu_options = []
            const start_value = field.start_value?field.start_value:0
            const end_value = field.end_value?field.end_value:10
            const increment = field.increment?field.increment:1

            for (var i=start_value; i<=end_value;  i += increment) {
                select_menu_options.push ([i,i]);
            }
            this.setState({ select_menu_options: select_menu_options})
          } else if (field && field.input_type === "color_picker") {
              var select_menu_options = [];
              select_menu_options.push (["red", "red"]);
              select_menu_options.push (["green", "green"]);
              select_menu_options.push (["blue", "blue"]);
              select_menu_options.push (["yellow", "yellow"]);
              this.setState({ select_menu_options: select_menu_options})
          } else {
              getSelectOptions (this.props.field.references, this.props.field, this.props.object_type, this.props.dependent_value, (select_menu_options) => {
                if (this.props.required && !this.state.value ) {
                    this.setState({ select_menu_options: select_menu_options,
                                    value: select_menu_options[0][0]}, () => {
                                      this.props.onChange("",select_menu_options[0][0]);
                                  }) 
                } else {
                    this.setState({ select_menu_options: select_menu_options})
                }
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
    // a) the form was closed and nflist depends on changes
    // c) The object_type
  
    if (this.props.open && !prevProps.open || this.props.object_type !==  prevProps.object_type ||
      (field && field.dependent_field && dependent_value !== prevProps.dependent_value))  {
        log.func("Updating", "field, props", field, this.props)
            getSelectOptions (this.props.field.references, this.props.field, this.props.object_type, dependent_value, (select_menu_options) => {
              if (this.props.required && !this.state.value ) {
                  this.setState({ select_menu_options: select_menu_options,
                                    value: select_menu_options[0][0]}, () => {
                                    this.props.onChange("",select_menu_options[0][0]);
                                }) 
              } else {
                  this.setState({ select_menu_options: select_menu_options})
              }        
           })
    }
  }
  
 
  static getDerivedStateFromProps(nextProps, prevState) {
    //  alert ("derived state from props " + nextProps.value)
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
//    alert ("select menu options i s" + JSON.stringify(this.state.select_menu_options))
    const {  open, field, id, shrink } = this.props;
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

export default SelectField;
