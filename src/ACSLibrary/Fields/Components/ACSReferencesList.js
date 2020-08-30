import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../../Utils/utils.js'
import {ACSListController} from '../../../ACSRenderEngine'

import React, {useEffect} from 'react';


function ACSReferencesList(props)  {
  const {object_type, mode, reference_formValues, reference_lastTouched , referenced_object_type, referenced_id, field_name, field_list, ...params} = props


  if (["edit","create"].includes(mode)) {

    return (<ACSListController {...params} field_list={field_list} no_header={true} list_pagination={false} list_mode="list_edit" row_form={true} field_click_to_edit={false} num_add={3} allow_add={true} object_type={object_type} api_options={props.api_options} referenced_object_type={referenced_object_type} referenced_id={referenced_id} reference_formValues= {reference_formValues} reference_lastTouched = {reference_lastTouched} reference_field_name={field_name}
/> )
  } else {
    return (<ACSListController {...params} list_mode="list" field_list={field_list}  no_header={true} list_pagination={false}  field_click_to_edit={false} object_type={object_type} api_options={props.api_options}/> )
  }
}
export default ACSReferencesList;


