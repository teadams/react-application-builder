import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js'
import * as api from '../Utils/data.js'
import _ from 'lodash/object'
import * as auth from '../Utils/auth.js'

import useGetModel from '../Hooks/useGetModel'
import {AuthContext} from '../Modules/User/index.js';


import React, { Component, Fragment,  useRef, useState, useContext, useEffect} from 'react';
import * as control from "../Utils/control.js"

const ACSMenuController = (props) => { 
  const {menu, id,  ...params} = props
  const menu_models = useGetModel("menus")
  const menu_model = menu_models.menus[menu]
  const context = useContext(AuthContext);
  const {items, ...menu_model_rest} = menu_model
  let item_data = {}


  items.forEach((item,index) => {
    // add authentication, expand based on item
    // expand out items like subsites
    const menu_item = _.merge({},menu_models.menu_items[item])
    if (!menu_item) { alert ("no menu for " + item)}
    const auth_scope = menu_item.auth_scope
    const auth_priv = menu_item.auth_priv

    const authorized = auth.authorized({context_id:context.context_id, user:context.user}, auth_scope, auth_priv)
    if (!authorized) {return}

    menu_item.key = item
    menu_item.index = index
    if (!menu_item.props) {
        menu_item.props = {}
    }
    if (!menu_item.props.api_options) {
        menu_item.props.api_options ={}
    }
    if (!menu_item.props.api_options.filter_field) {
      menu_item.props.api_options.filter_field =[]
    }
    if (!menu_item.props.api_options.filter_id) {
      menu_item.props.api_options.filter_id =[]
    }
    if (menu_item.with_context && context.context_id) { 
      if (menu_item.object_type !== "core_subsite" || !id) {
        menu_item.props.api_options.filter_field.push("core_subsite")
        menu_item.props.api_options.filter_id.push(context.context_id) 
      }  else if (menu_item.object_type === "core_subsite" && id) {
        menu_item.props.api_options.filter_field.push("core_subsite")
        menu_item.props.api_options.filter_id.push(id) 
      }
    }
    if (id) {
      menu_item.id = id
    }
    if (context && context.context_id && menu_item.object_type === "core_subsite" && !menu_item.id && !id) {
        menu_item.id = context.context_id
    }
    if (context && context.user.id && menu_item.object_type === "core_user" && !menu_item.id && !id) {
        menu_item.id = context.user.id
    }

    item_data[item] = menu_item
  })

  // handle change
  
  return (
    <Fragment>
    {React.cloneElement(props.children, {menu_model:menu_model, items:items, item_data:item_data, ...props, ...menu_model_rest })}
    </Fragment>
  )

}

export default ACSMenuController