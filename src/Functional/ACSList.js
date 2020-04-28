import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as u from '../Utils/utils.js';

import useGetObjectList from '../Hooks/useGetObjectList';
import React, {Fragment, useState, useEffect} from 'react';

import {functional_components} from "./index.js"

function ACSList(props) {

  const {field_tag, object_type:props_object_type, api_options:props_api_options={},  ...params } = props

  props_api_options.field_tag = field_tag

  const [mode, setMode] = useState("view");

  let [object_type, api_options, data] = useGetObjectList(props.object_type, props_api_options, props.data); 

  let object_meta = meta.object[object_type]

  const list_component = meta.getPrecedence ("RenderACSList", object_meta?object_meta.list_component:"",  props.list_component?props.list_component:"" )

  const list_wrap_body = meta.getPrecedence ("TableBody",  object_meta?
      object_meta.wrap?object_meta.wrap.list_body:""
      :"", 
  props.wrap?props.wrap.list_body:"")

  const list_wrap = meta.getPrecedence ("Table", object_meta?
      object_meta.wrap?object_meta.wrap.list:""
      :"", 
  props.wrap?props.wrap.list:"")
  
  const ACSListBody = functional_components[list_wrap_body]
  const ACSList = functional_components[list_wrap]

  const RenderACSList = functional_components["RenderACSList"]

  // Changes to data (manpulate for drill down?)
  // Choose the right component
  // convert field_tag into field_list
  //const field_list = Object.keys(data[0])  // for now
  const field_list = ""
  if (data) {
    return  (<ACSList><ACSListBody> <RenderACSList {...params} object_type={object_type} field_list={field_list}  data={data} api_options={api_options} />
        </ACSListBody></ACSList>)
    } else {
        // prevents dom changes
        return <div></div>
    }
  
}

export default ACSList;