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

export function getAuthScopeAndPriv(object_model,auth_action="read",app_params, auth_scope,auth_priv, trace) {
  if (!auth_priv) {
      let auth_action_privs;
      if (object_model) {
        auth_action_privs = object_model.auth_action_privs
      } else if (app_params) {
        auth_action_privs = app_params.auth_action_privs.site_default
      }
      let auth_and_scope 
      if (auth_action_privs) {
        auth_and_scope = auth_action_privs[auth_action].split("_")
        auth_scope = auth_and_scope[0]
        auth_priv = auth_and_scope[1]
      } else {
        auth_scope = "site";
        auth_priv="public"
      }
  } else {
      if (!auth_scope) {
        if (object_model.with_context) {
          auth_scope = "context"
        } else {
          auth_scope = "site"
        }
      }
  }
  return [auth_scope, auth_priv]
}

//  const authorized = auth.authorized({context_id:context.context_id, user:context.user}, auth_scope, 
//auth_priv, auth_action, object_type_meta, data, app_params)

export function authorized(context, auth_scope, auth_priv, auth_action="read", object_model={}, data="",app_params={}) {



  [auth_scope,auth_priv] = getAuthScopeAndPriv(object_model,auth_action, app_params,auth_scope,auth_priv);
  let exception_fields = []
  if (object_model && auth_action === "read" && object_model.read_priv_exception_user_fields) {
      exception_fields = object_model.read_priv_exception_user_fields;
  }
  if (object_model && auth_action === "edit"  && object_model.edit_priv_exception_user_fields) {
    exception_fields = object_model.edit_priv_exception_user_fields;
  }
  if (object_model && auth_action === "delete" && object_model.delete_priv_exception_user_fields) {
    exception_fields = object_model.delete_priv_exception_user_fields;
  }

  for (const exception_field of exception_fields) {
        let data_value = getDataValue(data,exception_field);
        if (data_value === context.user.id) {
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
// WHY WOULD PRIV BE READ?
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