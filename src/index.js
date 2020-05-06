import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import 'typeface-roboto';
// HACK to work around timing.. components that needed ACSField.
// did not make it into the functional components array.  Will
// move array to function 
import ACSFieldController from './Functional/ACSField2.js'
import ACSRowController from './Functional/ACSRowController.js'
import ACSListController from './Functional/ACSListController.js'
import RenderACSField from './Functional/RenderACSField.js'
import RenderACSRow from './Functional/RenderACSRow.js'
import RenderACSList from './Functional/RenderACSList.js'

import React, { Component, Fragment} from 'react';
import {render}  from 'react-dom';
import App from "./App.js";
import Body from "./Body.js"
import './index.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

render((

  <Router>
    <Switch>
      <Redirect exact from="/" to="/app_menu/0" />
      <Route path="/:selected_menu_type/:selected_menu" component={App}/>
      <Route path="/" component={App}></Route>
    </Switch>
  </Router>

), document.getElementById("root"))


//render(<App/>,document.getElementById("root"));
