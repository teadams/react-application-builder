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
  const [field_data, setFieldData] = useState()
  const [selected_object_data, setSelectedObjectData] = useState()
  const [selected_field_data, setSelectedFieldData] = useState()

  const default_object_value = selected_object_data?selected_object_data.key:"_none_"
  const default_field_value = selected_field_data?selected_field_data.key:"_none_"

  function handleObjectTypeFilter(event, object_data) {

      if (object_data) {
        const select_id = event.target.value
        const select_data = object_data.find(object_data => object_data.key === select_id);    
        setSelectedObjectData(select_data)
      }
  }

  function handleFieldFilter(event, field_data) {
      if (field_data) {
        const select_field_id = event.target.value
        const select_field_data = field_data.find(field_data => field_data.key === select_field_id);    
        setSelectedFieldData(select_field_data)
      }
  }

  function handleFieldData(field_data) {
      setFieldData(field_data)
  }

  // <ACSSelectFilter label="Data Type" key="object_types" onChange={handleObjectTypeFilter} object_type="object_types" filter_name="object_types"  default_value={default_object_value} select_display_field="pretty_plural" any_display_label="-- Select --" select_value_field="key"/>

  return (
  <div>
   <div style={{width:'200px'}}>  
   </div>
   <div style={{width:'200px'}}>
    <ACSObjectType onData={handleFieldData} headless={true} object_type="fields" />
    {field_data && 
      <ACSSelectFilter data={field_data.core_subsite_level} label="Field Name" key="fields" onChange={handleFieldFilter} object_type="fields" filter_name="fields"  default_value={default_field_value} select_display_field="pretty_name" any_display_label="-- Select --" any_item={true} select_value_field="key"/>
    }
   </div>
    <div>
    {selected_object_data &&
    <ACSObjectView data={selected_object_data}  object_type="object_types" id={selected_object_data.id}/>
    }
    
    </div>
  </div>
  )
}

export default MetaModelAdmin