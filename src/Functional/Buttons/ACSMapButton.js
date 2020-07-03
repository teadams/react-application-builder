import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState} from 'react';
import {IconButton} from '@material-ui/core';
import IconEdit from "@material-ui/icons/Edit";
import * as u from '../../Utils/utils.js'
import ACSMappingView from '../Lists/ACSMappingView.js'
import {Auth} from '../../Components/User/index.js';

function ACSMappingButton(props) {
  const {object_type, id, Component, action_props, sections, field_list, dialog_size} = props
  // we do not want to pass data to the map
  const data = ""
  const [create_dialog, setCreateDialog] = useState(false);
  const handleOnClick = event => {
    setCreateDialog(true)
    if (props.onClick) {
      props.onClick(event);
    }
  }
  const handleOnClose= event => {
    setCreateDialog(false)
    if (props.onClose) {
      props.onClose(event)
    }
  }



  const float=props.float?props.float:'none'
 return (
      <Fragment>
      <Auth auth_action="create" object_type={object_type} prompt_login={false}>
        {Component?
        <Component text="here" onClick={handleOnClick}/>
        : <IconButton variant="fab" color="primary"  style={{ display:"inline"}} onClick={handleOnClick}>
        <IconEdit style={{height:15, width:15}}/>
        </IconButton>
        }
        {create_dialog  &&
        <ACSMappingView  object_type={object_type} id={id}  dialog_size={dialog_size} onClose={handleOnClose} {...action_props} trace={true}/> }
      </Auth>
      </Fragment>
      )
}

export default ACSMappingButton;
