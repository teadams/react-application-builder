import * as log from './log.js';
import axios from 'axios';


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
  if (options.filter_id) {
    param_clause.push("filter_field="+options.filter_field+"&filter_id="+options.filter_id)
  }
  if (options.key_type) {
    param_clause.push("key_type="+options.key_type)
  }
// alert (' param clause is ' + param_clause)
  urltext += "?"+param_clause.join("&")
// alert ('urltext ' + urltext)
  axios({
   method: 'get',
   url: urltext,
 }).then(results => {
      callback(results.data,"");
  }).catch(error => {
    log.val('in catch error', error.message)
    callback('', error);
  })
}