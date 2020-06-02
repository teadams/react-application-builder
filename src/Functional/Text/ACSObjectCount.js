import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import * as u from '../../Utils/utils.js';
import ACSRowController from '../ACSRowController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {Tab, Tabs, Menu, MenuItem, Paper, MenuList,List,ListItem,ListItemAvatar,ListItemIcon,ListItemSecondaryAction,ListItemText,ListSubheader,Table,TableBody,TableCell,TableContainer,TableFooter,TableHead,TablePagination,TableRow,Typography} from '@material-ui/core';
 
function ACSObjectCount(props)  {
  // careful no to use api_options = {}
  const {object_type, api_options} = props
  //api_options.get_count = true
  const ACSCount = (props) => {
    if (!props.data) {return null}
    return (<Fragment>a1<div style={{display:'flex'}}>{props.data.count}</div>a2</Fragment>)
  }
  const rab_component_model = {
    row: {
      components:{
        row_body:ACSCount
      },
      names:{
        header_wrap:"RABVoid"
      }
    }

  }
  return ( <Fragment>c1
      <div style={{display:'flex'}}> {props.text}<ACSRowController 
        rab_component_model = {rab_component_model}
        object_type={object_type}  api_options={api_options} />
     </div>c2
      </Fragment>
  )
}
export default ACSObjectCount;
