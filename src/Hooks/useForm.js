import React, {useState, useContext} from 'react';
import * as api from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js';
import useGetModel from '../Hooks/useGetModel';
import {AuthContext} from '../Components/User';
import axios from 'axios';


const useForm = (object_type, field_name="", data, handleSubmit, mode="view", form=true, form_props={}, field_list) => {
  const [formValues, setFormValues] = useState({});
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

  var defaults = {}
  field_list.forEach(field =>{
    const field_model = field_models[field]
    const references = field_model.references
    if (references && mode==="edit" && data) {
      // XX fix to have id work off object meta data 
      const references_field = field_model.references_field?field_model.references_field:"id"; 
      // data has been restructured
      defaults[field]= data[field]?data[field][references_field]:""
    } else if (data && mode === "edit") {
        if (field_model.input_type === "file") {
          defaults[field] = ""
        } else {
          defaults[field] = data[field]?data[field]:""
        }
    } else if (mode === "create") {
          // take from field_models
          let default_value = field_model.default?field_model.default:""
          // take from context
          if (context.user.id && references === "core_user" && field_model.use_context) {
              default_value = context.user.id
          }
          // take from props
          default_value=form_props[field]?form_props[field]:default_value  
          defaults[field] = default_value
    }
            
  })

  if (Object.keys(defaults).length > 0 && Object.keys(formValues).length === 0) {
      setFormValues(defaults)
  }
  
  const handleFormSubmit = (event => {
    u.a("submitted")
    if (!lastTouched) {
       handleSubmit(event, "no_change")
       return
    } 

    if (event) {
      event.preventDefault();
    }
    formValues.core_subsite = context.context_id
    formValues.user_id = context.user.id 

    if (!formValues[id_field]) {
      api.postData(object_type, formValues, {}, (insert_result, error) => { 
        // XX user_id, subsite
        if (error) {
          alert ('error is ' + error.message)
        } else {
          var inserted_id = insert_result.rows[0][id_field] 
          context.setDirty();
          handleSubmit(event,'created', inserted_id);
        }
      })     
    } else {

      api.putData(object_type, formValues, {}, (result, error) => { 
        if (error) {
          alert ('error is ' + error.message)
        } else { 
          context.setDirty();
          handleSubmit(event,'updated', formValues);
        }
      })
    }
  })

  const handleFileEditSubmit = (event,field_name, file) => {
    let fileFormValues = Object.assign(formValues)
    fileFormValues.field_name=file

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
      if (mode==="edit" && form) {
        // edit ubmits right away
        handleFileEditSubmit(event, name, value)
      } else if (mode === "create") {
        setFormValues(formValues => ({...formValues, [name]:value}));
      }
    }
  })

  return {formValues, lastTouched, handleFormSubmit, handleFormChange};

}

export default useForm;