import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import * as control from '../../Utils/control.js';

import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import ACSListController from '../ACSListController.js'
import * as meta from '../../Utils/meta.js';
import ACSImage from './ACSImage.js'
import useGetModel from '../../Hooks/useGetModel.js'

function ACSFile(props) {
  const {mode, data, field_name, field_model={}, formdata, object_type, formValues, disable_underline=false, onChange, autoFocus, avatar, fullWidth=true} = props

  let image_size = props.image_size?props.image_size:(field_model.image_size?field_model.image_size:"medium")

  let image_size_list = props.image_size_list?props.image_size_list:(field_model.image_size_list?field_model.image_size_list:"tiny")


  const {data_type, field_component="", final_field_name=field_name} = field_model
  const field_value = data[final_field_name]
  const object_type_model = useGetModel("object_types")[object_type]
  const fields_model = useGetModel("fields")[object_type]
  let letters = ""
  if (!field_value && data_type === "image") {
    const pretty_key = object_type_model.pretty_key_id
    const pretty_field_meta = fields_model[pretty_key]
    const pretty_comp_name = pretty_field_meta.field_component
    const field_component = control.componentByName(pretty_comp_name?pretty_comp_name:"RABTextField")
    let pretty_name_text = ""
    if (data[field_name]) {
      pretty_name_text  = field_component({data:data, field_name:pretty_key, mode:"text"})
    }
    let word = ""
    if (pretty_name_text) {
      for (word of pretty_name_text.split(" ")) {
        letters += word.charAt(0)
      }
    }
  }

  switch (mode) {
    case "edit":
    case "create":
      return (<Fragment>
          {mode==="edit" && data_type === "image" &&
            <ACSImage letters={letters} image_object={field_value} letters={letters} size={image_size}/>
          }
          <TextField 
            autoFocus={autoFocus}
            name={field_name} 
            key={field_name}
            InputProps={{disableUnderline:disable_underline}}
            disabled={field_model.prevent_edit}
            type="file"
            onChange={onChange}
            />
            </Fragment>
        )
      break
    case "csv":
      return '"'+field_value+'""'
      break
    case "list":
      if (data_type === "image") {
        return <ACSImage letters={letters} image_object={field_value} size={image_size_list}/>
      } else {
        return ("placeholder for file")
      }
      break
    default:
      // text, view, list
      if (data_type === "image") {
        return <ACSImage letters={letters} avatar={avatar} image_object={field_value} size={image_size}/>
      } else {
        return ("placeholder for file")
      }
  }
}

export default ACSFile;
