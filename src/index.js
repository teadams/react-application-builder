import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import 'typeface-roboto';

import React from 'react';
import {render}  from 'react-dom';
import App from "./App.js";
import './index.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'


// Get the new case statment here 
// App is from the node library
// pass it to app  (move the router stuff down)
// then in the case statement, execute it first
// in short term could make index.js that had all the custom 
// case statements and then choose based on swtich on the model

render((

  <Router>
    <Switch>
      <Route path="/menu/:menu_type/:selected_menu/:object_type/:id/:field_name" component={App}/>
      <Route path="/menu/:menu_type/:selected_menu/:object_type/:id" component={App}/>
      <Route path="/menu/:menu_type/:selected_menu/:object_type" component={App}/>
      <Route path="/menu/:menu_type/:selected_menu/" component={App}/>

      <Route path="/component/:component_name/:object_type/:id/:field_name" component={App}/>
      <Route path="/component/:component_name/:object_type/:id" component={App}/>
      <Route path="/component/:component_name/:object_type" component={App}/>
      <Route path="/component/:component_name/" component={App}/>

      <Route path="/:selected_menu/:object_type/:id/:field_name" component={App}/>
      <Route path="/:selected_menu/:object_type/:id/" component={App}/>
      <Route path="/:selected_menu/:object_type/" component={App}/>
      <Route path="/:selected_menu" component={App}/>

      <Route path="/" component={App}></Route>
    </Switch>
  </Router>
), document.getElementById("root"))



//render(<App/>,document.getElementById("root"));
