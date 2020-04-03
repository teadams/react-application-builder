import * as log from './log.js';
import axios from 'axios';
import * as meta from './meta.js';

export function get_url_path_base () {
      // later this will be a config
      return "/api/v1/"
} 

export function getData (object_type, options, callback)   {
  var urltext = '/api/v1/' + object_type;

  //alert ('options  ' + JSON.stringify(options))
  if (options.id) {
    urltext += '/'+options.id
  }
  var param_clause = []
  if (options.order_by) {
    param_clause.push("order_by="+options.order_by)
  }
  if (options.order_by_direction) {
    param_clause.push("order_by_direction="+options.order_by_direction)
  }

  if (options.filter_id) {
    param_clause.push("filter_field="+options.filter_field+"&filter_id="+options.filter_id)
  }
  if (options.key_type) {
    param_clause.push("key_type="+options.key_type)
  }
// alert (' param clause is ' + param_clause)
  urltext += "?"+param_clause.join("&")
  //alert ('urltext ' + urltext)
  
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