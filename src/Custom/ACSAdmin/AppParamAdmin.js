import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState, useContext} from 'react';
import {Grid,  Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button, Tabs, Tab } from '@material-ui/core';
import ACSDrillDown from "../../ACSLibrary/Layouts/ACSDrillDown.js"
import { ACSSelectFilter, ACSObjectView, ACSEditButton, ACSField, ACSText, ACSTabMenu, ACSObjectType, ACSCreateButton} from '../../ACSLibrary/index.js'

import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';

import useGetModel from "../../Hooks/useGetModel.js"
import AuthContext from '../../Modules/User/AuthContext';



function AppParamAdmin(props) {
  const {id:subsite_id ,field_name:menu_tab}  = props
  const [app_data, setAppData] = useState()
  const tabItemStyles = {}

  function handleAppData(app_data) {
      setAppData(app_data)
  }

  const root_path = "/ACSGroup/core_subsite/"+subsite_id+"/AppParamAdmin"
  return (
  <div style={{paddingLeft:"15px"}}>
    <ACSObjectType onData={handleAppData} headless={true} object_type="app_params" />
  
  {app_data &&
      <Fragment>
        <ACSObjectView data={app_data}  object_type="app_params"/>
        <ACSTabMenu id={subsite_id} root_path={root_path} field_name="test"  menu_type="group_overview_panels"/>
      </Fragment>
    }
  </div>
  )
}

export default AppParamAdmin