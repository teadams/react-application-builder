import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../../Utils/utils.js'
import * as api from '../../../Utils/data.js'
import * as control from '../../../Utils/control.js';
import {ACSListController} from '../../../ACSRenderEngine'
import {ACSField, ACSImageView} from '../../../ACSLibrary'
import {AuthContext} from '../../../Modules/User';

import useGetModel from '../../../Hooks/useGetModel.js'
import React, {Fragment, useState, useContext} from 'react';
import { Tooltip, Table, TableBody, TableRow, TableCell, Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

const ACSChip = (props) => {
  const {summary, label, avatar_object, show_blank_avatar, variant="default", color="default", size="small", onClick} = props
  return (
    <Fragment>
      {summary? 
      <Tooltip title={summary} placement="top-end" arrow={true}>
        <Chip  onClick={onClick} style={{marginLeft:"5px", marginBottom:"5px"}} variant={variant} label={label} size={size} color={color} avatar={<ACSImageView image_object={avatar_object} show_blank={show_blank_avatar}  size="tiny"/>}/>
      </Tooltip>
      :
        <Chip onClick={onClick}  style={{marginLeft:"5px", marginBottom:"5px"}} variant={variant}   label={label} size={size} color={color} avatar={<ACSImageView image_object={avatar_object} show_blank={show_blank_avatar}  size="tiny"/>} />
      }
      </Fragment>
  )
}

function field_text (field_models, object_type, field, data) {
  const field_model = field_models[object_type][field]
  const data_path = field_model.data_path 
  const field_data = data_path?data[data_path]:data
  const field_component = field_model.field_component
  let value = field_data[field_model.display_field]

  if (field_component !== "RABTextField" && field_component !== "ACSFile") {
    const Field = control.componentByName(field_component)
    value = Field({data:field_data, field_name:field_model.display_field, mode:"text"})
  }
  return value
}

function field_text_for_key (object_models, field_models, object_type, key_type,  data) {
  const key_field = object_models[object_type][key_type]
  let value =""
  if (key_field) {
    value = field_text (field_models, object_type, key_field, data)
  }
  return value
}


function MappedList(props) {
  const {mapping_base_data, data, object_type, ...params} = props
  const object_models = useGetModel("object_types")
  const object_model = object_models[object_type]
  const {mapping_base_object_type, mapping_base_link, mapping_table_link,status_column, positive_status, negative_status} = object_model.mapping_values

  let mapping_values = {}
  data.forEach((mapping_row, index) =>{
    mapping_values[mapping_row[mapping_table_link]] = mapping_row
  })

  return (<div style={{display:"flex", flexDirection:"row"}}>
    {mapping_base_data.map(map_row=> {
      return (
        <div style={{marginTop:"5px", display:"flex", alignContent:"center",  flexDirection:"row" }}>                 
          <div style={{marginRight:"5px",marginTop:"5px", fontWeight:"bold"}}>
              <MappingRow {...params} data={map_row} object_type={object_type} mapping_values={mapping_values} mapping_base_object_type={mapping_base_object_type}/>
          </div>
        </div>)
      })}
    </div>) 

}

function MappingRow(props) {
      const {data,  mapping_values, object_type} = props
      const object_models = useGetModel("object_types")
      const object_model = object_models[object_type]
      const field_models = useGetModel("fields")
      const context = useContext(AuthContext)

      const {root_column, mapping_base_object_type, mapping_base_link, mapping_table_link,status_column, positive_status, negative_status} = object_model.mapping_values
      const mapped_data = mapping_values[data[mapping_base_link]]

      const label = field_text_for_key (object_models, field_models, mapping_base_object_type, "pretty_key_id", data) 
      const mapping_base_object_model = object_models[mapping_base_object_type]
      const avatar_field = mapping_base_object_model.thumbnail_key 

      const handleClick = (event) => {
        let mode="create"
        let formValues = {}
        formValues[mapping_table_link] = data[mapping_base_link]
        if (props[root_column]) {
          formValues[root_column] = props[root_column]
        }

        if (mapped_data) {
          mode="edit"
          formValues.id = mapped_data.id
          if (mapped_data[status_column] === positive_status) {
            formValues[status_column] = negative_status
          } else {
            formValues[status_column] = positive_status
          }
        } else {
          formValues[status_column] = positive_status
        }
        api.handleSubmit (event, formValues, mode, context, object_type, object_model, field_models, "", "id", "", false) 
      }

      let variant = "outlined"
      if (mapped_data) {
        if (positive_status === mapped_data[status_column]) {
          variant="default"
        }
      }

      let show_blank_avatar = false
      let avatar_object
      if (avatar_field) {
        avatar_object = field_text (field_models, mapping_base_object_type, avatar_field, data)
        show_blank_avatar = true
      }
      const summary = field_text_for_key (object_models, field_models, mapping_base_object_type, "summary_key", data) 

      return (<ACSChip summary={summary} size="medium" onClick={handleClick} label={label} variant={variant}  color="primary" avatar_object={avatar_object} show_blank_avatar={show_blank_avatar}/>)
}


function ACSMapping(props)  {
  const {object_type, api_options, ...params} = props
  const [mapping_base_data, setMappingBaseData] = useState(props.mapping_base_data)
  const [mapping_data, setMappingData] = useState(props.mapping_data)

  const object_models = useGetModel("object_types")
  const object_model = object_models[object_type]
  const {mapping_base_object_type, mapping_base_api_options} = object_model.mapping_values


  const handleMappingBaseData = (api_results) => {
    setMappingBaseData(api_results)
  }

  const handleMappingData = (api_results) => {
    setMappingData(api_results)
  }

  return (
  <Fragment>
    <ACSListController headless={true} data={mapping_base_data} onData={handleMappingBaseData} object_type={mapping_base_object_type} api_options={mapping_base_api_options}/>
    <ACSListController headless={true} {...params} onData={handleMappingData} api_options={api_options} object_type={object_type}/>
    {mapping_data && mapping_base_data && <MappedList {...params} data={mapping_data} object_type={object_type} mapping_base_data={mapping_base_data} />}
  </Fragment>
 )
}

export default ACSMapping;

