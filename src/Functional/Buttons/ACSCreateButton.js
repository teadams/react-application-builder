import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState} from 'react';
import {IconButton} from '@material-ui/core';
import IconCreate from "@material-ui/icons/Add";
import * as log from '../../Utils/log.js'
import ObjectView from '../../RABComponents/ObjectView.js'
function ACSCreateButton(props) {
  const {object_type, Component} = props
  const [create_dialog, setCreateDialog] = useState(false);

  const handleOnClick = event => {
alert("handle con click")
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
      {Component?
       <Component text="here" onClick={handleOnClick}/>
      : <IconButton variant="fab" color="primary"  style={{ display:"inline"}} onClick={handleOnClick}>
      <IconCreate style={{height:15, width:15}}/>
      </IconButton>
      }
      {create_dialog  &&
      <ObjectView object_type={object_type} row_mode="create" row_form="true" onClose={handleOnClose} /> }
      </Fragment>
      )
}

export default ACSCreateButton;
