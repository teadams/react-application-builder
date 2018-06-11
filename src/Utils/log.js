 

export function log(text) {
  console.log(text);
}

export function val(names, ...params) {
  if (params.length == 0) {
    log(names);
  }
  names = names.split(',');
  for (var i in params) {
      log( names[i].trim().toLowerCase().split(' ').map(function(word) {      
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ') + ": " + JSON.stringify(params[i]))
  }
}


export function mark(marker, names, ...params) {
    log ('   ### Marker: ' + marker + ' ###');
    if (names) {exports.val(names, ...params)};
    log(' ');
}
  
export function func(func,names, ...params)  {
  log(' ');
  log("********** Function: " + func + " **********");
  if (params.length > 0) {
    val(names,...params);
  }

  log(' ');
};
  
  
  