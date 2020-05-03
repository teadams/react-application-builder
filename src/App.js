import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, { Component, Fragment} from 'react';
import TabMenu from './RABComponents/TabMenu';
import DrawerMenu from './RABComponents/DrawerMenu';
import {Grid} from 'material-ui'
import {CrudTable, Text, GoogleMap} from './Components/Layouts';
import {NavMenuLink} from './Components/Experimental';
import {ContextSelect, AuthToggleLink, AuthContext, AuthContextProvider} from './Components/User';
import {SelectObject} from './Components/FormsAndViews';
import Body from "./Body"
import Debug from "./Debug.js"
import * as meta from './Utils/meta.js'
import * as log from './Utils/log.js'
import * as auth from './Utils/auth.js'
import axios from 'axios';
import {AppBar,Toolbar, Typography, IconButton, Button, Paper, Tabs, Tab, Drawer, Divider,List, Menu, MenuItem, ListItem, ListItemText} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {  BrowserRouter as Router,  Switch,  Route,  Link,  Redirect, useHistory } from "react-router-dom";
var async = require('async');

const drawerWidth = 150;

const styles = theme => ({
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
  padding: '0 8px',
  ...theme.mixins.toolbar,
},
});

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
          drawer_open: false,
          context: {},
          user: "",
          context_id: "",
      };
  }

    
  render() {    
    let { selected_menu, selected_menu_type } = this.props.match.params
    const { classes, theme } = this.props;
    const {drawer_open } = this.state;
    const hamburger_menu_p = true
    return      (<AuthContextProvider>  
    <Paper style={{ padding:10, marginTop:10, marginBottom:0, minHeight:600, position:'relative'}}>
    
  <AppBar position="sticky">
    <Toolbar style={{minHeight:0}}> 
      <Grid container style={{width:'100%'}}>
        <Grid item sm="11"> 
          <DrawerMenu menu_type="hamburger" selected_menu={selected_menu} selected_menu_type={selected_menu_type} />
          <Typography variant="headline" color="inherit" style={{display:'inline-block', marginTop:10, marginBottom:0, marginRight:100}}>  {meta.get_param('name')} </Typography>  
          <ContextSelect />
        </Grid>
        <Grid item sm="1">
          <AuthToggleLink></AuthToggleLink>
        </Grid>
      </Grid>
    </Toolbar>
  </AppBar>
  <TabMenu menu_type="app_menu" selected_menu={selected_menu} selected_menu_type={selected_menu_type} />

  <Body selected_menu_type={selected_menu_type} selected_menu={selected_menu} />

</Paper>
<Debug/>
  </AuthContextProvider>)
  
  }
}


export default withStyles(styles, { withTheme: true })(App);



