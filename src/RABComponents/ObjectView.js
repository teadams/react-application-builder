import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import {functional_components} from "../Functional/index.js"
import ACSField from '../Functional/ACSField2.js'
import RenderACSField from '../Functional/RenderACSField.js'
import ACSRowController from '../Functional/ACSRowController.js'
import ACSListController from '../Functional/ACSRowController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {Tab, Tabs, Menu, MenuItem, Paper, MenuList,List,ListItem,ListItemAvatar,ListItemIcon,ListItemSecondaryAction,ListItemText,ListSubheader,Table,TableBody,TableCell,TableContainer,TableFooter,TableHead,TablePagination,TableRow,} from '@material-ui/core';

function ObjectView(props)  {
  const {object_type,id,layout="list"} = props

  function TablePaper(props) {
      return <Paper variant="outlined">{props.children}</Paper>
  }
  
  function field_comp (props) {
      const {...params} = props
      const field_meta = meta.fields(props.object_type)[props.field_name]
      const field_comp_component = meta.getValueByPrecedence("component_name.field","RenderACSField",field_meta)
      const RenderField = functional_components[field_comp_component]
      return <Fragment><TableRow>
            <TableCell align="right"><b>{props.field_meta.pretty_name}:</b></TableCell><TableCell align="left"><RenderField {...params}/></TableCell></TableRow></Fragment> 
  }

  function row_wrap_comp(props) {
      const {...params} = props   
      const {object_type} = props
      const field_name = meta.keys(object_type).pretty_key_id
      const field_meta = meta.fields(object_type)[field_name]
      const pretty_field_component = meta.getValueByPrecedence("component_name.field","RenderACSField",field_meta)
      const RenderField = functional_components[pretty_field_component]
      return <Fragment>
              <RenderField {...params} field_name={field_name}/>
              {props.children}
            </Fragment>
  }

  const component = {field:field_comp, row_wrap:row_wrap_comp}
  const component_name = {field_wrap:"Fragment",  field_set_wrap:"TableBody", list_body:"", list:""}


  return (<TableContainer component={TablePaper}><Table style={{width:"80%", align:"left"}} size="small">
          <ACSRowController object_type={props.object_type} id={props.id} component={component} component_name={component_name}/>
          </Table></TableContainer>
          )
}
export default ObjectView;

