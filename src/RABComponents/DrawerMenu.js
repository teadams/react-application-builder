import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import TabMenu from './TabMenu';
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

const drawerWidth = 150;

const useStyles = makeStyles({
  root: {
    drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    justifyContent: 'flex-start',
    alignItems: 'left',
    height:600
  },
  'appShift-left': {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    position:'relative'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px'
  },
}
});

function DrawerMenu(props)  {
  const {selected_menu, selected_menu_type, menu_type, ...params} = props
  const classes = useStyles();
  const [drawer_open, setDrawerOpen] = useState(false)
  const hamburger_menu_p = true
   function toggleDrawer() {
    setDrawerOpen(!drawer_open)
  }
  return (<Fragment>
    {drawer_open && hamburger_menu_p && 
      <div style={{ position:"absolute"}}>
        <Drawer  variant="permanent" anchor="left" open={true} classes={{paper: classes.root.drawerPaper}}>
           <div className={classes.root.drawerHeader}>
            <IconButton onClick={toggleDrawer}><ChevronLeftIcon/></IconButton>
          </div>
          <Divider />  
          <TabMenu menu_type="hamburger"  orientation="vertical" selected_menu={selected_menu} selected_menu_type={selected_menu_type} 
          onChange={toggleDrawer}/>
        </Drawer> 
      </div>
    }
    {hamburger_menu_p && 
      <IconButton style={{ marginLeft: -12, marginRight: 20, marginBottom:0, paddingBottom:0}} color="inherit"  onClick={toggleDrawer}><MenuIcon /></IconButton> 
    } </Fragment>)
}
export default DrawerMenu;

// <div  className={classNames( {[classes[`appShift-left`]]: drawer_open})}>
//</div>
