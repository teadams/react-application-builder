import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import ACSObjectView from "../../Functional/Rows/ACSObjectView.js"
import ACSHeadlessObjectView from "../../Functional/Rows/ACSHeadlessObjectView.js"

import * as u from '../../Utils/utils.js';

function NWAProjectView(props) {
  return ( <Fragment>TEST<ACSHeadlessObjectView {...props}/></Fragment>)
}

export default NWAProjectView;

