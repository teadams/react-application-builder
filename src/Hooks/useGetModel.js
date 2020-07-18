
import React, {useState, useLayoutEffect, useContext} from 'react';
import * as api from '../Utils/data.js';
import * as meta from '../Utils/meta.js';
import * as log from '../Utils/log.js';
import * as u from '../Utils/utils.js';
import ModelContext from '../ModelContext.js';


const useGetModel = (type, object_type="") => {
  const model = useContext(ModelContext)
  if (!model) {
    // edge case. GoogleMaps popup window is in new 
    // DOM and does not have context
    return ""
  }
  if (object_type&& ["object_types", "fields"].includes(type) ) {
    return model[type][object_type]
  } else {
    return model[type]
  }
}

export default useGetModel;