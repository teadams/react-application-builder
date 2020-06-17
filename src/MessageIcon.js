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

function MessageIcon(props) {
  const context = useContext(AuthContext)
  const user_id = context.user.id
  const [message_count, setMessageCount] = useState(0)

  function handleMessageCount(count) {
    setMessageCount(count)
  }
  
  return    ( 
    <Fragment>
    {user_id && <ACSObjectCount headless={true} object_type="core_message" api_options={{get_count:true, num_rows:1, filter_id:user_id+","+false, filter_join:"and", filter_field:"to_user,read_p"}} onData={handleMessageCount}/> }
    <IconButton aria-label="show new mails" color="inherit">
        <Badge badgeContent={message_count} color="secondary">
            <MailIcon />
        </Badge>
    </IconButton>
    </Fragment>
  )
}

export default MessageIcon;



