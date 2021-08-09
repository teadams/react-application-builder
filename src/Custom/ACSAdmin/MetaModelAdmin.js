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
      const select_id = event.target.value

      if (object_data && select_id !== "_none_") {
        const select_data = object_data.find(object_data => object_data.key === select_id);    
        setSelectedObjectData(select_data)
      } 
      if (select_id === "_none_") {
        setSelectedObjectData(null);
      }
      setSelectedFieldData(null);
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
      if (selected_field_data) {
        const object_field_data = field_data[selected_object_data.key]
        
        const new_select_field_data = object_field_data.find(object_field_data => object_field_data.key === selected_field_data.key);    

        setSelectedFieldData(new_select_field_data)
      }
  }

  return (
  <div style={{paddingLeft:"15px"}}>
    <div style={{display:"flex", flexDirection:"row", alignItems:"flex-start"}}>  
      <div style={{padding:"15px"}}>  
        <ACSSelectFilter label="Data Type" key="object_types" onChange={handleObjectTypeFilter} object_type="object_types" filter_name="object_types"  default_value={default_object_value} select_display_field="pretty_plural" any_display_label="-- Select --" select_value_field="key"/>
      </div>
      <div style={{padding:"15px"}}>
        <ACSObjectType onData={handleFieldData} headless={true} object_type="fields" />
        {field_data && selected_object_data &&
        <ACSSelectFilter data={field_data[selected_object_data.key]} label="Field Name" key="fields" onChange={handleFieldFilter} object_type="fields" filter_name="fields"  default_value={default_field_value} value={selected_field_data?selected_field_data.key:default_field_value} select_display_field="pretty_name" any_display_label="-- Select --" any_item={true} select_value_field="key"/>
      }
      </div>
    </div>
    <div>
    {selected_object_data && !selected_field_data &&
    <ACSObjectView data={selected_object_data}  object_type="object_types" id={selected_object_data.id}/>
    }
    {selected_field_data && 
      <ACSObjectView data={selected_field_data}  object_type="fields" id={selected_field_data.id}/>
    }
    </div>
  </div>
  )
}

export default MetaModelAdmin