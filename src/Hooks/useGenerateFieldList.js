import React, {useState, useContext} from 'react';
import * as api from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js';
import useGetModel from '../Hooks/useGetModel';

const useGenerateFieldList = (object_type, field_name="", data, mode, form=true,  field_list=[]) => {
  const object_model =  useGetModel("object_types", object_type)
  const field_models =  useGetModel("fields", object_type)
  // form not needed or inputs not ready

  const id_field = object_model.key_id

  if ((field_list && field_list.length >0)) {
      return field_list
  }

  if (field_name) {
    field_list = [id_field, field_name]
  } else {
    if (object_type) {
      field_list = Object.keys(field_models)
    } else {
      if (data) {
        field_list = Object.keys(data[0])
      } else {
        return []
      }
    }
  }
  
  if (!object_type) {
    return field_list
  }
 
  let scrubbed_field_list = []
  field_list.forEach(field => {
    const field_model = field_models[field]
    if (!field_model.prevent_view &&
            !(field_model.not_on_list && mode==="list")
            && !(form && field_model.not_on_row_form)
            && !(form && mode==="create" && field_model.not_on_create_form)) {
          scrubbed_field_list.push(field)
      }
  })

  return scrubbed_field_list
}

export default useGenerateFieldList