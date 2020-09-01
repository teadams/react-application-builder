import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import {Link, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import {ACSFieldController } from "../../ACSRenderEngine"
import * as meta from '../../Utils/meta.js';


const Tag = (props) => {
  const {Tag, style, css_class} = props
  let {col_span} = props

  if (Tag) {
    return (<Tag onClick={props.onClick} colSpan={col_span} style={style} className={css_class}>{props.children}</Tag>)
  } else {
    return (<Fragment>{props.children}</Fragment>)
  }
}

function ACSComboField(props) {
  const {mode, row_data,  data, data_field, field_name, object_type, id,  combo_wrap_tag="div", combo_wrap_tag_style={}, combo_fields=[],
    combo_field_wraps=[], combo_field_wrap_styles=[], combo_field_wrap_props=[], field_models, handleFormChange, handleFormSubmit, formAttributes, form, rab_component_model } = props

    const [formValues, formVisibility, formValidated] = formAttributes

    return (<Tag Tag={combo_wrap_tag} style={combo_wrap_tag_style}>
        {combo_fields.map((field_name,index) => {
            const combo_field_model= field_models[object_type][field_name]
            return (
          <Tag Tag={combo_field_wraps[index]?combo_field_wraps[index]:"div"}  style={combo_field_wrap_styles[index]}>
              <Fragment>
              {combo_field_model.combo_fields && 
                <ACSComboField  key={field_name+"_combo"} rab_component_model={rab_component_model} handleFormChange={handleFormChange} handleFormSubmit={handleFormSubmit} formAttributes={formAttributes}  field_models={field_models}   object_type={object_type} id={id} mode={mode}  form={form} data={data} field_name={field_name} {...combo_field_wrap_props[index]}/>
              }
              {!combo_field_model.combo_fields && (mode === "view") && 
              <ACSFieldController  key={field_name+"_combo_view"} rab_component_model={rab_component_model} object_type={object_type} id={id} mode={mode}  data={data} field_name={field_name} {...combo_field_wrap_props[index]}/>
              }
              {!combo_field_model.combo_fields && (mode !== "view") &&
                <ACSFieldController key={field_name+"_combo_edit_or_create"} rab_component_model={rab_component_model} handleFormChange={handleFormChange} handleFormSubmit={handleFormSubmit} formAttributes={formAttributes}  field_models={field_models}   object_type={object_type} id={id} mode={mode}  form={form} data={data} field_name={field_name} {...combo_field_wrap_props[index]}/>
              }
              </Fragment>
          </Tag>)
        })}
      </Tag>)

}

export default ACSComboField;
