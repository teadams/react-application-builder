import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js';
import ACSRowController from '../ACSRowController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';

 function ACSObjectView(props)  {
  const {object_type, id, api_options, layout, sections, field_list, num_columns, form_open=props.row_form, ...params} = props
  // XX now-look up by id.
  // later may allow other unique columns
  function handleFormClose() {
    if (props.onClose) {
      props.onClose()
    }
  }
  return ( 
      <ACSRowController {...params} form_open={form_open} onClose={handleFormClose} object_type={object_type} id={id} layout={layout} sections={sections} field_list={field_list} api_options={api_options} num_columns={num_columns}  />
  )
}
export default ACSObjectView;
