import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../../Utils/utils.js'
import {ACSListController} from '../../../ACSRenderEngine'
import {Link, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel,RadioGroup,Radio } from '@material-ui/core';

import React, {Fragment,useEffect} from 'react';

function getViewData(data, field) {
  let view_data = []
  data.forEach(row => {
    let row_data = row[field]
    if (row.more_info) {
      row_data = row_data + " ("+row.more_info+")"
    }
    view_data.push(row_data)
  })  
  return view_data.join(", ")
}

function ACSReferenceMapping(props)  {
  const {object_type, mode,  field_name, field_list, num_add=3, allow_add=true, data, allow_save=false,field_model, valid_values,
  formAttributes=[],form_field_name=props.field_name, pretty_name,onChange,...params} = props

  const [formValues, formVisibility, formValidated] = formAttributes
  const visibility = formVisibility?formVisibility[field_name]:"visible"

  function handleChange(event) {
    const value=event.target.value
    if (props.onChange) {
      props.onChange(event)
    }
  }

  if (["edit","create"].includes(mode)) {
    const form_values = formValues[form_field_name]
//    const more_info_form_values = formValues[form_field_name+"_acs_more_info"]?formValues[form_field_name+"_acs_more_info"]:{}

    return (
    <Fragment>
    <div style={{minWidth:"20em", visibility:visibility}}>
      {field_model.summary &&  <div style={{marginBottom:"5px"}} dangerouslySetInnerHTML={{__html: field_model.summary}} 
  />    
  }
  <FormGroup row>
    {valid_values!=="transition" && valid_values.map(valid_value =>{
        const name=field_name+"_acs_"+valid_value.key
        const more_info_name=field_name+"_acs_more_info_acs_"+valid_value.key
  //      const label = form_values[valid_value.key]?(valid_value.name + ": " + valid_value.more_info_prompt):valid_value.name
        const label = valid_value.name
        return(<div>
               <FormControlLabel
                 control={<Checkbox checked={form_values[valid_value.key]} 
                 onChange={handleChange}
                 key={name}
                 name={name} />}
                 label={label}
               />
              {valid_value.more_info_prompt && form_values[valid_value.key] &&
                <TextField id={more_info_name} key={more_info_name} name={more_info_name} onChange={handleChange} value={form_values[valid_value.key+"_more_info"]} label={valid_value.more_info_prompt} />
              }
              </div>
      )
    })}
    </FormGroup>
    </div>
    </Fragment>)
  } else {
    const value = getViewData(data, field_name)
    return (value)
  }
}
export default ACSReferenceMapping;


