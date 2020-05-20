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
import {AppBar,Toolbar, Typography, Paper} from '@material-ui/core';
import useGetModel from "./Hooks/useGetModel.js"

function App(props) {
  const app_params =  useGetModel("app_params")
  if (!app_params) return(null)

  let { selected_menu} = props.match.params
  return      (
    <AuthContextProvider>  
      <Paper style={{ padding:10, marginTop:10, marginBottom:0, minHeight:600, position:'relative'}}>     
        <AppBar position="sticky">
          <Toolbar style={{minHeight:0}}> 
          <Grid container style={{width:'100%'}}>
            <Grid item sm={11}> 
              <DrawerMenu menu_type="hamburger" selected_menu={selected_menu} />
              <Typography variant="headline" color="inherit" style={{display:'inline-block', marginTop:10, marginBottom:0, marginRight:100}}> {app_params.name} </Typography>  
              <ContextSelect />
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
    <Debug/>
  </AuthContextProvider>
  )
}

export default App;



