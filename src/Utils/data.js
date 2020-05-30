import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import * as u from './utils.js';
import * as log from './log.js';
import axios from 'axios';
import * as meta from './meta.js';
import AuthContext from '../Components/User/AuthContext';


export function getPathBase () {
      // later this will be a config
      return "/api/v1"
} 

export function validAPIParams() {
    return ["order_by", "order_by_direction", "filter_field", "filter_id", "filter_join", "key_type", "context_limit", "user_id", "subsite_id" ,"parent_field", "grouping_field", "expand_hierarchy"]
}


export function addAPIParams(trigger_change_array, api_options) {
    validAPIParams().forEach(param => {
      if (api_options && api_options[param]) {
        trigger_change_array.push(api_options[param])
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
              ["filter_id", "filter_field", "filter_join"].includes(param)) {
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
  if (object_type=="core_subsite") {
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

export function createAccount (data_object, callback)   {
  callAPI ("auth/create-account", {}, data_object, "post", callback) 
}

export function getCount (object_type, options, callback)   {
  const path = 'count/' + object_type;
  callAPI (path, getParamsObject(options, ["filter_id", "filter_field", "filter_join"]), {}, "get", callback) 
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


