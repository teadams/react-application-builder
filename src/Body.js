import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, { Component, Fragment} from 'react';
import {dynamic_components} from "./dynamic-components"
import {AuthToggleLink, AuthContext, AuthProvider} from './Components/User';
import * as meta from './Utils/meta.js'
import * as log from './Utils/log.js'
import * as u from './Utils/utils.js'
import axios from 'axios';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {  BrowserRouter as Router,  Switch,  Route,  Link,  useParams } from "react-router-dom";

function Body(props) {
  const {
    selected_menu,
    filter_id,
    selected_menu_type
  } = props

  const hamburger_menu_p = meta.get_menu("hamburger") ? true : false
  const meta_menu = meta.get_selected_menu(selected_menu, selected_menu_type)


  const menu_component_name = meta.getValueByPrecedence("rab_component_name.menu", "ACSField", meta_menu)
  let BodyComponent = dynamic_components[menu_component_name]
  if (typeof(BodyComponent) != "function") {
    alert("Menu Model Issues - no component for " + menu_component_name)
  }

  const {
    ...rest
  } = meta_menu

  return ( < BodyComponent {
      ...rest
    }
    />)
  
}

export default Body
