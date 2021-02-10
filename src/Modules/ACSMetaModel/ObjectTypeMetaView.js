import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState, useContext} from 'react';
import {Grid,  Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button, Tabs, Tab } from '@material-ui/core';
import ACSField from "../../Functional/Fields/ACSField.js"

import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';

import useGetModel from "../../Hooks/useGetModel.js"

import AuthContext from '../User/AuthContext';

function ObjectTypeMetaView(props) {
  const {object_type}  = props
  const object_models =  useGetModel("object_types")
  if (!object_type) {return null}
  const object_model = object_models[object_type]
  return (
      <>sdfsdfasdf {object_model.name}</>
  )
}

export default ObjectTypeMetaView