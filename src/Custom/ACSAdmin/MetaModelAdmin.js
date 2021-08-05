import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState, useContext} from 'react';
import {Grid,  Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button, Tabs, Tab } from '@material-ui/core';
import ACSDrillDown from "../../ACSLibrary/Layouts/ACSDrillDown.js"
import {ACSSelectFilter, ACSObjectView, ACSEditButton, ACSField, ACSText, ACSTabMenu, ACSObjectType} from '../../ACSLibrary/index.js'


import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';

import useGetModel from "../../Hooks/useGetModel.js"

import AuthContext from '../../Modules/User/AuthContext';



function MetaModelAdmin(props) {
  const [object_data, setObjectData] = useState()
  const default_object_value = object_data?object_data.id:"_none_"
  function handleObjectTypeFilter(event, object_data) {
      if (object_data) {
        const select_id = event.target.value
        const select_data = object_data.find(object_data => object_data.key === select_id);    
        setObjectData(select_data)
      }
  }

  return (
  <div>
   <div style={{width:'200px'}}>
    <ACSSelectFilter label="Data Type" key="object_types" onChange={handleObjectTypeFilter} object_type="object_types" filter_name="object_types"  default_value={default_object_value} select_display_field="pretty_plural" any_display_label="-- Select --" select_value_field="key"/>
   </div>
    <div>
    {object_data &&
    <ACSObjectView data={object_data}  object_type="object_types" id={object_data.id}/>
    }
    </div>
  </div>
  )
}

export default MetaModelAdmin