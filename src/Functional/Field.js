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
  let {object_type, field_name} = props
  
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

  // XX - Derived Field - perhaps this will come from the server. Changing the one derivced field to a
  // field provided component

  // XX - Decide
  const RenderField = functional_components[props.field_component?props.field_component:"RenderField"]

  if (data) {
      return (<RenderField data={data} field_name={field_name}/>)
  } else {
      return null
  }
}

export default Field;
