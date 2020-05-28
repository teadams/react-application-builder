import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import ACSField from './ACSField2.js'
import ACSListController from './ACSListController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import useGetObjectList from '../Hooks/useGetObjectList';
import useGetModel from '../Hooks/useGetModel';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

function RABFormWrap(props) {
  const {object_type} = props
  const object_types = useGetModel("object_types")
  if (!object_types) {return null}
  function handleOnClose() {
    if (props.onClose) {
        props.onClose()
    }
  }
  if (props.form && (props.mode === "edit" || props.mode === "create")) {
    const object_type_model = object_types[object_type]
    const object_type_pretty_name = object_type_model.pretty_name
    const form_message = (props.mode==="create")?object_type_model.create_message:object_type_model.edit_message
    return (
      <Dialog fullWidth={true} open={props.open} onClose={handleOnClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{u.capitalize(props.mode)} {u.capitalize(object_type_pretty_name)}</DialogTitle>
        <DialogContent>
          {form_message && 
          <DialogContentText>{form_message}</DialogContentText>}
          <form onSubmit={props.onSubmit}>
          {props.children}
          <DialogActions>
           <Button onClick={props.onSubmit} color="primary">
             {props.mode}
           </Button>
            <Button onClick={handleOnClose} color="primary">
             Cancel
           </Button>
        </DialogActions>  
        </form>
        </DialogContent>
      </Dialog>)
  } else {
    return (<Fragment>{props.children}</Fragment>)
  }
}

function RenderACSRow(props) {
  const { ...params} = props
  const {key_id, form, mode, form_open, data, rab_component_model, object_type, field_list, handleFormChange, handleFormSubmit, formValues, onClose} = props

  const FormWrap = RABFormWrap
  const {header_wrap:HeaderWrap, header:Header, section_wrap:SectionWrap, section_header:SectionHeader, row_wrap:RowWrap,  row:RABRow} = rab_component_model.row.components

  if (data) {
      return (
        <Fragment>
          <HeaderWrap {...params}>HeaderWrap
            <Header {...params}/>
          </HeaderWrap>
          {field_list.map((section_fields, s_index) => {
            return (
              <FormWrap mode={mode} form={form} object_type = {object_type} open={form_open} onSubmit={handleFormSubmit} onClose={onClose} key={s_index+"form"}>
              <SectionWrap {...params} key={s_index+"wrap"}>
                <SectionHeader {...params} key={s_index+"header"}/>
                {section_fields.map((field_chunk, f_index) => {
                  return ( 
                          <RowWrap {...params} key={f_index+"wrap"}>
                              <RABRow {...params} s_index={s_index} f_index={f_index} field_chunk={field_chunk} key={f_index+"row"} key_id={f_index}/>
                             {data.children && data.children.length >0 && <ACSListController {...params} {...rab_component_model.list.props} data={data.children} key={f_index+"list"}/>}
                          </RowWrap>
          )
                })}
              </SectionWrap>
              </FormWrap>
)
            })}
        </Fragment>
      )
  }
}

export default RenderACSRow;
