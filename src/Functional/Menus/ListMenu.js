import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js'
import * as data from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';
import useGetModel from "../../Hooks/useGetModel.js"
import ACSRowController from '../ACSRowController.js'
import ACSListController from '../ACSListController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {  BrowserRouter as Router,  Switch,   Route,  Link,  Redirect, useHistory } from "react-router-dom";
import * as auth from '../../Utils/auth.js'
import {AppBar,Toolbar, Typography, IconButton, Button, Paper, Tabs, Tab, Drawer, Divider,List, Menu, MenuItem, ListItem, ListItemText} from '@material-ui/core';
import rab_component_models from '../../Models/HealthMe/component.js'
import * as control from '../../Utils/control.js'
import AuthContext from '../../Components/User/AuthContext';
import UIContext from '../../Template/UIContext.js';
import ACSObjectView from '../Rows/ACSObjectView.js'

import { withStyles } from '@material-ui/core/styles';

function ListMenu(props)  {
  const {selected_menu, menu_type, orientation, ...params} = props
  const history = useHistory({});
  const value = selected_menu
  const context = useContext(AuthContext)
  const menu_model =  useGetModel("menus")
  const field_list=
      menu_model.menus[menu_type]?menu_model.menus[menu_type]:
      Object.keys(menu_model.menu_items)
  const dialog = useContext(UIContext).dialog   

  const ListComponent = ((props) => {

    const {data, field_list, launch_dialog=true} = props
    const [value, setValue] = React.useState(props.value);
  
    const _MenuComponent = (props) => {
        let {menu_component_name, with_context, object_type, id, api_options, ...rest} = props
        const Helper = control.componentByName(menu_component_name)
        if (with_context) {
          if (object_type === "core_user") {
              id = context.user.id
          } else if (context.context_id) {
            api_options.filter_field = "core_subsite"
            api_options.filter_id = context.context_id
          } 
        }
        return (
        <Helper form_title="foo" with_context={with_context} object_type={object_type} id={id} api_options={api_options} {...rest}  />)    
    }

    function handleOnClick(event, menu_item) {
      window.scrollTo(0,0)
      let new_value=menu_item.key
      setValue(new_value)
      const MenuComponent = _MenuComponent(menu_item)

      if (!launch_dialog) {
         let path = `/${new_value}`
         history.push(path);
      } else {
          dialog.open("", MenuComponent)
      }
      if (props.onChange) {
        props.onChange(menu_item)
      }
    }

    return (<List
       value={value}
      > 
      {field_list.map(key => {
        const menu_item=data[key]
        if (!menu_item) { alert ("no menu for " +key)}
        const auth_scope = menu_item.auth_scope
        const auth_priv = menu_item.auth_priv
        const authorized = auth.authorized({context_id:context.context_id, user:context.user}, auth_scope, auth_priv)
        if (authorized && menu_item.label) {
          return (<ListItem key={key} value={key} onClick={(event) => handleOnClick(event, menu_item)}>{menu_item.label}</ListItem>)
        }
      })}
    </List>)
  })

  let rab_component_model = rab_component_models.tab 
  rab_component_model.list.components.body_wrap = ListComponent
  rab_component_model.list.props.value = selected_menu
  return <ACSListController  rab_component_model={rab_component_model} list_onChange={props.onChange} field_list={field_list} data={menu_model.menu_items} />
}
export default ListMenu;