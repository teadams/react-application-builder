import React, {useState, useContext} from 'react';
import * as api from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js';
import useGetModel from '../Hooks/useGetModel';
import {AuthContext} from '../Components/User';
import axios from 'axios';


const useForm = (object_type, field_name="", data, handleSubmit, mode="view", form=true, default_values_prop={}, field_list) => {
  
  const [formValues, setFormValues] = useState({});
  const [prior_input_mask, setPriorInputMask] = useState(null)
  const [lastTouched,setLastTouched] = useState(false)
  const context = useContext(AuthContext)
  const object_model =  useGetModel("object_types", object_type)
  const field_models =  useGetModel("fields", object_type)
  // form not needed or inputs not ready

  const id_field = object_model.key_id

  if ((mode !== "edit" && mode !=="create") || !form ||
      (mode === "edit" && !data) || 
      !object_model || !field_models) {
          return {undefined, undefined, undefined, undefined}
    }
  const input_mask = object_type+","+context.user.id+","+field_name+"mode"+field_list.toString()

  if (input_mask !== prior_input_mask) {
    // context or parent component has changed
    let defaults = {}
    field_list.forEach(field =>{
      const field_model = field_models[field]
      const references = field_model.references
      if (field_model.input_type === "file") {
        defaults[field] = ""
      } else if (references && mode==="edit" && data) {
        // XX fix to have id work off object meta data 
        const references_field = field_model.references_field?field_model.references_field:"id"; 
      // data has been restructured
      
        defaults[field]= data[field]?(data[field][references_field]?data[field][references_field]:""):""
    
      } else if (data && mode === "edit") {
        defaults[field] = data[field]?data[field]:""
      } else if (mode === "create") {
          // take from field_models
          let default_value = field_model.default?field_model.default:""
          // take from context
          if (context.user.id && references === "core_user" && field_model.use_context) {
              default_value = context.user.id
          }
          // take from props
          default_value=default_values_prop[field]?default_values_prop[field]:default_value  
          defaults[field] = default_value
      }
            
    })


    if (Object.keys(defaults).length > 0) {
        setPriorInputMask(input_mask)
        setFormValues(defaults)
    }
  }

  const handleFormSubmit = (event => {

    if (!lastTouched) {
       if (handleSubmit) {
        handleSubmit(event, "no_change")
      }
       return
    } 

    if (event) {
      event.preventDefault();
    }
    if (context.context_id) {
      formValues.core_subsite = context.context_id
    }
    if (context.user && context.user_id) {
      formValues.user_id = context.user.id 
    }

    if (!formValues[id_field]) {
      api.postData(object_type, formValues, {}, (insert_result, error) => { 
        // XX user_id, subsite
        if (error) {
          alert ('error is ' + error.message)
        } else {
          var inserted_id = insert_result.rows[0][id_field] 
          context.setDirty();
          if (handleSubmit) {
            handleSubmit(event,'created', formValues, inserted_id);
          }
        }
      })     
    } else {

      api.putData(object_type, formValues, {}, (result, error) => { 
        if (error) {
          alert ('error is ' + error.message)
        } else { 
          context.setDirty();
          if (handleSubmit) {
            handleSubmit(event,'updated', formValues);
          }
        }
      })
    }
  })

  const handleFileEditSubmit = (event, name, file) => {
    let fileFormValues = Object.assign({},formValues)
    fileFormValues[name]=file
    api.putData(object_type, fileFormValues, {}, (result, error) => { 
        if (error) {
          alert ('error with file upload ' + error.message)
        } else { 
          context.setDirty();
          handleSubmit(event,'updated', formValues);
        }
    })
  } 

  const handleFormChange = ((event) => {
    event.persist();
    const name = event.target.name
    setLastTouched(name)
    if (event.target.type !== "file") {
      let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      setFormValues(formValues => ({...formValues, [name]:value}));
    } else {
      let value = event.target.files[0];
      if (mode==="edit" && form && field_name) {
        // this is a field form (not row form)
        handleFileEditSubmit(event, name, value)
      } else {
        setFormValues(formValues => ({...formValues, [name]:value}));
      }
    }
  })

  return {formValues, lastTouched, handleFormSubmit, handleFormChange};

}

export default useForm;