import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from 'react';
import {IconButton} from '@material-ui/core';
import IconCreate from "@material-ui/icons/Add";
import * as log from '../../Utils/log.js'

function ACSCreateButton(props) {

  const handleOnClick = event => {
    alert("CLICKED")
    if (props.onClick) {
      props.onClick(event);
    }
  }
  const float=props.float?props.float:'none'

 return (
      <IconButton variant="fab" color="primary"  style={{ display:"inline"}} onClick={handleOnClick}>
      <IconCreate style={{height:15, width:15}}/>
      </IconButton>
      )
}

export default ACSCreateButton;
