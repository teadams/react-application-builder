
import React, {useState, useEffect} from 'react';
import * as data from '../Utils/data.js';
import * as meta from '../Utils/meta.js';
import * as log from '../Utils/log.js';


const useObjectGet = (object_type, id) => {
  const [object_data, setDbResults] = useState("");

  useEffect( () => {
      if (object_type && id) {
        data.getData (object_type, {id:id}, (results, error) => { 
            if (error) {
                alert ("error retrieving object " + object_type + " " + id + ":" + error.message)
            } else {
              setDbResults(results)
            }
        })
    }
}, [object_type, id]);

  return object_data;
}

export default useObjectGet;