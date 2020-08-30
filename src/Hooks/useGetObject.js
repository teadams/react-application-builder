
import React, {useState, useRef, useLayoutEffect, useContext, useEffect} from 'react';
import AuthContext from '../Modules/User/AuthContext';

import * as api from '../Utils/data.js';
import * as meta from '../Utils/meta.js';
import * as log from '../Utils/log.js';
import * as u from '../Utils/utils.js';


//  const [db_object_data, setDbResults] = useState();
const useGetObject = (object_type, id, field_list, api_options={}, param_data, onData, mode) => {
  // XX - think not neeed
  let passthrough  = false
  let param_data_exists = false
  if (param_data && Object.keys(param_data).length >0 ) {
      param_data_exists = true
      passthrough = true
  }

  if (["create", "list_create"].includes(mode)) {
      passthrough = true
  }
  // XX pass thruogh if param data eixsts or mode is create

  //object_type, id, field_list, api_options, param_data
  const [state, setState] = useState(null);
  const isMountedRef = useRef(null);
  const context = useContext(AuthContext)
  const dirty_data = context?context.dirty_stamp:""
  
  let trigger_change_array
  if (param_data_exists) {
    trigger_change_array = []
  } else {
    trigger_change_array = [object_type, id, dirty_data]
    api_options.user_id = api_options.user_id?api_options.user_id:(context?context.user.id:"") 
    api_options.subsite_id = api_options.subsite_id?api_options.subsite_id:(context?context.context_id:"")
    trigger_change_array = api.addAPIParams(trigger_change_array, api_options)
  }


  useLayoutEffect( () => {

      isMountedRef.current = true;
      if (!passthrough && !param_data && (object_type && (id||api_options.filter_id||api_options.get_count))) {

        api.getData (object_type, Object.assign({id:id},api_options), (results, error) => {  
          if (isMountedRef.current) {
            if (error) {
                alert ("error retrieving object " + object_type + " " + id + ":" + error.message)
            } else {
              if (results === "ERROR") {
                alert ("database error")
                return {}
              }
              results = results[0]
              if (onData) {
                  onData(results)
              }
              setState([object_type, id, field_list, api_options, results])
            }
          }
        })
      } else if (!param_data && object_type) {
          setState([object_type, id, field_list, api_options, undefined])
      }
    return () => isMountedRef.current = false;
  }, trigger_change_array);

  if (passthrough) {
      return [object_type, id, field_list, api_options, param_data]
      if (state !== null) {
        setState(null)
      }
  } else {
      if (state === null) {
        return [object_type, id, field_list, api_options, undefined]
      } else {
        return state
      }
  }
}

export default useGetObject;