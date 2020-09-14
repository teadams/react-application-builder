import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js';
import {ACSRowController} from '../../ACSRenderEngine/index.js'
import React, { useContext} from 'react';


 function ACSObjectView(props)  {
  const {object_type, id, api_options, layout, sections, field_list, num_columns, row_type="table_row", ...params} = props
  let { form_open=props.row_form} = props

  function handleFormClose() {
    if (props.onClose) {
      props.onClose()
    } 
  }
  const onClose=props.onClose?handleFormClose:""
  
  return ( 
      <ACSRowController {...params} override_meta_model={true} row_type={row_type} form_open={form_open} onClose={onClose} object_type={object_type} id={id} layout={layout} sections={sections} field_list={field_list} api_options={api_options} num_columns={num_columns}  />
  )
}
export default ACSObjectView;
