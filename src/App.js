import React, { Component, Fragment} from 'react';
import {Grid} from 'material-ui'
import {Header,Footer, MenuBar, CrudTable, Text} from './Components/Layouts';
import {NavMenuLink} from './Components/Experimental';
import * as meta from './Utils/meta.js'
import * as log from './Utils/log.js'
import axios from 'axios';
import {AppBar,Toolbar, Typography, IconButton, Button, Paper, Tabs, Tab, Drawer, Divider,List, Menu, MenuItem, ListItem, ListItemText} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 100;

const styles = theme => ({
  drawerPaper: {
  position: 'relative',
  width: drawerWidth,
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
          selected_menu: 0,
          selected_menu_type: 'app_menu',
          filter_id: "",
          drawer_open: false,

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
//alert('handle menu change' + event.target.value + ' ' + selected_menu)
      
      var menu_type = 'app_menu'
      // Tabs can only send an integer
      // TODO - file up the huge variable list to be an object with options
      // and option can be the menu type
      if ((typeof selected_menu) == "string") {
        const split_menu = selected_menu.split('-');
        menu_type = split_menu[1]?split_menu[1]:'app_menu'
        selected_menu = split_menu[0]
      } 
  //    alert ('menu type is ' + menu_type)
      const meta_menu = meta.get_selected_menu(selected_menu, menu_type)
//alert ('resulting menu' + JSON.stringify(meta_menu))
      log.val("resulting menu", meta_menu)
      var filter_id = ""
    
      if (link_filter_field) {
//alert('in link filter fields')
          if (menu_link_reference_field) {
            log.func("need to navigate to another table", "menu_link_reference_field", menu_link_reference_field)
            var urltext = '/api/v1/reference/' + link_field_object_type + '/'+ menu_link_reference_field + '/' + link_filter_id;            
          } else {

            log.func("Need to get the filter field here","filter field, filter_id, field_object_type", link_filter_field, link_filter_id, link_field_object_type)
              var urltext = '/api/v1/' + link_field_object_type + '/'+ link_filter_id;
          }
          log.val("url text", urltext);
          axios({
           method: 'get',
           url: urltext,
         }).then(results => {
           log.val("results", results.data[0])
           filter_id = results.data[0][link_filter_field]
           log.val("filter id, filter_field", filter_id, link_filter_field)
           this.setState({selected_menu: selected_menu,
                          selected_menu_type: menu_type,
                         filter_id : filter_id?filter_id:""
                       });
         })

      } else {
        log.func("changing menu", "filter_id, meta_menu", link_filter_id, meta_menu)
          // look at the object field in the filter field_ and get the references
          
          if (meta_menu.require_filter_id && !link_filter_id) {
            
            const filter_object_type = meta.field(meta_menu.object_type, meta_menu.filter_field).references
            const filter_key_id = meta.keys(filter_object_type).key_id
            log.val('filter object type, filter key id ', filter_object_type, filter_key_id)
            var urltext = '/api/v1/' + filter_object_type;
            axios({
             method: 'get',
             url: urltext,
           }).then(results => {
             log.val("results", results.data[0])
             filter_id = results.data[0][filter_key_id]
             log.val("filter id, filter_field", filter_id, link_filter_field)
             this.setState({selected_menu: selected_menu,
                          selected_menu_type: menu_type,
                           object_type : meta_menu.object_type,
                           filter_id : filter_id
                         });
           }).catch(error => {
              console.log("error")
           })
    
        } else {
          alert('setting state to selected menu')
          this.setState({selected_menu: selected_menu,
                         selected_menu_type: menu_type,
                        filter_id : link_filter_id?link_filter_id:""
                      });
          }
      }               
  }
    
  render() {    
//    alert('ham menu is ' + JSON.stringify(meta.get_menu("hamburger_menu")));
    const { classes, theme } = this.props;
    const {drawer_open } = this.state;
    const hamburger_menu_p = meta.get_menu("hamburger")?true:false  
    const meta_menu = meta.get_selected_menu(this.state.selected_menu,this.state.selected_menu_type)
    const filter_object_type = meta.field(meta_menu.object_type, meta_menu.filter_field).references

//    alert ('menu ' + JSON.stringify(meta_menu))
    const filter_field = meta.field(meta_menu.object_type, meta_menu.filter_field);
    return <Fragment>
     <Paper style={{ padding:10, marginTop:10, marginBottom:0, height:600, position:'relative'}}>
     {drawer_open && hamburger_menu_p &&
     <div style={{ position:"absolute"}}>
     <Drawer 
      variant="permanent"
      anchor="left" 
      open="true"
      classes={{
       paper: classes.drawerPaper,
     }}>
     <div className={classes.drawerHeader}>
         <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeftIcon />
         </IconButton>
       </div>
       <Divider />

       <List component="nav">
          {meta.get_menu("hamburger").map(menu=> {
            var index =  menu.index + '-hamburger'
          return     <ListItem dense component="div">   <NavMenuLink text={menu.label} index={index} onClick={this.handleMenuChange} /> </ListItem>
          })}
        
        </List>
  
    </Drawer> 
    </div>
    }
    <div  className={classNames( {[classes[`appShift-left`]]: drawer_open})}>
       
     <AppBar position="relative">
        <Toolbar>  
        {hamburger_menu_p &&
        <IconButton style={{ marginLeft: -12, marginRight: 20}} color="inherit"  onClick={this.handleDrawerOpen}>
           <MenuIcon />
        </IconButton> 
        }
          <Typography variant="headline" color="inherit">
            ResRent Interface Tracking
          </Typography>
           <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      <Tabs 
          value={this.props.value}
          onChange={this.handleMenuChange}
          indicatorColor="primary"
          textColor="primary"
          centered
       >
       {meta.get_menu("app_menu").map(menu=> {
          return <Tab key={menu.index} label={menu.label}/>
       })}
        </Tabs>
        <  main  style={{marginLeft:20, marginRight:20}}>
        {meta_menu.component == "Text" &&
          <Text  
            title = {meta_menu.title}
            text = {meta_menu.text}
          />
        }  
        {(!meta_menu.component || meta_menu.component == "CrudTable") &&
        <Grid container>
        <Grid item sm style={{margin:0}}>
         <CrudTable
            object_type={meta_menu.object_type}
            object_attributes={meta.object(meta_menu.object_type)}
            object_fields={meta.fields(meta_menu.object_type)}
            filter_field = {meta_menu.filter_field}
            filter_object_type = {filter_object_type}
            filter_label = {meta_menu.pretty_name}
            filterOnChange = {this.handleMenuChange}
            filter_id = {this.state.filter_id}/>
        </Grid>
        </Grid>
      }
          
        </main>
        <Tabs
          value={0}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Powered by React ACS AppBuilder" />
        </Tabs>
        </div>
     </Paper>
    </Fragment>
  }
}

export default withStyles(styles, { withTheme: true })(App);
//export default App;
