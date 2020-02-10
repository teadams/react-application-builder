
const metadata_fields = {
  nwn_project_message: [
    {name:"id",  section:"basic",  pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"from_user", section:"basic", pretty_name:"Project Leader", references:"nwn_user", index:true, pretty_key:true},
    {name:"to_user", section:"basic", pretty_name:"Project Leader", references:"nwn_user", index:true, pretty_key:true},
    {name:"nwn_project", section:"basic", pretty_name: "Project", references:"nwn_project", index:true}, 
    {name:"subject", section:"basic", pretty_name: "Title", index:true, pretty_key:"true"}, 
    {name:"body",  section:"basic",  pretty_name: "Description", data_type: "string"},
    {name:"read_p", pretty_name: "Read?",  data_type: "boolean", default:true},
    {name:"creation_date", section:"basic", pretty_name: "Creation Date", data_type:"date"},
  ],
  nwn_project_post: [
    {name:"id",  section:"basic",  pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"nwn_project", section:"basic", pretty_name: "Project", references:"nwn_project", index:true}, 
    {name:"name", section:"basic", pretty_name: "Title", index:true, pretty_key:"true"}, 
    {name:"body",  section:"basic",  pretty_name: "Description", data_type: "string"},
    {name:"url",  section:"basic",  pretty_name: "You Tube URL", data_type: "string", input_type:'string',  you_tube:true},
    {name:"image",  section:"basic",  pretty_name: "Image", data_type: "image", input_type: "image"},
    {name:"role_type", section:"basic", pretty_name: "Role Type", references:"nwn_role_type", index:true, pretty_key:"true"},
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
    {name:"name", section:"basic", pretty_name:"Volunteer Name", references:"nwn_user", index:true, pretty_key:true},
    {name:"nwn_project", section:"basic", pretty_name: "Project", references:"nwn_project", index:true}, 
    {name:"role_type", section:"basic",grid_col:6, pretty_name: "Role Type", data_type: "string"},
    {name:"status", section:"admin",grid_col:6, pretty_name: "Status", data_type: "string", valid_values:"Applied, Accepted, Denied, Retired", default:"Applied"},
    {name:"leader_notes", section:"admin",grid_col:6, pretty_name: "Leader Notes", data_type: "string"}
  ],
  nwn_project: [
    {name:"id",  section:"basic",  pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"name", section:"basic",grid_col:6, pretty_name: "Project Name", data_type: "string", pretty_key:"true"},
    {name:"type", section:"basic",grid_col:6, pretty_name: "Project Type", references:"nwn_project_type", index:true},
    {name:"leader", section:"basic", pretty_name:"Project Leader", references:"nwn_user", index:true},
    {name:"summary", section:"basic", grid_col:6, pretty_name: "Short Summary", data_type: "string"},
    {name:"description", section:"basic", grid_col:12, pretty_name: "Project Description", size:"large", data_type: "string"},
    {name:"country", section:"location", pretty_name: "Country", references:"nwn_country"}, 
    {name:"state",  section:"location", pretty_name: "State or Province", references:"nwn_state_province"},
    {name:"latitude", section:"location", pretty_name: "Latitude", data_type: "string"},
    {name:"longitude", section:"location", pretty_name: "Longitude", data_type: "string"},
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
  nwn_country: [
    {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"name", pretty_name: "Country", data_type: "string", pretty_key:true},
  ],
  nwn_state_province: [
    {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"name", pretty_name: "State nor Province", data_type: "string", pretty_key:true},
  ],
  nwn_project_type: [
    {name:"id", section:"basic", pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"name", section:"basic", grid_col:12, pretty_name: "Project Type", data_type: "string", pretty_key:true},
    {name:"thumbnail",  grid_col:12, section:"thumbnail", pretty_name: " ", data_type: "image", input_type: "image"},
  ],
  nwn_user: [
    {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
    {name:"first_name", section:"basic", grid_col:6,pretty_name: "First Name",required:true, data_type: "string"},
    {name:"last_name", section:"basic",grid_col:6, pretty_name: "Last Name", required:true, data_type: "string"},
    {name:"password", section:"basic",grid_col:6, pretty_name: "Password", required:true, data_type: "string", input_type:"password"},
    {name:"password_confirm", section:"basic",grid_col:6, pretty_name: "Confirm Password", required:true, data_type: "string", input_type:"password"},
    {name:"full_name", pretty_key:true, derived:"{first_name}  {last_name}",  section:"basic", pretty_name: "Full Name", data_type: "string"},
    {name:"thumbnail", section:"thumbnail", pretty_name: "Thumbnail", data_type: "image", input_type: "image"},
    {name:"email", section:"basic", pretty_name: "Email", required:true, data_type: "string"},
    {name:"country", section:"location", grid_col:6, pretty_name: "Country", references:"nwn_country"},  
    {name:"state", section:"location", grid_col:6,  pretty_name: "State or Province", references:"nwn_state_province"},  
    {name:"twitter", section:"additional", pretty_name: "Twitter Handle",  data_type: "string"},
    {name:"phone", section:"additional", pretty_name: "Phone",  data_type: "string"},
  ],
}

//module.exports = {
//  metadata_fields
//}
export default metadata_fields
