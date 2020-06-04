import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import ACSObjectView from "../../Functional/Rows/ACSObjectView.js"
import * as u from '../../Utils/utils.js';

function NWAProjectView(props) {
  return <ACSObjectView {...props}/>
}

export default NWAProjectView;

