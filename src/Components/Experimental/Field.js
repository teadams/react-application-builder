import React, { Component, Fragment} from 'react';
import {TextField, Paper, Button, Grid, ListItem, List,  Typography} from '@material-ui/core'

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
      // data - object containing data set
      // variant - for text mode, typography variant
      // color - for text mode, typography color
      // mode 
            // text - text only
            // form - full form, this component will call server to update
            // form-element - one form element - this component will not call server to update
  }



  getDisplayView() {
    const { object_type, field_name, data } = this.props;
    return(meta.get_display_value(object_type, field_name, data))
    // handle mapping
  }

  render()  {
// handle visibility and disabled handleEditRender
      return (<Typography variant={this.props.variant} 
                color={this.props.color} style={this.props.style} align={this.props.align}>
                {this.getDisplayView()} 
                {this.props.children}
              </Typography>)
  }

}

Field.defaultProps = {
    mode: 'text',
    variant: 'body2',
    color:'',
    style:{},
    align:''
  };

export default Field;