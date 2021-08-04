import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState, useContext} from 'react';
import {Grid,  Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button, Tabs, Tab } from '@material-ui/core';
import ACSDrillDown from "../../ACSLibrary/Layouts/ACSDrillDown.js"
import {ACSObjectView, ACSEditButton, ACSField, ACSText, ACSTabMenu, ACSObjectType} from '../../ACSLibrary/index.js'


import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';

import useGetModel from "../../Hooks/useGetModel.js"

import AuthContext from '../../Modules/User/AuthContext';


function convertMetaObjectToData(meta_object) {
  const data = []
  Object.keys(meta_object).forEach (key => {
    meta_object[key].id=key
    data.push(meta_object[key])
  })
  return data
}

function MenuModelAdmin(props) {
  const [object_data, setObjectData] = useState()
  const meta_object_models =  useGetModel("object_types")
  const meta_field_models =  useGetModel("fields")

  function CenterDrill(props) {
        const {object_models,field_models,data,id} = props;

        // const field_data = convertMetaObjectToData(meta_field_models[data.name])
        return (
        <>
        <ACSObjectView data={data} field_models={field_models} object_models={object_models} object_type="object_types" id={id}/>
        </>
        )
  }

  function handleObjectTypeData(data) {
      setObjectData(data)
  }

  return (
    <>
    <ACSObjectType onData={handleObjectTypeData} headless={true} object_type="object_types" />
    {object_data && 
      <ACSDrillDown  drill_center_component={CenterDrill} object_type="object_types" data={object_data}/>
    }
    </>
  )
}

export default MenuModelAdmin