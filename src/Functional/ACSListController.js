import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as u from '../Utils/utils.js';
import useGetModel from "../Hooks/useGetModel.js"
import useGetObjectList from '../Hooks/useGetObjectList';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import AuthContext from '../Components/User/AuthContext';
import {AppBar,Toolbar, Typography, IconButton, Button, Paper, Tabs, Tab, Drawer, Divider,List, Menu, MenuItem, ListItem, ListItemText} from '@material-ui/core';

import {functional_components} from "./index.js"

function ACSListController(props) {

  const {field_tag, object_type:props_object_type, api_options:props_api_options={}, field_list="", ...params } = props
  const context = useContext(AuthContext)
  const object_types =  useGetModel("object_types")

  let prepared_api_options = Object.assign({field_tag:field_tag}, props_api_options);

  let [object_type, api_options, data] = useGetObjectList(props.object_type, prepared_api_options, props.data); 

  let object_meta = meta.object[object_type]

  let RenderACSList  =  meta.getValueByPrecedence("rab_component.list","",object_meta, props)
  let ACSList = meta.getValueByPrecedence("rab_component.list_wrap","",object_meta, props)
  let ACSListBody = meta.getValueByPrecedence("rab_component.list_body_wrap","",object_meta, props)

  let component_name = ""
  if (!RenderACSList) {
    component_name = meta.getValueByPrecedence("rab_component_name.list","RenderACSList",object_meta, props)
     RenderACSList = functional_components[component_name]

  }
  let wrap_name =""
  if (!ACSList) {
    wrap_name =meta.getValueByPrecedence("rab_component_name.list_wrap","Fragment",object_meta, props)
    ACSList = functional_components[wrap_name]
  }

  let wrap_name_body =""
  if (!ACSListBody) {
    wrap_name_body =meta.getValueByPrecedence("rab_component_name.list_body_wrap","Fragment",object_meta, props)
    ACSListBody = functional_components[wrap_name_body]
  }

  const onClick = meta.getValueByPrecedence("onClick.list",object_meta,props)

  if (data) {
    return  (<ACSList>
              <ACSListBody {...params}  object_type={object_type} field_list={field_list}  data={data} api_options={api_options} onClick={onClick}>
                <RenderACSList {...params} object_type={object_type} field_list={field_list}  data={data} api_options={api_options} />
              </ACSListBody>
            </ACSList>)
    } else {
        // prevents dom changes
        return <div></div>
    
  }
  
}

export default ACSListController;