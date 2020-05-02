import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import ACSRowController from '../Functional/ACSRowController.js'
import ACSListController from '../Functional/ACSListController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {AppBar,Toolbar, Typography, IconButton, Button, Paper, Tabs, Tab, Drawer, Divider,List, Menu, MenuItem, ListItem, ListItemText} from '@material-ui/core';

// <Tabs 
//     value={(selected_menu_type=="app_menu")?selected_menu:""}
//     onChange={this.handleMenuChange}
//     indicatorColor="primary"
//     textColor="primary"
//     centered
//  >
//  {meta.get_menu("app_menu").map(menu=> {
//    if (auth.authorized({context_id:this.state.context_id, user:this.state.user}, menu.auth_scope, menu.auth_priv)
// ) {
//      return <Tab key={menu.index} label={menu.label}/>
//    } 
//  })}
//   </Tabs>

//const component_name = ""
function TabMenu(props)  {
  const {data=[], field_name="label", onClick, ...params} = props
  
  //     value={(selected_menu_type=="app_menu")?selected_menu:""}
  //     onChange={this.handleMenuChange}

  const TabsComponent = ((props) => {
      return (<Tabs 
       value={1}
       indicatorColor="primary"
       textColor="primary"
       centered
      > 
      {props.children}
    </Tabs>)
  })

  const TabComponent = ((props) => {
    const {data} = props
    return (
      <Tab key={data.index} label={data.label}/>
    )
  })
  const component_name = {list_wrap_body:"Fragment"}
  const component={list_wrap:TabsComponent, row:TabComponent}
  return <ACSListController {...params} component={component} component_name={component_name} data={data}  field_list={field_name}/>
}

export default TabMenu;