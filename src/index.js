import React from 'react';
import {render}  from 'react-dom';
import App from "./App.js";
import './index.css';
import { BrowserRouter as Router, Route, IndexRoute } from 'react-router-dom'

render((
  <Router>
    <Route path="/" component={App}></Route>
  </Router>
), document.getElementById("root"))


//render(<App/>,document.getElementById("root"));
