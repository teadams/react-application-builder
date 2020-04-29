import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as u from '../Utils/utils.js';

import useGetObjectList from '../Hooks/useGetObjectList';
import React, {Fragment, useState, useEffect} from 'react';

import {functional_components} from "./index.js"

function ACSListController(props) {
  const {field_tag, object_type:props_object_type, api_options:props_api_options={}, field_list="", ...params } = props

  props_api_options.field_tag = field_tag

  const [mode, setMode] = useState("view");

  let [object_type, api_options, data] = useGetObjectList(props.object_type, props_api_options, props.data); 

  let object_meta = meta.object[object_type]

  let RenderACSList  =  meta.getValueByPrecedence("component.list","",object_meta, props)
  let ACSList = meta.getValueByPrecedence("component.list_wrap","",object_meta, props)
  let ACSListBody = meta.getValueByPrecedence("component.list_wrap_body","",object_meta, props)

  let component_name = ""
  if (!RenderACSList) {
    component_name = meta.getValueByPrecedence("component_name.list","RenderACSList",object_meta, props)
     RenderACSList = functional_components[component_name]
  }

  let wrap_name =""
  if (!ACSList) {
    wrap_name =meta.getValueByPrecedence("component_name.list_wrap","Table",object_meta, props)
    ACSList = functional_components[wrap_name]
  }

  let wrap_name_body =""
  if (!ACSListBody) {
    wrap_name_body =meta.getValueByPrecedence("component_name.list_wrap_body","TableBody",object_meta, props)
    ACSListBody = functional_components[wrap_name_body]
  }

  const onClick = meta.getValueByPrecedence("onClick.list",object_meta,props)

  if (data) {
    return  (<ACSList><ACSListBody onClick={onClick}> <RenderACSList {...params} object_type={object_type} field_list={field_list}  data={data} api_options={api_options} />
        </ACSListBody></ACSList>)
    } else {
        // prevents dom changes
        return <div></div>
    
  }
  
}

export default ACSListController;