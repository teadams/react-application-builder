import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, { Component, Fragment, useContext} from 'react';
import * as meta from './Utils/meta.js'
import * as u from './Utils/utils.js'
import * as control from './Utils/control.js'
import useGetModel from "./Hooks/useGetModel.js"
import AuthContext from './Modules/User/AuthContext';

function shieldObject(object) {
  // ensure object exists
  // Clone with a new pointer so that it does not 
  // modify upsteam
  // XX Later expand to be able to do deep shield
  if (!object) {
      return {}
  } else {
      return Object.assign({},object) 
  }

}

function Body(props) {
  const {selected_menu, object_type="",  field_name="", menu_type} = props
  let {id=""} = props
  let {component_name} = props
  const menu_model =  useGetModel("menus")
  const app_params =  useGetModel("app_params")
  const context = useContext(AuthContext)
  if (!selected_menu && !component_name ) {return null}
  let selected_menu_model = ""

  if (selected_menu) {
    selected_menu_model = menu_model.menu_items[selected_menu]
    selected_menu_model.api_options = shieldObject(selected_menu_model.api_options)
    component_name = selected_menu_model.menu_component_name

  }
  let BodyComponent = control.componentByName(component_name)

  if (selected_menu_model && selected_menu_model.with_context) {
    if (selected_menu_model.object_type === "core_user") {
      selected_menu_model.id = context.user.id
    } else if (context.context_id) { 
      selected_menu_model.api_options.filter_field = "core_subsite"
      selected_menu_model.api_options.filter_id = context.context_id
    } 
  }
  if (context && context.context_id && object_type === "core_subsite" && !id) {
      id = context.context_id
  }

  const { ...rest} = selected_menu_model
  // object_type in menu_model will override URL
  return (< BodyComponent object_type={object_type} id={id} field_name={field_name} {...rest}  />)  
}

export default Body
