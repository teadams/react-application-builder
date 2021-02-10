import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js'

function getDataValue(data,string_name) {
  if (string_name.indexOf(".") > -1) {
    const split_string_name = string_name.split(".")
    const references_field = split_string_name[0]
    const final_field = split_string_name[1]
    return data[references_field][final_field]
  } else {
      return data[string_name]
  }
}

export function authorized(context, auth_scope, auth_priv, object_model={}, data="") {
  if (object_model && (object_model.user_context_key)) {
    let data_value = getDataValue(data,object_model.user_context_key);
      //u.a(auth_scope, auth_priv, data_value, context.user.id )

      // you can do anything to yourself (for now)
        if ( getDataValue(data,object_model.user_context_key) === context.user.id) {
          return true
        }
  }
  if (!auth_scope || auth_priv=="public" || ( context.user && context.user.site_admin) || (context.user && auth_priv == "user")) {
      // no auth  check; site admins get into everything
    //  alert ("user is " + JSON.stringify(context.user))
      return true 
  } else if (auth_scope && !context.user) {
      // needs to be logged in to check an auth
      return false
  } else if (auth_scope == "site")  {
    //  alert ("auth scope is site")
    //  alert ("auth prive is " + auth_priv)
      if (context.user.site_admin) {
        return true
      } else if (auth_priv == "member") {
        return true
      } else {
        return false
      }  
  } else if (auth_scope == "context" && context.user.authorization_object && context.user.authorization_object[context.context_id]) {
      if (auth_priv == "admin") {
          if (context.user.authorization_object[context.context_id].Privileges.admin ) {
            return true
          } else {
            return false
          }
      } else if (auth_priv == "member" || auth_priv == "read") {
          return true
      } else {
          if ( context.user.authorization_object[context.context_id].Privileges[auth_priv] ) {
            return true
          } else {
            return false
          } 
      } 
  } else {
    // should have covered all cases abost
    return false
  }
}