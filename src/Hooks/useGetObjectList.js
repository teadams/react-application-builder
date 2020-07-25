import React, {useState, useRef, useLayoutEffect, useContext, useEffect} from 'react';
import AuthContext from '../Components/User/AuthContext';
import * as api from '../Utils/data.js';

import * as log from '../Utils/log.js';
import * as u from '../Utils/utils.js';

// Cleanup
//Make variable names and approach consistent with out file
// Clean up the state management - with the array. 
// Lay out test cases nicely
// Later - extend to work with changes of values in api_options (object issues)

const useGetObjectList = (object_type, api_options={}, param_data, callback, onData="") => {
  const [prev_state, setState] = useState([false, object_type, api_options, param_data]);

  if (!param_data && !object_type) {
      alert ("Error in useGetObjectList. Either data or object_type must be provided.")
  }
  const context = useContext(AuthContext)
  const isMountedRef = useRef(null);

  const dirty_stamp = context.dirty_stamp;

  // XX This will move to the session cookie
  api_options.user_id = context.user.id
  api_options.subsite_id = context.context_id


  let return_state = prev_state.slice(1)
  const trigger_change_array = api.addAPIParams([object_type, dirty_stamp], api_options)

  function markStateReady(object_type, api_options, api_results) {
    setState([true, object_type,  api_options, api_results])
  }
  
  function markStateTransitioning() {
    setState([false].concat(prev_state.slice(1)))
  }
  // put the direct flag in the call?  How does that interact with trigger change array. 
  // think about it, it is reall about API_options
  useLayoutEffect( () => {
    isMountedRef.current = true;
      if (!param_data && object_type) {
        api.getData (object_type,  api_options, (api_results, error) => { 
          if (isMountedRef.current) {
            if (error) {
                alert ("error retrieving object list " + object_type + ":" + error.message)
            } else {
                markStateReady(object_type,  api_options, api_results)
                if (onData) {
                    onData(api_results)
                }
            }
            if (callback) {
                callback(api_results, error)
            }
          }
        })
    }
  return () => isMountedRef.current = false;
}, trigger_change_array);

  if (param_data || !prev_state) {
    // just passing through. No API
    return_state = [object_type, api_options, param_data]
    // params have changed. update state for future renders
    if ((object_type != prev_state[1]) || param_data != prev_state[3]) {
      setState([true].concat(return_state))
    }
  }

  if (object_type != prev_state[1]) { /// OR something else is different including param data
    if(prev_state[0]) {
      markStateTransitioning()
    }
  }

  return return_state
  
}

export default useGetObjectList