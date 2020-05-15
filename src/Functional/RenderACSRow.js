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

function form_wrap(props) {
  if (props.form && props.mode === "edit") {
    return (<form onSubmit={props.onSubmit}>
      {props.children}
      <input type="submit"/>
    </form>)
  } else {
    return (<Fragment>{props.children}</Fragment>)
  }
}

function RenderACSRow(props) {
  const { ...params} = props
  const {form, mode, data, rab_component_model, field_list, handleFormChange, handleFormSubmit, formValues} = props

  const FormWrap = form_wrap

  const {header_wrap:HeaderWrap, header:Header, section_wrap:SectionWrap, section_header:SectionHeader, row_wrap:RowWrap,  row:RABRow} = rab_component_model.row.components 
  if (data) {
      return (
        <Fragment>
          <HeaderWrap {...params}>
            <Header {...params}/>
          </HeaderWrap>
          {field_list.map(section_fields => {
            return (
              <FormWrap mode={mode} form={form} onSubmit={handleFormSubmit}>
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
