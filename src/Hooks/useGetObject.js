
import React, {useState, useLayoutEffect, useEffect} from 'react';
import * as api from '../Utils/data.js';
import * as meta from '../Utils/meta.js';
import * as log from '../Utils/log.js';
import * as u from '../Utils/utils.js';

//  const [db_object_data, setDbResults] = useState();
const useGetObject = (object_type, id, field_list, api_options, param_data) => {
  // XX - think not neeed
  const [ready, setReady] = useState(false);
  const [prev_state, setState] = useState([false, object_type, id, field_list, api_options, param_data]);

  if (!param_data) {
    u.aa("get object with object_type, field_list, prev_state object, prev_state_field_list",object_type, field_list, prev_state[1], prev_state[3])
  }

//// NEEDS FIXED..plus it shoudl just return
//  if (!param_data && !(object_type && (id || api_options.filter_field))) {
//      alert ("Error in useGetObject. Either data or object_type and id must be provided.")
//  }

  let trigger_change_array = [object_type, id, param_data]
  trigger_change_array = api.addAPIParams(trigger_change_array, api_options)

  useLayoutEffect( () => {
      if (!param_data && (object_type && (id||api_options.filter_id))) {
        api.getData (object_type, Object.assign({id:id},api_options), (results, error) => { 
            if (error) {
                alert ("error retrieving object " + object_type + " " + id + ":" + error.message)
            } else {
              setState([true, object_type, id, field_list, api_options, results])
            }
        })
    } else if (!param_data && object_type) {
        setState([true, object_type, id, field_list, api_options, ""])
    }
}, trigger_change_array);
//https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables - Should I use one or more States
// WE NEED TO USE ONE because we want the data and the metadata
// model to match. Otherwise, we will have a lot of weird debuggs
// and flickering
  if (param_data || !prev_state) {
    if ((object_type != prev_state[1]) || (param_data != prev_state[5])  || (field_list != prev_state[3])) {
        setState([true, object_type, id, field_list, api_options, param_data])
    }
    return [true, object_type, id, field_list, api_options, param_data]
  } 
  // subtle use case example
  // menu has the same component twice but with 2 different
  // object types.  The whole DOM structure is going to change
  // so don't run render with the meta data from one object
  // type on data from another.  A mess of subtle bugs
  if (object_type != prev_state[2] || field_list != param_data[3]) { /// OR something else is different 
      if(prev_state[0]) {
        setState([false, prev_state[1], prev_state[2],prev_state[3], prev_state[4],prev_state[5]])
      }
    return [false, prev_state[1], prev_state[2],prev_state[3], prev_state[4],prev_state[5]]
  } else {
    return [true, prev_state[1], prev_state[2],prev_state[3], prev_state[4],prev_state[5]]
  }
}

export default useGetObject;