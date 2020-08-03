import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../Utils/utils.js';
import useGetObject from '../Hooks/useGetObject';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell } from '@material-ui/core';
import useGetModel from '../Hooks/useGetModel';
import {ACSTextField} from "../ACSLibrary";


const FormWrap =(props) => {
  // objects are always created at the row level
  // filters always use the filter component 
  if (props.form && (props.mode === "edit")) {
    return (<form onSubmit={props.onSubmit}>
      {props.children}
    </form>)
  } else {
    return (<Fragment>{props.children}</Fragment>)
  }
}

const Tag = (props) => {
  const {Tag, style, css_class} = props
  let {col_span} = props

  if (Tag) {
    return (<Tag colspan={col_span} style={style} className={css_class}>{props.children}</Tag>)
  } else {
    return (<Fragment>{props.children}</Fragment>)
  }
}

function RenderACSField(props) {

  const {api_options, components:discard_components, ...params} = props
  const {data, row_data, object_type, data_field,  field_name, form_field_name, components, 
        mode="view", form="true", formValues, autoFocus, onSubmit, onBlur, onChange, 
        more_detail, toggleMoreDetail} = props
  // these come from rab_component_model props
  const {field_tag="div", field_pre_text, field_post_text, field_css_class, field_style,  //field
        label=false, pretty_name, label_tag="", label_pre_text, label_post_text, label_style, label_css_class, //label
        wrap_css_class, wrap_style={display:"flex", flexDirection:"row"},  wrap_tag=""} = props  //props
    let {col_span=1} = props


  // everything regarding field presentation will be in field_model
  function handleFieldClick(event) {
    if (props.onFieldClick && event.target.name !== "more_link") {
       props.onFieldClick(event, data.id, "field", field_name, row_data, data)
    }
  }

  function handleMouseOver(event) {
    if (props.onMouseOver) {
        props.onMouseOver(event, data.id, "field", field_name, row_data, data)
    }
  }

  if (label && col_span > 1) {
    col_span = 2*col_span -1
  }
  const {field_wrap:FieldWrap, field:Field=ACSTextField} = components 
  if (mode !== "edit") {

    return (<Fragment>
      <FieldWrap key={field_name+"_wrap1"}   field_name={field_name}   col_span={col_span}>
        <Tag Tag={wrap_tag} class={wrap_css_class} style={wrap_style}>
          {label && 
          <Tag Tag={label_tag} class={label_css_class} style={label_style}>
              {label_pre_text}{pretty_name}{label_post_text}
          </Tag>}
           <Tag Tag={field_tag} col_span={col_span} style={field_style} class={field_css_class}>
              {field_pre_text}<Field {...params}  key={field_name+"field"}/>{field_post_text}
          </Tag>
        </Tag>
      </FieldWrap></Fragment>
    )
  
  } else {

    return ( 
      <FormWrap mode={mode} form={form} onSubmit={props.onSubmit}>
        <Field {...params} key={field_name+"field"}/>
      </FormWrap>
    )
  }

}

export default RenderACSField;
