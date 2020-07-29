import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { fade, withStyles, makeStyles } from '@material-ui/core/styles';
import React, { Component, Fragment, useState, useContext} from 'react';
import Auth from "./Modules/User/Auth.js"
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import TabMenu from './RABComponents/TabMenu';
import MailIcon from '@material-ui/icons/Mail';
import DrawerMenu from './RABComponents/DrawerMenu';
import {Grid} from 'material-ui'
import ACSObjectCount from './Functional/Text/ACSObjectCount.js'
import {ContextSelect, AuthToggleLink, AuthContext, AuthContextProvider} from './Modules/User';
import Body from "./Body"
import MessageIcon from "./MessageIcon.js"
import Debug from "./Debug.js"
import * as meta from './Utils/meta.js'
import * as u from './Utils/utils.js'

import {AppBar,Toolbar, Typography, Paper} from '@material-ui/core';
import useGetModel from "./Hooks/useGetModel.js"

function Template(props) {

  const app_params =  useGetModel("app_params")
  const menu_model = useGetModel("menus")
  const context = useContext(AuthContext)

  const useStyles = makeStyles((theme) => ({
    grow: {
      flexGrow: 1,
      height:'100%'
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


  let { selected_menu, object_type, id, menu_type, field_name } = props.match.params
  if (!selected_menu) {
    selected_menu =  menu_model.menus.app_menu[0]
  }


  return    ( 
    <div id="tall" className={classes.grow}>
      <AppBar position="static">
      <Toolbar className={classes.root}>
          <Auth auth_scope="site" auth_priv="admin" prompt_login={false}>
            <DrawerMenu menu_type="hamburger" selected_menu={selected_menu} />
          </Auth>
          <Typography className={classes.title} variant="h6" noWrap>{app_params.name}</Typography>
          <div className={classes.context}>
          <Auth auth_scope="site" auth_priv="admin" prompt_login={false}>
            <ContextSelect/>
          </Auth>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
              <MessageIcon/>
              <AuthToggleLink></AuthToggleLink>
              </div>
      </Toolbar>
      </AppBar>
      <TabMenu menu_type="app_menu" selected_menu={selected_menu} object_type={object_type} id={id} />
      <Body  selected_menu={selected_menu} object_type={object_type} id={id} field_name={field_name} menu_type={menu_type} />
    <Debug/> 
    </div>

  )
}

export default Template;



