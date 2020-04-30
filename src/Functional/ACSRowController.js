 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import RenderACSRow from './RenderACSRow.js'
import useGetObject from '../Hooks/useGetObject';
import React, {Fragment, useState, useEffect} from 'react';
import { TableRow } from '@material-ui/core';

import {functional_components} from "./index.js"

function ACSRowController(props) {
  const {object_type: props_object_type, id: props_id, field_list:props_field_list, api_options:props_api_options, data:props_data, ...params} = props
  const [mode, setMode] = useState("view");
  
  let [ready, object_type, id, field_list, api_options, data] = 
  useGetObject(props_object_type, props_id, props_field_list, props_api_options, props_data); 

  let object_meta = meta.object[object_type]

  if (!field_list) {
      if (object_type) {
        field_list = Object.keys(meta.fields(object_type))
      } else {
        field_list = Object.keys(data)
      }
  }
  // Changes to field list (metadata rules, ext)

  let RenderACSRow  =  meta.getValueByPrecedence("component.row","",object_meta, props)

  let ACSRow = meta.getValueByPrecedence("component.row_wrap","",object_meta, props)

//pattern, default value, args
  let component_name = ""
  if (!RenderACSRow) {
    component_name = meta.getValueByPrecedence("component_name.row","RenderACSRow",object_meta, props)
     RenderACSRow = functional_components[component_name]
  }
  let wrap_name =""
  if (!ACSRow) {
    wrap_name =meta.getValueByPrecedence("component_name.row_wrap","TableRow",object_meta, props)

    ACSRow = functional_components[wrap_name]
  }

  const onClick = meta.getValueByPrecedence("onClick.row",object_meta,props)


  if (!api_options) { 
    // hack to allow the ACSField renews below to be memoized
    // (due to javascript compare to null weirdness)
    const api_options = {memo_helper:true}
  }

  if (data) {
    return ( <ACSRow onClick={onClick} data={data} object_type={object_type} id={id}>
            <RenderACSRow {...params} object_type={object_type} id={id} field_list={field_list} data={data} api_options={api_options}/>
            </ACSRow>)
    } else {  
        return <div></div>
    }
}

export default ACSRowController;