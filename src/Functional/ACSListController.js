import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import _ from 'lodash/object'

import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {Tab, Tabs, Menu, MenuItem, MenuList,List,ListItem,ListItemAvatar,ListItemIcon,ListItemSecondaryAction,ListItemText,ListSubheader,Table,TableBody,TableCell,TableContainer,TableFooter,TableHead,TablePagination,TableRow,} from '@material-ui/core';

// Responsible 
// chosing model, component
// storing state of forms?
// Decided the mode?
import useGetObjectList from '../Hooks/useGetObjectList';
import useGetModel from '../Hooks/useGetModel';
import useGenerateFieldList from '../Hooks/useGenerateFieldList';

import RenderACSList from './RenderACSList.js'
import ACSRowController from './ACSRowController.js'

import * as control from "../Utils/control.js"
import rab_component_models from '../Utils/component.js'

function RABTableHeaders(props) {
  const app_params = useGetModel("app_params")
  const useStyles = makeStyles({
    head: {
      backgroundColor:app_params.colors.table_header_background,
      color:app_params.colors.table_header_text
    }
  });
  const classes = useStyles();
  const {object_type, data, rab_component_model, ...list_params} = props

  let {field_list} = props
   let field_models =  useGetModel("fields")
    if (props.field_models) {
      field_models = _.merge({},field_models, props.field_models)
    }  
   if (!field_models) {return null}
   const field_model = field_models[object_type]

  // XX 3 places
   if (!props.field_list) {
       if (object_type) {
         field_list = Object.keys(field_model)
       } else {
         field_list = Object.keys(data)
       }
   }
  return (
        <TableRow>
        {field_list.map(field=>{
          const split_field = field.split(".")
          let column_field_model
          if (split_field.length === 2 ) {
              column_field_model = field_models[split_field[0]][split_field[1]] 
          } else {
            column_field_model = field_models[object_type][field] 
          }
        return(<TableCell className={classes.head} key={field+"header"}>{column_field_model.pretty_name}</TableCell>)})}
        </TableRow>
        )
}

function RABList(list_props) {
  const {data, field_models, rab_component_model, ...list_params} = list_props
  return (
    data.map((row, index) => {
        return (<ACSRowController {...list_params} data={row} field_models={field_models} rab_component_model={rab_component_model} key={index+"Controller"} key_id={index}/>)
    })
  )
}

// Documentation - see comments in ACSRowController
function ACSListController(input_props) {
  // do not merge expensive, known unnecessary things
  const {data:input_props_data, action, target_menu_name, lazy="core", field_models, headless, action_props, onData, ...merging_props} = input_props
  const object_models =  useGetModel("object_types")
  const object_model = object_models?object_models[input_props.object_type]:{}
  // XX BUG. will change the original 
  // Fix is to make RABList in the library and 
  // put it in the base. (which is actually the )
  // same effect so it's not "really" a a bug
  let list_component_model = rab_component_models.list
  list_component_model.list.components.list = RABList
  list_component_model.list.components.list_header = RABTableHeaders
  list_component_model.list.names.list_header_wrap = "TableHead" 
  const rab_component_model = control.getFinalModel("list", {...merging_props}, object_model, rab_component_models.list )

  const list_model = rab_component_model.list
  const list_components = list_model.components
  const massaged_props = list_model.props
  const {list_wrap, body_wrap, list} = list_components
    // XX thinking about the role of field list/field tags in lazy loading, lazy reference loading
  let {mode="list", field_list=""} = massaged_props

  // important to use input_props.data as it is an array and useGetObjectList
  // see changes to an array's reference as a change
  let [object_type, api_options, data] = useGetObjectList(massaged_props.object_type, massaged_props.api_options, input_props.data, onData); 


  field_list = useGenerateFieldList(object_type, "", data, mode, false, field_list, lazy)

  if (!data || (object_type && !object_model) || headless) return null

  return  (
    <RenderACSList {...list_model.props} field_models={field_models} action={action} key={object_type+"list"}  object_type={object_type} field_list={field_list}  data={data} api_options={api_options} action_props={action_props} rab_component_model={rab_component_model} />
  )
  
}

export default ACSListController;