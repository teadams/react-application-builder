import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState, useContext} from 'react';
import {ListItem, Grid,  Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button, Tabs, Tab } from '@material-ui/core';
import {ACSObjectView, ACSEditButton, ACSField, ACSText, ACSTabMenu, ACSObjectType} from '../index.js'

import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';

import useGetModel from "../../Hooks/useGetModel.js"

function ACSDrillCenter(props) {
   const {object_models,field_models,data,object_type,id} = props;
    return (<ACSObjectView data={data} field_models={field_models} object_models={object_models} object_type={object_type} id={id}/>)
}


function getCustomObjectModels(custom_object_type) {
  const object_models = {}  
  object_models[custom_object_type] = {name:"new_object", pretty_name:"New Object", key_id:"id", pretty_key_id:"name"}
  return object_models
}

function getCustomFieldModels(custom_object_type, data) {
  const field_models = {}  
  field_models[custom_object_type] ={}
  Object.keys(data).forEach(key => {
    field_models[custom_object_type][key] = {name:key, pretty_name:key} 
  })
  return field_models
}


function ACSDrillDown(props) {
  const {object_type="custom_object_type", api_options, id_field="id", drill_center_component, data, drill_placement="left"}  = props
  
//  const data = [{id:1, name:"foo"}, {id:2, name:"bar"}]
  const [drill_data, setDrillData] = useState(data)
  const [selected_data, setSelectedData] = useState([props.id,"", null])
  const [id, index, selected_row] = selected_data

  let object_models, field_models

  if (object_type === "custom_object_type" && data) {
    object_models = getCustomObjectModels("custom_object_type")

    // each row may have differnt fields 
    if (index) {  
      field_models = getCustomFieldModels("custom_object_type",data[index])
    } else {
      // if nothing is selected, use the first row
      field_models = getCustomFieldModels("custom_object_type",data[0])
    }

  } 
  
  const handleOnData = (api_results) => {
      setDrillData(api_results)
  }

  const handleOnClick = (event,selected_row,index) => {
    setSelectedData ([selected_row[id_field], index, selected_row])
  }

  const DrillCenter = drill_center_component?drill_center_component:ACSDrillCenter

  function RowDrillDown(props) {
    return (
    <div style={{display:"flex", flexDirection:"row", width:"100%"}}>
      <div style={{width:"20%"}}>
    {drill_data && 
      drill_data.map((drill_row_data,index)=> {
        return (<ListItem  onClick={(event) => handleOnClick(event, drill_row_data, index)} key={index} value={index} name={index}><ACSField image_size="tiny" object_type={object_type} click_to_edit={false} data={drill_row_data} object_models={object_models} field_models={field_models} field_name="name"/></ListItem>
        )
      })
    }     
    </div>

      <div style={{width:"80%"}}>
      {id && <Fragment> 
        <DrillCenter data={selected_row} field_models={field_models} object_models={object_models} object_type={object_type} id={id}/> 
        </Fragment>
      } 
      </div>
    </div>)
  }

  function ColumnDrillDown(props) {
    return (
    <div style={{display:"flex", flexDirection:"column", width:"100%"}}>
      <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap", width:"100%"}}>
    {drill_data && 
      drill_data.map((drill_row_data,index)=> {
        return ( <div><ListItem  onClick={(event) => handleOnClick(event, drill_row_data, index)} key={index} value={index} name={index}><ACSField image_size="tiny" onClick={(event) => handleOnClick(event, drill_row_data, index)} object_type={object_type} data={drill_row_data} object_models={object_models} field_models={field_models} field_name="name"/></ListItem>
        </div>)
      })
    }     
    </div>
      <div style={{width:"100%"}}>
      {id && <Fragment> 
          <DrillCenter data={selected_row} field_models={field_models} object_models={object_models} object_type={object_type} id={id}/> 
        </Fragment>
      } 
      </div>
    </div>)
  }

  let DrillDownLayout = (drill_placement === "left")?RowDrillDown:ColumnDrillDown

  return (
      <Fragment>
      {object_type !== "custom_object_type" && 
        <ACSObjectType object_models={object_models} field_models={field_models} onData={handleOnData} headless={true} data={data} object_type={object_type} api_options={api_options}/>
      }
      <DrillDownLayout/>
      </Fragment>
  )
}

export default ACSDrillDown