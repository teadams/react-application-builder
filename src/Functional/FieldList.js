import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import RenderFieldList from './RenderFieldList.js'
import useGetObject from '../Hooks/useGetObject';
import React, {Fragment, useState, useEffect} from 'react';

function FieldList(props) {
//  const { id, api_options} = props
//  let {field_list} = props // will use object meta if not provided
  const [mode, setMode] = useState("view");

  let [ready, object_type, id, field_list, api_options, data] = useGetObject(props.object_type, props.id, props.field_list, props.api_options, props.data); 

  if (!field_list) {
    field_list = Object.keys(meta.fields(object_type))
  }

  if (data) {
    return ( <Fragment>
            <RenderFieldList object_type={object_type} id={id} field_list={field_list} data={data} api_options={api_options}/>
            </Fragment>)
    } else {  
        return <div></div>
    }
}

export default FieldList;