
const metadata_fields = {
  nwn_project_message: [
    {name:"id",  section:"basic",  pretty_name: "Id", data_type: "integer", required:true, key:true},
      // if use_context is true, the create form will take the initial value from the context variables
    {name:"from_user", section:"basic", pretty_name:"From", references:"core_user", use_context:true, index:true, pretty_key:true},
    {name:"to_user", section:"basic", pretty_name:"To", references:"core_user", index:true, pretty_key:true},
    {name:"nwn_project", section:"basic", pretty_name: "Project", references:"nwn_project", index:true}, 
    {name:"subject",default:"interested in your project", grid_col:12, section:"basic", pretty_name: "Subject", index:true, pretty_key:"true"}, 
    {name:"body",  grid_col:12, size:"large", section:"basic",  pretty_name: "Body", data_type: "string"},
    {name:"read_p", section:"hidden", pretty_name: "Read?",  data_type: "boolean", default:false},
    {name:"nwn_project_volunteer", section:"hidden", pretty_name: "Volunteer", references:"nwn_project_volunteer", index:true}
  ],
  nwn_project_post: [
    {name:"id",  section:"basic",  pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"nwn_project", section:"basic", pretty_name: "Project", references:"nwn_project", index:true}, 
    {name:"name", section:"basic", pretty_name: "Title", index:true, pretty_key:"true"}, 
    {name:"body",  section:"basic",  pretty_name: "Description", data_type: "string"},
    {name:"url",  section:"basic",  pretty_name: "You Tube URL", data_type: "string", input_type:'string',  you_tube:true},
    {name:"image",  section:"basic",  pretty_name: "Image", data_type: "image", input_type: "image"},
    {name:"role_type", section:"basic", pretty_name: "Role Type", references:"nwn_role_type", index:true},
    {name:"status", section:"admin",grid_col:6, pretty_name: "Status", data_type: "string", valid_values:"Active, Inactive", default:"Active"},
  ],
  nwn_project_video: [
    {name:"id",  section:"basic",  pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"nwn_project", section:"basic", pretty_name: "Project", references:"nwn_project", index:true}, 
    {name:"name", section:"basic", pretty_name: "Title", index:true, pretty_key:"true"}, 
    {name:"description",  section:"basic",  pretty_name: "Description", data_type: "string"},
    {name:"url",  section:"basic",  pretty_name: "URL", data_type: "string", you_tube:true},
    {name:"primary_video", section:"admin",grid_col:6, pretty_name: "Primary", data_type: "boolean", default:true},
    {name:"status", section:"admin",grid_col:6, pretty_name: "Status", data_type: "string", valid_values:"Active, Inactive", default:"Active"},
  ],
  nwn_project_document: [
    {name:"id",  section:"basic",  pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"nwn_project", section:"basic", pretty_name: "Project", references:"nwn_project", index:true}, 
    {name:"name", section:"basic", pretty_name: "Title", index:true, pretty_key:"true"}, 
    {name:"description",  section:"basic",  pretty_name: "Description", data_type: "string"},
    {name:"url",  section:"basic",  pretty_name: "URL", data_type: "string"},
  ],
  nwn_project_need: [
    {name:"id",  section:"basic",  pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"name", section:"basic", pretty_name: "Role Type", references:"nwn_role_type", index:true, pretty_key:"true"},
    {name:"nwn_project", section:"basic", pretty_name: "Project", references:"nwn_project", index:true}, 
    {name:"description",  section:"basic",  pretty_name: "Description", data_type: "string"},
    {name:"status", section:"admin",grid_col:6, pretty_name: "Status", data_type: "string", valid_values:"Recruiting, Filled", default:"Recruiting"},
  ],
  nwn_role_type: [
    {name:"id",  section:"basic",  pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"name", section:"basic",grid_col:6, pretty_name: "Role Type", data_type: "string", pretty_key:"true"},
    {name:"description", section:"basic",grid_col:6, pretty_name: "Role Description", data_type: "string"}
  ],
  nwn_project_volunteer: [
    {name:"id",  section:"basic",  pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"name", section:"basic", pretty_name:"Volunteer Name", references:"core_user",  use_context:true, index:true, pretty_key:true},
    {name:"nwn_project", section:"basic", pretty_name: "Project", references:"nwn_project", index:true}, 
    {name:"role_type", section:"basic",grid_col:6, pretty_name: "Role Type", data_type: "string"},
    {name:"status", section:"admin",grid_col:6, pretty_name: "Status", data_type: "string", valid_values:"Applied, Accepted, Denied, Retired", default:"Applied"},
    {name:"leader_notes", section:"admin",grid_col:6, pretty_name: "Leader Notes", data_type: "string"}
  ],
  nwn_project: [
    {name:"id",  section:"basic",  pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"name", section:"basic",grid_col:6, pretty_name: "XXXXXXX Name", data_type: "string", pretty_key:"true"},
    {name:"type", section:"basic",grid_col:6, pretty_name: "Project Type", references:"nwn_project_type", index:true},
    {name:"leader", section:"basic", pretty_name:"Project Leader", references:"core_user", index:true,  use_context:true},
    {name:"summary", section:"basic", grid_col:6, pretty_name: "Short Summary", data_type: "string"},
    {name:"description", section:"basic", grid_col:12, pretty_name: "Project Description", size:"large", data_type: "string"},
    {name:"street_address", section:"location", grid_col:12, pretty_name: "Street Address",  data_type: "string"},
    {name:"city", section:"location", grid_col:6, pretty_name: "City",  data_type: "string"},
    {name:"state",  section:"location", grid_col:6, pretty_name: "State or Province", references:"core_state_province"},
    {name:"country", section:"location", grid_col:6, pretty_name: "Country", references:"core_country"}, 
    {name:"zip_code", section:"location", grid_col:6, pretty_name: "Zip Code",  data_type: "string"},
    {name:"latitude", section:"geo", pretty_name: "Latitude", data_type: "string"},
    {name:"longitude", section:"geo", pretty_name: "Longitude", data_type: "string"},
// image field will store an object with height
// width and alt tag.  Images themselves will
// be stored in a core images object.
// For now, this will be in the database.  Later,
// this object type can be expanded to store in S3
// or file system
    {name:"thumbnail", section:"more", pretty_name: "Thumbnail Image", data_type: "image", input_type: "image"},
    {name:"project_needs", section:"needs", referenced_by:"nwn_project_need", pretty_name:"Project Needs", grid_col:12},
    {name:"project_videos", section:"videos", referenced_by:"nwn_project_video", pretty_name:"Project Videos", grid_col:12},
    {name:"project_documents", section:"documents", referenced_by:"nwn_project_document", pretty_name:"Project Documents", grid_col:12},
    {name:"status", section:"admin",grid_col:6, pretty_name: "Status", data_type: "string", valid_values:"Preparation, OnGoing, Success, OnHold", default:"Applied"},
  ],
  nwn_project_type: [
    {name:"id", section:"basic", pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"name", section:"basic", grid_col:12, pretty_name: "Project Type", data_type: "string", pretty_key:true},
    {name:"thumbnail",  grid_col:12, section:"thumbnail", pretty_name: " ", data_type: "image", input_type: "image"},
  ]
}

//module.exports = {
//  metadata_fields
//}
export default metadata_fields
