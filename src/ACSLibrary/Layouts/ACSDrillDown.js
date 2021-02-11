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
  field_models[custom_object_type] ={}
  Object.keys(data[0]).forEach(key => {
    field_models[custom_object_type][key] = {name:key, pretty_name:key} 
  })
  return field_models
}


function ACSDrillDown(props) {
  const {object_type="custom_object_type", api_options, id_field="id", view_component="ACSObjectView", data}  = props
  
//  const data = [{id:1, name:"foo"}, {id:2, name:"bar"}]
  const [drill_data, setDrillData] = useState(data)
  const [id, setDrillId] = useState(props.id)
  const [selected_row, setSelectedRow] = useState(null)

  let object_models, field_models
  if (object_type === "custom_object_type" && data) {
    object_models = getCustomObjectModels("custom_object_type")
    field_models = getCustomFieldModels("custom_object_type",data)
  }

  const handleOnData = (api_results) => {
      setDrillData(api_results)
  }

  const handleOnClick = (event,selected_row,index) => {
    setDrillId(selected_row[id_field]);
    setSelectedRow(selected_row);
  }


  return (
      <Fragment>
      {object_type !== "custom_object_type" && 
        <ACSObjectType object_models={object_models} field_models={field_models} onData={handleOnData} headless={true} data={data} object_type={object_type} api_options={api_options}/>
      }
      <div style={{display:"flex", flexDirection:"row", width:"100%"}}>
        <div style={{width:"20%"}}>
      {drill_data && 
        drill_data.map((drill_row_data,index)=> {
          return (<ListItem  onClick={(event) => handleOnClick(event, drill_row_data, index)} key={index} value={index} name={index}><ACSField image_size="tiny" object_type={object_type} data={drill_row_data} object_models={object_models} field_models={field_models} field_name="name"/></ListItem>

          // return (<ListItem  onClick={(event) => handleOnClick(event, drill_row_data, index)} key={index} value={index} name={index}><ACSField image_size="tiny" object_type={object_type} data={drill_row_data} object_models={object_models} field_models={field_models} field_name="name"/></ListItem>
          )
        })
      }     
        </div>
        <div style={{width:"80%"}}>
        {id && <Fragment> <ACSObjectView data={selected_row} field_models={field_models} object_models={object_models} object_type={object_type} id={id}/> 
          </Fragment>
        } 
        </div>
      </div>
      </Fragment>
  )
}

export default ACSDrillDown