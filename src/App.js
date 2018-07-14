import React, { Component, Fragment} from 'react';
import {Grid} from 'material-ui'
import {Header,Footer, MenuBar, CrudTable, Text} from './Components/Layouts';
import {NavMenuLink, DrillDown} from './Components/Experimental';
import {ResourceSchedule} from './Components'
import * as meta from './Utils/meta.js'
import * as log from './Utils/log.js'
import axios from 'axios';
import {AppBar,Toolbar, Typography, IconButton, Button, Paper, Tabs, Tab, Drawer, Divider,List, Menu, MenuItem, ListItem, ListItemText} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

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
    //  alert ("handle menu change " + selected_menu
      window.scrollTo(0,0)
      let menu_type = 'app_menu'
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
         // link_filter_id is the id field.  Based on this, retrieve another field
            //let urltext ='api/v1/system_groups'
            let urltext = '/api/v1/' + link_field_object_type + '/'+ link_filter_id;
          axios({
           method: 'get',
           url: urltext,
         }).then(results => {
           filter_id = results.data[link_filter_field]
           //alert ("filter id  after query is " + filter_id)
           this.setState({selected_menu: selected_menu,
                          selected_menu_type: menu_type,
                          filter_id : filter_id
                       }, () => {this.handleDrawerClose()});
         })

      } else {

          this.setState({selected_menu: selected_menu,
                         selected_menu_type: menu_type,
                        filter_id : filter_id
                      }, ()=> {
                        this.handleDrawerClose();               
                      });
      }
  }
    
  render() {    
//    alert('ham menu is ' + JSON.stringify(meta.get_menu("hamburger_menu")));
    const { classes, theme } = this.props;
    const {drawer_open } = this.state;
    const hamburger_menu_p = meta.get_menu("hamburger")?true:false  
    const meta_menu = meta.get_selected_menu(this.state.selected_menu,this.state.selected_menu_type)
    const filter_field = meta_menu.object_type?meta.field(meta_menu.object_type, meta_menu.filter_field):""
    const filter_object_type = filter_field.references
     //alert ('fitler required is ' + JSON.stringify(meta_menu))
    //alert ("redner filter id is S" + this.state.filter_id)
    return <Fragment>
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
           <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      <Tabs 
          value={this.state.selected_menu}
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

        {meta_menu.component == "DrillDown" &&
          <DrillDown  
            object_type = {meta_menu.object_type}
            grouping_field_name = {meta_menu.grouping_field_name}
            create_form_sections = {meta_menu.create_form_sections}
            expand_contract = {meta_menu.expand_contract}
            manage_object_types = {meta_menu.manage_object_types}
            onMenuChange = {this.handleMenuChange}
            selected_id = {this.state.filter_id}
          />
        }  

        {meta_menu.component == "ResourceSchedule" &&
          <ResourceSchedule
            resource_object = {meta_menu.resource_object}
          />
        }  
        {this.state.selected_menu !== undefined && (!meta_menu.component || meta_menu.component == "CrudTable") &&
        <Grid container>
        <Grid item sm style={{margin:0}}>
         <CrudTable
            object_type={meta_menu.object_type}
            object_attributes={meta.object(meta_menu.object_type)}
            object_fields={meta.fields(meta_menu.object_type)}
            filter_field = {meta_menu.filter_field}
            filter_required = {meta_menu.filter_required}
            filter_object_type = {filter_object_type}
            filter_label = {meta_menu.pretty_name}
            onMenuChange = {this.handleMenuChange}
            filter_id = {this.state.filter_id}
              />
        </Grid>
        </Grid>
      }
          
        </main>
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
    </Fragment>
  }
}

export default withStyles(styles, { withTheme: true })(App);
//export default App;
