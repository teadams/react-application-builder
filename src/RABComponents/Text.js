import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, {Fragment} from 'react';
import {Paper, Typography} from '@material-ui/core';

function Text(props) {
  const {title, text} = props

  return (
      <Fragment>
        <Typography variant="headline">
         {title}
        </Typography>
        <Typography variant="body1" style={{padding:10}}>
         {text}
        </Typography>

      </Fragment>
  )
}

export default Text;
