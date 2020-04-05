
const metadata_fields = {
  // fields that are added to every table
  // fields that are added to every table
  core_fields: [
    {name:"creation_date", pretty_name:"Creation Date", data_type: "timestamp", default:"now()", required:true, index:true, system_controlled:true},
    {name:"last_updated_date", pretty_name:"Last Updated Date", data_type: "timestamp", default:"now()", required:true, index:true, system_controlled:true},
    {name:"creation_user", pretty_name:"Creation User", data_type:"integer", references:"core_user", system_controlled:true},
  ],
  core_subsite_field: [
    {name:"core_subsite", pretty_name:"Core Subsite FROM CORE", data_type:"integer", references:"core_subsite", system_controlled:true}
  ],
  // subsites are within a tenant. Tables are striped with the subsite_id
  // Roles will be linked to subsite
 // later: limit to 3 levels for now.  Data model will support infinite, but keep things simple
  core_subsite: [
    {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"name", pretty_name: "Subsite", data_type: "string", pretty_key:true, index:true},
    // level is a denormlization as you could technically figure it out from core_subsite_hierarchy
    // top level is 1. 
    {name:"level", pretty_name: "Level", data_type: "integer", start_value:1, end_value:3, index:true, default:1}
  ],
  // denormalization
  // this one row for each subsite, pluse one row for each subsite in it's heirarcy
  // used for efficients queries like "if I have admin on subsite 1, what other subsites to I have admin on"
  core_subsite_hierarchy: [
    {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"core_subsite", pretty_name:"Core Subsite", data_type:"integer", references:"core_subsite", index:true},
    // named ancestor, but we also store the subsite itself with levels_removed = 0. 
    // done to make queries like "show me everything you have access to efficient"
    {name:"ancestor", pretty_name:"Ancestor", data_type:"integer", references:"core_subsite", index:true},
    // 0 if core_subsite and ancestor are the same (the leaft subsite)
    {name:"generations_removed", pretty_name: "Level", data_type: "integer", index:true}
  ],
  core_country: [
    {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"name", pretty_name: "Country", data_type: "string", pretty_key:true},
  ],
  core_state_province: [
    {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"name", pretty_name: "State nor Province", data_type: "string", pretty_key:true},
  ],
  core_user: [
    {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"first_name", section:"basic", grid_col:6,pretty_name: "First Name",required:true, data_type: "string"},
    {name:"last_name", section:"basic",grid_col:6, pretty_name: "Last Name", required:true, data_type: "string"},
    {name:"full_name", pretty_key:true, derived:"{first_name}  {last_name}",  section:"basic", pretty_name: "Full Name", data_type: "string"},
    {name:"thumbnail", section:"thumbnail", pretty_name: "Thumbnail", data_type: "image", input_type: "image"},
    {name:"email", section:"basic", pretty_name: "Email", required:true, data_type: "string"},
    {name:"country", section:"location", grid_col:6, pretty_name: "Country", references:"core_country"},  
    {name:"state", section:"location", grid_col:6,  pretty_name: "State or Province", references:"core_state_province"},  
    {name:"twitter", section:"additional", pretty_name: "Twitter Handle",  data_type: "string"},
    {name:"phone", section:"additional", pretty_name: "Phone",  data_type: "string"},
  ],
  core_credential: [
    {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"core_user", pretty_name:"User", references:"core_user", index:true,  system_controlled:true},
    {name:"credential", section:"basic",grid_col:6, pretty_name: "Password", required:true, data_type: "string", input_type:"password"},
  ],
  core_site_admin: [
    {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"core_user", pretty_name:"Site Administrator Name", references:"core_user", index:true, pretty_key:true, prevent_edit:true}
  ], 
  core_role: [
    {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"name", pretty_name:"Role Name", data_type:"string", index:true, pretty_key:true}
  ],
  core_subsite_role: [
    {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"core_user", pretty_name:"Name", references:"core_user", index:true, pretty_key:true},
    {name:"core_subsite", pretty_name:"Subsite", data_type:"integer", references:"core_subsite",  index:true},
    {name:"core_role", pretty_name:"Role",data_type:"string", references:"core_role", index:true}
  ],
  // one object type will be designated as context (and used to drive the user interface)
  // this object my be linked to a context
  core_context_subsite_map: [
    {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
    // id of a row from the context object_type
    // general use case / application code will have 1-to-1 object to subsite
    // however, the data model gives flexibity to support mony-to-1
    {name:"core_subsite", pretty_name:"Subsite", references:"core_subsite", index:true, pretty_key:true},
    {name:"core_context", pretty_name:"Context Id", data_type:"integer", index:true},

  ],

}

//module.exports = {
//  metadata_fields
//}
//export default metadata_fields

export default  metadata_fields

