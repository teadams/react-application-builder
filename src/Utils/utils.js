export function isEmptyObject (object) {
  if (object) {
    for (var key in object) {
           if (hasOwnProperty.call(object, key)) return false;
    }
  }
  return true  
}