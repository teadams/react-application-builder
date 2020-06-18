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
import ACSField from './Functional/ACSField2.js'
import {ContextSelect, AuthToggleLink, AuthContext, AuthContextProvider, Auth} from './Components/User';
import {SelectObject} from './Components/FormsAndViews';
import Body from "./Body"
import Debug from "./Debug.js"
import * as meta from './Utils/meta.js'
import * as u from './Utils/utils.js'

import {Container, AppBar, Toolbar, Typography, Paper, Popover} from '@material-ui/core';
import useGetModel from "./Hooks/useGetModel.js"

function MessageRow(row_props) {
  const {mode, form, field_chunk, data, field, rab_component_model, handleFormChange, handleFormSubmit, formValues, key_id, field_list, s_index, f_index} = row_props
  const {...row_params} = row_props
  return (
    field_list[0][0].map(field_name =>{
      const emphasis = data.read_p?"":"bold"
      return <ACSField field_mode={mode} field_form={false} field_name={field_name} emphasis={emphasis} {...row_params} key={field_name} key_id={field_name}/>
  }))

}

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
        PaperProps={{style:{padding:"20px"}}}
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
    ><div>
        <ACSObjectTypeView data={message_data} field_list={[ "from_user","subject","read_p"]}
        rab_component_model={{row:{components:{row:MessageRow}}}}  object_type="core_message"  api_options={{filter_id:user_id ,filter_join:"and", filter_field:"to_user"}}/>
      </div>
    </Popover>}
    </Fragment>
  )
}

export default MessageIcon;



