import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js'
import * as api from '../Utils/data.js'
import _ from 'lodash/object'
import useGetModel from '../Hooks/useGetModel


import React, { Component, Fragment,  useRef, useState, useContext, useEffect} from 'react';
import * as control from "../Utils/control.js"

function ACSMenuController(props) { 
  const {menu,  ...params} = props
  const menu_models = useGetModel("menus")
  const menu_model = menu_models.menus[menu]
  const {items, ...menu_model_rest} = menu_model
  let item_data = {}
  items.forEach((item,index) => {
    // add authentication, expand based on item
    // expand out items like subsites
    item_data[item] = menu_models.menu_items[item]
    item_data[item].key = item
    item_data[item].index = index
  })

  // handle change

  
  return (
    <Fragment>
    {React.cloneElement(props.children, {menu_model:menu_model, items:items, item_data:item_data, ...props, ...menu_model_rest })}
    </Fragment>
  )

}

export default ACSMenuController