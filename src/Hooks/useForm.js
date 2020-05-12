import React, {useState} from 'react';
import * as api from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js';
import useGetModel from '../Hooks/useGetModel';


const useForm = (object_type, field_name, data, handleSubmit) => {
  const object_models =  useGetModel("object_types")
  const field_models =  useGetModel("fields")
  // calculate the defaults
// only work for field - expand to row
  const id_field = meta.keys(object_type).key_id
  const defaults = {[id_field]:data[id_field], [field_name]:data[field_name]}

  const [formValues, setFormValues] = useState(defaults);
  const [formTouched,setFormTouched] = useState(false)
  
  const handleFormSubmit = (event => {
    if (!formTouched) {
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

  const handleFormChange = (event) => {
    event.persist();
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormTouched(true)
    setFormValues(formValues => ({...formValues, [event.target.name]:value}));
  }

  return {handleFormSubmit, handleFormChange, formValues};

}

export default useForm;