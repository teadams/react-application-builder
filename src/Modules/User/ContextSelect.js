import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js';

import {useHistory } from "react-router-dom";

import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import AuthContext from './AuthContext';
import {ACSSelectFilter} from '../../ACSLibrary'
import useGetModel from '../../Hooks/useGetModel.js'
import * as meta from '../../Utils/meta.js';
import {Button} from '@material-ui/core';

const context_style = {
 //display: 'block',
 fontSize: 16,
 fontFamily: 'sans-serif',
 fontWeight: 700,
 color: '#444',
 lineHeight: 1.3,
 paddingLeft: 10,  
 paddingRight: 0,  
 //padding: "".6em 1.4em .5em .8em,
 width: 300,
 margin: 10,
 boxSizing: 'border-box',
// border: 1px solid #aaa,
// boxShadow: 0 1px 0 1px rgba(0,0,0,.04,,
 borderRadius: '.5em',
// -mozAppearance: none,
 //-webkitAppearance: none,
 appearance: 'none',
 backgroundColor: '#bbf',
//  linearGradient(to bottom, #ffffff 0%,#e5e5e5 100%)
}

function ContextSelect (props) {
  const {object_type,id} = props;
  const context = useContext(AuthContext)
  const app_params = useGetModel("app_params")
  const subsite_id = context.context_id
  const user = context.user
  const history = useHistory({});
  // context changew will be triggered by the URL.
  // THis approach handles both "Fresh" hits to the URL 
  // and changes to the URL caused by this context switcher
//  if (object_type === "core_subsite" && id) {
//    context.setContextId(id)  
//  }
  function handleContextChange(event) {
    const value = event.target.value 
    if (value && value !== "_none_") {
        //        context.setContextId(value)  
        // context will be set off the new URL in 
        // Template.  This is to handle the case 
        // when the user goes to the URL directly 
        // instead of switching.
        history.push("/ACSGroup/core_subsite/"+value)
    } else {
      context.setContextId(0)
      history.push("/")
    }
   }

   const value= (context.context_id === 0)?"_none_":context.context_id
  let select_data 
  if (!context.user.site_admin && context.user.context_list) {
    select_data = []
    context.user.context_list.forEach((subsite_id) => {
      select_data.push ({id:subsite_id, name:context.user.authorization_object[subsite_id].Name})
    })
  }
    if (context.user.id && app_params.layout.context_switcher ) { 
          return (<div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            <div><Button  color="inherit">Your Projects:</Button></div>
            <div>
            <ACSSelectFilter object_type = "core_subsite"
              value = {value}
              default_value = {context.context_id}
              key="context_filter"  filter_name="content_filter" 
              onChange={handleContextChange} select_display_field="name"
              any_item={false} select_value_field="id"
              select_style = {context_style}
              onChange={handleContextChange}
              disable_underline={true}
              data = {select_data}
              tree_options={true}
              api_options={{parent_field:"parent_subsite"}}/>
              </div>
            </div>
          );
    }  else {
        return(null)
    }      
}

export default ContextSelect