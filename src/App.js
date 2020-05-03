import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, { Component, Fragment} from 'react';
import TabMenu from './RABComponents/TabMenu';
import {Grid} from 'material-ui'
import {CrudTable, Text, GoogleMap} from './Components/Layouts';
import {NavMenuLink} from './Components/Experimental';
import {ContextSelect, AuthToggleLink, AuthContext} from './Components/User';
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
          metadata_loaded:false
      };
      this.handleMenuChange = this.handleMenuChange.bind(this);
  }

  async componentDidMount() {  
    let type_list = ["app_params", "object_types", "fields"]
    let type
    // async.each did not work, setState in the callback hung
    for (type of type_list) {
      const meta_result = await meta.load(type);
    }
    let meta_result
    const default_context_id = meta.get_param("context_default_object")
    this.setState({metadata_loaded:true, context_id:default_context_id})
  }


  handleDrawerOpen = () => {
    this.setState({ drawer_open: true });
  };

  handleDrawerClose = () => {
    this.setState({ drawer_open: false });
  };


  handleMenuChange(selected_menu, menu_type) {
      window.scrollTo(0,0)
      const meta_menu = meta.get_selected_menu(selected_menu, menu_type)
      let path = `/${menu_type}/${selected_menu}`
      this.props.history.push(path);
  }
    
  render() {    
    if (!this.state.metadata_loaded  ||  !this.state.context_id) {
        // componentDidMount will not trigger unless something is returned
        return <Fragment/>
    }

    let { selected_menu, selected_menu_type } = this.props.match.params
    
    const { classes, theme } = this.props;
    const {drawer_open } = this.state;

    const hamburger_menu_p = meta.get_menu("hamburger")?true:false
    const meta_menu = meta.get_selected_menu(selected_menu,selected_menu_type)
  
    return      <Fragment>  
    <AuthContext.Provider
    value={{
       user: this.state.user,
       context_id: this.state.context_id,
       logout: ()=> {this.setState({user:""})},   
       login: (user)=> {
          this.setState({user:user})},    
        setContextId:  (context_id)=> {
         this.setState({context_id:context_id})    
        }
      }}
    >      

     <Paper style={{ padding:10, marginTop:10, marginBottom:0, minHeight:600, position:'relative'}}>
    
     {drawer_open && hamburger_menu_p && 
     <div style={{ position:"absolute"}}>
     <Drawer  variant="permanent" anchor="left" open={true} classes={{paper: classes.drawerPaper}}>

     <div className={classes.drawerHeader}>
         <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeftIcon />
         </IconButton>
     </div>
      <Divider />  
      <TabMenu onChange={this.handleMenuChange} menu_type="hamburger"  orientation="vertical" value={selected_menu} data={meta.get_menu("hamburger")} />
    </Drawer> 
    </div>
    }
    <div  className={classNames( {[classes[`appShift-left`]]: drawer_open})}>

     <AppBar position="sticky">
        <Toolbar style={{minHeight:0}}> 
        <Grid container style={{width:'100%'}}>
        <Grid item sm="11">
        {hamburger_menu_p && 
            <IconButton style={{ marginLeft: -12, marginRight: 20, marginBottom:0, paddingBottom:0}} color="inherit"  onClick={this.handleDrawerOpen}><MenuIcon /></IconButton> 
        }
        <Typography variant="headline" color="inherit" style={{display:'inline-block', marginTop:10, marginBottom:0, marginRight:100}}> 
            {meta.get_param('name')}   
        </Typography>  
        <ContextSelect />
           </Grid>
            <Grid item sm="1">
            <AuthToggleLink></AuthToggleLink>
          </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <TabMenu onChange={this.handleMenuChange} menu_type="app_menu" value={selected_menu} data={meta.get_menu("app_menu")} />
        <Body  selected_menu={selected_menu} selected_menu_type={selected_menu_type} filter_id={filter_id}
        onMenuChange = {this.handleMenuChange}/>
      </div>
     </Paper>
    <Debug/>
    </AuthContext.Provider>
  </Fragment>
  
  }
}

export default withStyles(styles, { withTheme: true })(App);
