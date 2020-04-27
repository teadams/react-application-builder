import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'

import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import useGetObject from '../Hooks/useGetObject';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

import {functional_components} from "./index.js"

function ACSField(props) {
  //const {id, api_options} = props
  //let { field_name} = props // will if the field is a reference to another object_type

  const [mode, setMode] = useState("view");
  let [ready, object_type, id, field_name, api_options, data] = useGetObject(props.object_type, props.id,props.field_name, props.api_options, props.data); 

// XX ?? look at rest of props and see if there are any other API options... what layer to do this in

  function handleViewClick(event) {
      setMode("edit")
  }

  function handleEditSubmit(event) {
      setMode("view")
  }
    
  // Use case - this field has been tagged with "references"
  // which indicates the field is from another object type.
  // Need to modify that the  object_type, field_name to 
  // represent the meta model from the other model and
  // provide the correct data.
  let field_meta = meta.fields(object_type)[field_name]
  if (field_meta && field_meta.references) {
      const references = field_meta.references
      data = data[field_name]
      object_type = field_meta.references
      field_name = field_meta.referenced_field?field_meta.referenced_field:meta.keys(object_type).key_id
      field_meta = meta.fields(object_type)[field_name]
  }

// XX make function - common design concept
  let component = "RenderACSField"
  if  (field_meta && field_meta.field_component) {component = field_meta.field_component}
  if  (props.field_component) { 
    component = props.field_component}

  const RenderField = functional_components[component]

// state will track a view/edit mode
// Use case
// When user clicks on a field in view mode, it will
// render a one-input form. When use mouse leaves the
// form, the form is submitted and the page returns
// to view mode.  

  if (data && ready) {
      if (mode=="view") {
          return (<RenderField data={data} field_name={field_name}/>)
      } else {
          return (<div>edit form</div>)
          // Later - FROM with compoent fieldForm, handleSubmit, data, object_type,
      }
  } else {
      return null
  }
}

export default ACSField;
