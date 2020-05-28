import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import React, { Component, Fragment} from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import TabMenu from './RABComponents/TabMenu';
import MailIcon from '@material-ui/icons/Mail';
import DrawerMenu from './RABComponents/DrawerMenu';
import {Grid} from 'material-ui'
import {CrudTable, Text, GoogleMap} from './Components/Layouts';
import {NavMenuLink} from './Components/Experimental';
import {ContextSelect, AuthToggleLink, AuthContext, AuthContextProvider} from './Components/User';
import {SelectObject} from './Components/FormsAndViews';
import Body from "./Body"
import Debug from "./Debug.js"
import * as meta from './Utils/meta.js'
import * as u from './Utils/utils.js'

import {AppBar,Toolbar, Typography, Paper} from '@material-ui/core';
import useGetModel from "./Hooks/useGetModel.js"

function Template(props) {
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
    sectionDesktop: {
       display: 'none',
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
  return    ( 
    <Fragment>
    <div className={classes.grow}>
      <AppBar position="static">
      <Toolbar className={classes.root}>
          <DrawerMenu menu_type="hamburger" selected_menu={selected_menu} />
          <Typography className={classes.title} variant="h6" noWrap>{app_params.name}</Typography>
          <ContextSelect />
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
              <IconButton aria-label="show 4 new mails" color="inherit">
               <Badge badgeContent={4} color="secondary">
                    <MailIcon />
               </Badge>
              </IconButton>
              <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick=""
                  color="inherit"
                >
                  xxx
                </IconButton>
              </div>
      </Toolbar>
      </AppBar>
    </div>
      <Paper style={{ padding:10, marginTop:10, marginBottom:0, minHeight:600, position:'relative'}}>     
        <AppBar position="sticky">
          <Toolbar style={{minHeight:0}}> 
          <Grid container style={{width:'100%'}}>
            <Grid item sm={11}> 
              <DrawerMenu menu_type="hamburger" selected_menu={selected_menu} />
              <Typography variant="subtitle1" color="inherit" style={{display:'inline-block', marginTop:10, marginBottom:0, marginRight:100}}> {app_params.name} </Typography>  
            </Grid>
            <Grid item sm={1}>
              <AuthToggleLink></AuthToggleLink>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <TabMenu menu_type="app_menu" selected_menu={selected_menu}  />
      <Body  selected_menu={selected_menu} />
    </Paper>
    <Debug/> </Fragment>
  )
}

export default Template;



