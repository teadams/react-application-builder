import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import FieldView from './FieldView.js'
import {functional_components} from "../Functional/index.js"
import ACSField from '../Functional/ACSField2.js'
import RenderACSField from '../Functional/RenderACSField.js'
import ACSRowController from '../Functional/ACSRowController.js'
import ACSListController from '../Functional/ACSRowController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {Tab, Tabs, Menu, MenuItem, Paper, MenuList,List,ListItem,ListItemAvatar,ListItemIcon,ListItemSecondaryAction,ListItemText,ListSubheader,Table,TableBody,TableCell,TableContainer,TableFooter,TableHead,TablePagination,TableRow,Typography} from '@material-ui/core';
import useGetModel from "../Hooks/useGetModel.js"

function ObjectView(props)  {
  const {object_type,id} = props

  function TablePaper(props) {
      return <Paper style={{display:"inline"}} variant="outlined">{props.children}</Paper>
  }
  
  function field_comp (props) {
      const {...params} = props
      return <Fragment><TableRow>
            <TableCell align="right"><b>{props.field_meta.pretty_name}:</b></TableCell><TableCell align="left"><FieldView {...params}/></TableCell></TableRow></Fragment> 
  }

  function row_wrap_comp(props) {
      const {...params} = props   
      const {object_type} = props
      const field_name = meta.keys(object_type).pretty_key_id
      return <Fragment><Typography variant="title" style={{display:"block", padding:10}}><b>
              <FieldView {...params} field_name={field_name}/></b></Typography>
              {props.children}
            </Fragment>
  }

  const rab_component = {field:field_comp, row_wrap:row_wrap_comp}
  const rab_component_name = {field_wrap:"Fragment",  field_set_wrap:"Fragment", list_body:"Fragment", list:"Fragment"}

  return (<Table style={{display:"inline", align:"left"}} size="small">
          <ACSRowController object_type={props.object_type} id={props.id} rab_component={rab_component} rab_component_name={rab_component_name}/>
          </Table>
          )
}
export default ObjectView;

