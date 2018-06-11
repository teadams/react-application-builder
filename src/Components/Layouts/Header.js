import React, { Component, Fragment} from 'react';
import {AppBar,Toolbar, Typography, IconButton, Button, Paper, Tabs, Tab, Drawer, Divider,List} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import * as meta from '../../Utils/meta.js';
import classNames from 'classnames';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

var styles = theme => ({
  root: {
//    flexGrow: 1,
  },
  appFrame: {
  //height: 70,
    //zIndex: 2,
    //overflow: 'hidden',
    //position: 'relative',
  //  display: 'flex',
  //  width: '100%',
  },
  appBar: {
    //  width: `calc(100% - ${drawerWidth}px)`,
      //  marginLeft: drawerWidth,
      //  position: 'absolute',
//    transition: theme.transitions.create(['margin', 'width'], {
//      easing: theme.transitions.easing.sharp,
//      duration: theme.transitions.duration.leavingScreen,
//    }),
  },
  appBarShift: {
//    transition: theme.transitions.create(['margin', 'width'], {
//      e5asing: theme.transitions.easing.easeOut,
  //    duration: theme.transitions.duration.enteringScreen,
//    }),
  },
  'appBarShift-left': {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
//    position: 'relative',
    padding:10, 
    marginTop:10, 
    marginBottom:0,
    width: 100,
    zIndex: 1,
  },
  drawerHeader: {
      position: 'relative',
    display: 'flex',
    alignItems: 'center',
   justifyContent: 'flex-end',
    padding: '0 8px'
  //  ...theme.mixins.toolbar,
  },
  content: {
//    flexGrow: 1,
    zIndex: 2,
    //width: `calc(100% - ${drawerWidth}px)`,
    //  marginLeft: drawerWidth,
  //  width: '100%',
  //  backgroundColor: theme.palette.background.default,
  ////  transition: theme.transitions.create('margin', {
  //    easing: theme.transitions.easing.sharp,
  //    duration: theme.transitions.duration.leavingScreen,
  //  }),
  },
  contentShift: {
    width: `calc(100% - ${drawerWidth}px)`,
  //  transition: theme.transitions.create('margin', {
  //    easing: theme.transitions.easing.easeOut,
  //    duration: theme.transitions.duration.enteringScreen,
  //  }),
  },
  'contentShift-left': {
     marginLeft: drawerWidth,
  }
});

//styles = ""

class Header extends React.Component {
  state = {
    open: false,
    anchor: 'left',
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value,
    });
  };


   render () {
  const { classes, theme } = this.props;
   return ( 
      <div>
      {this.state.open &&
      <Drawer
       variant="persistent"
       anchor="left"
       open={this.state.open}
         classes={{paper: classes.drawerPaper,}}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerClose}>
             <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List><li>ONE</li></List>
        <Divider />
        <List><li>TWO</li></List>
        </Drawer>        
      }
        <AppBar   position="absolute" className={classNames(classes.appBar, {
              [classes.appBarShift]: this.state.open,
              [classes[`appBarShift-left`]]: this.state.open,
            })}>
           <Toolbar>  
           <IconButton style={{ marginLeft: -12, marginRight: 20}} color="inherit"     onClick={this.handleDrawerOpen}>
              <MenuIcon />
           </IconButton>
             <Typography variant="headline" color="inherit">
               ResRent Interface Tracking
             </Typography>
              <Button color="inherit">Login</Button>
           </Toolbar>
         </AppBar>
         <Tabs  className={classNames(classes.content, {
              [classes.contentShift]: this.state.open,
              [classes[`contentShift-left`]]: this.state.open,
            })}
             value={this.props.value}
             onChange={this.props.onChange}
             indicatorColor="primary"
             textColor="primary"
             centered
          >
          {meta.get_menu("app_menu").map(menu=> {
             return <Tab key={menu.index} label={menu.label}/>
          })}
           </Tabs>
  
     </div>
    )  
  }
}

export default withStyles(styles)(Header); 
//export default Header;
 
 
