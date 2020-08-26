import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {  Fragment} from 'react';
//import * as u from '../../Utils/utils.js'
import ACSCommunicationRow from '../Rows/Rows/ACSCommunicationRow.js'
import ACSObjectTypeView from './ACSObjectTypeView.js'


function ACSCommunicationObjectTypeView(props)  {
  const {object_type, api_options, ...params} = props
  const field_list = ["role_name", "description"]
  const rab_component_model = { 
      list:{
            names:{ 
                  list_header_wrap:"RABVoid",
                  footer_wrap:"RABVoid",
                  footer:"RABVoid",
                  list_wrap:"Fragment",
                  body_wrap:"Fragment",
                  list_pagination:"RABVoid"}
      },
      row:{components:{
            row:ACSCommunicationRow,
            row_wrap:Fragment
          },
      },
      field:{names:{
            field_wrap:"Fragment"
          },props: 
            { image_size:"medium_large",
              test_prop:"FOO",
              avatar:false, 
              fix:"none"},
      }}
  return (<ACSObjectTypeView {...params} rab_component_model={rab_component_model}  object_type={object_type} api_options={api_options}/> )
}

export default ACSCommunicationObjectTypeView