import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, {Fragment} from 'react';
import {Paper, Typography} from '@material-ui/core';
import RABText from './RABText.js';


function RABHeaderAndBodyText(props) {
  const {header_text, body_text, header_variant="h5", body_variant="body1"} = props
  return (
      <Fragment>
        <RABText text={header_text} header={true} variant={header_variant}/>
        <RABText variant={body_variant} header={false} text={body_text} style={{padding:10}}/>
      </Fragment>
  )
}

export default RABHeaderAndBodyText;
