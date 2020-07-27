import React, {useState, useContext} from 'react';
import * as api from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js';
import useGetModel from '../Hooks/useGetModel';
import {AuthContext} from '../Modules/User';
import axios from 'axios';


const useForm = (object_type, field_name="", data, handleSubmit, mode="view", form=true, default_values_prop={}, field_list) => {
  const [formValues, setFormValues] = useState({});
  const [prior_input_mask, setPriorInputMask] = useState(null)
  const [lastTouched,setLastTouched] = useState(false)
  const [filesTouched,setFilesTouched] = useState([])
  const context = useContext(AuthContext)
  const object_models = useGetModel("object_types")
  const object_model =  useGetModel("object_types", object_type)
  const field_models =  useGetModel("fields")
  const [prior_user_id, setPriorUserId] = useState("")

  // form not needed or inputs not ready

  const id_field = object_model.key_id

  if (mode === "filter" && form) {
    const handleFilterFormSubmit = (event) => {
        if (event) {
          event.preventDefault();
        }
        if (handleSubmit) {
          handleSubmit(event,field_name, formValues)
        }
    }
    const handleFilterFormChanged = (event) => {
        /// FILTER
      const value=event.target.value
      const name=event.target.name
      if (formValues[name] !== value) {
          setLastTouched(name)
          setFormValues(formValues=>({...formValues,[name]:value}))
      }
    }

    if (Object.keys(formValues).length === 0) {
        setFormValues({[field_name]:data[field_name]})
    }

    return {formValues, lastTouched, handleFormSubmit:handleFilterFormSubmit, handleFormChange:handleFilterFormChanged};
  }

  if ((mode !== "edit" && mode !=="create") || !form ||
      (mode === "edit" && !data) || 
      !object_model || !field_models) {
          return {undefined, undefined, undefined, undefined}
    }
  const input_mask = object_type+","+field_name+"mode"+field_list.toString()
  if (input_mask !== prior_input_mask) {
    // context or parent component has changed
    let defaults = {}
    field_list.forEach(field =>{
      const [base_field_name, final_field_name, base_object_type, final_object_type, base_field_model, final_field_model] = meta.resolveFieldModel(object_type, field, object_models, field_models)

      const references = final_field_model.references
      if (final_field_model.input_type === "file") {
        defaults[final_field_name] = ""
      } else if ((final_field_name !== base_field_name) && mode==="edit" && data) {
      // data has been restructured
        let default_value
        if (final_field_model.references) {
          const references = final_field_model.references  
          default_value=data[base_field_name][final_field_name][final_field_model["references_field"]]
        } else {
          default_value=data[base_field_name][final_field_name]
        }
        if (default_value === undefined || default_value === null) {
          // base existed, but references did not
          default_value = final_field_model.default?final_field_model.default:""
        }
        defaults[field] = default_value
      } else if (data && mode === "edit") {
//        u.a("final, base", final_field_name, base_field_name)
        if (references) {
          defaults[field] = data[field][base_field_model["references_field"]]?data[field][base_field_model["references_field"]]:""
        } else {
          defaults[field] = data[field]?data[field]:""
        }
      } else if (mode === "create") {
          // take from field_models
          let default_value = final_field_model.default?final_field_model.default:""
          // take from context
          if (context.user.id && references === "core_user" && final_field_model.use_context) {
              default_value = context.user.id
          }
          // take from props
          default_value=default_values_prop[field]?default_values_prop[field]:default_value  
          defaults[field] = default_value
      }
            
    })

    if (Object.keys(defaults).length > 0) {
        setPriorInputMask(input_mask)
        if (context.user) {
          setPriorUserId(context.user_id)
        }
        setFormValues(defaults)
    }
  } else if (context.user && mode === "create" && context.user.id !== prior_user_id) {
      // user logs in after fillout out form  
      field_list.forEach(field => {
        const [base_field_name, final_field_name, base_object_type, final_object_type, base_field_model, final_field_model] = meta.resolveFieldModel(object_type, field, object_models, field_models)
        if (context.user.id && final_object_type === "core_user" && final_field_model.use_context) {
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
    if (context.context_id && object_model.with_context && mode === "create") {
      formValues.core_subsite = context.context_id
    }
    if (context.user && context.user.id) {
      formValues.user_id = context.user.id 
    }

    if (!formValues[id_field]) {
      api.postData(object_type, formValues, {}, (insert_result, error) => { 
        // XX user_id, subsite
        //u.a("insert results", insert_result)

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
          context.setDirty();
        }
      })     
    } else {
      // only send file fields when changed
      Object.keys(formValues).forEach(form_field_name => {
        const field_model = field_models[form_field_name]
        // user_id, core_subsite might not have field_model
        if (field_model && field_model.input_type === "file" && !filesTouched.includes(form_field_name)) {
            delete formValues[form_field_name]
        }
      })
      api.putData(object_type, formValues, {}, (result, error) => { 
      //  u.a("update results", result)

        if (error) {
          alert ('error is ' + error.message)
        } else { 
          if (object_type === "core_user" || object_type=== "core_subsite" || object_model.extends_object === "core_user" || object_model.extends_object === "core_subsite") {
            context.refreshUserContext()
          }
          context.setDirty();
          if (handleSubmit) {
            handleSubmit(event,'updated', formValues);
          }
        }
      })
    }
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
    event.persist();
    const name = event.target.name
    const [base_field_name, final_field_name, base_object_type, final_object_type, base_field_model, final_field_model] = meta.resolveFieldModel(object_type, name, object_models, field_models)
    setLastTouched(name)
    if (event.target.type !== "file") {
      let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      if (final_field_model.dependency_data_field) {
        let dependent_form_values_name = final_field_model.dependency_data_field
        if (base_field_name !== final_field_name) {
          dependent_form_values_name = base_field_name+"."+dependent_form_values_name
        }
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