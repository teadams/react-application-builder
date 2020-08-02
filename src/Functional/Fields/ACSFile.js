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

  const {mode, data, prevent_edit, image_size="tiny", image_size_list="tiny", field_name, field_models, pretty_key, data_field, formdata, object_type, formValues, disable_underline=false, onChange, autoFocus, avatar, fullWidth=true, custom_width, custom_height, data_type, components, img_style} = props

  const field_value = data[data_field]
  const object_type_model = useGetModel("object_types")[object_type]

  let letters = ""

  if (!field_value && data_type === "image") {
    const pretty_key = object_type_model.pretty_key_id

    const pretty_field_meta = field_models[object_type][pretty_key]
    const pretty_comp_name = pretty_field_meta.field_component
    const field_component = control.componentByName(pretty_comp_name?pretty_comp_name:"RABTextField")
    let pretty_name_text = ""
    if (data[pretty_key]) {
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
            <ACSImage style={img_style} letters={letters} image_object={field_value} letters={letters} size={image_size} avatar={avatar} custom_width={custom_width} custom_height={custom_height}/>
          }
          <TextField 
            autoFocus={autoFocus}
            name={field_name} 
            key={field_name}
            InputProps={{disableUnderline:disable_underline}}
            disabled={prevent_edit}
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
        return <ACSImage style={img_style} letters={letters} image_object={field_value} size={image_size_list}   avatar={avatar}/>
      } else {
        return ("placeholder for file")
      }
      break
    default:
      // text, view, list
      if (data_type === "image") {
        return <ACSImage style={img_style} letters={letters} avatar={avatar} image_object={field_value} size={image_size}/>
      } else {
        return ("placeholder for file")
      }
  }
}

export default ACSFile;
