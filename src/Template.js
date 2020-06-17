import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { fade, withStyles, makeStyles } from '@material-ui/core/styles';
import React, { Component, Fragment, useState, useContext} from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import TabMenu from './RABComponents/TabMenu';
import MailIcon from '@material-ui/icons/Mail';
import DrawerMenu from './RABComponents/DrawerMenu';
import {Grid} from 'material-ui'
import {CrudTable, Text, GoogleMap} from './Components/Layouts';
import {NavMenuLink} from './Components/Experimental';
import ACSObjectCount from './Functional/Text/ACSObjectCount.js'
import {ContextSelect, AuthToggleLink, AuthContext, AuthContextProvider} from './Components/User';
import {SelectObject} from './Components/FormsAndViews';
import Body from "./Body"
import Debug from "./Debug.js"
import * as meta from './Utils/meta.js'
import * as u from './Utils/utils.js'

import {AppBar,Toolbar, Typography, Paper} from '@material-ui/core';
import useGetModel from "./Hooks/useGetModel.js"

function Template(props) {
  const context = useContext(AuthContext)
  const user_id = context.user.id
  const [message_count, setMessageCount] = useState(0)
  const app_params =  useGetModel("app_params")
  const useStyles = makeStyles((theme) => ({
    grow: {
      flexGrow: 1,
    },
    root: {
      backgroundColor:app_params.colors.template_header,
      minHeight:0
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    context: {
       position: 'relative',
       borderRadius: theme.shape.borderRadius,
       marginRight: theme.spacing(2),
       marginLeft: 0,
       width: '100%',
       [theme.breakpoints.up('sm')]: {
         marginLeft: theme.spacing(3),
         width: 'auto',
       },
     },
     inputRoot: {
        color: 'inherit',
      },
      inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '20ch',
        },
      },
    sectionDesktop: {
       display: 'none',
       alignItems:'center',
       [theme.breakpoints.up('md')]: {
         display: 'flex',
       },
     },
     sectionMobile: {
       display: 'flex',
       [theme.breakpoints.up('md')]: {
         display: 'none',
       },
     },
  }))
  const classes = useStyles();

  let { selected_menu} = props.match.params

  function handleMessageCount(count) {
    setMessageCount(count)
  }
  
  return    ( 
    <div className={classes.grow}>
        {user_id &&<ACSObjectCount api_options={{get_count:true, num_rows:1, filter_id:user_id+","+false, filter_join:"and", filter_field:"to_user,read_p"}} headless={true} object_type="core_message" onData={handleMessageCount}/>}
      <AppBar position="static">
      <Toolbar className={classes.root}>
          <DrawerMenu menu_type="hamburger" selected_menu={selected_menu} />
          <Typography className={classes.title} variant="h6" noWrap>{app_params.name}</Typography>
          <div className={classes.context}>
          <ContextSelect/>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
              <IconButton aria-label="show 4 new mails" color="inherit">
               <Badge badgeContent={message_count} color="secondary">
                    <MailIcon />
               </Badge>
              </IconButton>
              <AuthToggleLink></AuthToggleLink>
              </div>
      </Toolbar>
      </AppBar>
      <TabMenu menu_type="app_menu" selected_menu={selected_menu}  />
      <Body  selected_menu={selected_menu} />
    <Debug/> 
    </div>

  )
}

export default Template;



