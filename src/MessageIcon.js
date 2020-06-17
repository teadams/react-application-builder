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
import ACSObjectTypeView from './Functional/Lists/ACSObjectTypeView.js'
import {ContextSelect, AuthToggleLink, AuthContext, AuthContextProvider, Auth} from './Components/User';
import {SelectObject} from './Components/FormsAndViews';
import Body from "./Body"
import Debug from "./Debug.js"
import * as meta from './Utils/meta.js'
import * as u from './Utils/utils.js'

import {Container, AppBar, Toolbar, Typography, Paper, Popover} from '@material-ui/core';
import useGetModel from "./Hooks/useGetModel.js"

function MessageIcon(props) {
  const context = useContext(AuthContext)
  const user_id = context.user.id
  const [message_count, setMessageCount] = useState(0)

  const [anchorEl, setAnchorEl] = useState(null);
  const [message_data, setMessageData] = useState(null);

  function handleMessageCount(count) {
    setMessageCount(count)
  }

  function handleMessageData(message_data) {
u.a(message_data)
    setMessageData(message_data)
  }


  const handleClick = (event) => {
     setAnchorEl(event.currentTarget);
   };
 
   const handleClose = () => {
     setAnchorEl(null);
   };
  
   const open = Boolean(anchorEl);
   const id = open ? 'simple-popover' : undefined;

  return    ( 
    <Fragment>
    {user_id && <ACSObjectCount headless={true} object_type="core_message" api_options={{get_count:true, num_rows:1, filter_id:user_id+","+false, filter_join:"and", filter_field:"to_user,read_p"}} onData={handleMessageCount}/> }
    <IconButton aria-label="show new mails" color="inherit" onClick={handleClick}>
        <Badge badgeContent={message_count} color="secondary">
            <MailIcon />
        </Badge>
    </IconButton>
    {open &&<Auth object_type="core_message"/>}
    {user_id && open && 
        <ACSObjectTypeView onData={handleMessageData} headless={true} object_type="core_message"  api_options={{filter_id:user_id ,filter_join:"and", filter_field:"to_user"}}/>}
    {user_id && open && message_data &&
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    ><div style={{width:'100%'}}>
        <ACSObjectTypeView data={message_data} object_type="core_message"  api_options={{filter_id:user_id ,filter_join:"and", filter_field:"to_user"}}/>}
</div>
    </Popover>}
    </Fragment>
  )
}

export default MessageIcon;



