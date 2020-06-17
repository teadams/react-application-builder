import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import * as u from '../../Utils/utils.js';
import ACSRowController from '../ACSRowController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {Tab, Tabs, Menu, MenuItem, Paper, MenuList,List,ListItem,ListItemAvatar,ListItemIcon,ListItemSecondaryAction,ListItemText,ListSubheader,Table,TableBody,TableCell,TableContainer,TableFooter,TableHead,TablePagination,TableRow,Typography} from '@material-ui/core';
 
function ACSObjectCount(props)  {
  // careful no to use api_options = {}
  const {object_type, api_options, headless=false} = props
  //api_options.get_count = true
  const ACSCount = (props) => {
    if (!props.data) {return null}
    return props.data.count
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
  function onData(results) {
    const count =results.data.count
    if (props.onData) {
      return count
    }
  }

  return ( <Fragment>
      <div style={{display:'inline'}}> {props.text}<ACSRowController 
        rab_component_model = {rab_component_model}
        object_type={object_type} headless={headless} onData={headless?onData:""} api_options={api_options} />
     </div>
      </Fragment>
  )
}
export default ACSObjectCount;
