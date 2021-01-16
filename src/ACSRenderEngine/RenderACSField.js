import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../Utils/utils.js';
import * as control from '../Utils/control.js';
import useGetObject from '../Hooks/useGetObject';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment, useContext,  useState, useEffect} from 'react';
import { Popup, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell } from '@material-ui/core';
import useGetModel from '../Hooks/useGetModel';
import {ACSTextField, ACSField, ACSImageView} from "../ACSLibrary";
import UIContext from '../Template/UIContext.js';


const ACSVoid = (props) => {
  return <Fragment/>
}

const FormWrap =(props) => {
  // objects are always created at the row level
  // filters always use the filter component 
  const {width, save_button=true, form_wrap_style={}} = props 

  if (width=="large") {
    form_wrap_style.width="700px"
  }
  if (props.form && (props.mode === "edit")) {
    return (
    <form onSubmit={props.onSubmit}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center"}}>
        <div style={form_wrap_style}>
        {props.children}
        </div>
          <div style={{width:"100%", diplay:"flex", alignContent:"flex-end"}}>
          <DialogActions>
          {save_button &&
            <Button onClick={props.onSubmit}>Save</Button>}
            <Button onClick={props.onClose}>Close</Button>
          </DialogActions>
        </div>
      </div>
    </form>)
  } else {
    return (<Fragment>{props.children}</Fragment>)
  }
}

const Tag = (props) => {
  const {Tag, style, css_class} = props
  let {col_span} = props

  if (Tag) {
    return (<Tag onClick={props.onClick} colSpan={col_span} style={style} className={css_class}>{props.children}</Tag>)
  } else {
    return (<Fragment>{props.children}</Fragment>)
  }
}

const popup_origin = {
    anchorOrigin:{vertical: 'top',
    horizontal: 'center',
    },
    transformOrigin:{
      vertical: 'bottom',
      horizontal: 'center',
    }}

