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
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

function RABFormWrap(props) {
  function handleOnClose() {
    if (props.onClose) {
        props.onClose()
    }
  }

  // trying experiment. Dialog can close either
  // via props open or internal.  
  if (props.form && (props.mode === "edit" || props.mode === "create")) {    
    return (
      <Dialog fullWidth={true} open={props.open} onClose={handleOnClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{props.mode} OBJECT TYPE</DialogTitle>
        <DialogContent>
          <DialogContentText>FORM MESSAGE</DialogContentText>
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
  const {form, mode, form_open, data, rab_component_model, field_list, handleFormChange, handleFormSubmit, formValues, onClose} = props

  const FormWrap = RABFormWrap

  const {header_wrap:HeaderWrap, header:Header, section_wrap:SectionWrap, section_header:SectionHeader, row_wrap:RowWrap,  row:RABRow} = rab_component_model.row.components 
  if (data) {
      return (
        <Fragment>
          <HeaderWrap {...params}>
            <Header {...params}/>
          </HeaderWrap>
          {field_list.map(section_fields => {
            return (
              <FormWrap mode={mode} form={form} open={form_open} onSubmit={handleFormSubmit} onClose={onClose}>
              <SectionWrap {...params}>
                <SectionHeader {...params}/>
                {section_fields.map(field_chunk => {
                  return ( 
                          <RowWrap {...params}>
                              <RABRow {...params} field_chunk={field_chunk}/>
                             {data.children && data.children.length >0 && <ACSListController {...params} {...rab_component_model.list.props} data={data.children}/>}
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
