import * as log from './log.js';
import axios from 'axios';
import * as meta from './meta.js';

export function getPathBase () {
      // later this will be a config
      return "/api/v1"
} 

export function getParamsObject(params=[], options={}) {
    // prepares parameter object for axios
    if (!options) {
      return
    }
    let params_object = {}
    params.forEach(param => {
      if (options[param]) {
          params_object[param] = options[param]
        }
    });
    return (params_object)
}

export function callAPI (path="", params={}, data_object={}, method="get", callback)   {
  var url = getPathBase() + "/"  + path
  //alert ("path and params " + path + " " + JSON.stringify(params))
  axios({
   method: method,
   url: url,
   data:{data_object},  
   params:params
 }).then(results => {
    
      callback(results.data,"");
  }).catch(error => {
    const error_prompt = 'error connecting to server with url: ' + url + " method: " + method + " params: " + JSON.stringify(params) + " data: " + JSON.stringify(data_object) + " "
    log.val(error_prompt + error.message + " " + error.stack)
    alert (error_prompt + error.message + " " + error.stack)

    callback('', error);
  })
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
  var path = options.path?options.path:object_type
  if (options.id) {
    path += '/'+options.id
  }

  const params = ["order_by", "order_by_direction", "filter_field", "filter_id", "key_type", "context_limit", "user_id"]

  callAPI (path, getParamsObject(params, options), "", "get", callback) 
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
  callAPI (path, getParamsObject(["filter_id", "filter_field"], options), {}, "get", callback) 
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


