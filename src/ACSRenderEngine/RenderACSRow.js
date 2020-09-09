import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import { ACSListController} from '../ACSRenderEngine/'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import useGetModel from '../Hooks/useGetModel';
import {AuthContext, Auth, LoginForm} from '../Modules/User/index.js';


import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';


function RenderACSRow(props) {
  const { ...params} = props
  const {key_id, form, form_title, mode, form_open, data, rab_component_model, object_type, field_list, chunked_field_list, sections=[], handleFormChange, handleFormSubmit, formAttributes, onClose, header_image_size="small", num_columns, dialog_size, dialog_center, delayed_auth=false, form_submit_word} = props
  const {header_wrap:HeaderWrap, header:Header, section_wrap:SectionWrap, section_header:SectionHeader, section_body_wrap:SectionBodyWrap=Fragment, row_wrap:RowWrap,  row:RABRow, row_body:RowBody, form_wrap:FormWrap} = rab_component_model.row.components
  if (data) {
    return (
      <Auth require_authorization={!delayed_auth} auth_action={mode} object_type={object_type} onClose={onClose} data={data}>
        <FormWrap mode={mode} form={form} object_type = {object_type} open={form_open} dialog_size={dialog_size} form_title={form_title} dialog_center={dialog_center} onSubmit={handleFormSubmit} onClose={onClose} key={"row_form"} form_submit_word={form_submit_word}  >
         <HeaderWrap {...params} >
           <Header {...params} image_size={header_image_size}/>
         </HeaderWrap>
         <RowBody {...params}>
         {chunked_field_list.map((section_fields, s_index) => {
           return (
             <SectionWrap {...params} num_columns={num_columns} section={sections[s_index]} key={s_index+"wrap"}>
               <SectionHeader {...params}  num_columns={num_columns} section={sections[s_index]} key={s_index+"section_header"}/>
               <SectionBodyWrap {...params} num_columns={num_columns} section={sections[s_index]} key={s_index+"section_body_wrap"}>
               {section_fields.map((field_chunk, f_index) => {
                 return ( 
                         <RowWrap {...params} trace={props.trace} key={f_index+"wrap"}>
                             <RABRow {...params} s_index={s_index} f_index={f_index} field_chunk={field_chunk} key={f_index+"row"} key_id={key_id+f_index}/>
                            {data.children && data.children.length >0 && <ACSListController {...params} {...rab_component_model.list.props} data={data.children} key={key_id+f_index+"list"}/>}
                         </RowWrap>
                 )
               })}
             
               </SectionBodyWrap>
             </SectionWrap>)
           })}
         </RowBody>
        </FormWrap>
      </Auth>
      )
  }
}

export default RenderACSRow;
