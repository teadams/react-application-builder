import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js'
import * as data from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import ACSImage from "./ACSImage.js"

function ACSAddress(props) {
  const {data, field_name,display, mode="view", ...params} = props
  
  if (data && Object.keys(data).length >0) {
    const city = data.city?data.city:""
    const street_address = data.street_address?data.street_address:""
    let country = ""
    let state =""
    if (data.country) {
      country = data.country.name?data.country.name:""
    }
    if (data.state) {
      state = data.state.name?data.state.name:""
    }
    const zip_code = data.zip_code?data.zip_code:""

    switch (mode) {
      case "text":
        return (street_address + "," + city)
        break;
      default:
        return (
          <Fragment>
          {street_address &&
            <Typography style={{display:'block'}} variant="body1">
              {street_address}
            </Typography>
          }
          {city && state &&
            <Typography style={{display:'block'}} variant="body1">
              {city}, {state}
            </Typography>
          }
          {city && !state && country &&
            <Typography style={{display:'block'}} variant="body1">
              {city}, {country}
            </Typography>
          }
          {city && !state && !country &&
            <Typography style={{display:'block'}} variant="body1">
              {city}
            </Typography>
          }
          {!city && state && country &&
            <Typography style={{display:'block'}} variant="body1">
              {state}, {country}
            </Typography>
          }
          {!city && state && !country &&
            <Typography style={{display:'block'}} variant="body1">
              {state}
            </Typography>
          }
          {country && city && state &&
            <Typography style={{display:'block'}} variant="body1">
                {country}
            </Typography>
          }
          {country && !city && !state &&
            <Typography style={{display:'block'}} variant="body1">
                {country}
            </Typography>
          }
          </Fragment>
        )
    
  }
}
}

export default ACSAddress;
