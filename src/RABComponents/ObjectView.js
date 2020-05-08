import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import _ from 'lodash/object'

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
  const {object_type, filter_field, num_columns=8, ...params} = model

  let api_options = {}
  api_options.filter_id = props[filter_field]
  api_options.filter_field = filter_field

  function TablePaper(props) {
      return <Paper style={{display:"inline"}} variant="outlined">{props.children}</Paper>
  }
  
// Next stpes
// move this down into RenderRow 
/// Thinkn out names of everything (row wrap, section_wrap,)
// Different field dispalys value, name_colin:value, name_values_cells, name_above_value, form_layout
// later, handle column span, 
// text out sections (wrap about be Grid container, GridItem) - need theses are base row_component

//  function field_comp (props) {
//      const {field_model, ...params} = props
//      return ("text")
      // return <Fragment><TableRow>
      //       <TableCell align="right"><b>{field_model.pretty_name}:</b></TableCell><TableCell align="left"><FieldView {...params}/></TableCell></TableRow></Fragment> 
  //}

  function row_wrap_comp(props) {
      const {object_type, ...params} = props   
      const field_name = meta.keys(object_type).pretty_key_id
      return (<Table>{props.children}</Table>)
      // return <Fragment><Typography variant="title" style={{display:"block", padding:10}}><b>
      //         <FieldView {...params} data={props.data} object_type={object_type} field_name={field_name}/></b></Typography><Table style={{borderSpacing:30, borderCollapse:"separate"}}>
      //         {props.children}</Table>
      //       </Fragment>
  }

  function row_comp(props) {
    const {data,field_list, object_type,   ...params} = props
  //  u.a(field_list)

    let row_data = []
// section, row, field
    if (!data) {return null}
      if (data) {
        return (<Fragment>
          {field_list.map((section_list, section_index) => {
            u.aa ("section_list", section_list) 
              return section_list.map((row_list) => {
            //      u.aa("row_list", row_list)
                    return (
                    <TableRow>
                        {row_list.map((field_name) =>  {
                            return (<Fragment>XXX
                                <ACSField {...params} object_type={object_type} data={data} field_name={field_name} /><br/>
                                  </Fragment>)
                        })}
                    </TableRow>)
              })
          })}
          </Fragment>)
    }
  }

  //                                      <TableCell style={{ margin:0, padding:0}} align="right"><b>{local_data[field_index][0]}:</b></TableCell><TableCell style={{margin:0, padding:0}} align="left"> {data[row_data[field_index[1]]]}<FieldView {...params} data={data} field_name={local_data[field_index][1]} field_model={field_model}/></TableCell>

  let rab_component_model = _.merge({}, rab_component_models.empty)
  rab_component_model.row.components =  {row_wrap:row_wrap_comp, row:row_comp}
  rab_component_model.field.names = {field_wrap:"TableCell"}

  return (<Table style={{display:"inline", align:"left",borderSpacing:30, borderCollapse:"separate"}} size="small">
          <ACSRowController {...params} object_type={object_type}  api_options={api_options} num_columns={num_columns} rab_component_model={rab_component_model} />
          </Table>
          )
}
export default ObjectView;
