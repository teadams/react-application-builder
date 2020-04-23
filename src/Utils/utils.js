import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

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
  if (params.length == 0) {
      return
  }
  let {alert_text, i, var_name, var_alert} = {alert_text:[], i:0, var_name:"", var_alert:""}
  for (i in params) {
    var_alert  = stringify(params[i]) + "; "
    alert_text.push(var_alert)
  }
  alert (alert_text.join ("\n"))
}


// super quick way to pop up alert with variables
export function aa(var_names, ...params) {
    if (params.length == 0) {
        alert(var_names)
    }
    let {alert_text, i, var_name, var_alert} = {alert_text:[], i:0, var_name:"", var_alert:""}
    var_names = var_names.split(",")
    for (i in params) {
      var_name = var_names[i]
      var_alert = var_name + ": " + stringify(params[i])
  //    var_alert = var_name
  //    alert ("Var alert is " + var_alert)
      alert_text.push(var_alert)
    }
    alert (alert_text.join ("\n"))
}


function stringify(str) {
  try {
      return (JSON.stringify(str));
  } catch (e) {
      return "!! CAN NOT DISPLAY VALUE !! ";
  }
}