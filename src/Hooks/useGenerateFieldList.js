import React, {useState, useContext} from 'react';
import * as api from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js';
import useGetModel from '../Hooks/useGetModel';

const useGenerateFieldList = (object_type, field_name="", data, mode, form=true,  field_list=[]) => {
  const field_models =  useGetModel("fields")
  if (!field_models) return []
  // form not needed or inputs not ready

  const id_field = meta.keys(object_type).key_id
  if (!field_list || field_list.length === 0) {
    if (field_name) {
      field_list = [id_field, field_name]
    } else {
      if (object_type) {
        field_list = Object.keys(field_models[object_type])
      } else {
        field_list = Object.keys(data)
      }
    }
  }

  let scrubbed_field_list = []
    
  field_list.forEach(field => {
    const f_model = field_models[object_type][field]
    if (!f_model.prevent_view 
            && !(form && f_model.not_on_row_form)
            && !(form && mode==="create" && f_model.not_on_create_form)) {
          scrubbed_field_list.push(field)
      }
  })

  return scrubbed_field_list
}

export default useGenerateFieldList