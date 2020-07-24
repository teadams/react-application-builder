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
import PopupContext from '../../Template/PopupContext';
import { withStyles } from '@material-ui/core/styles';

function ListMenu(props)  {
  const {selected_menu, menu_type, orientation, ...params} = props
  const history = useHistory({});
  const value = selected_menu
  const context = useContext(AuthContext)
  const popup = useContext(PopupContext)
  // XX This will move to the session cookie
   
  const menu_model =  useGetModel("menus")
  const field_list=
      menu_model.menus[menu_type]?menu_model.menus[menu_type]:
      Object.keys(menu_model.menu_items)

  const ListComponent = ((props) => {
    const {data, field_list} = props
    const [value, setValue] = React.useState(props.value);
    function handleOnClick(event,new_value) {
      window.scrollTo(0,0)
      setValue(new_value)
      let path = `/${new_value}`
      history.push(path);
      popup.setDialogOpen()
      if (props.onChange) {
          props.onChange(new_value)
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
          return (<ListItem value={key} onClick={(event) => handleOnClick(event, key)}>{menu_item.label}</ListItem>)
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