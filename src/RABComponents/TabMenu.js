import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import useGetModel from "../Hooks/useGetModel.js"
import ACSRowController from '../Functional/ACSRowController.js'
import ACSListController from '../Functional/ACSListController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {  BrowserRouter as Router,  Switch,  Route,  Link,  Redirect, useHistory } from "react-router-dom";

import {AppBar,Toolbar, Typography, IconButton, Button, Paper, Tabs, Tab, Drawer, Divider,List, Menu, MenuItem, ListItem, ListItemText} from '@material-ui/core';

function TabMenu(props)  {
  const {selected_menu, selected_menu_type, menu_type, orientation, ...params} = props
  const history = useHistory({});
  const value = (menu_type==selected_menu_type)?selected_menu:""
  let menu_model =  useGetModel("menu")
  if (!menu_model) {return null}
  menu_model = menu_model[selected_menu_type]

  const TabsComponent = ((props) => {
    const {data} = props
    const [value, setValue] = React.useState(props.value);

    function handleOnChange(event,new_value) {
      window.scrollTo(0,0)
      setValue(new_value)
      let path = `/${menu_type}/${new_value}`
      history.push(path);
      if (props.onChange) {
          props.onChange(new_value, menu_type)
      }
    }
    return (<Tabs 
       value={value}
       orientation={orientation}
       onChange={handleOnChange}
       indicatorColor="primary"
       textColor="primary"
       variant="scrollable"
       scrollButtons="auto"
       centered
      > 
      {Object.keys(data).map(key => {
        const menu_item=data[key]
        return (<Tab value={key} label={menu_item.label}/>)
      })}
    </Tabs>)
  })


  const rab_component_name = {row_wrap:"Fragment", list_wrap:"Fragment", field_wrap:"Fragment", field:"Fragment", row:"Fragment"}
  const rab_component={list_body_wrap:TabsComponent}
  
  return <ACSListController  rab_component={rab_component} rab_component_name={rab_component_name} data={menu_model} value={value}/>
}

export default TabMenu;