import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, {Fragment} from 'react';
import {Paper, Typography} from '@material-ui/core';
import RABComponentHeader from './RABComponentHeader.js';


function Text(props) {
  const {title, text, title_variant="h5", body_variant="body1"} = props
  return (
      <Fragment>
        <RABComponentHeader text={title} variant={title_variant}/>
        <RABComponentHeader variant={body_variant} text={text} style={{padding:10}}/>
      </Fragment>
  )
}

export default Text;
