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


function ACSFieldSet(props) {
//  const { id, api_options} = props
//  let {field_list} = props // will use object meta if not provided
  const [mode, setMode] = useState("view");

  let [ready, object_type, id, field_list, api_options, data] = useGetObject(props.object_type, props.id, props.field_list, props.api_options, props.data); 

  if (!field_list) {
      if (object_type) {
        field_list = Object.keys(meta.fields(object_type))
      } else {
        field_list = Object.keys(data)
      }
  }
  // Changes to field list (metadata rules, ext)

  // Choose the write component

  if (!api_options) { 
    // hack to allow the ACSField renews below to be memoized
    // (due to javascript compare to null weirdness)
    const api_options = {memo_helper:true}
  }

  if (data) {
    return ( <TableRow>
            <RenderACSFieldSet object_type={object_type} id={id} field_list={field_list} data={data} api_options={api_options}/>
            </TableRow>)
    } else {  
        return <div></div>
    }
}

export default ACSFieldSet;