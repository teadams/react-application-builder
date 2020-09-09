import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

//import * as u from './utils.js';
import * as log from './log.js';
import * as u from './utils.js'
import axios from 'axios';
import * as meta from './meta.js';


export function getPathBase () {
      // later this will be a config
      return "/api/v1"
} 

export function validAPIParams() {
    return ["order_by", "order_by_direction", "filter_field", "filter_id", "filter_join", "key_type", "context_limit", "user_id", "subsite_id" ,"parent_field", "get_count", "grouping_field", "expand_hierarchy", "num_rows", "root_value", "mapping_name", "referenced_by"]
}


export function addAPIParams(trigger_change_array, api_options) {
    validAPIParams().forEach(param => {
      if (api_options && api_options[param]) {
        trigger_change_array.push(JSON.stringify(api_options[param]))
      } else { 
        // MUST keep consistent array size. (rule of useEffect)
        trigger_change_array.push("")
      }
      })
      return trigger_change_array
}

export function getParamsObject(options={}, params=validAPIParams()) {
    // prepares parameter object for axios
    if (!options) {
      return
    }
    let params_object = {}
    params.forEach(param => {
      const value = options[param]
      if (value) {
          if (Array.isArray(value) & 
              ["referenced_by","filter_id", "filter_field", "filter_join"].includes(param)) {
              params_object[param] = value.join(",")
          } else {
              params_object[param] = options[param]
          }
        }
    });
    return (params_object)
}

export async function callAPI (path="", params={}, data_object={}, method="get", callback)   {
  let url = getPathBase() + "/"  + path
  let data = ""
  let api_result = {}
  if (data_object) {
    let multi_object = new FormData();
    Object.keys(data_object).forEach(key => {
      multi_object.append(key, data_object[key])
    })
    data_object = multi_object
  }
  api_result = await axios({
    method: method,
    url: url,
    data:data_object,
    params:params
  }).catch(error => {
    const error_prompt = 'error connecting to server with url: ' + url + " method: " + method + " params: " + JSON.stringify(params) + " data: " + JSON.stringify(data_object) + " "
    alert (error_prompt + error.message + " " + error.stack)
    if (callback) {
        callback('', error);
      }
  })
  if (api_result) {
      data = api_result.data
  }
  if (callback) {
    callback(data,"");
  } else {
    return data
  }
}

export function getURL (url, params, callback)   {
  // params is an object containing URL params

  axios({
   method: 'get',
   url: url,
   params: params
//   data: {address: "France", key: "AIzaSyB7xya0w0DAsz0kODQ0_MWlApayXELLBGo"}
 }).then(results => {
      
      callback(results.data,"");
  }).catch(error => {
    log.val('in catch error', error.message)
    alert ("error getting url " + url + "  "+ error.message)
    callback('', error);
  })
}

export function getData (object_type, options={}, callback)   {
  // in get data

  var path = options.path?options.path:object_type
  if (options.id) {
    path += '/'+options.id
  }
  if (object_type==="core_subsite") {
}


  callAPI (path, getParamsObject(options), "", "get", callback) 
}

// INSERTS 
export function postData (object_type, data_object, options, callback)   {
  callAPI (object_type, {}, data_object, "post", callback) 
}

export function login (data_object, callback)   {
  callAPI ("auth/login", {}, data_object, "post", callback) 
}

export function getUserContext (user_id, callback)   {
  callAPI ("auth/user-context/"+user_id, {}, "", "get", callback) 
}

export function createAccount (data_object, callback)   {
  callAPI ("auth/create-account", {}, data_object, "post", callback) 
}

/// UPDATES
export function putData (object_type, data_object, options, callback)   {
  let path =  object_type;
  if (data_object.id) {
    path +='/'+data_object.id
  } else {
    path +=  '/'+data_object[meta.keys[object_type].key_id]
  } 
  callAPI (path, {}, data_object, "put", callback) 

}

export function deleteData (object_type, data_object, options, callback)   {
  const path =  object_type  +'/'+data_object[meta.keys(object_type).key_id]
  callAPI (path, data_object, "delete", callback) 
}


export function handleSubmit (event, formValues, mode, context, object_type, object_model, field_models, handleSubmit, id_field="id", filesTouched, delay_dirty=false) {

  if (context.context_id && object_model.with_context && ["create","list_create"].includes(mode) && !formValues.core_subsite) {
    formValues.core_subsite = context.context_id
  }
  if (context.user && context.user.id) {
    formValues.creation_user = context.user.id 
  }

  if (!formValues[id_field]) {

    postData(object_type, formValues, {}, (insert_result, error) => { 
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

    putData(object_type, formValues, {}, (result, error) => { 

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
}

