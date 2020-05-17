import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js';
import React, {Fragment} from 'react';
import {Paper, Typography} from '@material-ui/core';

function Message(props) {
  return (props.message + "...." +props.data.first_name)
}

export default Message;
