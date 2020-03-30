import React, { Component, Fragment} from 'react';
import {Grid} from 'material-ui'
import {CrudTable, Text, GoogleMap} from './Components/Layouts';
import {NavMenuLink, DrillDown} from './Components/Experimental';
import {AuthToggleLink, AuthContext, AuthProvider} from './Components/User';
import {ProjectView, Volunteer, ProjectMessages} from './Components/NowWeAct';
import Body from "./Body"
import * as meta from './Utils/meta.js'
import * as log from './Utils/log.js'
import axios from 'axios';
import {AppBar,Toolbar, Typography, IconButton, Button, Paper, Tabs, Tab, Drawer, Divider,List, Menu, MenuItem, ListItem, ListItemText} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {  BrowserRouter as Router,  Switch,  Route,  Link,  Redirect, useHistory } from "react-router-dom";


//const MyContext = React.createContext("creation");
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
      log.func(' Menu constructor');
      this.state = {
          drawer_open: false,
          context: "GGGGGG"
      }
      this.handleMenuChange = this.handleMenuChange.bind(this);
  }

  handleDrawerOpen = () => {
    this.setState({ drawer_open: true });
  };

  handleDrawerClose = () => {
    this.setState({ drawer_open: false });
  };


  handleMenuChange(event, selected_menu, link_filter_id, link_filter_field, link_field_object_type, menu_link_reference_field) {
    //  alert ("handle menu change " + selected_menu
      window.scrollTo(0,0)
      let menu_type = 'app_menu'
      //alert ('handle menu change')
      // Tabs can only send an integer
      // TODO - file up the huge variable list to be an object with options
      // and option can be the menu type
      //alert ("selectced menu is " + JSON.stringify(selected_menu))
      if ((typeof selected_menu) == "string") {
        //alert ("type is string")
        const split_menu = selected_menu.split('-');
        menu_type = split_menu[1]?split_menu[1]:'app_menu'
        selected_menu = split_menu[0]
      } 

      const meta_menu = meta.get_selected_menu(selected_menu, menu_type)
      let filter_id = link_filter_id
        //alert ("selected menu and type is " + selected_menu + " " + menu_type)
  //    alert ('fitler id ' + filter_id  + ' filter field  ' + link_filter_field)
      if (link_filter_field) {
        // this is a more complex case that was used for the interface tracking project
        // consider removing
         // link_filter_id is the id field.  Based on this, retrieve another field
            //let urltext ='api/v1/system_groups'
            let urltext = '/api/v1/' + link_field_object_type + '/'+ link_filter_id;
          axios({
           method: 'get',
           url: urltext,
         }).then(results => {
           filter_id = results.data[link_filter_field]
            let path = `/${menu_type}/${selected_menu}/${filter_id}`
           //alert ("filter id  after query is " + filter_id)
            this.handleDrawerClose();
            this.props.history.push(path);  
         })

      } else {
          let path = `/${menu_type}/${selected_menu}`
          if (filter_id) {
              path = path + '/${filter_id}'
          }

          this.handleDrawerClose();   
          this.props.history.push(path);                    
      }
  }
    
  render() {    
    let { selected_menu, filter_id, selected_menu_type } = this.props.match.params
    const { classes, theme } = this.props;
    const {drawer_open } = this.state;
    const hamburger_menu_p = meta.get_menu("hamburger")?true:false  
    const meta_menu = meta.get_selected_menu(selected_menu,selected_menu_type)
    const filter_field = meta_menu.object_type?meta.field(meta_menu.object_type, meta_menu.filter_field):""
    const filter_object_type = filter_field.references


    return      <Fragment>  <AuthProvider> 
     <Paper style={{ padding:10, marginTop:10, marginBottom:0, minHeight:600, position:'relative'}}>
    
     {drawer_open && hamburger_menu_p && 
     <div style={{ position:"absolute"}}>
     <Drawer 
      variant="permanent"
      anchor="left" 
      open={true}
      classes={{
       paper: classes.drawerPaper,
     }}>
     <div className={classes.drawerHeader}>
         <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeftIcon />
         </IconButton>
       </div>
       <Divider />

       <List  component="nav">
          {meta.get_menu("hamburger").map(menu=> {
            var index =  menu.index + '-hamburger'
          
          return     <ListItem key={menu.index} style={{padding:0}} dense disableGutters component="div">   <NavMenuLink text={menu.label} index={index} onClick={this.handleMenuChange} /> </ListItem>
          })}
        
        </List>
  
    </Drawer> 
    </div>
    }
    <div  className={classNames( {[classes[`appShift-left`]]: drawer_open})}>

     <AppBar position="sticky">
        <Toolbar>  
        {hamburger_menu_p &&
        <IconButton style={{ marginLeft: -12, marginRight: 20}} color="inherit"  onClick={this.handleDrawerOpen}>
           <MenuIcon />
        </IconButton> 
        }
          <Typography variant="headline" color="inherit"> 
            {meta.get_param('name')} 
          </Typography>  
           <AuthToggleLink></AuthToggleLink>
        </Toolbar>
      </AppBar>

      <Tabs 
          value={(selected_menu_type=="app_menu")?selected_menu:""}
          onChange={this.handleMenuChange}
          indicatorColor="primary"
          textColor="primary"
          centered
       >
       {meta.get_menu("app_menu").map(menu=> {
          return <Tab key={menu.index} label={menu.label}/>
       })}
        </Tabs>
        <Body selected_menu={selected_menu} selected_menu_type={selected_menu_type} filter_id={filter_id}/>
        </div>
     </Paper>
     <Tabs
       value={0}
       indicatorColor="primary"
       textColor="primary"
       centered
     >
       <Tab label={meta.get_param('footer')} />
     </Tabs>
    </AuthProvider></Fragment>
  
  }
}


export default withStyles(styles, { withTheme: true })(App);
//export default App;
