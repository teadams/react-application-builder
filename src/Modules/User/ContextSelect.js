import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js';


import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import AuthContext from './AuthContext';
import {ACSSelectFilter} from '../../ACSLibrary'
import useGetModel from '../../Hooks/useGetModel.js'
import * as meta from '../../Utils/meta.js';

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

function ContextSelect () {
  const context = useContext(AuthContext)
  const app_params = useGetModel("app_params")
  const subsite_id = context.context_id
  const user = context.user
  
  function handleContextChange(event) {
    const value = event.target.value 
    if (value !== "_none_") {
        context.setContextId(value)  
    } else {
      context.setContextId(0)        
    }
   }

   const value= (context.context_id === 0)?"_none_":context.context_id
    if (context.user.id && app_params.layout.context_switcher ) { 
          return (
            <ACSSelectFilter object_type = "core_subsite"
              value = {value}
              default_value = {context.context_id}
              key="context_filter"  filter_name="content_filter" 
              onChange={handleContextChange} select_display_field="name" any_display_label="Your Projects" select_value_field="id"
              select_style = {context_style}
              onChange={handleContextChange}
              disable_underline={true}
              api_options={{parent_field:"parent_subsite"}}/>
            
          );
    }  else {
        return(null)
    }      
}

export default ContextSelect