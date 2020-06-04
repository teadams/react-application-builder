import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js';
import ACSObjectView from './ACSObjectView.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';

 function ACSHeadlessObjectView(props)  {
  const {onData, ...params} = props
  return ( 
      <ACSObjectView {...params}  headless={true} onData={onData}/>
  )
}
export default ACSHeadlessObjectView;
