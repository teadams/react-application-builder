import React, {useState, useLayoutEffect} from 'react';
import * as api from '../Utils/data.js';
import * as meta from '../Utils/meta.js';
import * as log from '../Utils/log.js';

// Cleanup
//Make variable names and approach consistent with out file
// Clean up the state management - with the array. 
// Lay out test cases nicely
// Later - extend to work with changes of values in api_options (object issues)

const useGetObjectList = (object_type, api_options, param_data, callback) => {

  const [prev_state, setState] = useState([false, object_type, api_options, param_data]);
 
  if (!param_data && !object_type) {
      alert ("Error in useGetObjectList. Either data or object_type must be provided.")
  }

  let return_state = prev_state.slice(1)
  const trigger_change_array = api.addAPIParams([object_type], api_options)
  
  function markStateReady(object_type, api_options, api_results) {
    setState([true, object_type,  api_options, api_results])
  }
  
  function markStateTransitioning() {
    setState([false].concat(prev_state.slice(1)))
  }
  // put the direct flag in the call?  How does that interact with trigger change array. 
  // think about it, it is reall about API_options
  useLayoutEffect( () => {
      if (!param_data && object_type) {
        api.getData (object_type,  api_options, (api_results, error) => { 
            if (error) {
                alert ("error retrieving object list " + object_type + ":" + error.message)
            } else {
                markStateReady([object_type,  api_options, api_results])
            }
            if (callback) {
                callback(api_results, error)
            }
        })
    }
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