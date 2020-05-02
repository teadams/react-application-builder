import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, { Component, Fragment} from 'react';
import {Grid} from 'material-ui'
import { CrudTable, Text, GoogleMap} from './Components/Layouts';
import {dynamic_components} from "./dynamic-components"
import {NavMenuLink, DrillDown} from './Components/Experimental';
import {AuthToggleLink, AuthContext, AuthProvider} from './Components/User';
import {ProjectView, Volunteer, ProjectMessages} from './Components/NowWeAct';
import * as meta from './Utils/meta.js'
import * as log from './Utils/log.js'
import * as a from './Utils/utils.js'
import axios from 'axios';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {  BrowserRouter as Router,  Switch,  Route,  Link,  useParams } from "react-router-dom";

class Body extends Component {
  constructor(props) {
      super(props);
  }
  
  render() {    
  
    const { selected_menu, filter_id, selected_menu_type } = this.props
    const hamburger_menu_p = meta.get_menu("hamburger")?true:false  
    const meta_menu = meta.get_selected_menu(selected_menu,selected_menu_type)
    let filter_field = {}
    let filter_object_type = ""
    if (meta_menu.filter_field) {
      filter_field = meta_menu.object_type?meta.field(meta_menu.object_type, meta_menu.filter_field):""
      filter_object_type = filter_field.references
    } 
    const menu_component_name = meta_menu.component_name?meta_menu.component_name.menu:"ACSField"
    let BodyComponent = dynamic_components[menu_component_name]
    // later, run off parm list
    const {parent_field, grouping_field, api_options={}, ...rest} = meta_menu
    api_options.parent_field=parent_field
    api_options.grouping_field=grouping_field
        
    return (<Fragment><BodyComponent api_options={api_options} {...rest}/></Fragment>)
  }      
}
export default Body
//export default withStyles(styles, { withTheme: true })(Body);

