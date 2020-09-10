import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js'
import * as api from '../Utils/data.js'
import _ from 'lodash/object'
import useGetModel from '../Hooks/useGetModel'
import {AuthContext} from '../Modules/User/index.js';


import React, { Component, Fragment,  useRef, useState, useContext, useEffect} from 'react';
import * as control from "../Utils/control.js"

const ACSMenuController = (props) => { 
  const {menu,  ...params} = props
  const menu_models = useGetModel("menus")
  const menu_model = menu_models.menus[menu]
  const context = useContext(AuthContext);
  const {items, ...menu_model_rest} = menu_model
  let item_data = {}


  items.forEach((item,index) => {
    // add authentication, expand based on item
    // expand out items like subsites
    item_data[item] = menu_models.menu_items[item]
    item_data[item].key = item
    item_data[item].index = index
    if (!item_data[item].props) {
        item_data[item].props = {}
    }
    if (!item_data[item].props.api_options) {
        item_data[item].props.api_options ={}
    }
    if (!item_data[item].props.api_options.filter_field) {
      item_data[item].props.api_options.filter_field =[]
    }
    if (!item_data[item].props.api_options.filter_id) {
      item_data[item].props.api_options.filter_id =[]
    }

    if (item_data[item].with_context && context.context_id) { 
        item_data[item].props.api_options.filter_field.push("core_subsite")
        item_data[item].props.api_options.filter_id.push(context.context_id) 
    }
    if (context && context.context_id && item_data[item].object_type === "core_subsite" && !item_data[item].id) {
        item_data[item].id = context.context_id
    }
  
    if (context && context.user.id && item_data[item].object_type === "core_user" && !item_data[item].id) {
        item_data[item].id = context.user.id
    }
  })

  // handle change
  
  return (
    <Fragment>
    {React.cloneElement(props.children, {menu_model:menu_model, items:items, item_data:item_data, ...props, ...menu_model_rest })}
    </Fragment>
  )

}

export default ACSMenuController