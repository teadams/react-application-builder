import React, {useState, useContext} from 'react';
import * as api from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js';
import useGetModel from '../Hooks/useGetModel';
import {AuthContext} from '../Components/User';


const useForm = (object_type, field_name="", data, handleSubmit, mode, form=true, form_props={}) => {
  const [formValues, setFormValues] = useState({});
  const [lastTouched,setLastTouched] = useState(false)
  const context = useContext(AuthContext)

  const object_models =  useGetModel("object_types")
  const field_models =  useGetModel("fields")
  // form not needed or inputs not ready
  if (mode === "view" || !form ||
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

// XX off tags
  const fields_to_splice = [ "creation_date", "state", "last_updated_date", "core_subsite", "full_name", "thumbnail"]
  fields_to_splice.forEach(field => {
    if (field_list.indexOf(field)>0) {
      field_list.splice(field_list.indexOf(field),1)
    }
  })

  var defaults = {}
  field_list.forEach(field =>{
    const field_model = field_models[object_type][field]
    const references = field_model.references
    if (references && mode==="edit" && data) {
      // XX fix to have id work off object meta data 
      const references_field = field_model.references_field?field_model.references_field:"id"; 
      // data has been restructured
      defaults[field]= data[field]?data[field][references_field]:""
    } else if (data && mode === "edit") {
        defaults[field] = data[field]?data[field]:""
    } else if (mode === "create") {
        if (field != id_field) {
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
    }
            
  })

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

    formValues.subsite_id = context.context_id
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

  const handleFormChange = ((event) => {
    event.persist();
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setLastTouched(event.target.name)
    setFormValues(formValues => ({...formValues, [event.target.name]:value}));
  })

  return {formValues, lastTouched, handleFormSubmit, handleFormChange};

}

export default useForm;