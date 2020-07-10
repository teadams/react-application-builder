import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React,  {useContext, useState, Fragment} from 'react';
import {Paper,  Typography, Button, Grid, Popover} from '@material-ui/core';
//import * as meta from '../../Utils/meta.js'
import {AuthContext} from '../User';

import ACSObjectCount from '../../Functional/Text/ACSObjectCount.js'
import ACSCreateButton from '../../Functional/Buttons/ACSCreateButton.js'
import ObjectView from '../../RABComponents/ObjectView.js'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import * as u from '../../Utils/utils.js'
import {  BrowserRouter as Router,  Switch,  Route,  Link,  Redirect, useHistory } from "react-router-dom";
import SubsiteApply from "../NowWeAct/SubsiteApply.js"

function NWAProjectSummary (props) {
  const {object_type, data, field_list, layout, sections, dialog_size} = props
  const context = useContext(AuthContext)
  const history = useHistory({});

  const [showVolunteerDialog, setShowVolunteerDialog] = useState(false)

  const handleMoreClick = event => {
       window.scrollTo(0,0)
       context.setContextId(props.data.id)
       let path = `/OneProject`
       history.push(path);
   }

  const handleVolunteerClose= event => {
      setShowVolunteerDialog(false)
  }

  const handleVolunteerClick = event => {
      setShowVolunteerDialog(true)
  }

  return (
    <Fragment>
      <Fragment>     
            <Typography>
                <ObjectView  data={props.data}
                  object_type =  {props.object_type}
                  field_mode = "view"
                  field_list = {field_list}
                  field_click_to_edit = {false}
                  num_columns={1}
                  row_header_image_size="medium"
                 handleMoreClick = {handleMoreClick}/>
              </Typography>
              <div style={{display:"flex", width:"100%", justifyContent:"space-evenly"}}>
              <Button   variant="contained" onClick={handleVolunteerClick}>Volunteer</Button>
              <Button   variant="contained" onClick={handleMoreClick}>Learn More</Button>
              </div>
        </Fragment>
        {showVolunteerDialog && <SubsiteApply id={props.data.id} onClose={handleVolunteerClose} open={showVolunteerDialog}/>}
      </Fragment>
    )
  }

export default NWAProjectSummary;
