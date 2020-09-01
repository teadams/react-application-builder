import React, {useState, useContext} from 'react';
import * as api from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js';
import useGetModel from '../Hooks/useGetModel';
import {AuthContext} from '../Modules/User';
import axios from 'axios';


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

const useForm = (object_type, field_name="", data, handleSubmit, mode="view", form=true, default_values_prop={}, field_list, delay_dirty=false,  list_form_params={}, index,trace) => {
// XX Have to be passed field_models
  const [formAttributes, setFormAttributes] = useState([{},{},{}]);
  const [lastTouched,setLastTouched] = useState(false)
  const [filesTouched,setFilesTouched] = useState([])
  const context = useContext(AuthContext)
  const object_models = useGetModel("object_types")
  const object_model =  useGetModel("object_types", object_type)
  const field_models =  useGetModel("fields", object_type)
  const [prior_input_mask, setPriorInputMask] = useState(null)
  const [prior_user_id, setPriorUserId] = useState("")
  let [formValues, formVisibility, formValidated] = formAttributes
  // form not needed or inputs not ready

  const id_field = object_model.key_id

  if ((!["edit","create","list_edit","list_create"].includes(mode)) || !form ||
      (["edit","list_edit"].includes(mode) && !data) || 
      !object_model || !field_models) {
          return {undefined, undefined, undefined, undefined}
    }

  let input_mask 
  if (data) {
    input_mask = object_type+","+field_name+mode+field_list.toString()+data.id
  } else {
    input_mask = object_type+","+field_name+mode+field_list.toString()
  }
  if (input_mask !== prior_input_mask) {
    // props have changed, new form
    let defaults = {}

    field_list = expand_combos_field_list(field_list, field_models)
    if (!field_list.includes("id")) {
        field_list.push("id")
    }

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
      } else if (["create","list_create"].includes(mode)) {


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

    if (["create","list_create"].includes(mode) && list_form_params) {
      if (list_form_params.referenced_object_type && !field_list.includes(list_form_params.referenced_object_type)) {
        defaults["referenced_object_type"] = list_form_params.referenced_object_type
      }
      if (list_form_params.referenced_id && !field_list.includes(list_form_params.referenced_id)) {
        defaults["referenced_id"] = list_form_params.referenced_id
      }
    }

    if (Object.keys(defaults).length > 0) {
        setPriorInputMask(input_mask)
        if (context.user) {
          setPriorUserId(context.user.id)
        }
        setLastTouched(false)
        setFormAttributes([defaults,{},{}])
    }
  } else if (context.user && ["create","list_create"].includes(mode) && context.user.id !== prior_user_id) {
      // user logs in after starting to fill out the form 
      // update context
    
      field_list.forEach(field => {
        const field_model=field_models[field]
        if (context.user.id  && field_model.use_context) {
// formValues, formVisible, formValidated
            setFormAttributes([formValues=>({...formValues,[field]:context.user.id}),{},{}])
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
    api.handleSubmit (event, formValues, mode, context, object_type, object_model, field_models, handleSubmit, id_field, filesTouched, delay_dirty) 
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
        setFormAttributes(formAttributes => ([{...formValues, [name]:value, [dependent_form_values_name]:""},{},{}]));
      } else {
        setFormAttributes(formAttributes =>  ([{...formValues, [name]:value},{},{}]));
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
        setFormAttributes([formValues => ({...formValues, [name]:value}),{},{}]);
      }
    }
  })
  if (list_form_params.formAttributes) {
    if (list_form_params.reference_field_name) {
      list_form_params.formAttributes.current[list_form_params.reference_field_name][index] = [formValues,{},{}]
      list_form_params.lastTouched.current[list_form_params.reference_field_name][index] = lastTouched
    } else {
      list_form_params.formAttributes.current[index] = [formValues,{},{}]
      list_form_params.lastTouched.current[index] = lastTouched
    }
  }

   return {formAttributes, lastTouched, handleFormSubmit, handleFormChange};

}

export default useForm;