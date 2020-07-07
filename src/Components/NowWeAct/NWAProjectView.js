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
  const [video_data, setVideoData] = useState(null)
  const {id, api_options} = props
  // if admin, add applied
  let volunteer_options = {filter_id:api_options.filter_id+",Accepted",
                           filter_field:api_options.filter_field+",Status,"}

  const onData=(api_data) => {
    setData(api_data)
  }

  const onVideoData=(api_data) => {
    setVideoData(api_data)
  }
 // ACSHeadlessObjectView wiill retrieve new data on props changes
  return (
    <Fragment>
    <Paper  variant="outlined">
    <ACSHeadlessObjectView {...props} onData={onData}/>
    <ACSHeadlessObjectView  {...props} api_options={{filter_field:"primary_video", filter_id:true}} object_type="nwn_project_video" onData={onVideoData}/>
    {data && 
    <div style={{display:'flex',padding:20, width:"90%", justifyContext:"center", xborder:"5px solid red"}}>
      <div style={{width:"30%", marginRight:10,xborder:"5px solid  blue"}}>
        <ACSObjectView {...props} data={data} row_no_stripe={true} action="edit" row_header_image_size="medium" field_display="name_value"
        field_click_to_edit = {false} num_columns={1} action_props={{layout:"nwn_project_create_form"}} field_list={["address", "summary",  "description","type"]}/>
      </div>
      <div style={{width:"40%", marginLeft:10, marginRight:10, xborder:"5px solid  blue"}}>
          {video_data ?
          <ACSObjectView action="edit" data={video_data} api_options={{filter_field:"primary_video", filter_id:true}}  row_no_stripe={true} field_display="name" field_list={["url"]} action_props={{field_list:["id","name","url","description"]}} object_type="nwn_project_video" />
          :  
          <ACSObjectTypeView {...props} action="create" data={video_data} action_props={{field_list:["id","name","url","description"]}} object_type="nwn_project_video"/>    
          }
          <ACSCommunicationObjectTypeView action="create" {...props} object_type="nwn_project_post" />
        
      </div>
      <div style={{width:"30%", marginLeft:10, xborder:"5px solid  blue"}}>
        
        <ACSObjectView {...props} data={data.leader}  row_no_stripe={true} field_display="name_value" num_columns={1} object_type="core_user" row_header_image_size="medium" rab_component_model={{row:{names:{row_body:"RABVoid"}}}} row_image_size="medium" />
      <div style={{marginTop:20}}>

        <ACSSummaryObjectTypeView action="map"   description_field="role_name.description" action_props={{mapping_name:"mapping_values",filter_field:"role_name.accept_signups", filter_id:true}} object_type="nwn_project_need"/>
        
      </div>
      <div style={{marginTop:20}}>
        
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

