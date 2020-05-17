import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js';
import React, {Fragment} from 'react';
import {Paper, Typography} from '@material-ui/core';

function Text(props) {
  const {title, text, title_variant="h1", body_variant="body1"} = props
  return (
      <Fragment>
        <Typography variant={title_variant}>
         {title}
        </Typography>
        <Typography variant={body_variant} style={{padding:10}}>
         {text}
        </Typography>

      </Fragment>
  )
}

export default Text;
