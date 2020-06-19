import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

//import {React, Fragment} from 'react';
import React, { Component, Fragment, useState} from 'react';
import ACSObjectView from "../../Functional/Rows/ACSObjectView.js"
import ACSHeadlessObjectView from "../../Functional/Rows/ACSHeadlessObjectView.js"
import ACSObjectTypeView from "../../Functional/Lists/ACSObjectTypeView.js"
import ACSCommunicationObjectTypeView from "../../Functional/Lists/ACSCommunicationObjectTypeView.js"
import ACSSummaryObjectTypeView from "../../Functional/Lists/ACSSummaryObjectTypeView.js"
import {Paper, Container, Box, Typography, Card, TableHead, TableContainer, Table, TableBody, TableRow, TableCell} from '@material-ui/core';
import * as u from '../../Utils/utils.js';

function NWAProjectView(props) {
  const [data, setData] = useState(null)
  const {id, api_options} = props
  // if admin, add applied
  let volunteer_options = {filter_id:api_options.filter_id+",Accepted",
                           filter_field:api_options.filter_field+",Status,"}

  const onData=(api_data) => {
    setData(api_data)
  }
 // ACSHeadlessObjectView wiill retrieve new data on props changes
  return (
    <Fragment>
<Paper  variant="outlined">
    <ACSHeadlessObjectView {...props} onData={onData}/>
    {data && 
    <div style={{display:'flex',padding:20, width:"90%", justifyContext:"center", xborder:"5px solid red"}}>
      <div style={{width:"30%", marginRight:10,xborder:"5px solid  blue"}}>
        <ACSObjectView {...props} row_no_stripe={true} row_header_image_size="medium" field_display="name_value" num_columns={1} field_list={["address", "summary",  "description","type"]}/>
      </div>
      <div style={{width:"40%", marginLeft:10, marginRight:10, xborder:"5px solid  blue"}}>
          <ACSObjectView  id={1}  row_no_stripe={true} field_display="name" field_list={["url"]} object_type="nwn_project_video" />
          
          <Typography style={{marginTop:20}} variant="h5">Announcements</Typography>
          <ACSCommunicationObjectTypeView {...props} object_type="nwn_project_post" />
        
      </div>
      <div style={{width:"30%", marginLeft:10, xborder:"5px solid  blue"}}>
        
        <ACSObjectView {...props} data={data.leader}  row_no_stripe={true} field_display="name_value" num_columns={1} object_type="core_user" row_header_image_size="medium" rab_component_model={{row:{names:{row_body:"RABVoid"}}}} row_image_size="medium" />
      <div style={{marginTop:20}}>

        <Typography variant="h5">Current Project Needs</Typography>
        <ACSSummaryObjectTypeView {...props} object_type="nwn_project_need"/>
        
      </div>
      <div style={{marginTop:20}}>
        
        <Typography variant="h5">Volunteers</Typography>
        <ACSSummaryObjectTypeView {...props} api_options={volunteer_options} object_type="core_subsite_role"/>
        
      </div>
      </div>
    </div>
    }
</Paper>
    </Fragment>

  )
  
}

export default NWAProjectView;

