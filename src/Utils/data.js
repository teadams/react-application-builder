import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import moment from 'moment'; 
import axios from 'axios';

//import * as u from './utils.js';
import * as log from './log.js';
import * as u from './utils.js'


export function getPathBase (object_model) {
    if (!object_model || !object_model.base_api_path) {
      // later this will be a config
        return "/api/v1"
    } else {
        alert ("base is " + object_model.base_api_path)
        return object_model.base_api_path
    }
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
  let data = ""
  let api_result = {}
  if (data_object) {
    // this approach is needed for file uploads 
    // anything might be a file update due to the flexible
    // metadata
    let multi_object = new FormData();
    Object.keys(data_object).forEach(key => {
      // protects dates 
      if (typeof data_object[key] === 'object' && !(data_object[key] instanceof Blob) && !moment.isMoment(data_object[key])) {    
        data_object[key] = JSON.stringify(data_object[key])
      }
      multi_object.append(key, data_object[key])
    })
    data_object = multi_object
  }
  const jwt_token = JSON.parse(localStorage.getItem('user'));
  let auth_header;
  if (jwt_token) {
    auth_header = { 'x-access-token': jwt_token }
  }
  api_result = await axios({
    method: method,
    url: path,
    data:data_object,
    params:params,
    headers:auth_header
  }).catch(error => {
    const error_prompt = 'error connecting to server with url: ' + path + " method: " + method + " params: " + JSON.stringify(params) + " data: " + JSON.stringify(data_object) + " "
    alert (error_prompt + error.message + " " + error.stack)
    if (callback) {
        callback('', error);
      }
  })
  if (api_result) {
      if (api_result.data.status === "validation_error") {
        u.a("Validation Error", api_result.data.validation_errors)
      }
      if(api_result.data.status === "error") {
        if (api_result.data.validation_errors) {
          u.a("Validation Error", api_result.data.validation_errors)
        }
        if (api_result.data.authorization_errors) {
          localStorage.removeItem("user");
          // call the same API with no username
          return callAPI (path, params, data_object, method, callback)
        }
        if (api_result.data.parsing_errors) {
          u.a("Parsing Error", api_result.data.parsing_errors)
        }
        data ={}
      } else {
        if (api_result.data.jwt_token) {
          localStorage.setItem("user", JSON.stringify(api_result.data.jwt_token));
        }
        data = api_result.data
      }
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
 }).then(results => {
      
      callback(results.data,"");
  }).catch(error => {
    alert ("error getting url " + url + "  "+ error.message)
    callback('', error);
  })
}

export function getData (object_type, options={}, callback)   {
  // in get data
  let path = options.path
  if (!options.path) {
    path = options.base_api_path?options.base_api_path:getPathBase()
    path = path + "/" + object_type
    if (options.id || options.id === 0) {
      path += '/'+options.id
    }
  }

  callAPI (path, getParamsObject(options), "", "get", callback) 
}

// INSERTS 
export function postData (object_type, data_object, options, callback)   {
  let path = options.path
  if (!options.path) {
    path = options.base_api_path?options.base_api_path:getPathBase()
    path = path + "/" + object_type
  }

  callAPI (path, {}, data_object, "post", callback) 
}

export function login (data_object, callback)   {
  const path = getPathBase() + "/auth/login"
  callAPI (path, {}, data_object, "post", callback) 
}

export function getUserContext (user_id, callback)   {
  const path = getPathBase()+"/auth/user-context/" + user_id
  callAPI (path, {}, "", "get", callback) 
}

export function createAccount (data_object, callback)   {
  const path = getPathBase()+"/auth/create-account"
  callAPI (path, {}, data_object, "post", callback) 
}

/// UPDATES
export function putData (object_type, data_object, options, callback)   {

  let path = options.path
  if (!options.path) {
    path = options.base_api_path?options.base_api_path:getPathBase()
    path = path + "/" + object_type
    if (data_object.id || data_object.id === 0) {
      path += '/'+data_object.id
    }
  }
  callAPI (path, {}, data_object, "put", callback) 
}

export function deleteData (object_type, data_object, options, callback)   {

  let path = options.path
  if (!options.path) {
    path = options.base_api_path?options.base_api_path:getPathBase()
    path =  object_type  +'/'+data_object.id;
  }

  callAPI (path, data_object, "delete", callback) 
}


export function handleSubmit (event, formValues, mode, context, object_type, object_model, field_models, handleSubmit, id_field="id", filesTouched, delay_dirty=false, options={}) {

  if (context.context_id && object_model.with_context && ["create","list_create"].includes(mode) && !formValues.core_subsite) {
    formValues.core_subsite = context.context_id
  }
  // ROADMAP - deprecate due to jwt token
  if (context.user && context.user.id) {
    formValues.creation_user = context.user.id 
  }

  let path = options.path
  if (!options.path) {
    path = options.base_api_path?options.base_api_path:getPathBase(object_model)
    path += "/"+object_type 
    if (formValues.id) {
      path += '/'+formValues.id;
    }
  }

  if (!formValues[id_field]) {

    postData(path, formValues, {}, (insert_result, error) => { 
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
          context.setDirty(object_type);
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

    putData(path, formValues, {}, (result, error) => { 

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
          context.setDirty(object_type);
        }
      }
    })
  }
}

