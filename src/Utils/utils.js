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