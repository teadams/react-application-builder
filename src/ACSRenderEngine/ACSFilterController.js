import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
//import * as u from '../../Utils/utils.js'
import React, {  Fragment,  useState} from 'react';
import {Typography } from '@material-ui/core';
import { TableContainer} from '@material-ui/core';
import {ACSSelectFilter, ACSTextFilter} from '../ACSLibrary'

// default_value, object_type, label, 
function ACSFilterController(props) {
  const {filters={}, default_filter_values={}, onChange, label_direction="column", label_variant="subtitle1", filter_direction="column", label_width="70px", select_width="250px", select_display_field, label_position="select", any_display_label} = props
  let default_form_values = {}
  filters.forEach(filter => {
    default_form_values[filter.name] = default_filter_values[filter.name]?default_filter_values[filter.name]:filter.default_value
  })
  const [formValues, setFormValues] =useState(default_form_values)
  const [api_options, setAPIOptions] = useState({"filter_id":[],"filter_field":[],"referenced_by":[],"filter_join":"AND"})

  const handleFilterChange = (event) => {
    
    const event_name = event.target.name 
    const event_value = event.target.value 
    if (formValues[event_name] !== event_value) {
        setFormValues(formValues=>({...formValues,[event_name]:event_value}))
    }
  }

  let new_api_options = {filter_id:[], filter_field:[], referenced_by:[], filter_join:"AND"}
  filters.forEach(filter => {
    if (formValues[filter.name] && formValues[filter.name] !== "_none_") {
        new_api_options.filter_field.push(filter.filter_field_name)
        new_api_options.filter_id.push(formValues[filter.name])
        if (filter.referenced_by) {
          new_api_options.referenced_by.push(filter.referenced_by)
        }
        if (filter.additional_api_options) {
          new_api_options.filter_field.push(filter.additional_api_options.filter_field)
          new_api_options.filter_id.push(filter.additional_api_options.filter_id)
        }
    }
  })

  if (JSON.stringify(new_api_options) !== JSON.stringify(api_options)) {
      setAPIOptions(new_api_options)
      if (onChange) {
          onChange(new_api_options, formValues)
      }
  } 
  
  return (
   <Fragment>
   <div style={{display:"flex", flexDirection:filter_direction, width:"100%"}}>
      {filters.map(filter => {
        if (filter.select_api_options) {
            if (filter.select_api_options.filter_dependent_field) {
                filter.select_api_options.filter_id = formValues[filter.select_api_options.filter_dependent_field]
            }
        } else {
          filter.select_api_options= {}
        }
    //    u.a(filter.name, filter.select_api_options)
        if (filter.filter_type !== "Text") {
            if (!filter.select_display_field) {
              filter.select_display_field = "name"
            }
        }

        return (
          <div key={"div1-"+filter.name} style={{display:"flex", marginTop:"10px", alignSelf:"flex-end", flexDirection:label_direction, alignItems:"center"}}>
          {filter.label&&<div style={{marginRight:"10px", minWidth:label_width}}><Typography variant={label_variant}>{filter.label}:</Typography></div>}
          <div style={{alignSelf:"flex-start", minWidth:select_width}}>
            {filter.filter_type !== "Text" &&
            <ACSSelectFilter label={filter.select_label} key={filter.name} object_type={filter.object_type} filter_name={filter.name} field_name={filter.name} default_value={formValues[filter.name]} onChange={handleFilterChange} api_options={filter.select_api_options} select_display_field={filter.select_display_field} any_display_label={filter.any_display_label} select_value_field={filter.select_value_field}/>}

            {filter.filter_type === "Text" &&
            <ACSTextFilter key={filter.name} label={filter.text_label} helper_text={filter.helperText} object_type={filter.object_type} filter_name={filter.name} field_name={filter.name} default_value={formValues[filter.name]} onChange={handleFilterChange}/>
            }
          </div>
          </div>)
      })}
    </div>
   </Fragment>
   )

}

export default ACSFilterController;

