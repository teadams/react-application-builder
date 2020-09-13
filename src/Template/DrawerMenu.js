import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {ACSTabMenu} from '../ACSLibrary';
import React, {  Fragment,  useState} from 'react';

import { IconButton, Drawer, Divider} from '@material-ui/core';

const drawerWidth = 150;

const useStyles = makeStyles((theme) => ({
  root: {
    drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    justifyContent: 'flex-start',
    alignItems: 'left',
    height:600
  },
  menuButton: {
     marginRight: theme.spacing(2),
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
}));

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
        <Drawer  variant="temporary" anchor="left" open={true} classes={{paper: classes.root.drawerPaper}}>
           <div className={classes.root.drawerHeader}>
            <IconButton onClick={toggleDrawer}><ChevronLeftIcon/></IconButton>
          </div>
          <Divider />  
          <ACSTabMenu menu_type="hamburger"  orientation="vertical" selected_menu={selected_menu} selected_menu_type={selected_menu_type} 
          onChange={toggleDrawer} prevent_content={true}
          type="drawer"/>
        </Drawer> 
      </div>
    }
    {hamburger_menu_p && 
      <IconButton  edge="start"
           className={classes.menuButton}
           color="inherit"
           aria-label="open drawer" color="inherit"  onClick={toggleDrawer}><MenuIcon /></IconButton> 
    } </Fragment>)
}
export default DrawerMenu;

// <div  className={classNames( {[classes[`appShift-left`]]: drawer_open})}>
//</div>
