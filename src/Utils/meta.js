import {app_params, metadata_menus, metadata_fields, metadata_object_types, metadata_sections} from '../Models/Test';
import * as log from './log.js';

export function object(object_type) {
  //  log.func('object', 'object type, metadata_object_types', object_type,metadata_object_types);
    return (metadata_object_types.reduce ((accum, meta_object_type) => {
  //  log.val('object_type, meta object type accum', object_type, accum);
    return (meta_object_type.name === object_type)?meta_object_type:accum
  },{})) 
}

export function fields(object_type) {
//    log.val('meta fields for ', object_type);
//alert ('fields object type ' + object_type)
    return metadata_fields[object_type];
}

export function field(object_type, field_name) {
  //    log.val('meta fields for ', object_type);
    //log.func("fucntion field", "object type, field name", object_type, field_name)
    //log.val("object type fields", fields(object_type))
    const field =  (fields(object_type).reduce((acc, field) => {
      //  log.val("acc, field", acc, field);
        if (field.name == field_name) {
            return field
        }
        return acc
    },{}))
    //log.val("FIELD IS", field);
    return field;
}

export function keys (object_type) {
//    log.val('finding key for ', object_type);
    const field_meta = fields(object_type);
//    log.mark('finding keys', ('object_type, field_meta'), object_type, field_meta);
    return (field_meta.reduce ((ids, field) => {
    //      log.val('ids, looping field', ids, field)
          if (field.pretty_key) {
      //        log.val('pretty key id', field.name)
              ids.pretty_key_id = field.name
          } else if (field.key) {
        //      log.val('key id', field.name)
              ids.key_id = field.name
          }
//          log.val('ids', ids);
          return ids;
    },{}))
  }
  
export function key_field(object_type) {
  const field_meta = fields(object_type);
  return (
    field_meta.reduce ((ids, field) => {
  //    log.val ('ids, field', ids, field)
      return field.key?field:ids 
    },{})
    )
}

// the database column of the field used as the key
export function id_column(object_type) {
  return key_field(object_type)['name'];
}

export function pretty_key_field(object_type) {
  const field_meta = fields(object_type);
  return (
    field_meta.reduce ((ids, field) => {
  //    log.val ('ids, field', ids, field)
      return field.pretty_key?field:ids 
    },{})
    )
}

// the database column of the field used as the pretty key
export function pretty_name_column(object_type) {
  return pretty_key_field(object_type)['name'];
}

// the pretty name for the field used as the pretty keys
// this is what would appear on the table header in the UI
export function pretty_name_field_pretty_name(object_type) {
  return pretty_key_field(object_type)['pretty_name'];
}

export function get_menu(menu_type) {
    return metadata_menus[menu_type];
}

export function get_selected_menu(selected_menu_index, menu_type) {
  if (!menu_type) {
    menu_type = "app_menu"
  }
  
  log.func('get selected menu', 'selected_index, metadata_menus, app_menu', 
    selected_menu_index, metadata_menus, metadata_menus.app_menu);
  
  return (get_menu(menu_type).reduce ((accum,menu_item) => {
      log.val('menu item', menu_item)
      if (selected_menu_index == menu_item.index) {
          return (menu_item);
      } else { return accum}
  },""));
  
}

export function get_param(param) {
  return app_params[param];
}

// get the index in the array where field_name is field_value
export function get_index (array_name, field_name, field_value) {
  log.func("get index", "array_name, field_name, field_value", array_name, field_name, field_value)
  const index = array_name.reduce ((accum, element, element_index) => {
    if (element[field_name] === field_value) {
      return element_index  
    } else {
         return accum
    }
  }, "")
  
  return index
}


export function sections(object_type, section_names) {
    if (!section_names) {
      return metadata_sections[object_type]
    } else {    
//alert ('section name is ' + section_names)
      const section_name_array = section_names.split(",");
//    alert ('section name array ' + section_name_array)
      return metadata_sections[object_type].filter (section => {
        //alert ('section is ' + JSON.stringify(section))
          if (section_name_array.indexOf(section.name)>=0) {
            return true
          } else {
            return false
          }
      })
    } 
}



export function section_fields (object_type, section_name) {
    return fields(object_type).filter (field => {
      if (field.section === section_name || !field.section && !section_name) {
        return true
      } else {
        return false
      }}
    )
}


export function unmapped_field (mapping_object_type, unmapped_field_name) {
  //      alert ('meta function mapping ojbect type is ' + mapping_object_type)
  //      alert ("field is " + JSON.stringify(fields(mapping_object_type)))
    return fields(mapping_object_type).filter ( field => {
      if (field.name != unmapped_field_name && field.map_field ) {
          return true
      } 
    })[0]
}

export function mapping_additional_fields (mapping_object_type) {
    return fields(mapping_object_type).filter ( field => {
      if (!field.key && !field.map_field ) {
          return true
      } 
    })
}

export function grouping_column_info(object_type, grouping_field_name) {
  // returns the appropriate grouping field name and object type
  // (which is dependent if the grouping_field_name is a reference or not)
  //alert ('groupoing field name object type' + grouping_field_name +' ' + object_type)
  const grouping_field = field(object_type, grouping_field_name)
  // alert ('grouping field is ' + JSON.stringify(grouping_field))
  if (grouping_field.references) {
    const  grouping_object_type = grouping_field.references
  //  alert ('grouping object type in meta ' + grouping_object_type)
    const grouping_keys = keys(grouping_object_type)
    return ( [grouping_field_name+'_'+grouping_keys.pretty_key_id, grouping_object_type] )
  } else {
    return ( grouping_field_name )
  } 
}

export function get_display_value(object_type, field_name, data) {
    const display_field = field(object_type, field_name)
    function derivedMatch(match, p1, offset, string) {
        log.val ("p1", p1)
       return (data[p1])
    }

    if (data[field_name] === null || data[field_name] === "") {
        return ""
    }  else if (display_field.references) {
        const referenced_table = display_field.references;
        const referenced_pretty_id_column = keys(referenced_table).pretty_key_id
        const referenced_field = field(referenced_table, referenced_pretty_id_column)
        log.val('column ' , display_field.name +'_'+referenced_pretty_id_column)
        log.val('referenced_field', referenced_field)
        log.val('data', data)
        function derivedReferencedMatch(match, p1, offset, string) {
            log.val ("p1", p1)
           return (data[field_name+"_"+p1])
        }
        if (referenced_field.derived) {
          return (referenced_field.derived.replace(/{(.*?)}/ig, derivedReferencedMatch));
        } else {
          return (data[display_field.name +'_'+referenced_pretty_id_column])
        }
    } else if (display_field.derived) {
      log.func("get display values")
      log.val ('field',display_field)
      log.val('data', data)
      log.val('display field derived', display_field.derived)
      return (display_field.derived.replace(/{(.*?)}/ig, derivedMatch));
    } else if (display_field.mapping) {
        // mappings do not have a base display value
        return ""
    } else  {
        return (data[field_name].toString())
    }
}