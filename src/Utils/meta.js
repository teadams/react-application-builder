import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import metadata_menus from '../Models/HealthMe/menus'
import * as log from './log.js';
import * as data from './data.js';
import * as u from './utils.js';
const custom_model="HealthMe"
let app_params = {}
let metadata_fields = {}
let metadata_object_types = {}
let metadata_sections = {}

let metadata_core = require('../Models/Core')
let metadata_custom = require('../Models/HealthMe')
// load in the core and the custom models

metadata_sections = Object.assign(metadata_sections,metadata_custom.metadata_sections);


export function object(object_type) {
//    alert ("getting attributes for " + object_type)
//    alert ("meta data object types is " + JSON.stringify(metadata_object_types))
    return metadata_object_types[object_type]
}

export function fields(object_type, restricted_fields = []) {
    if (!object_type) return {}
    if (restricted_fields.length == 0) {
      return metadata_fields[object_type];
    } else {
      return Object.keys(metadata_fields[object_type]).filter(key=> {
        field = metadata_fields[object_type][key]
        if (restricted_fields.indexOf(field.name)>=0) {
            return false
          } else {
            return true
          }
      })
    } 
}

export function model(type) {
  switch(type) {
    case "menu":
      return metadata_menus
      break
}}

export async function load(type, callback) {
  if (type=="menu") {
    callback(metadata_menus);  
    return metadata_menus
  }
  const meta_result = await data.callAPI("/meta/model/"+type, {}, {}, "get")  
      switch(type) {
        case "app_params":
          app_params = meta_result
          break
        case "object_types":
          metadata_object_types = meta_result
          break 
        case "fields":
          metadata_fields = meta_result
          
      }
    callback(meta_result)
}


export function getValueByPrecedence(attribute, default_value, ...models) {
    let value = default_value
    models.forEach (model => {
      if (model) {
          const deep_value = deepValue(attribute, model)
          value = deep_value?deep_value:value
      }
    })
    return value
}

// XX - not used?
export function getPrecedence(...params) {
  let value
  params.forEach( param => {
      if (param) {
        value = param
      }
  }) 
  return value
}

export function deepValue(key_string, object) {
      if (!object) {
        return ""
      }
      const key_segments = key_string.split(".")
      let deep_object=object
      
      for (let key of key_segments) {
        if (!deep_object[key]) {
            return ""
        } else {
            deep_object = deep_object[key]
        }
      }
      return deep_object
}

export function field(object_type, field_name) {
    return fields(object_type)[field_name]
}

export function keys (object_type) {
    const field_meta = fields(object_type);
    return (Object.keys(field_meta).reduce((ids, key) => {
          if (field_meta[key].pretty_key) {
              ids.pretty_key_id = key
          } else if (field_meta[key].key) {
              ids.key_id = key
          }
          if (!ids.key_id) {
            ids.key_id = "id"
          }
          if (!ids.pretty_key_id) {
            ids.pretty_key_id = ids.key_id
          }
          return ids;
    },{}))

  }
  
export function key_field(object_type) {
  const field_meta = fields(object_type);
  return (
    Object.keys(field_meta).reduce ((ids, key) => {
      return field_meta[key].key?field_meta[key]:ids 
    },{})
    )
}

// the database column of the field used as the key
export function id_column(object_type) {
  const field_meta = fields(object_type);
  return (
    Object.keys(field_meta).reduce ((ids, key) => {
      return field_meta[key].key?key:ids 
    },{})
    )
}

export function pretty_key_field(object_type) {
  const field_meta = fields(object_type);
  return (
    Object.keys(field_meta).reduce ((ids, key) => {
  //    log.val ('ids, field', ids, field)
      return field_meta[key].pretty_key?field_meta[key]:ids 
    },{})
    )
}

