import * as log from './log.js';
import axios from 'axios';
import * as meta from './meta.js';

export function get_url_path_base () {
      // later this will be a config
      return "/api/v1/"
} 

export function getData (object_type, options={}, callback)   {
  var url_base = '/api/v1/'  // later - take from params
  var url_path = options.path?options.path:object_type
  var url_text = url_base + url_path
  if (options.id) {
    url_text += '/'+options.id
  }

  var param_clause = []
  const params = ["order_by", "order_by_direction", "filter_field", "filter_id", "key_type", "context_limit", "user_id"]

  params.forEach(param => {
    if (options[param]) {
        param_clause.push( param +"="+ encodeURI(options[param]))
      }
  });

  url_text += "?"+param_clause.join("&")
  //al  
  axios({
   method: 'get',
   url: url_text,
 }).then(results => {
      callback(results.data,"");
  }).catch(error => {
    log.val('catch error for url post', error.message)
    alert ('error retrieving data', error.message)
    callback('', error);
  })
}


export function login (data_object, callback)   {
  var urltext = '/api/v1/auth/login';
  // data object should haev email and credential
  axios({
   method: 'post',
   url: urltext,
   data: { data_object }
 }).then(results => {
      //alert ("login fucntion results is " + JSON.stringify(results.data))
      callback(results.data,"")
  }).catch(error => {
      log.val('in catch error', error )
      alert ("in catch error")
//    log.val('in catch error', error.message)
  //  alert ('error getting data', JSON.stringify(error.message))
//    callback('', error);
  })
}

export function getCount (object_type, options, callback)   {
  var urltext = '/api/v1/count/' + object_type;

  //alert ('options  ' + JSON.stringify(options))

  var param_clause = []
  if (options.filter_id) {
    param_clause.push("filter_field="+options.filter_field+"&filter_id="+options.filter_id)
  }

  urltext += "?"+param_clause.join("&")
  axios({
   method: 'get',
   url: urltext,
 }).then(results => {
  //      alert ('got data')
      callback(results.data,"");
  }).catch(error => {
    log.val('in catch error', error.message)
    alert ('error getting data', error.message)
    callback('', error);
  })
}

// INSERTS 
export function postData (object_type, data_object, options, callback)   {
  let urltext = '/api/v1/' + object_type;
  axios({
   method: 'post',
   url: urltext,
   data: { data_object }
 }).then(results => {
      log.val("post successful")
      callback(results.data,"");
  }).catch(error => {
//    log.val('in catch error', error.message)
    alert ('error getting data', error.message)
    callback('', error);
  })
}

/// UPDATES
export function putData (object_type, data_object, options, callback)   {
  let urltext = '/api/v1/' + object_type;
  if (data_object.id) {
    urltext += '/'+data_object.id
  } else {
    urltext += '/'+data_object[meta.keys[object_type].key_id]
  } 
  axios({
   method: 'put',
   url: urltext,
   data: { data_object }
 }).then(results => {
      callback(results.data,"");
  }).catch(error => {
    log.val('in catch error', error.message)
    //alert ('error getting data', error.message)
    callback('', error);
  })
}


export function deleteData (object_type, data_object, options, callback)   {
  let urltext = '/api/v1/' + object_type;
  urltext += '/'+data_object[meta.keys(object_type).key_id]
  axios({
   method: 'delete',
   url: urltext,
   data: { data_object }
 }).then(results => {
      callback(results.data,"");
  }).catch(error => {
    log.val('in db delete catch error', error.message)
    alert ('error deleting data', error.message)
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
  //      alert ('got data')
      callback(results.data,"");
  }).catch(error => {
    log.val('in catch error', error.message)
    alert ("error getting url " + url + "  "+ error.message)
    callback('', error);
  })
}