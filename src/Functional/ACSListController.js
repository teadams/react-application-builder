import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as u from '../Utils/utils.js';
import * as control from "../Utils/control.js"
import useGetModel from "../Hooks/useGetModel.js"
import useGetObjectList from '../Hooks/useGetObjectList';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import AuthContext from '../Components/User/AuthContext';
import {AppBar,Toolbar, Typography, IconButton, Button, Paper, Tabs, Tab, Drawer, Divider,List, Menu, MenuItem, ListItem, ListItemText} from '@material-ui/core';
import _ from 'lodash/object';
import {functional_components} from "./index.js"
import rab_component_models from '../Models/HealthMe/component.js'

function ACSListController(input_props) {
  const context = useContext(AuthContext)
  const object_types =  useGetModel("object_types")
  // do not merge expensive, known unnecessary things
  const {data:input_props_data, target_menu_name, ...merging_props} = input_props

  const rab_component_model = control.getFinalModel("list", {...merging_props}, rab_component_models.list )
  const list_model = rab_component_model.list
  const list_components = list_model.components
  const massaged_props = list_model.props

  const {body_wrap} = list_model.components
  // .. params will not be passed down
  const {object_type:props_object_type, api_options:props_api_options={}, field_list="", field_tag} = massaged_props

  // important to use input_props.data as it is an array and useGetObjectList
  // see changes to an array's reference as a change
  let [object_type, api_options, data] = useGetObjectList(massaged_props.object_type, massaged_props.api_options, input_props.data); 


  const object_meta = meta.object[object_type]

  const RenderACSList  =  list_components.list
  const ACSList = list_components.list_wrap
  const ACSListBody = list_components.list_body_wrap

  if (data) {
    return  (<ACSList>
              <ACSListBody object_type={object_type} field_list={field_list}  data={data} api_options={api_options}  rab_component_model={rab_component_model}>
                <RenderACSList  object_type={object_type} field_list={field_list}  data={data} api_options={api_options} rab_component_model={rab_component_model} />
              </ACSListBody>
            </ACSList>)
    } else {
        // prevents dom changes
        return <div></div>
    
  }
  
}

export default ACSListController;