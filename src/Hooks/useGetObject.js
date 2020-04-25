
import React, {useState, useEffect} from 'react';
import * as api from '../Utils/data.js';
import * as meta from '../Utils/meta.js';
import * as log from '../Utils/log.js';
import * as utils from '../Utils/utils.js';

const useGetObject = (object_type, id, api_options, param_data) => {
  const [db_object_data, setDbResults] = useState();
  if (!param_data && (!object_type && !id)) {
      alert ("Error in useGetObject. Either data or object_type and id must be provided.")
  }

  let trigger_change_array = [object_type, id, param_data]
  trigger_change_array = api.addAPIParams(trigger_change_array, api_options)

  useEffect( () => {

      if (!param_data && (object_type && id)) {
        api.getData (object_type, {id:id}, (results, error) => { 
            if (error) {
                alert ("error retrieving object " + object_type + " " + id + ":" + error.message)
            } else {
              setDbResults(results)
            }
        })
    } 
}, trigger_change_array);
  if (param_data) {
    return param_data
  } else {
    return db_object_data;
  }
}

export default useGetObject;