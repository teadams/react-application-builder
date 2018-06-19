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


export function sections(object_type) {
    return metadata_sections[object_type]
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