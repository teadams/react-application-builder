import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import _ from 'lodash/object'
import * as api from '../Utils/data.js';
import {AuthContext} from '../Modules/User';


import React, { Component, Fragment,  useState, useContext, useEffect, useRef} from 'react';
import {Tab, Tabs, Menu, MenuItem, MenuList,List,ListItem,ListItemAvatar,ListItemIcon,ListItemSecondaryAction,ListItemText,ListSubheader,Table,TableBody,TableCell,TableContainer,TableFooter,TableHead,TablePagination,TableRow,} from '@material-ui/core';

import useGetObjectList from '../Hooks/useGetObjectList';
import useGetModel from '../Hooks/useGetModel';
import useGenerateFieldList from '../Hooks/useGenerateFieldList';

import {ACSListRenderer, ACSRowController} from '../ACSRenderEngine/'


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
  const {object_type, data, rab_component_model, total_width_units, ...list_params} = props

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
            const column_field_model = field_models[object_type][field] 
            let list_grow =1
            let pretty_name = field
//## TODO get proper header for subobjects
            if (column_field_model) {
              list_grow = column_field_model.list_grow?column_field_model.list_grow: list_grow
              pretty_name = column_field_model.pretty_name
            }
            let style
            if (list_grow && list_grow >1) {
                const width = list_grow * (100/total_width_units)
                const width_percent = width.toString()+"%"
                style = {width:width_percent}
            }
            return(<TableCell className={classes.head} style={style} key={field+"header"}>{pretty_name}</TableCell>)})}
        </TableRow>
        )
}

function RABList(list_props) {
  const {data, field_models, rab_component_model, mode, num_add, ...list_params} = list_props
  let last_index= 0
  let next_index

  let add_on_array = []
  let i;
  for (i = 1; i <= num_add; i++) {
    add_on_array.push(i);
  }
  return (
    <Fragment>
      {data.map((row, index) => {
          last_index = index
          return (<ACSRowController row_type="table_list" {...list_params} data={row} index={row.id} mode={mode} field_models={field_models} rab_component_model={rab_component_model} key={row.id+"Controller"} key_id={row.id}/>)
      })}
      {mode === "list_edit" &&
        <Fragment>
          {add_on_array.map(add_index => {
            next_index = last_index+1 
            const key="add_row_"+next_index+"+"+add_index+"_"
            return (
              <ACSRowController row_type="table_list" {...list_params}  index={key} mode="list_create" field_models={field_models} rab_component_model={rab_component_model} key={key} key_id={key}/>
            )
          })}
        </Fragment>
      }
    </Fragment>
  )
}

// Documentation - see comments in ACSRowController
function ACSListController(input_props) {

  // do not merge expensive, known unnecessary things
  const {data:input_props_data, action, target_menu_name, lazy="core", field_models:input_field_models, object_models:input_object_models, headless, action_props, no_header=false, onData, api_options:discard_api_options, field_list:discard_field_list, allow_add=false, allow_save=false, num_add=3, reference_formAttributes, reference_lastTouched, reference_field_name, referenced_object_type, referenced_id, ...merging_props} = input_props
  const context = useContext(AuthContext)
  let object_models =  useGetModel("object_types")
  if (input_object_models && Object.keys(input_object_models).length> 0) {
      object_models =  input_object_models
  }


  const object_model = object_models?object_models[input_props.object_type]:{} 

  let field_models = useGetModel("fields")
  if (input_field_models && Object.keys(input_field_models).length> 0) {
      field_models =  input_field_models
  }
  const list_formAttributes = useRef({})
  const list_lastTouched = useRef({})


  // XX BUG. will change the original 
  // Fix is to make RABList in the library and 
  // put it in the base. (which is actually the )
  // same effect so it's not "really" a a bug
  let list_component_model = _.merge({},rab_component_models.list)
  list_component_model.list.components.list = RABList
  if (no_header) {
    list_component_model.list.names.header = "RABVoid"
    list_component_model.list.names.header_wrap = "RABVoid" 
  } 

  list_component_model.list.components.list_header = RABTableHeaders
  list_component_model.list.names.list_header_wrap = "TableHead" 

  const rab_component_model = control.getFinalModel("list", {...merging_props}, object_model, list_component_model )

  const list_model = rab_component_model.list
  const list_components = list_model.components
  const massaged_props = list_model.props
  const {list_wrap, body_wrap, list} = list_components
    // XX thinking about the role of field list/field tags in lazy loading, lazy reference loading
  let {mode="list"} = massaged_props
  // important to use input_props.data as it is an array and useGetObjectList
  // see changes to an array's reference as a change
  let input_api_options = _.merge({}, input_props.api_options)
  if (lazy) {
    if (input_api_options) {
      input_api_options.lazy = lazy
    } else {
      input_api_options = {lazy:lazy}
    }
  }
  if (object_model.base_api_path) {
    input_api_options.base_api_path = object_model.base_api_path
  }
  let [object_type, api_options, data] = useGetObjectList(input_props.object_type, input_api_options, input_props.data, onData,"","list"); 

  list_lastTouched.current = {}
  list_formAttributes.current = {}

//  const useGenerateFieldList = (object_type, field_name="", data, mode, form=true,  field_list=[], lazy="core", layout, section, field_models, object_models) => {
  const field_list = useGenerateFieldList(object_type, "", data, mode, false, input_props.field_list, api_options.lazy, "","",field_models,object_models) 
  if (!data || (object_type && !object_model) || headless) return null

  // XX could calcuate server side
  let total_width_units
  if (object_type) {
    total_width_units = 0
    field_list.map (field => {
      const column_field_model = field_models[object_type][field] 
      let list_grow =1
      if (column_field_model) {
        list_grow = column_field_model.list_grow
      }
      total_width_units += list_grow
    })
  }

  const handleSubmit=(event) => {
    Object.keys(list_lastTouched.current).forEach(row_index=>{
      if(list_lastTouched.current[row_index]) {
        api.handleSubmit (event, list_formAttributes.current[row_index][0], mode, context, object_type, object_models[object_type], field_models, "", "id", {}, false) 
       }
    })
  }

  let list_form_params = {}
  if (["list_edit","list_create"].includes(mode)) {
      // use list ref is stand alone, passed if reference if a field on a form
      list_form_params.formAttributes = reference_formAttributes?reference_formAttributes:list_formAttributes
      list_form_params.lastTouched = reference_lastTouched?reference_lastTouched:list_lastTouched
      list_form_params.reference_field_name = reference_field_name?reference_field_name:""
      list_form_params.referenced_object_type = referenced_object_type?referenced_object_type:""
      list_form_params.referenced_id = referenced_id?referenced_id:""
  }
  return  (
    <ACSListRenderer  {...list_model.props} list_form_params={list_form_params} num_add={num_add} allow_add={allow_add} allow_save={allow_save} onSubmit={handleSubmit} total_width_units={total_width_units}  field_models={field_models} action={action} key={object_type+"list"}  object_type={object_type} field_list={field_list}  data={data} api_options={api_options} action_props={action_props}  rab_component_model={rab_component_model} />
  )
  
}

export default ACSListController;