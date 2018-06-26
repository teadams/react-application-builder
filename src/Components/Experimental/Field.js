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
    options.filter_id = this.props.selected_id;
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

  render()  {
// handle visibility and disabled handleEditRender
      return (<Fragment>
                {this.getDisplayView()} 
              </Fragment>)
  }

}

Field.defaultProps = {
    mode: 'text'
  };

export default Field;