import React, {useState} from 'react';
import * as api from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js';
import useGetModel from '../Hooks/useGetModel';


const useForm = (object_type, field_name="", data, handleSubmit, mode, form=true) => {
  const [formValues, setFormValues] = useState({});
  const [lastTouched,setLastTouched] = useState(false)

  const object_models =  useGetModel("object_types")
  const field_models =  useGetModel("fields")
  // form not needed or inputs not ready
  if (mode === "view" || 
      (mode === "edit" && !data) || 
      !object_models || !field_models) {
          return {undefined, undefined, undefined, undefined}
    }
  // XX replace from model
  const id_field = meta.keys(object_type).key_id
  var field_list = [id_field, field_name]

  if (!field_name) {
    field_list = Object.keys(field_models[object_type])
    // run some rules to determin which should
    //  show, be part of the form values (hidden)
  }

  var defaults = {}
  const field_model = field_models[object_type]
  if (data && mode === "edit") {
    field_list.forEach(field =>{
        const references = field_model[field].references
        if (references) {
            defaults[field] = data[field][field_models[references].key_id]
        } else {
           defaults[field] = data[field]
        }
        
    })
  } else if (mode === "create") {
    field_list.forEach(field =>{
        if (field != id_field) {
          // XX rules/ use model to figure out the defaults
          defaults[field] = field
        }
    })
  }
  
  if (Object.keys(defaults).length > 0 && Object.keys(formValues).length === 0) {
      setFormValues(defaults)
  }
  
  const handleFormSubmit = (event => {
    if (!lastTouched) {
       handleSubmit(event, "no_change")
       return
    } 
    if (event) {
      event.preventDefault();
    }
    if (!formValues[id_field]) {
      api.postData(object_type, formValues, {}, (insert_result, error) => { 
        if (error) {
          alert ('error is ' + error.message)
        } else {
          var inserted_id = insert_result.rows[0][id_field]  
          handleSubmit(event,'created', inserted_id);
        }
      })     
    } else {

      api.putData(object_type, formValues, {}, (result, error) => { 
        if (error) {
          alert ('error is ' + error.message)
        } else { 
          handleSubmit(event,'updated', formValues);
        }
      })
    }
  })

  const handleFormChange = ((event) => {
    event.persist();
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setLastTouched(event.target.name)
    setFormValues(formValues => ({...formValues, [event.target.name]:value}));
  })

  return {formValues, lastTouched, handleFormSubmit, handleFormChange};

}

export default useForm;