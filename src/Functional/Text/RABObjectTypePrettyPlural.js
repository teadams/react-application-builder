import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import {  Typography } from '@material-ui/core';
import useGetModel from '../../Hooks/useGetModel';
import RABText from './RABText.js';

function RABObjectTypePrettyPlural(props) {
  const {object_type, variant, action="create", header=true} = props

  const object_model = useGetModel("object_types")
  if (!object_model) {return null}
  return (<RABText {...props} header={header} object_type={object_type} action={action} text={object_model[object_type].pretty_plural} variant={variant}/>)
}
export default RABObjectTypePrettyPlural
