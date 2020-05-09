import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import ACSField from './ACSField2.js'
import ACSListController from './ACSListController.js'
//import {functional_components} from "./Functional"
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import useGetObjectList from '../Hooks/useGetObjectList';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';


function RenderACSRow(props) {
  //const ACSFieldMemo = React.memo(ACSField)
  const {...params} = props
  const {data, rab_component_model, field_list} = props

  const {header_wrap:HeaderWrap, header:Header, section_wrap:SectionWrap, section_header:SectionHeader, row_wrap:RowWrap,  row:RABRow} = rab_component_model.row.components 
//  u.aa("chilren,data", data.children, data)
  if (data) {
      return (
        <Fragment>
          <HeaderWrap {...params}>
            <Header {...params}/>
          </HeaderWrap>
          {field_list.map(section_fields => {
            return (
              <SectionWrap {...params}>
                <SectionHeader {...params}/>
                {section_fields.map(field_chunk => {
                  return (<RowWrap {...params}>{RowWrap.displayName}
                            <RABRow {...params} field_chunk={field_chunk}/>
                          </RowWrap>)
                })}
              </SectionWrap>)
            })}
            {data.children && data.children.length >0 &&
                <ACSListController {...params} {...rab_component_model.list.props} data={data.children}/>}

        </Fragment>
      )
  }
}

export default RenderACSRow;
