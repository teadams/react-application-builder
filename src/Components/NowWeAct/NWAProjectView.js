import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

//import {React, Fragment} from 'react';
import React, { Component, Fragment, useState} from 'react';
import ACSObjectView from "../../Functional/Rows/ACSObjectView.js"
import ACSHeadlessObjectView from "../../Functional/Rows/ACSHeadlessObjectView.js"
import ACSObjectTypeView from "../../Functional/Lists/ACSObjectTypeView.js"
import ACSSummaryObjectTypeView from "../../Functional/Lists/ACSSummaryObjectTypeView.js"
import {Container, Box, Typography, Card, TableHead, TableContainer, Table, TableBody, TableRow, TableCell} from '@material-ui/core';
import * as u from '../../Utils/utils.js';

function NWAProjectView(props) {
  const [data, setData] = useState(null)

  const onData=(api_data) => {
    setData(api_data)
  }
 // ACSHeadlessObjectView wiill retrieve new data on props changes
  return (
    <Fragment>
    <ACSHeadlessObjectView {...props} onData={onData}/>
    {data && 
    <div style={{display:'flex',padding:20, width:"90%", justifyContext:"center",  border:"5px solid red"}}>
      <div style={{width:"30%", marginRight:10, xborder:"5px solid  blue"}}>
      <ACSObjectView {...props} row_header_image_size="medium" field_display="name_value" num_columns={1} field_list={["type", "summary",  "description", "city"]}/>
      </div>
      <div style={{width:"40%", marginLeft:10, marginRight:10, xborder:"5px solid  blue"}}>messages</div>
      <div style={{width:"30%", marginLeft:10, border:"5px solid  blue"}}>
      <ACSObjectView {...props} data={data.leader} field_display="name_value" num_columns={1} object_type="core_user" row_header_image_size="medium" rab_component_model={{row:{names:{row_body:"RABVoid"}}}} row_image_size="medium" />
      <div style={{marginTop:20}}>
        <Card>
        <Typography variant="h6">Current Project Needs</Typography>
        <ACSSummaryObjectTypeView {...props} object_type="nwn_project_need"/>
        </Card>
      </div>
      <div style={{marginTop:20}}>
        <Card>
        <Typography variant="h6">Volunteers</Typography>
        <ACSSummaryObjectTypeView {...props} object_type="nwn_project_volunteer"/>
        </Card>
      </div>
      </div>
    </div>
    }
    </Fragment>
  )
  
}

export default NWAProjectView;

