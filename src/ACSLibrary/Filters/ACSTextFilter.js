import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, { Fragment, useState } from 'react';
import { TextField } from '@material-ui/core';


// default_value, object_type, label, 
function ACSTextFilter(props) {
  //XX could get default select field by object type from proc?
  const { default_value, object_type, label, field_name, filter_name = props.object_type, onChange, api_options, helper_text } = props
  const [value, setValue] = useState(default_value)

  const handleChange = (event) => {
    const event_value = event.target.value
    if (value !== event_value) {
      setValue(event_value)
    }
  }

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    let text_event = {}
    text_event.target = { name: field_name, value: value }
    if (onChange) {
      onChange(text_event)
    }
  }

  return (<Fragment>
    <form onSubmit={handleSubmit}>
      <TextField
        autoFocus={false}
        name={field_name}
        key={field_name}
        fullWidth={false}
        disabled={false}
        helperText={helper_text}
        label={label}
        //      onBlur={props.onFieldBlur}
        value={value}
        onChange={handleChange} />
    </form>
  </Fragment>
  )
}

export default ACSTextFilter;

