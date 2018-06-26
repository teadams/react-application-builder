import React, { Component, Fragment} from 'react';
import {Chip, TextField, Paper, Button, Grid, ListItem, List,  Typography} from '@material-ui/core'

import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';

import update from 'immutability-helper';

import {SelectField, CreateForm, CrudTable, ButtonCreate, ButtonExpandMore, ButtonExpandLess} from "../Layouts/index.js";


class Field extends React.Component {

  constructor(props) {
        super(props)
      //props 
      // object_type
      // field_name
      // data_object - object containing data set
      // variant - for text mode, typography variant
      // color - for text mode, typography color
      // mode 
            // text - text only
            // form - full form, this component will call server to update
            // form-element - one form element - this component will not call server to update
      // id - the value for the the key from this row
      this.state = {
        value_changed: false
      }
      this.loadMappedData = this.loadMappedData.bind(this);

  }

  componentDidMount() {
    const { object_type, field_name, data_object } = this.props;
    const field = meta.field(object_type,field_name);

    if (field.mapping) {
        this.loadMappedData()
    } else {
      this.setState({value: this.props.data_object[field_name]})
    }
  } 

  loadMappedData() {
    const { object_type, field_name, data_object } = this.props;
    const field = meta.field(object_type,field_name);
  //  alert ('loading mapped data for ' + field_name)
    var options = {}
    options.filter_field = field.mapped_field;
    options.filter_id = this.props.id;
    options.key_type = "key_id";
    data.getData(field.mapping, options, (mapped_data, error) => { 
    //  alert ("mapped data is " + JSON.stringify(mapped_data))
      this.setState({value:mapped_data, value_changed:false})
    })
  }

  getDisplayView() {
    const { object_type, field_name, data_object } = this.props;
    const field = meta.field(object_type,field_name);
  //  alert ('fied and data object ' + field_name + ' ' + JSON.stringify(data_object))
    if (!field.mapping) {
      return(meta.get_display_value(object_type, field_name, data_object))
    } else {
      if (!this.state.value) {
        return null
      }
      const unmapped_field = meta.unmapped_field(field.mapping, field.mapped_field)
        //alert ('file mapping, unmapped field data object ' + field.mapping + ' ' + unmapped_field.name + ' ' + JSON.stringify(this.state.value) )  
    
      return (this.state.value.map(row=>{
  log.val ('filed mapping, unmapped field,row', field.mapping, unmapped_field.name, row)
//        let chip_label = other_mapped_pretty_derived ?
//              this.convertDerived(other_mapped_pretty_derived, "mapping", row, unmapped_field.nathis.state.value
//            :row[unmapped_field.name +"_" + meta.keys(other_mapped_table).pretty_key_id]

        let chip_label = meta.get_display_value(field.mapping,unmapped_field.name, row)
        return (<Chip style={{marginRight:10}} label={chip_label}/>)

      }))
    }
  }

  renderField() {
      const { object_type, field_name, data_object } = this.props;
      const field = meta.field(object_type,field_name);

      if (field.derived) {
        return( <TextField    
          InputLabelProps={{shrink:true}}
          name={field.name}
          label={field.pretty_name}
          disabled={true}
          type="text"
          helperText={field.helper_text}
          value=  {this.getDisplayView()}
         style={{width:"90%"}}
    />)

      } else if (field.mapping) {
//                <Typography style={{padding:0, border:0, width:width}}>{field.pretty_name} 
    
//          {!disabled && <EditButton float="right" size="small" onClick={()=>{this.setState({mapping_open:true, mapping_field_name:field.name})}} value={field.name}/>} </Typography>
  
          return (this.getDisplayView())
      } else if ( field.valid_values || field.references || field.data_type === "boolean" || (field.data_type === "integer" && field.input_type !== "" || field.input_type === "color_picker")) {
            return(
            <SelectField 
              key={field.name}    
//               disabled={disabled}
                object_type={field.references}
                valid_values={field.valid_values}
                shrink="true"
                field={field}
//               disableUnderline = {disable_underline}
                helperText={field.helper_text}
                form_object_type={this.props.object_type}
                label={field.pretty_name}
                value= {this.state.value}
                open="true"
//               onBlur={this.handleSubmit(field.name)}
//               onChange={this.handleChange(field.name)}
               style={{width:"90%"}}
              /> )

      } else {
        const multiline = (field.size=="large")?true:false
          return (
            <TextField    
    //      InputProps={{disableUnderline:disable_underline}}
          InputLabelProps={{shrink:true}}
          name={field.name}
          label={field.pretty_name}
  //        disabled={disabled}
          type="text"
          multiline={multiline}
          helperText={field.helper_text}
          value=  {this.state.value}
  //        onFocus={this.handleFocus}
  //        onChange={this.handleChange(field.name)}
  //        onBlur={this.handleSubmit(field.name)}
           style={{width:"90%"}}
        />)
    }
  }

// add onsubmit and name to form
  render()  {
// handle visibility and disabled handleEditRender

//const disable_underline = !this.state["form_underlined_" + field.name]
//const dependent_field = field.dependent_field
//let disabled = false
//let visible = true

//if (dependent_field && !this.state["form_"+dependent_field]) {
//    disabled = true/
//    if (field.dependent_action ===  "visible") {
//        visible = false
//              alert ("visible is false")
//    }

    switch (this.props.mode) {
      case "form":
        return (<form>
                {this.renderField()} 
              </form>)
        break;
      default :
        return (<Fragment>
                {this.getDisplayView()} 
              </Fragment>)
        break
      }


  }

}

Field.defaultProps = {
    mode: 'text'
  };

export default Field;