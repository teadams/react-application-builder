import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js'
import * as control from '../../Utils/control.js';
import ACSObjectTypeView from './ACSObjectTypeView.js'
import ACSField from '../ACSField2.js'
import AuthContext from '../../Components/User/AuthContext';
import useGetModel from '../../Hooks/useGetModel.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import ACSListController from '../ACSListController.js'
import {Tab, Tabs, Menu, MenuItem, MenuList,List,ListItem,ListItemAvatar,ListItemIcon,ListItemSecondaryAction,ListItemText,ListSubheader,Table,TableBody,TableCell,TableContainer,TableFooter,TableHead,TablePagination,TableRow,} from '@material-ui/core';


function MappingHeaders(props) {
  return (
    <TableHead>
    <TableRow>
      <TableCell>Volunteer Needed?</TableCell>
      <TableCell>Role</TableCell>
      <TableCell>Role Summary</TableCell>
      <TableCell>Project Specific Needs</TableCell>
    </TableRow>
    </TableHead>
  )
}

function MappingRow(props) {
  const {data, object_type, api_options} = props
  const {mapping_name} = api_options

  const object_type_models = useGetModel("object_types")
  const object_model = object_type_models[object_type]

  const mapping_attributes = object_model[mapping_name]
  const {root_column, mapped_table, mapped_table_link, mapping_table_link, status_column, positive_status, negative_status}  = mapping_attributes
  const mapped_object_model = object_type_models[mapped_table]
  const TableCell = control.componentByName("TableCell")

// Needed, Role, General Description, Specific Description

  return (
  <Fragment>
   <TableCell>Checkbox Status = {data[status_column]}</TableCell>
   <TableCell> Role {data[mapping_table_link][mapped_object_model.pretty_key_id]}</TableCell>
    <TableCell>{data[mapping_table_link][mapped_object_model.summary_key]}</TableCell> 
    <TableCell>{data[object_model.summary_key]}</TableCell>
  </Fragment>
  
  )
}



//      root_column:"core_subsite" 
//         - linked to root object, column stays the same
//      mapped_table:"core_role" 
//         -- Table that provides the values
//      mapped_table_link:"id",
//          -- column in mapped_table that links to the mapping_table
//      mapping_table_link:"role_name",
//          -- column in mapping_table that linkes to Mapped_table
//      status_colun 
//            -- Column indicating status
//      positive_status:"Recruiting"
//           -- Value indivating "true"
//      negative_status:"Filled"
//           -- Value indicating "no"
// ?? other columns to display

function ACSMappingView(props)  {
  const {object_type, root_value, mapping_name, api_options={}, ...params} = props
  const context = useContext(AuthContext)

  if (mapping_name) {
      // attribute to use for this mapping
      api_options.mapping_name = mapping_name
  }
  if (root_value) {
      api_options.root_value = root_value
  }
  if (!api_options.root_value) {
    // if not provided, use subsite context
    api_options.root_value = context.context_id
  }
  if (!api_options.root_value) {
      return null
  }
// XX move above

  const rab_component_model = { 
      list:{components:{
                    list_header:MappingHeaders},
            names:{header_wrap:"RABVoid", 
                  list_container:"TableContainer",
                  list_wrap:"Table",
                  list_header_wrap:"Fragment",
                  list_header:"Fragment",
            
                  body_wrap:"TableBody",
                  footer:"RABVoid",
                  list_pagination:"RABVoid"}
      },
      row:{components:{
            row:MappingRow
          },
          props: {
            no_stripe:true
          }
      },
      field:{names:{
            field_wrap:"Fragment"
          },
      }}
  return (<ACSListController {...params} rab_component_model={rab_component_model}  object_type={object_type} api_options={api_options}/> )
}
export default ACSMappingView;

