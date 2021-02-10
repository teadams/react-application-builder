import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState, useContext} from 'react';
import {ListItem, Grid,  Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button, Tabs, Tab } from '@material-ui/core';
import {ACSObjectView, ACSEditButton, ACSField, ACSText, ACSTabMenu, ACSObjectType} from '../index.js'

import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';

import useGetModel from "../../Hooks/useGetModel.js"

function getCustomObjectModels(custom_object_type) {
  const object_models = {}  
  object_models[custom_object_type] = {name:"new_object", pretty_name:"New Object", key_id:"id", pretty_key_id:"name"}
  return object_models
}

function getCustomFieldModels(custom_object_type, data) {
  const field_models = {}  
  field_models[custom_object_type] = {id:{key:true}, name:{pretty_name:"Name"}}
  return field_models
}


function ACSDrillDown(props) {
  const {object_type="custom_object_type", api_options, view_object_type=props.object_type, tmpdata}  = props
  
  const data = [{id:1, name:"foo"}, {id:2, name:"bar"}]
  let object_models, field_models
  if (object_type === "custom_object_type") {
    object_models = getCustomObjectModels("custom_object_type")
    field_models = getCustomFieldModels("custom_object_type",data)
  }

  const [drill_data, setDrillData] = useState(data)
  const handleOnData = (api_results) => {
      setDrillData(api_results)
  }

  const handleOnClick = (event,row_data,index) => {

  }

  return (
      <Fragment>
      <ACSObjectType object_models={object_models} field_models={field_models} onData={handleOnData} headless={true} data={data} object_type={object_type} api_options={api_options}/>
      {drill_data && 
        drill_data.map((drill_row_data,index)=> {
          return (<ListItem  onClick={(event) => handleOnClick(event, drill_row_data, index)} key={index} value={index} name={index}><ACSField image_size="tiny" object_type={object_type} data={drill_row_data} object_models={object_models} field_models={field_models} field_name="name"/></ListItem>
          )
        })
      }    
      </Fragment>
  )
}

export default ACSDrillDown