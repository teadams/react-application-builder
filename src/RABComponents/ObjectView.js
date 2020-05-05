import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
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
  if (!menu_model) {return null}
  const model = meta.getByPrecedence({filter_field:"id"}, props, menu_model.menu_items[props.menu_name])
  const {object_type, filter_field, ...params} = model

  let api_options = {}
  api_options.filter_id = props[filter_field]
  api_options.filter_field = filter_field

  function TablePaper(props) {
      return <Paper style={{display:"inline"}} variant="outlined">{props.children}</Paper>
  }
  
  function field_comp (props) {
      const {...params} = props
      return <Fragment><TableRow>
            <TableCell align="right"><b>{props.field_meta.pretty_name}:</b></TableCell><TableCell align="left"><FieldView {...params}/></TableCell></TableRow></Fragment> 
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
  
    // XXX Cases where there is no data

      if (data) {
        return (<Fragment>
          {field_list.map((field_name, field_index) => {
              const field_meta = meta.fields(object_type)[field_name]
//              u.aa("object_type,field_name,field_meta", object_type, field_name,field_meta)

              // default col_span to 1.  Add col_span to number_running_columns. Add 1 to num_running_fields
              // if number_running_columns = num_columns - loop with start to start+ num_running_fields
                    // number_running_columns = 0, start is start + num_running_fields +1, num_running_fields = 0
              // if number_columns > max, loop with start to num_running_fields -1, start = Start plus num_running_fields, num_running_fields 0
              // PROBLEM - last row may have more- do it twice

              // First loop - splits up the field sett
              // [a,b,c, d, e, f, g]
              //[[a,b,c], [d,e],[f,g]]
              // running_row = 0
              // if col_span+running_column_span < limit - push to sub
              // else - create a new onMenuChange
              // running_row = running_row+1
              // fields_new.push([]) 
              //fields_new[running_row].push(field_name)
              const field_pretty_name = field_meta.pretty_name?field_meta.pretty_name:field_meta.field_name
              row_data.push([field_pretty_name, field_name]) 
              if ((field_index !=0 || num_columns===1) && (field_index+1) % num_columns === 0 ) {
                  const local_data = row_data.slice();

                  row_data = []

                  // instead of making a copy, make a range (start to start + num fields) num columns
                  return (<TableRow>
                            {local_data.map( (field, field_index) => {
                              return (<Fragment>
                                      <TableCell style={{ margin:0, padding:0}} align="right"><b>{local_data[field_index][0]}:</b></TableCell><TableCell style={{margin:0, padding:0}} align="left"> {data[row_data[field_index[1]]]}<FieldView {...params} data={data} field_name={local_data[field_index][1]}/></TableCell>
                                    </Fragment>)
                            })}
                          </TableRow>)
              } else {  return null }
          })}
          {row_data.length > 0 && 
                <TableRow>
                      {row_data.map( (field, field_index) => {
                        return (<Fragment>
                                <TableCell  style={{ margin:0, padding:0}} align="right"><b>{row_data[field_index][0]}:</b></TableCell><TableCell style={{margin:0,padding:0}} align="left">aa{data[row_data[field_index[1]]]}aa<FieldView {...params} field_name = {row_data[field_index][1]} data={data}/></TableCell>
                              </Fragment>)
                      })}
                </TableRow> 
          }
          </Fragment>)
      }
  }


  

  const rab_component = {field:field_comp, row_wrap:row_wrap_comp, row:row_comp}
  const rab_component_name = {field_wrap:"Fragment",   list_body:"Fragment", list:"Fragment"}

  return (<Table style={{display:"inline", align:"left",borderSpacing:30, borderCollapse:"separate"}} size="small">
          <ACSRowController {...params} object_type={object_type}  api_options={api_options}  rab_component={rab_component} rab_component_name={rab_component_name}/>
          </Table>
          )
}
export default ObjectView;

