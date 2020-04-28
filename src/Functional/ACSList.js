import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as u from '../Utils/utils.js';
import RenderACSList from './RenderACSList.js'
import useGetObjectList from '../Hooks/useGetObjectList';
import React, {Fragment, useState, useEffect} from 'react';

import {functional_components} from "./index.js"

function ACSList(props) {

  const {field_tag, object_type:props_object_type, api_options:props_api_options={}, list_component, ...params } = props

  props_api_options.field_tag = field_tag

  const [mode, setMode] = useState("view");

  let [object_type, api_options, data] = useGetObjectList(props.object_type, props_api_options, props.data); 

  const ACSListBody = functional_components["TableBody"]
  const ACSList = functional_components["TableRow"]

  // Changes to data (manpulate for drill down?)
  // Choose the right component
  // convert field_tag into field_list
  //const field_list = Object.keys(data[0])  // for now
  const field_list = ""
  if (data) {
    return  (<ACSList><ACSListBody> <RenderACSList {...params} object_type={object_type} field_list={field_list} list_component={list_component} data={data} api_options={api_options} />
        </ACSListBody></ACSList>)
    } else {
        // prevents dom changes
        return <div></div>
    }
  
}

export default ACSList;