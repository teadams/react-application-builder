import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../../Utils/utils.js';
import * as control from '../../../Utils/control.js';

import { withStyles } from '@material-ui/core/styles';
import JoditEditor from "jodit-react";

import React, { Component, Fragment,  useState, useEffect, useRef} from 'react';
import {Link, OutlinedInput, FormControl, FormHelperText, Input, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import * as meta from '../../../Utils/meta.js';
import useGetModel from '../../../Hooks/useGetModel.js'

function ACSWysiwygEditor(props) {
  const {mode, data, row_data, prevent_edit, image_size="tiny", image_size_list="tiny", field_name, field_models, pretty_key, pretty_name, data_field, formdata, object_type, formAttributes, disable_underline=false, onChange, autoFocus, avatar, fullWidth=true, custom_width, custom_height, data_type, components, img_style, list_img_style, display_field=props.field_name, references_field, form_field_name=props.field_name, field_model={},
  variant="outlined", required, helperText, placeholder
} = props
  const [formValues, formVisibility, formValidated] = formAttributes
  const editor = useRef(null);
  const object_type_model = useGetModel("object_types")[object_type]

  let field_value = data[data_field]

 function handleValueChange(new_value) {
    // simulating the normal event behavior of
    // a form
    let event = {};
    event.target = {};
    event.target.value = new_value;
    event.target.name = field_name
    onChange(event)
  }

  switch (mode) {
    case "edit":
    case "create":
      const value = formValues[form_field_name]
      const wysiwyg_config = {
          readonly: false,
          showTooltip: true,
          addNewLine: false,
          placeholder: pretty_name
      }
      return (<Fragment>
        <JoditEditor
                ref={editor}
                value={value}
                config={wysiwyg_config}
                tabIndex={1} // tabIndex of textarea
//                onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                onBlur={handleValueChange}
        />
        </Fragment>
        )
      break
      case "list_create":
      case "list_edit":
        return (<Fragment>
          </Fragment>
          )
        break
    case "csv":
      if (field_value) {
        return ""
      } else {
        return ""
      }
      break
    case "list":
      if (field_value) {
        return ( <Fragment>
        </Fragment>)
      } else {
        return ""
      }
      break;
    default:
      if (field_value) {
        return ( <Fragment>
          <div dangerouslySetInnerHTML={{__html: field_value}} 
          />
      </Fragment>)
      } else {
        return ""
      }
      // text, view, list
  }
}

export default ACSWysiwygEditor;
