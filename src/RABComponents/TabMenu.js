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
  const {data=[], field_name="label", onClick, value=props.data[0].key, menu_type,...params} = props
  
  //     value={(selected_menu_type=="app_menu")?selected_menu:""}
  //     onChange={this.handleMenuChange}

  const TabsComponent = ((props) => {
    const [value, setValue] = React.useState(props.value);
  
      function handleOnChange(event,new_value) {
        setValue(new_value)
        if (props.onChange) {
            props.onChange(new_value, menu_type)
        }
      }
      return (<Tabs 
       value={value}
       onChange={handleOnChange}
       indicatorColor="primary"
       textColor="primary"
       variant="scrollable"
       scrollButtons="auto"
       centered
      > 
      {data.map(row => {
        const value=row.key?row.key:row.label.replace(/\s+/g, '')
        return (<Tab value={value} label={row.label}/>)
      })}
    </Tabs>)
  })

  const rab_component_name = {row_wrap:"Fragment", list_wrap:"Fragment", field_wrap:"Fragment", field:"Fragment", row:"Fragment"}
  const rab_component={list_body_wrap:TabsComponent}

  return <ACSListController {...params} rab_component={rab_component} rab_component_name={rab_component_name} data={data} value={value}  field_list={[field_name]}/>
}

export default TabMenu;