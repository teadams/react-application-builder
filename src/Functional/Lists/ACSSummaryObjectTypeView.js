import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/log.js'
import ACSObjectTypeView from './ACSObjectTypeView.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';


function ACSSummaryObjectTypeView(props)  {
  const {object_type, api_options, ...params} = props
  return (<ACSObjectTypeView {...params}  object_type={object_type} api_options={api_options}/> )
}
export default ACSSummaryObjectTypeView;

