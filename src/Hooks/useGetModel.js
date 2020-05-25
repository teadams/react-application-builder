
import React, {useState, useLayoutEffect, useContext} from 'react';
import * as api from '../Utils/data.js';
import * as meta from '../Utils/meta.js';
import * as log from '../Utils/log.js';
import * as u from '../Utils/utils.js';
import ModelContext from '../ModelContext.js';


const useGetModel = (type) => {
  const model = useContext(ModelContext)
  
  return model[type]
}

export default useGetModel;