// the database column of the field used as the pretty key
export function pretty_name_column(object_type) {
  const field_meta = fields(object_type);
  return (
    Object.keys(field_meta).reduce ((ids, key) => {
  //    log.val ('ids, field', ids, field)
      return field_meta[key].pretty_key?key:ids 
    },{})
    )
}

// the pretty name for the field used as the pretty keys
// this is what would appear on the table header in the UI
export function pretty_name_field_pretty_name(object_type) {
  return pretty_key_field(object_type)['pretty_name']
}

export function get_menu(menu_type) {
    return metadata_menus[menu_type];
}

export function get_selected_menu(selected, menu_type="app_menu") {
    return (get_menu(menu_type).reduce ((accum,menu_item) => {
      if (menu_item.key && selected == menu_item.key.replace(/\s+/g, '')) {
          return (menu_item);
      } else if (selected == menu_item.label.replace(/\s+/g, '')) {
          return (menu_item);
      } else { 
        return accum
      }
  },""));  
}

export function get_param(param) { 
//  alert (" looking for param " + param)
  //alert ("loaded is " + JSON.stringify(app_params))
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


// return the sections preject in the fields for that object type
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

export function section_longest_length(object_type, section_names="", mode="view") {
    let section_name_array = []
    if (!section_names) {
        if (!metadata_sections[object_type] || metadata_sections[object_type].length == 0) {
          return section_fields(object_type, "", mode).length;
        } else {
         section_name_array  =  metadata_sections[object_type].map (section =>{
                            return section.name
                            })  
        }
    } else {
      section_name_array = section_names.split(",");
    }
    let longest_length = 0
      for (let i = 0; i < section_name_array.length; i++)  {
            if (section_fields(object_type, section_name_array[i], mode).length > longest_length) {
              longest_length = section_fields (object_type, section_name_array[i]).length
            }
      }
      return longest_length
}

export function section_fields (object_type, section_name="", mode="view") {
//  alert ("object type is " + object_type)
//  object_type = "core_user"
//  const fields = fields(object_type);
  const fields = metadata_fields[object_type]
  //alert ("fields is " + JSON.stringify(fields))
  const field_keys = Object.keys(fields)
  return field_keys.filter (key => {
    const field = fields[key]
    if (field.key) {
        // for now, all key fields are not shown to the user.
        // Their purpose is for the database.  This may evolve over time
        return false
      }
      if (field.section === section_name || !section_name) {
        if (mode === "view") {
            if (!(field.restrict_from_view)) {
              return true
            } else {
              return false
            }
       } else if (mode === "form") {
            // exclude fields that should not be shown on objectForm 
          if (field.menu_link || field.mapping || field.restrict_from_form || field.referenced_by || field.derived) {
              return false
          } else {
              return true
          }
       }
      } else {
        return false
      }}
    )
}


export function unmapped_field (mapping_object_type, unmapped_field_name) {
    const fields = fields(mapping_object_type)
    const keys = Object.keys(fields)
    return keys.filter ( key => {
      if (key != unmapped_field_name && fields[key].map_field ) {
          return true
      } 
    })[0]
}

export function mapping_additional_fields (mapping_object_type) {
    const fields = fields(mapping_object_type)
    const keys = Object.keys(fields)
    return keys.filter ( key => {
      if (!fields[key].key && !fields[key].map_field ) {
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

export function get_contributing_field_names(object_type, field_name) {
      // for derived fields -  returns the array of field names that contribute to the display values
      const original_field = field(object_type, field_name)
      if (!original_field || !original_field.derived) {
            return [field_name]
      }
      alert ("looking for a contributing field is " + object_type + " " + field_name)
      let matched_field_array = []
      let array;
      const regex = /{(.*?)}/ig
      // Saving code here in case I need this logic
      // this deal with fields used to get the display value
            // const referenced_table = original_field.references;
            // const referenced_pretty_id_column = keys(referenced_table).pretty_key_id;
            // const referenced_field = field(referenced_table, referenced_pretty_id_column);
            // if (!referenced_field.derived) {
            //     return (original_field.name +'_'+referenced_pretty_id_column)
            // } else {
            //   while ((array= regex.exec(referenced_field.derived)) !== null) {
            //     matched_field_array.push(original_field.name + '_' + array[1])
            //   }
            //   return matched_field_array
            // }      
      while ((array= regex.exec(original_field.derived)) !== null) {
          matched_field_array.push(array[1])
      }
      return matched_field_array 
}

export function get_display_value(object_type, field_name="", data) {
    if (!field_name) {
      field_name = keys(object_type).pretty_key_id
    }
    const initial_field = field(object_type, field_name)
    let final_field = initial_field;
    let final_object_type = object_type;
    let prefix = ""
  
    // check to see if the field comes from 
    // another object
    if (initial_field.field_object_type) {
          // the data object will have everything prefixed by the 
          // name of the reference field pointing to this tables    
          prefix =  reference_field(object_type,initial_field.field_object_type)
          // object_type is another table
          final_object_type = initial_field.field_object_type
          final_field = field(initial_field.field_object_type, initial_field.field_field_name)
    }

    function derivedMatch(match, p1, offset, string) {
        log.val ("p1", p1)
       return (data[p1])
    }

    if (data[prefix + final_field.name] === null || data[prefix + final_field.name] === "") {
        // field is blank
        return null
    }  else if (final_field.references) {
        const referenced_table = final_field.references;
        const referenced_pretty_id_column = keys(referenced_table).pretty_key_id
        const referenced_field = field(referenced_table, referenced_pretty_id_column)

        function derivedReferencedMatch(match, p1, offset, string) {
  
           return (data[prefix+field_name+"_"+p1])
        }
        //alert ("display field name " + display_field.name)
        //alert ("referenced_pretty_id_column " + referenced_pretty_id_column)
        //alert ("data " + JSON.stringify(data))
        if (referenced_field.derived) {
          return (referenced_field.derived.replace(/{(.*?)}/ig, derivedReferencedMatch));
        } else {
            const display_value = data[final_field.name +'_'+referenced_pretty_id_column]
            if (display_value) {
              return display_value
            } else {
              return null
            }  //          return(data[display_field.name +'_'+referenced_pretty_id_column])
        }
    } else if (final_field.derived) {
      return (final_field.derived.replace(/{(.*?)}/ig, derivedMatch));
    } else if (final_field.mapping) {
        // mappings do not have a base display value
        return ""
    } else  {
        if (data[prefix+final_field.name]) { 
          return (data[prefix+final_field.name].toString())
        } else {
          return null
        }
    }
}

export function reference_field(object_type,field_object_type) {
      let results = metadata_fields[object_type].filter (field => {
          if (field.references === field_object_type)
              return true;
//      alert ("results is "  + JSON.stringify(results))
          });
      return results[0]
}

export function reference_fields_shown(object_type,reference_table) {
      let results = Object.keys(metadata_fields[object_type]).filter (key => {
          const field = metadata_fields[object_type][key]
          if (field.field_object_type === reference_table)
              return true;
//      alert ("results is "  + JSON.stringify(results))
          });
      return results
}

export function referencing_field(referencing_object_type, referenced_object_type) {
    const referencing_object_fields = fields(referencing_object_type)
    // assumes we only have 1 field referencing this table. this may
    // need to expand
    const referencing_object_field_keys = Object.keys(referencing_object_fields)
    return ( referencing_object_field_keys.filter(key=>{
              if (referencing_object_fields[key].references === referenced_object_type) {
                  return true
              }
    })[0] )
}

export function sort_field_name (object_type) {
  // for now, assume 1 field is the sort
    const pretty_key_field_name = keys(object_type).pretty_key_id
    if (field(object_type,pretty_key_field_name).derived) {
          return (fields(object_type).filter(field=>{
              if (field.order_by) {
                return true
              }
          })[0].name)
    } else {
        return pretty_key_field_name
    }
} 