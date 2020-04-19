import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, { Component, Fragment, useState, useContext} from 'react';
import {AuthContext} from './Components/User';
import Container from '@material-ui/core/Container'
import {Snackbar, SnackbarContent, Button, Grid} from '@material-ui/core';



function Debug(props) {
  const context = useContext(AuthContext)
  return (
      <Container maxWidth="sm">
      THIS IS THE DEBUG COMPONENT and user is
      {context.user.id}
      </Container>
  )
}

//Body.contextType = AuthContext;
export default Debug

