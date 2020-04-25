import React, {useState, useEffect} from 'react';
import * as data from '../Utils/data.js';
import * as meta from '../Utils/meta.js';
import * as log from '../Utils/log.js';


const useGetObjectList = (object_type, db_options, callback) => {
  const [object_list_data, setDbResults] = useState("");
 
  let trigger_change_array = [object_type]
  data.validAPIParams().forEach(param => {
    if (db_options && db_options[param]) {
      trigger_change_array.push(db_options[param])
    } else {
      // must must must keep consistent length
      trigger_change_array.push("")
    }
  })
  
  useEffect( () => {
      if (object_type) {
        data.getData (object_type,  db_options, (api_results, error) => { 
            if (error) {
                alert ("error retrieving object list " + object_type + ":" + error.message)
            } else {
              setDbResults(api_results)
              if (callback) {
                  callback(api_results,"")
              }
            }
        })
    }
}, trigger_change_array);

  if (!callback) {
    return object_list_data;
  }
}

export default useGetObjectList