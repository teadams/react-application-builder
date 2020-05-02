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
  const {data=[], field_name="name", onClick, ...params} = props
  u.a(data)
  return <ACSListController {...params} onClick={{field_wrap:onClick}} data={data}  field_list={field_name}/>
}

export default TabMenu;