const metadata_fields = {
  // fields that are added to every table
  core_fields: {
    creation_date:
      {pretty_name:"Creation Date", data_type: "timestamp", default:"now()", required:true, index:true, system_controlled:true},
    last_updated_date:
      { pretty_name:"Last Updated Date", data_type: "timestamp", default:"now()", required:true, index:true, system_controlled:true},
    creation_user: 
      {pretty_name:"Creation User", data_type:"integer", references:"core_user", system_controlled:true},
  },
  core_subsite_field: {
    core_subsite: { pretty_name:"Core Subsite", data_type:"integer", references:"core_subsite", system_controlled:true}
  },
  // subsites are within a tenant. Tables are striped with the subsite_id
  // Roles will be linked to subsite
 // later: limit to 3 levels for now.  Data model will support infinite, but keep things simple
  core_subsite: {
    id: { pretty_name: "Id", data_type: "integer", required:true, key:true},
    name: { pretty_name: "Subsite", data_type: "string", pretty_key:true, index:true},
    // level is a denormlization as you could technically figure it out from core_subsite_hierarchy
    // top level is 1. 
    level: { pretty_name: "Level", data_type: "integer", start_value:1, end_value:3, index:true, default:1}
  },
  // denormalization
  // this one row for each subsite, pluse one row for each subsite in it's heirarcy
  // used for efficients queries like "if I have admin on subsite 1, what other subsites to I have admin on"
  core_subsite_hierarchy: {
    id: { pretty_name: "Id", data_type: "integer", required:true, key:true},
    core_subsite: { pretty_name:"Core Subsite", data_type:"integer", references:"core_subsite", index:true},
    // named ancestor, but we also store the subsite itself with levels_removed = 0. 
    // done to make queries like "show me everything you have access to efficient"
    ancestor: { pretty_name:"Ancestor", data_type:"integer", references:"core_subsite", index:true},
    // 0 if core_subsite and ancestor are the same (the leaft subsite)
    generations_removed: { pretty_name: "Level", data_type: "integer", index:true}
  },
  core_country: {
    id: { pretty_name: "Id", data_type: "integer", required:true, key:true},
    name: { pretty_name: "Country", data_type: "string", pretty_key:true},
  },
  core_state_province: {
    id: { pretty_name: "Id", data_type: "integer", required:true, key:true},
    name: { pretty_name: "State nor Province", data_type: "string", pretty_key:true},
  },
  core_user: {
    id: { pretty_name: "Id", data_type: "integer", required:true, key:true},
    first_name: { section:"basic", grid_col:6,pretty_name: "First Name",required:true, data_type: "string"},
    last_name: { section:"basic",grid_col:6, pretty_name: "Last Name", required:true, data_type: "string"},
    full_name: { pretty_key:true, derived:"{first_name}  {last_name}",  section:"basic" , pretty_name: "Full Name", data_type: "string"},
    thumbnail: { section:"thumbnail" , pretty_name: "Thumbnail", data_type: "image", input_type: "image"},
    email: { section:"basic" , pretty_name: "Email", required:true, data_type: "string"},
    country: { section:"location", grid_col:6, pretty_name: "Country", references:"core_country"},  
    state: { section:"location", grid_col:6,  pretty_name: "State or Province", references:"core_state_province"},  
    twitter: { section:"additional", pretty_name: "Twitter Handle",  data_type: "string"},
    phone: { section:"additional:", pretty_name: "Phone",  data_type: "string"},
  },
  core_credential: {
    id: { pretty_name: "Id", data_type: "integer", required:true, key:true},
    core_user: { pretty_name:"User", references:"core_user", index:true,  system_controlled:true},
    credential: { section:"basic",grid_col:6, pretty_name: "Password", required:true, data_type: "string", input_type:"password"},
    credential_confirm: { section:"basic",grid_col:6, pretty_name: "Password Confirmation", required:true, data_type: "string", input_type:"password",not_in_db:true},
  },
  core_site_admin: {
    id: { pretty_name: "Id", data_type: "integer", required:true, key:true},
    core_user: { pretty_name:"Site Administrator Name", references:"core_user", index:true, pretty_key:true}
  },
  core_role: {
    id: { pretty_name: "Id", data_type: "integer", required:true, key:true},
    name: { pretty_name:"Role Name", data_type:"string", index:true, pretty_key:true},
    description: { section:"basic",grid_col:6, pretty_name: "Role Description", data_type: "string"}
  },
  core_subsite_role: {
    id: { pretty_name: "Id", data_type: "integer", required:true, key:true},
    core_user: { pretty_name:"Subsite Administrator Name", references:"core_user", index:true, pretty_key:true},
    core_subsite: { pretty_name:"Subsite", references:"core_subsite", index:true},
    core_role: { pretty_name:"Role",data_type:"string", references:"core_role", index:true},
    status: { section:"admin",grid_col:6, pretty_name: "Status", data_type: "string", valid_values:"Applied, Accepted, Denied, Retired", default:"Applied"},
  },
  // one object type will be designated as context (and used to drive the user interface)
  // this object my be linked to a context
  core_context_subsite_map: {
    id: { pretty_name: "Id", data_type: "integer", required:true, key:true},
    // id of a row from the context object_type
    // general use case / application code will have 1-to-1 object to subsite
    // however, the data model gives flexibity to support mony-to-1
    core_subsite: { pretty_name:"Subsite", references:"core_subsite", index:true, pretty_key:true},
    core_context: { pretty_name:"Context Id", data_type:"integer", index:true},
  },

}

//module.exports = {
//  metadata_fields
//}
//export default metadata_fields

export default  metadata_fields

