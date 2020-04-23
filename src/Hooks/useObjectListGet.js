import React, {useState, useEffect} from 'react';
import * as data from '../Utils/data.js';
import * as meta from '../Utils/meta.js';
import * as log from '../Utils/log.js';


const useObjectListGet = (object_type, db_options) => {
  const [object_list_data, setDbResults] = useState("");
 
  let trigger_change_array = [object_type]
  data.validAPIParams().forEach(param => {
    if (db_options && db_options[param]) {
      trigger_change_array.push(db_options[param])
    } else {
      trigger_change_array.push("")
    }
  })
  
  useEffect( () => {
      if (object_type) {
        data.getData (object_type,  db_options, (results, error) => { 
            if (error) {
                alert ("error retrieving object list " + object_type + ":" + error.message)
            } else {
              setDbResults(results)
            }
        })
    }
}, trigger_change_array);

  return object_list_data;
}

export default useObjectListGet