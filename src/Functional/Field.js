import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as utils from '../Utils/utils.js';
import useGetObject from '../Hooks/useGetObject';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

import {functional_components} from "./index.js"

function Field(props) {
  const {id, db_options} = props
  const [mode, setMode] = useState("view");
  let {object_type, field_name} = props

  function handleViewClick(event) {
      setMode("edit")
  }

  function handleEditSubmit(event) {
      setMode("view")
  }
  
  let data = useGetObject(object_type, id, {}, props.data); 

  // if this field came from another table, modify the data, object_type, field_name
  let field_meta = meta.fields(object_type)[field_name]
  if (field_meta && field_meta.references) {
      const references = field_meta.references
      data = data[field_name]
      object_type = field_meta.references
      field_name = field_meta.referenced_field?field_meta.referenced_field:meta.keys(object_type).key_id
      field_meta = meta.fields(object_type)[field_name]
  }

  let component = "RenderField"
  if  (field_meta.field_component) {component = field_meta.field_component}
  if  (props.field_component) { component = props.field_component}

  const RenderField = functional_components[component]

// state will track a view/edit mode.. when clicked, it will toggle and then
// render Form (not Form Field) with the data, "no submit button". Form will manage
// controlled stote. handle Submit should pass back to here which will toggle 
// mode back
  if (data) {
      if (mode=="view") {
          return (<RenderField data={data} field_name={field_name}/>)
      ] else {
          // render FROM with compoent fieldForm, handleSubmit, data, object_type, id
      }
  } else {
      return null
  }
}

export default Field;
