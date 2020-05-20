import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

export function capitalize(string) {
 return string.charAt(0).toUpperCase() + string.slice(1);
}
export function isEmptyObject (object) {
  if (object) {
    for (var key in object) {
           if (hasOwnProperty.call(object, key)) return false;
    }
  }
  return true  
}


// super quick way to pop up alert with variables
export function a(...params) {
  if (params.length === 0) {
      return
  }
  let {alert_text, i, var_name, var_alert} = {alert_text:[], i:0, var_name:"", var_alert:""}
  for (i in params) {
    if (typeof(params[i])  != "function") {
      params[i] = stringify(params[i])
    } 
    var_alert  = params[i]+ "; "
    
    alert_text.push(var_alert)
  }
  alert (alert_text.join ("\n"))
}


// super quick way to pop up alert with variables
export function aa(...params) {
    let var_names= params.length>1?params[0]:""
    if (params.length>1) {
        params = params.slice(1)
    }  
    let {alert_text, i, var_name, var_alert} = {alert_text:[], i:0, var_name:"", var_alert:""}
    var_names = var_names.split(",")
    for (i in params) {
      var_name = var_names[i]
      let var_value = params[i]
      if (typeof(var_value) != "function") {
        var_value = stringify(params[i])
      } 
      var_alert = var_name + ": " + var_value
          alert_text.push(var_alert)
    }
    alert (alert_text.join ("\n"))

}


function stringify(str) {
  try {
    if (typeof(str) === "object" && str.displayName) {
        return str.displayName
    } else {
      return (JSON.stringify(str));
    }
  } catch (e) {
      return "!! CAN NOT DISPLAY VALUE !! ";
  }
}