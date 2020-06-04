import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js';
import ACSObjectView from './ACSObjectView.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';

 function ACSHeadlessObjectView(props)  {
  const {onData, ...params} = props
  const component_model = {
      row: {
        names:{
          header_wrap:"RABVoid",
          row_body:"RABVoid"
        }
      }
  }
  return ( 
      <ACSObjectView {...params} onData={onData} component_model={component_model}  />
  )
}
export default ACSHeadlessObjectView;
