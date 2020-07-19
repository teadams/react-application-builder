import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React,  {useContext, useState, Fragment} from 'react';
import {Paper,  Typography, Button, Grid, Popover} from '@material-ui/core';
//import * as meta from '../../Utils/meta.js'
import {AuthContext} from '../../Components/User';

import ACSObjectCount from '../../Functional/Text/ACSObjectCount.js'
import ACSCreateButton from '../../Functional/Buttons/ACSCreateButton.js'

// XX TODOs
import ObjectView from '../../RABComponents/ObjectView.js'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import * as u from '../../Utils/utils.js'
import { BrowserRouter as Router,  Switch,  Route,  Link,  Redirect, useHistory } from "react-router-dom";
import ACSMap from "../Lists/ACSMap.js"
import SubsiteApply from "../../Components/NowWeAct/SubsiteApply.js"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    learn_button: {
      display:'flex',
      justifyContent:'center'
    },
    grow: {
      flexGrow: 1,
      display:'flex'
    },
    head_row: {
      display:'flex',
      padding:'10px'
    }, 
    head_count_wrapper: {
      display:'flex',
      justifyContent:'flex-end'
    },
    head_count_item: {
      display:'flex',
      padding:'0px',
      paddingRight:'20px'
    }, 
    paper: {
      backgroundColor: '#DDDDDD',
      maxWidth:'40%',
      maxHeight:'75%',
      alight:'center',
      border: '2px solid #000',
      borderRadius: '25px',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

function ACSMapAndFilter (props) {
  const {object_type, field_list, layout, sections, dialog_size} = props
  const classes = useStyles();
  const context = useContext(AuthContext)
  const history = useHistory({});

  const [marker_data, setMarkerData] = useState("")
  const [showInfoWindow, setShowInfoWindow] =useState(false)
  const [showSideWindow, setShowSideWindow] =useState(false)
  const [showVolunteerDialog, setShowVolunteerDialog] = useState(false)

  const [activeMarker, setActiveMarker] = useState({})
  const [selectedPlace, setSelectedPlace]= useState({subsite_data:{}})

  const [create_project_open, setCreateProjectOpen]= useState(false)

  const handleCreateProjectOpen = () =>  {
        setCreateProjectOpen(false)
  }

  const handleProjectCreated= (event,action, project_data, inserted_id) => {
  }

  const handleOnClick = (id, marker, e) => {
    setSelectedPlace(id)
    if (!showSideWindow) {
      setShowSideWindow(true)
    }
  };
  
  const handleMoreClick = event => {
       window.scrollTo(0,0)
       context.setContextId(selectedPlace.id)
       let path = `/OneProject`
       history.push(path);
   }

  const handleVolunteerClose= event => {
      setShowVolunteerDialog(false)
  }

  const handleVolunteerClick = event => {
      setShowVolunteerDialog(true)
  }

  const handlePopoverClose= () => {
      setShowInfoWindow(false)
   }
  
  const create_button = (props) => { 
      return (<Button variant="contained" {...props}>Create a Project</Button>)
  }
//const create_button = Button
  return (
      <Fragment>
      <div className={classes.grow}>
           <Typography variant="h4" classes={{root:classes.head_row}}>{props.title}</Typography>
          <div className={classes.head_row}>
            <ACSCreateButton onSubmit={handleProjectCreated}
              layout={layout}
              sections={sections}
              Component={create_button}
              dialog_size={dialog_size}
              auth_action="read"
              object_type={object_type}/>
          </div>
          <div className={classes.grow} />
          <div className={classes.head_count_wrapper}>
            <div className={classes.head_count_item}>
              <ACSObjectCount api_options={{get_count:true, num_rows:1,}} text="Active Projects:" object_type="nwn_project"/>
            </div>
            <div className={classes.head_count_item}>
              <ACSObjectCount api_options={{get_count:true, num_rows:1, filter_id:"Success", filter_field:"status"}} text="Sucessful Projects:" object_type="nwn_project"/>
            </div>
            <div className={classes.head_count_item}>
              <ACSObjectCount api_options={{get_count:true, num_rows:1}} text="Volunteers:" object_type="nwn_project_volunteer"/> 
            </div>
          </div>
        </div>
        <Grid container style={{paddingTop:20, height:"75%"}}>
        <Grid item style={{width:"20%", padding:10, height:"75%"}}>
            {showSideWindow && <Fragment>     
            <Typography>
                <ObjectView  object_type =  {props.object_type}
                  id = {selectedPlace.id}
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
            </Fragment>}  

            {!showSideWindow &&      
              <Typography>
              Welcome!!!!! Click on a pin to learn more.  Zac and Jesse provide text.
              </Typography>
            }  
        </Grid>

        <Grid item style={{width:"75%", height:"75%"}}>
          <ACSMap onClick={handleOnClick} object_type={object_type}/>
        </Grid>

      </Grid>
      {showVolunteerDialog && <SubsiteApply id={selectedPlace.id} onClose={handleVolunteerClose} open={showVolunteerDialog}/>}
      </Fragment>
    )
  }

export default ACSMapAndFilter;
