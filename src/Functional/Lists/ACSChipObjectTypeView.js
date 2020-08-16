import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js'
import * as api from '../../Utils/data.js'
import * as control from '../../Utils/control.js';
import {ACSListController} from '../../ACSRenderEngine'
import ACSField from '../Fields/ACSField.js'
import ACSImage from '../Fields/ACSImage.js'

import useGetModel from '../../Hooks/useGetModel.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { Tooltip, Table, TableBody, TableRow, TableCell, Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

const ACSChip = (props) => {
  const {summary, label, avatar_object, show_blank_avatar, variant="default", color="default"} = props
  return (
    <Fragment>
      {summary? 
      <Tooltip title={summary} placement="top-end" arrow={true}>
        <Chip   style={{marginLeft:"5px", marginBottom:"5px"}} variant={variant} label={label} size="small" color={color} avatar={<ACSImage image_object={avatar_object} show_blank={show_blank_avatar}  size="tiny"/>}/>
      </Tooltip>
      :
        <Chip style={{marginLeft:"5px", marginBottom:"5px"}} variant={variant}   label={label} size="small" color={color} avatar={<ACSImage image_object={avatar_object} show_blank={show_blank_avatar}  size="tiny"/>} />
      }
      </Fragment>
  )
}

function field_text (field_models, object_type, field, data) {
  const field_model = field_models[object_type][field]
  const data_path = field_model.data_path 
//u.a(data_path, field)
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


// Declare group by object type 
// Get object type 
// FOrm group by data
//  -- loop 1 - get the query


function ChipGroupBy(props) {
  const {row_data, data, object_type,  chip_group_by_field, chip_group_by_object_type, chip_group_by_api_options, group_by_chip={}, chip_group_by_object_type_key, chip_show_blank_groups=false} = props
  const [group_by_key, setGroupByKey]= useState()
  const field_models = useGetModel("fields")

  // OR FROm DB
  if (!group_by_key && !chip_group_by_object_type) {
    let working_group_by_key = {}
    data.forEach(row=> {
      const group_by_value = field_text (field_models, object_type, chip_group_by_field, row)
      working_group_by_key[group_by_value] = {}
      working_group_by_key[group_by_value].name = group_by_value 
      working_group_by_key[group_by_value].chips = []
    })

    data.forEach(row=> {
      const group_by_value = field_text (field_models, object_type, chip_group_by_field, row)
      working_group_by_key[group_by_value].chips.push(row)    
    })

    setGroupByKey(working_group_by_key)
  }
  if (!group_by_key && chip_group_by_object_type) {
    let working_group_by_key = {}

    api.getData (chip_group_by_object_type,chip_group_by_api_options, (results, error) => {         
          if (error) {
              alert ("in chip" + chip_group_by_object_type + " " + error.message)
          } else {
            results.forEach(row => {
              const group_by_value = field_text (field_models, chip_group_by_object_type, chip_group_by_object_type_key, row)

              working_group_by_key[group_by_value] = {}
              working_group_by_key[group_by_value].name = group_by_value 
              working_group_by_key[group_by_value].chips = []
            })
            data.forEach(row=> {
              const group_by_value = field_text (field_models, object_type, chip_group_by_field, row)
              working_group_by_key[group_by_value].chips.push(row)    
            })
            setGroupByKey(working_group_by_key)
          }
      })
  }

  if (!group_by_key || Object.keys(group_by_key).length===0) {
    return null
  }
   return (<div style={{display:"flex", flexDirection:"column"}}>
        {Object.keys(group_by_key).map(key=> {
          const group_by_chip_data = group_by_chip[key]
            if (chip_show_blank_groups || group_by_chip_data || group_by_key[key].chips.length > 0) {
              return (<div style={{marginTop:"5px", display:"flex", alignContent:"center",  flexDirection:"column" }}>
                    <div style={{marginRight:"5px",marginTop:"5px", fontWeight:"bold"}}>{group_by_key[key].name}:
                    {group_by_chip_data && <ChipRow data={group_by_chip_data} object_type={object_type}/>}
                    </div><div style={{marginLeft:"25px", marginTop:"5px"}}>
                    {group_by_key[key].chips.map(chip=> {
                    return(<ChipRow data={chip} object_type={object_type}/>)
                      })}
                    </div></div>
                )
            } else {
              return null
            }      
        })}
        </div>) 
}


function ChipRow(props) {
      const {data, object_type} = props
      const object_models = useGetModel("object_types")
      const field_models = useGetModel("fields")
      const label = field_text_for_key (object_models, field_models, object_type, "pretty_key_id", data) 
      const object_model = object_models[object_type]
      const avatar_field = object_model.thumbnail_key 
      const variant = data.variant?data.variant:"outlined"
      const color = data.color?data.color:"default"
      let show_blank_avatar = false
      let avatar_object
      if (avatar_field) {
        avatar_object = field_text (field_models, object_type, avatar_field, data)
        show_blank_avatar = true
      }
      show_blank_avatar = data.hasOwnProperty("show_blank_avatar")?data.show_blank_avatar:show_blank_avatar

//      const chip_group_by_field = field_models[object_type][props.field_name].chip_group_by_field
      const summary = field_text_for_key (object_models, field_models, object_type, "summary_key", data) 
      return (<ACSChip summary={summary} label={label} variant={variant}  color={color} avatar_object={avatar_object} show_blank_avatar={show_blank_avatar}/>)
}


function ACSChipObjectTypeView(props)  {
  const {object_type, api_options, ...params} = props
  let {summary_field, description_field} = props
  const rab_component_model = { 
      list:{
            components:{},
            names:{
                  list_header_wrap:"RABVoid",
                  footer_wrap:"RABVoid",
                  footer:"RABVoid",
                  list_pagination:"RABVoid",
                  header_wrap:"RABVoid",
                  header:"RABVoid",
                  list_container:"Fragment",
                  list_wrap:"Fragment",
                  list_header_wrap:"Fragment",
                  list_header:"Fragment",
                  list_pagination:"RABVoid",
                  body_wrap:"Fragment"},
          props:{}
      },
      row:{names:{
          header_wrap:"RABVoid",
          header:"RABVoid",
          row_body:"Fragment",
          section_wrap:"Fragment",
          section_header:"RABVoid",
          section_body_wrap:"Fragment",
          row_wrap:"Fragment",
          field_chunk_wrap:"Fragment"},
          components:{
            row:ChipRow
          },
          props: {
            no_stripe:true
          }
      },
      field:{names:{
            field_wrap:"Fragment"
          },
      }}
  
      if (params.field_model.chip_group_by_field) { 
        rab_component_model.list.components.list = ChipGroupBy
      //rab_component_model.list_grouping_data = grouping_data
        rab_component_model.list.props.chip_group_by_field = params.field_model.chip_group_by_field  
        rab_component_model.list.props.chip_group_by_object_type = params.field_model.chip_group_by_object_type
        rab_component_model.list.props.chip_group_by_api_options = params.field_model.chip_group_by_api_options  
        rab_component_model.list.props.chip_group_by_object_type_key = params.field_model.chip_group_by_object_type_key  
        rab_component_model.list.props.chip_show_blank_groups= params.field_model.chip_show_blank_groups 

      }
  return (<ACSListController {...params} api_options={api_options}  rab_component_model={rab_component_model}  object_type={object_type} api_options={api_options}/> )
}

export default ACSChipObjectTypeView;

