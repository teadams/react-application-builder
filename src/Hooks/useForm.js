import React, {useState, useContext} from 'react';
import * as api from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js';
import useGetModel from '../Hooks/useGetModel';
import {AuthContext} from '../Modules/User';
import axios from 'axios';

const _handleSubmit = ((event, formValues, mode, context, object_type, object_model, field_models, handleSubmit, id_field, filesTouched, delay_dirty=false) => {

  if (context.context_id && object_model.with_context && ["create","list_create"].includes(mode)) {
    formValues.core_subsite = context.context_id
  }
  if (context.user && context.user.id) {
    formValues.creation_user = context.user.id 
  }

  if (!formValues[id_field]) {

    api.postData(object_type, formValues, {}, (insert_result, error) => { 
      // XX user_id, subsite

      if (error) {
        alert ('error is ' + error.message)
      } else {
        var inserted_id = insert_result.rows[0][id_field] 
        if (handleSubmit) {
          handleSubmit(event,'created', formValues, inserted_id);
        }
        if (object_type === "core_user" || object_type=== "core_subsite" || object_model.extends_object === "core_user" || object_model.extends_object === "core_subsite") {
          context.refreshUserContext()
        }
        if (!delay_dirty) {
          context.setDirty();
        }
      }
    })     

  } else {
    // only send file fields when changed
    Object.keys(formValues).forEach(form_field_name => {
      const field_model=field_models[form_field_name]

      if (field_model && field_model.input_type === "file" && !filesTouched.includes(form_field_name)) {
          delete formValues[form_field_name]
      }
    })

    api.putData(object_type, formValues, {}, (result, error) => { 

      if (error) {
        alert ('error is ' + error.message)
      } else { 
        if (handleSubmit) {
          handleSubmit(event,'updated', formValues);
        }
        if (object_type === "core_user",  object_model.extends_object === "core_user") {
          context.refreshUserContext()
        }
        if (!delay_dirty) {
          context.setDirty();
        }
      }
    })
  }
})

const expand_combos_field_list = (field_list, field_models) => {
  let expanded_field_list = []
  field_list.forEach(field => {
    const field_model = field_models[field]
    if (!field_model.combo_fields) {
        expanded_field_list.push(field)
    } else {
        const recurse_list = expand_combos_field_list(field_model.combo_fields, field_models)
        expanded_field_list = expanded_field_list.concat(recurse_list)
    }
  })
  return expanded_field_list

}

const useForm = (object_type, field_name="", data, handleSubmit, mode="view", form=true, default_values_prop={}, field_list, delay_dirty=false) => {
// XX Have to be passed field_models
  const [formValues, setFormValues] = useState({});
  const [lastTouched,setLastTouched] = useState(false)
  const [filesTouched,setFilesTouched] = useState([])
  const context = useContext(AuthContext)
  const object_models = useGetModel("object_types")
  const object_model =  useGetModel("object_types", object_type)
  const field_models =  useGetModel("fields", object_type)
  const [prior_input_mask, setPriorInputMask] = useState(null)
  const [prior_user_id, setPriorUserId] = useState("")


  // form not needed or inputs not ready

  const id_field = object_model.key_id

  if ((!["edit","create","list_edit","list_create"].includes(mode)) || !form ||
      (["edit","list_edit"].includes(mode) && !data) || 
      !object_model || !field_models) {
          return {undefined, undefined, undefined, undefined}
    }

  const input_mask = object_type+","+field_name+mode+field_list.toString()

  if (input_mask !== prior_input_mask) {
    // props have changed, new form
    let defaults = {}

    field_list = expand_combos_field_list(field_list, field_models)
    field_list.forEach(field_name =>{
      const field_model=field_models[field_name]
      const references = field_model.references
      if (field_model.input_type === "file") {
        defaults[field_name] = ""
      } else if ( ["edit","list_edit"].includes(mode) && data) {
      // data has been restructured
        let default_value 

        const data_path = field_model.data_path?field_model.data_path.split("."):""
        const data_field = field_model.data_field

        if (field_model.data_path) {
          const data_path = field_model.data_path.split(".")
          let final_data = data[data_path[0]]
          if (data_path[1]) {
              final_data = final_data[data_path[1]]
          }

          if (final_data) {
            default_value=final_data[data_field]
            if (default_value===null||default_value===undefined) {
              default_value = field_model.default?field_model.default:""
            }
          }

        } else {
          default_value=(data[data_field]!==null&&data[data_field]!==undefined)?data[data_field]:""
        }

        if (default_value === undefined || default_value === null) {
          // base existed, but references did not
          default_value = field_model.default?field_model.default:""
        }
        defaults[field_name] = default_value
      } else if (["create","list_create"].includes(mode) === "create") {

          // take from field_models
          let default_value = field_model.default?field_model.default:""
          // take from context
          if (context.user.id && references === "core_user" && field_model.use_context) {
              default_value = context.user.id
          } 
          default_value=default_values_prop[field_name]?default_values_prop[field_name]:default_value  
          
          defaults[field_name] = default_value
      }
            
    })

    if (Object.keys(defaults).length > 0) {
        setPriorInputMask(input_mask)
        if (context.user) {
          setPriorUserId(context.user.id)
        }
        setFormValues(defaults)
    }
  } else if (context.user && ["create","list_create"].includes(mode) && context.user.id !== prior_user_id) {
      // user logs in after starting to fill out the form 
      // update context
    
      field_list.forEach(field => {
        const field_model=field_models[field]
        if (context.user.id  && field_model.use_context) {
            setFormValues(formValues=>({...formValues,[field]:context.user.id}))
          }
      })
      setPriorUserId(context.user.id)
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
    _handleSubmit (event, formValues, mode, context, object_type, object_model, field_models, handleSubmit, id_field, filesTouched, delay_dirty) 
  })
  // single field edit, submits on change
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
    if (event.target.type) {  
      event.persist();
    }
    const name = event.target.name
    const field_model=field_models[name]
    setLastTouched(name)
    if (event.target.type !== "file") {
      let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      if (field_model.dependency_data_field) {
        let dependent_form_values_name = field_model.dependency_data_field
        setFormValues(formValues => ({...formValues, [name]:value, [dependent_form_values_name]:""}));
      } else {
        setFormValues(formValues => ({...formValues, [name]:value}));
      }
    } else {
      let value = event.target.files[0];
      if (mode==="edit" && form && field_name) {
        // this is a field form (not row form)
        handleFileEditSubmit(event, name, value)
      } else {
        // only send new files to the server 
        if (filesTouched.indexOf(name) === -1) {
            setFilesTouched(filesTouched.concat([name]))
        }
        //dependency_data_field
        setFormValues(formValues => ({...formValues, [name]:value}));
      }
    }
  })
   return {formValues, lastTouched, handleFormSubmit, handleFormChange};

}

export default useForm;