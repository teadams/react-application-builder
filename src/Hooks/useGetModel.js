
import React, {useState, useLayoutEffect, useEffect} from 'react';
import * as api from '../Utils/data.js';
import * as meta from '../Utils/meta.js';
import * as log from '../Utils/log.js';
import * as u from '../Utils/utils.js';

const useGetModel = (type) => {
  const [model, setModel] = useState(meta.model(type));
  if (!model) {
    meta.load(type, model_results => {
          setModel(model_results)
    })
  }
  return model
}

export default useGetModel;