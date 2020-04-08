import React, { Component, Fragment} from 'react';
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

class ContextSelect extends Component {
  constructor(props) {
      super(props);
      this.handleContextChange = this.handleContextChange.bind(this);
  } 
  
    handleContextChange(value) {
        this.context.setContextId(value)  
      
    }
    render() {
      if (this.context.user.id) {
          let context_limit = this.context.user.site_admin?"":"member"
          return (
            <SelectObject object_type = "nwn_project"
              value = {this.context.context_id}
              style = {context_style}
              onChange={this.handleContextChange}
              noLabel= {true}
              context_limit={context_limit}
              user_id = {this.context.user.id}
              open="true"
             />
          );
        }  else {
            return (<Fragment/>)
        }
    }
}

ContextSelect.contextType = AuthContext;
export default ContextSelect