function RenderACSField(props) {

  const popup = useContext(UIContext).popup   
  const [more_detail, setMoreDetail]  = useState(false)

  if (props.data === undefined && !props.referred_by_object_type) {
      return null
  }

  let {api_options, components:discard_components,reference_formAttributes, reference_lastTouched, ...params} = props
  const {data ={}, row_data, object_type, data_field,  dsiplay_field, references_field, field_name, form_field_name, components={},
        mode="view", form="true", formAttributes, autoFocus, onSubmit, onBlur, onChange,  click_to_edit, field_model, referred_by_object_type, click_to_edit_field, cardinality} = props

  // these come froprops.m rab_component_model props

  const {field_tag="div", field_pre_text, field_post_text, field_css_class, field_style,  //field
        label=false, form_label=false, pretty_name, label_tag="", label_pre_text, label_post_text, label_style, label_css_class, //label
        prevent_edit, hide_if_empty, wrap_css_class, wrap_style={display:"flex", flexDirection:"row"},  wrap_tag="",
        with_thumbnail, thumbnail_size="small", thumbnail_avatar=true, thumbnail_style, form_wrap_style} = props  //wrap
    let {col_span=1} = props


    function toggleMoreDetail(event) {
      setMoreDetail(!more_detail)
    } 
  // everything regarding field presentation will be in field_model


  function handleMouseOver(event) {
    if (props.onMouseOver) {
        props.onMouseOver(event, data.id, "field", field_name, row_data, data)
    }
  }


  let Field = props.field_component_component
  if (!props.field_component_component) {
    Field = control.componentByName(props.field_component?props.field_component:"ACSTextField")
  }
  let FieldWrap = control.componentByName(props.field_wrap?props.field_wrap:"Fragment")

  let show_thumbnail = false
  if (with_thumbnail && data[with_thumbnail]) {
      show_thumbnail = true
  }

  if (referred_by_object_type && (!["edit","create"].includes(mode) || (referred_by_object_type && cardinality === "many_to_one"))) {
    const referred_by = field_model.referred_by_field
    const referred_to = field_model.referred_to_field
    const data_path = field_model.data_path

    params={}
    params.field_model = field_model
    params.object_type = referred_by_object_type
    params.mode = mode
    reference_formAttributes.current[field_name] =[{},{},{}]
    reference_lastTouched.current[field_name] ={}
    params.reference_formAttributes= reference_formAttributes
    params.reference_lastTouched = reference_lastTouched
    params.field_name = field_name
    params.field_list = field_model.referenced_field_list
    params.referenced_object_type = object_type 
    params[referred_by] = row_data[referred_to]
    params.api_options = field_model.referenced_api_options?field_model.referenced_api_options:{}
    if (!params.api_options.filter_field) {
      params.api_options.filter_field= referred_by
    } else {
      params.api_options.filter_field.push(referred_by)
    }
    if (!params.api_options.filter_id) {
      params.api_options.filter_id = row_data[referred_to]
    } else {
      params.api_options.filter_id.push(row_data[referred_to])
    }
    if (referred_to === "core_subsite") {
      params.api_options.subsite_id = row_data[referred_to]
    } 
    if (data !== undefined) {
      params.data = data
    }
  }




  if (!["edit","create"].includes(mode)) {
    if (hide_if_empty && data && !data[data_field]) {
       FieldWrap = ACSVoid
    }

    const handleClickToEditSubmit = (event) => {
        popup.close()
    }


  ///XXX HERE = FIELD NAME SHOULD BE SOMETHING ELSE for SELECT - role_name_name
    const FieldEdit = (props) => {
        return (<Fragment>
          <div style={{width:"100%", minWidth:"400px"}}>
          <ACSField form_wrap_style={{padding:"20px 20px 0px 20px"}} onSubmit={handleClickToEditSubmit} object_type={object_type} field_name={click_to_edit_field} 
          autofocus={true} key={params.key_id} key_id={params.key_id}
          data={row_data}  mode="edit"  form={true}/>
          </div>
        </Fragment>)
    }

    const handleFieldClick = (event) => {
      if (!prevent_edit && click_to_edit && event.target.name !== "more_link" && event.target.name !=="url_link") {
        popup.setOrigin(popup_origin)
        popup.open(event,FieldEdit)
      }
    }

    return (<Fragment>
      <FieldWrap   onClick={handleFieldClick} key={field_name+"_wrap1"}   field_name={field_name}>
          <Tag Tag={wrap_tag} class={wrap_css_class} style={wrap_style}>
            {label && 
            <Tag Tag={label_tag} pretty_name={pretty_name} class={label_css_class} style={label_style}>
                {label_pre_text}{pretty_name}{label_post_text}
            </Tag>}
            <Tag Tag={field_tag}  style={field_style} class={field_css_class}>
                {!show_thumbnail?
                    <Fragment>
                      {field_pre_text}<Field {...params}  more_detail={more_detail} toggleMoreDetail={toggleMoreDetail} key={field_name+"field"}/>{field_post_text}
                    </Fragment>
                  :<div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                    <ACSImageView avatar={thumbnail_avatar} style={thumbnail_style} image_object={data[with_thumbnail]} size={thumbnail_size}/>            
                    <div style={{paddingLeft:3}}>{field_pre_text}<Field {...params}  key={field_name+"field"}/>{field_post_text}</div>
                  </div>
              }

            </Tag>
          </Tag>
      </FieldWrap></Fragment>
    )
  
  } else {

    
    const handleFieldClose = (event) => {
      popup.close()
    }
    let width="auto"
    if (field_model.multiline) {
        width="large"
    }
    let save_button = true
    if (field_model.data_type==="image") {
      save_button = false
    }

    params.placeholder = field_model.placeholder
    params.required = field_model.required
    if (!form) {
      // if on row form, have helper text consistent
      params.helperText=field_model.helperText?field_model.helperText:" "
    }

    return ( 
      <FormWrap width={width} form_wrap_style={form_wrap_style} save_button={save_button} mode={mode} form={form} onSubmit={props.onSubmit} onClose={handleFieldClose} >
        <FieldWrap key={field_name+"_wrap1"}   field_name={field_name}   col_span={col_span}>
            <Tag Tag={wrap_tag} class={wrap_css_class} style={wrap_style}>
              <Tag  Tag={field_tag} col_span={col_span} style={field_style} class={field_css_class}>
                <Field {...params}  pretty_name={pretty_name}   key={field_name+"field"}/> 
              </Tag>
            </Tag>
        </FieldWrap>
      </FormWrap>
    )
  }

}

export default RenderACSField;
