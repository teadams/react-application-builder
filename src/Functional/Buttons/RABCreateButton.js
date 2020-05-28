import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from 'react';
import { IconButton, Button} from '@material-ui/core';
import IconCreate from "@material-ui/icons/Add";
import * as log from '../../Utils/log.js'

function RABCreateButton(props) {

  handleOnClick = event => {
    props.onClick(event, this.props.value);
  }
  const float=this.props.float?this.props.float:'none'
  
 return (
      <Button variant="fab" color="primary"  style={{minHeight:20, height:20, width:20, float:float}} onClick={this.handleOnClick}>
      <IconCreate style={{height:15, width:15}}/>
      </Button>
      )
}

export default RABCreateButton;
