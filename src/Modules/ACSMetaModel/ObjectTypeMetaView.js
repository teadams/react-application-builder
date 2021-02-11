import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState, useContext} from 'react';
import {Grid,  Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button, Tabs, Tab } from '@material-ui/core';
import ACSDrillDown from "../../ACSLibrary/Layouts/ACSDrillDown.js"
import {ACSObjectView, ACSEditButton, ACSField, ACSText, ACSTabMenu, ACSObjectType} from '../../ACSLibrary/index.js'


import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';

import useGetModel from "../../Hooks/useGetModel.js"

import AuthContext from '../User/AuthContext';

function convertMetaObjectToData(meta_object) {
  const data = []
  Object.keys(meta_object).forEach (key => {
    meta_object[key].id=key
    data.push(meta_object[key])
  })
  return data

}

function CenterDrill(props) {
    const {object_models,field_models,data,object_type,id} = props;
      return (<ACSObjectView data={data} field_models={field_models} object_models={object_models} object_type={object_type} id={id}/>)
}

function ObjectTypeMetaView(props) {
  const {object_type}  = props
  const object_models =  useGetModel("object_types")
  const data = convertMetaObjectToData(object_models)
  return (<ACSDrillDown drill_placement="top" drill_center_component={CenterDrill} data={data}/>)
}

export default ObjectTypeMetaView