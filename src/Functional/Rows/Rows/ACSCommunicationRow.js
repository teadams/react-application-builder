import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, { Component, Fragment} from 'react';
import { Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import * as u from '../../../Utils/utils.js'

import ACSYouTube from "../../Fields/ACSYouTube.js"
import ACSImage from "../../Fields/ACSYouTube.js"
import ACSField from "../../ACSField2.js"

function ACSCommunicationRow(props) {
  const {...params} = props
  return (
      <Fragment>
      <Grid container spacing='32' direction='column'>
      <Grid item>
      <Typography variant="title">Project Announcements</Typography>
      </Grid>
      <Grid>
      {this.state.data.map(row=>{

          return(
              <Paper style={{padding:20}}>
                  <Typography variant='title' gutterBottom>
                    {row.name}
                  </Typography>
                  <Typography  gutterBottom>
                  {row.body}
                  </Typography>
                  {row.role_type && 
                      <Button variant='contained'>I can help!</Button>
                  }
                  {row.url && <ACSYouTube initial_url={row.url}/>}
                  {row.image && <ACSImage object_type="nwn_project_post"
                  size="medium" fix="width"
                  image_object={JSON.parse(row.image)} field_name="image"/>}
              </Paper>
            )   
      })}
      </Grid>
      </Grid>
      </Fragment>  
  )
}

export default ACSCommunicationRow