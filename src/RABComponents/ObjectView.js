import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import _ from 'lodash'
import rab_component_models from '../Models/HealthMe/component.js'

import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
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
  const menu_model =  useGetModel("menu")
  const field_models = useGetModel("fields")
  if (!menu_model || !field_models) {return null}
  const model = meta.getByPrecedence({filter_field:"id"}, props, menu_model.menu_items[props.menu_name])
  const {object_type, filter_field, ...params} = model

  let api_options = {}
  api_options.filter_id = props[filter_field]
  api_options.filter_field = filter_field

  function TablePaper(props) {
      return <Paper style={{display:"inline"}} variant="outlined">{props.children}</Paper>
  }
  
  function field_comp (props) {
      const {field_model, ...params} = props
      return <Fragment><TableRow>
            <TableCell align="right"><b>{field_model.pretty_name}:</b></TableCell><TableCell align="left"><FieldView {...params}/></TableCell></TableRow></Fragment> 
  }

  function row_wrap_comp(props) {
      const {object_type, ...params} = props   
      const field_name = meta.keys(object_type).pretty_key_id
      return <Fragment><Typography variant="title" style={{display:"block", padding:10}}><b>
              <FieldView {...params} data={props.data} object_type={object_type} field_name={field_name}/></b></Typography><Table style={{borderSpacing:30, borderCollapse:"separate"}}>
              {props.children}</Table>
            </Fragment>
  }

  function row_comp(props) {
    const {data,field_list, object_type, num_columns=3,  ...params} = props
    let row_data = []
    if (!data) {return null}
  
// section, row, field
      if (data) {
        return (<Fragment>
          {field_list.map((section_list, section_index) => {
              section_list.map((row_list) => {
                      row_list.map((field_name) =>  {
                        const field_model = field_models[field_name]
                        const field_pretty_name = field_model.pretty_name?field_model.pretty_name:field_model.field_name
                        return (<FieldView {...params} data={data} field_name={field_name} field_model={field_model}/>)
                      })
              })
          })}
          </Fragment>)
    }
  }

  //                                      <TableCell style={{ margin:0, padding:0}} align="right"><b>{local_data[field_index][0]}:</b></TableCell><TableCell style={{margin:0, padding:0}} align="left"> {data[row_data[field_index[1]]]}<FieldView {...params} data={data} field_name={local_data[field_index][1]} field_model={field_model}/></TableCell>



  let rab_component_model = _.merge({}, rab_component_models.shell)
  rab_component_model.field.components =  {field:field_comp, row_wrap:row_wrap_comp, row:row_comp}
  rab_component_model.field.name = {field_wrap:"Fragment",   list_body:"Fragment", list:"Fragment"}

  return (<Table style={{display:"inline", align:"left",borderSpacing:30, borderCollapse:"separate"}} size="small">
          <ACSRowController {...params} object_type={object_type}  api_options={api_options}  rab_component_model={rab_component_model} />
          </Table>
          )
}
export default ObjectView;
