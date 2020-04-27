import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as u from '../Utils/utils.js';
import RenderACSList from './RenderACSList.js'
import useGetObjectList from '../Hooks/useGetObjectList';
import React, {Fragment, useState, useEffect} from 'react';

function ACSList(props) {
  const {field_tag} = props
  let props_api_options = props.api_options?props.api_options:{}
  props_api_options.field_tag = field_tag

  const [mode, setMode] = useState("view");

  let [object_type, api_options, data] = useGetObjectList(props.object_type, props_api_options, props.data); 

  // Changes to data (manpulate for drill down?)
  // Choose the right component

  if (data) {
    return ( 
            <div>{JSON.stringify(data)}</div>
            // <RenderACSList object_type={object_type} field_tag={field_tag} data={data} api_options={api_options}/>
            )
    } else {
        // prevents dom changes
        return <div></div>
    }
  
}

export default ACSList;