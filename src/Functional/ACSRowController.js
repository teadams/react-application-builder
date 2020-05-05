 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import RenderACSRow from './RenderACSRow.js'
import ACSListController from './ACSListController.js'
import useGetObject from '../Hooks/useGetObject';
import React, {Fragment, useState, useEffect} from 'react';
import { TableRow } from '@material-ui/core';

import {functional_components} from "./index.js"

function ACSRowController(props) {
  const {object_type: props_object_type, id: props_id, field_list:props_field_list, api_options:props_api_options, data:props_data, ...params} = props
  const [mode, setMode] = useState("view");

  let [ready, object_type, id, field_list, api_options, data] = 
  useGetObject(props_object_type, props_id, props_field_list, props_api_options, props_data); 

  if (!field_list) {
      if (object_type) {
        field_list = Object.keys(meta.fields(object_type))
      } else {
        field_list = Object.keys(data)
      }
  }


  let object_meta = meta.object[object_type]

  // Changes to field list (metadata rules, ext)

  let RenderACSRow  =  meta.getValueByPrecedence("rab_component.row","",object_meta, props)
  
  let ACSRow = meta.getValueByPrecedence("rab_component.row_wrap","",object_meta, props)

//pattern, default value, args
  let component_name = ""
  if (!RenderACSRow) {
    component_name = meta.getValueByPrecedence("rab_component_name.row","RenderACSRow",object_meta, props)
     RenderACSRow = functional_components[component_name]
  }
  let wrap_name =""
  if (!ACSRow) {
    wrap_name =meta.getValueByPrecedence("rab_component_name.row_wrap","Fragment",object_meta, props)
    ACSRow = functional_components[wrap_name]
  }

  const onClick = meta.getValueByPrecedence("onClick.row",object_meta,props)


  if (data) {
    return ( <Fragment>
        <ACSRow onClick={onClick} data={data} field_list={field_list} api_options={api_options} object_type={object_type} id={id}>
          <RenderACSRow {...params} object_type={object_type} id={id} field_list={field_list} data={data} api_options={api_options}>
          </RenderACSRow>
          {data.children && data.children.length >0 &&
              <ACSListController {...params} object_type={object_type} api_options={api_options} data={data.children}  field_list={field_list}/>}
        </ACSRow> 
        </Fragment>)
    } else {  
        return <div></div>
    }
}

export default ACSRowController;