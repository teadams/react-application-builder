import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState, useContext} from 'react';
import {ListItem, Grid,  Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button, Tabs, Tab } from '@material-ui/core';
import {ACSObjectView, ACSEditButton, ACSField, ACSText, ACSTabMenu, ACSObjectType} from '../index.js'

import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';

import useGetModel from "../../Hooks/useGetModel.js"

function ACSDrillDown(props) {
  const {object_type, api_options, view_object_type=props.object_type, view_data}  = props
  

  const [drill_data, setDrillData] = useState(props.drill_data)
  const handleOnData = (api_results) => {
      setDrillData(api_results)
  }

  const handleOnClick = (event,row_data,index) => {

  }
  return (
      <Fragment>
      <ACSObjectType onData={handleOnData} headless={true} data={props.drill_data} object_type={object_type} api_options={api_options}/>
      {drill_data && 
        drill_data.map((drill_row_data,index)=> {
          return (<ListItem  onClick={(event) => handleOnClick(event, drill_row_data, index)} key={index} value={index} name={index}><ACSField image_size="tiny" object_type={object_type} data={drill_row_data}/></ListItem>
          )
        })
      }    
      </Fragment>
  )
}

export default ACSDrillDown