import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import RenderACSFieldSet from './RenderACSFieldSet.js'
import useGetObject from '../Hooks/useGetObject';
import React, {Fragment, useState, useEffect} from 'react';
import { TableRow } from '@material-ui/core';

import {functional_components} from "./index.js"

function ACSFieldSet(props) {
  const {object_type: props_object_type, id: props_id, field_list:props_field_list, api_options:props_api_options, data:props_data, ...params} = props
  const [mode, setMode] = useState("view");

  let [ready, object_type, id, field_list, api_options, data] = useGetObject(props_object_type, props_id, props_field_list, props_api_options, props_data); 

  let object_meta = meta.object[object_type]

  if (!field_list) {
      if (object_type) {
        field_list = Object.keys(meta.fields(object_type))
      } else {
        field_list = Object.keys(data)
      }
  }
  // Changes to field list (metadata rules, ext)

  // Choose the write component

  const field_set_component = meta.getPrecedence ("RenderACSFieldSet", object_meta?object_meta.field_set_component:"",  props.field_set_component?props.field_set_component:"" )
  
  const field_set_wrap = meta.getPrecedence ("TableRow",  object_meta?
      object_meta.wrap?object_meta.wrap.field_set:""
      :"", 
  props.wrap?props.wrap.field_set:"")

  const RenderACSFieldSet = functional_components[field_set_component]
  const ACSFieldSet = functional_components[field_set_wrap]

  if (!api_options) { 
    // hack to allow the ACSField renews below to be memoized
    // (due to javascript compare to null weirdness)
    const api_options = {memo_helper:true}
  }

  if (data) {
    return ( <ACSFieldSet>
            <RenderACSFieldSet {...params} object_type={object_type} id={id} field_list={field_list} data={data} api_options={api_options}/>
            </ACSFieldSet>)
    } else {  
        return <div></div>
    }
}

export default ACSFieldSet;