import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import AuthContext from './AuthContext';
import {SelectObject} from '..//FormsAndViews';

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
  const subsite_id = context.context_id
  const user = context.user
  
  function handleContextChange(value) {
        context.setContextId(value)  
   }


    if (context.user.id  ) {        
          let context_limit = user.site_admin?"":"member"
          return (
            <SelectObject object_type = "core_subsite"
              value = {context.context_id}
              style = {context_style}
              onChange={handleContextChange}
              noLabel= {true}
              context_limit={context_limit}
              user_id = {user.id}
              open="true"
             />
          );
      }  else {
            return (<Fragment/>)
      }
  
}

export default ContextSelect