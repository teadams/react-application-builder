import React, {useState, useContext} from 'react';
import * as api from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js';
import useGetModel from '../Hooks/useGetModel';

const useGenerateFieldList = (object_type, field_name="", data, mode, form=true,  field_list=[], lazy="core", layout, section, field_models, object_models) => {
  const default_object_models = useGetModel("object_types")
  const default_field_models =  useGetModel("fields")
  if (!field_models) {
      field_models = default_field_models
  }
  if (!object_models) {
      object_models = default_object_models
  }
  const object_model = object_type?object_models[object_type]:{}
  if (layout || section) {
    return []
  // form not needed or inputs not ready
  }
  const id_field = object_model.key_id

  if ((field_list && field_list.length >0)) {
      return field_list
  }

  if (field_name) {
    field_list = [id_field, field_name]
  } else {

    if (object_type) {
      field_list = [...object_models[object_type].field_tags[lazy]]
      field_list.forEach(field => {
         const field_model = field_models[object_type][field] 
         if (field_model.references && field_model.expand_results) {
           const referenced_field_index = field_list.indexOf(field);
           if (referenced_field_index > -1) {
             field_list.splice(referenced_field_index, 1);
           }
            const references_field_list = object_models[field_model.references].field_tags[lazy]
            field_list = field_list.concat(references_field_list)
        }
      })
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
  // XX FIX FOR REFERNCES
    const field_model = field_models[object_type][field]
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