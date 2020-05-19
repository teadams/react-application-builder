import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, {Fragment} from 'react';
import {Paper, Typography} from '@material-ui/core';
import RABText from './RABText.js';


function Text(props) {
  const {title, text, title_variant="h5", body_variant="body1"} = props
  return (
      <Fragment>
        <RABText text={title} header={true} variant={title_variant}/>
        <RABText variant={body_variant} header={false} text={text} style={{padding:10}}/>
      </Fragment>
  )
}

export default Text;
