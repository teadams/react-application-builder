import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as data from './Utils/data.js';
import * as meta from './Utils/meta.js';
import * as utils from './Utils/utils.js';

import React, { Component, Fragment, useState, useContext, useEffect} from 'react';
import {AuthContext} from './Components/User';
import {Container, Box, Grid, Typography, TableContainer, Table, TableBody, TableRow, TableCell} from '@material-ui/core';

const container_style = { 
  padding:20,
  backgroundColor:"lightGray",
  borderColor:"darkGray",
  borderWidth:"thick",
  borderStyle:"solid",
  display:"block"
}
const title_style = {
  color:"red"
}
const grid_item_style = {
  padding:10
}

function UserInfo () {
    const context = useContext(AuthContext)
    const user_logged_id = context.user && context.user.id?true:false
    if (user_logged_id)  {
        return context.user.first_name + " " + context.user.last_name
   } else {
      return "Not logged in"
  }
}

function UserSiteAdmin () {
    const context = useContext(AuthContext)
    const user_logged_id = context.user && context.user.id?true:false
    if (user_logged_id)  {
        return context.user.site_admin?"True":"False"
   } else {
      return "Not logged in"
  }
}

function Context () {
  const [subsite_data, setSubsiteData] = useState({});
  const context = useContext(AuthContext)
  useEffect(() => {
      data.getData ("core_subsite", {id:context.context_id}, (results, error) => { 
          if (!error) {
              setSubsiteData(results)
          }
      })
}, [context.context_id]);
  const message = `${context.context_id}  ${subsite_data.name?` - ${subsite_data.name}`:""}`
  return <Typography variant="h1">{message}</Typography>
}

function UserSubsiteAuthRoles () {
    const context = useContext(AuthContext)
    const subsite_id = context.context_id
    if (context.user && context.user.authorization_object && context.user.authorization_object[subsite_id] ) {
      return JSON.stringify(context.user.authorization_object[subsite_id].Roles)
    } else {
      return ""
    }
}

function UserSubsiteAuthPriv () {
  const context = useContext(AuthContext)
  const subsite_id = context.context_id
  if (context.user && context.user.authorization_object && context.user.authorization_object[subsite_id] ) {
    return JSON.stringify(context.user.authorization_object[subsite_id].Privileges)
  } else {
    return ""
  }
}

function Debug(props) {
  const context = useContext(AuthContext)

  const show_debug = meta.get_param("client_debug_component")
  if (show_debug) {
    return (
        <Container maxWidth="sm" style={container_style}>
        <Typography variant="h5" style={title_style}>Debug Information</Typography>
        <TableContainer>
          <Table>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell><UserInfo/></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Site Administrator</TableCell>
              <TableCell><UserSiteAdmin/></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Subsite</TableCell>
              <TableCell><Context/></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Subsite Roles</TableCell>
              <TableCell><UserSubsiteAuthRoles/></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Subsite Privileges</TableCell>
              <TableCell><UserSubsiteAuthPriv/></TableCell>
            </TableRow>
            <TableRow>
            <TableCell>All Access </TableCell>
            <TableCell>{JSON.stringify(context.user.authorization_object)}</TableCell>
          </TableRow>
          </Table>
        </TableContainer>
        </Container>
    )
  } else {
    return null
  }
}

//Body.contextType = AuthContext;
export default Debug

