import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, { Component, Fragment} from 'react';
import {Grid} from 'material-ui'
import { CrudTable, Text, GoogleMap} from './Components/Layouts';
import {functional_components} from "./Functional"
import {NavMenuLink, DrillDown} from './Components/Experimental';
import {AuthToggleLink, AuthContext, AuthProvider} from './Components/User';
import {ProjectView, Volunteer, ProjectMessages} from './Components/NowWeAct';
import * as meta from './Utils/meta.js'
import * as log from './Utils/log.js'
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

  //  alert ("render in body with context id " + this.context.context_id)
    //let selected_menu_type = this.props.params["selected_menu_type"]
    const hamburger_menu_p = meta.get_menu("hamburger")?true:false  
    const meta_menu = meta.get_selected_menu(selected_menu,selected_menu_type)
    let filter_field = {}
    let filter_object_type = ""
    if (meta_menu.filter_field) {
      filter_field = meta_menu.object_type?meta.field(meta_menu.object_type, meta_menu.filter_field):""
      filter_object_type = filter_field.references
    } 

  
    let BodyComponent = functional_components[meta_menu.component]

    // TODO - For menu attributes that are functional components, call function
    // to retrieve functional version from string name
    return    (<Fragment>
        {functional_components.hasOwnProperty(meta_menu.component) && 
              <Fragment><BodyComponent {...meta_menu}/></Fragment>
        }
        {meta_menu.component == "ProjectView" &&
          <ProjectView object_type="nwn_project" project_id={this.context.context_id} foo={this.props.foo}
          />
        } 
        {meta_menu.component == "DrillDown" &&
          <DrillDown enu 
            object_type = {meta_menu.object_type}
            grouping_field_name = {meta_menu.grouping_field_name}
            create_form_sections = {meta_menu.create_form_sections}
            expand_contract = {meta_menu.expand_contract}
            manage_object_types = {meta_menu.manage_object_types}
            onMenuChange = {this.props.onMenuChange}
            selected_id = {filter_id}
          />
        }  

        {meta_menu.component == "GoogleMap" &&
          <GoogleMap 
            title = {meta_menu.title}
            text = {meta_menu.text}
            onMenuChange = {this.props.onMenuChange}
            object_type = {meta_menu.object_type}
          />
        }  

        {meta_menu.component == "Volunteer" &&
          <Volunteer    />
        }  
        {meta_menu.component == "ProjectMessages" &&
          <ProjectMessages/>
        }  
        {selected_menu !== undefined && (!meta_menu.component || meta_menu.component == "CrudTable") &&
        <Grid container>
        <Grid item sm style={{margin:0}}>
         <CrudTable
            object_type={meta_menu.object_type}
            object_attributes={meta.object(meta_menu.object_type)}
            object_fields={meta.fields(meta_menu.object_type)}
            filter_field = {meta_menu.filter_field}
            filter_required = {meta_menu.filter_required}
            filter_object_type = {filter_object_type}
            filter_label = {meta_menu.pretty_name}
            onMenuChange = {this.handleMenuChange}
            filter_id = {filter_id}
              />
        </Grid>
        </Grid>
      }
      
      <Fragment>

      </Fragment>
    </Fragment>

)
  
  }
}

Body.contextType = AuthContext;
export default Body
//export default withStyles(styles, { withTheme: true })(Body);

