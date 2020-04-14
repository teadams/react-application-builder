const metadata_fields = {
  nwn_project_message: {
    id: { section:"basic",  pretty_name: "Id", data_type: "integer", required:true, key:true},
    from_user: { section:"basic", pretty_name:"Project Leader", references:"core_user", index:true, pretty_key:true},
    to_user: { section:"basic", pretty_name:"Project Leader", references:"core_user", index:true, pretty_key:true},
    nwn_project: { section:"basic", pretty_name: "Project", references:"nwn_project", index:true}, 
    subject: { section:"basic", pretty_name: "Title", index:true, pretty_key:"true"}, 
    body: { section:"basic",  pretty_name: "Description", data_type: "string"},
    read_p: { pretty_name: "Read?",  data_type: "boolean", default:true},
    nwn_project_volunteer: { section:"hidden", pretty_name: "Volunteer", references:"nwn_project_volunteer", index:true}
  },
  nwn_project_post: {
    id: { section:"basic",  pretty_name: "Id", data_type: "integer", required:true, key:true},
    nwn_project: { section:"basic", pretty_name: "Project", references:"nwn_project", index:true}, 
    name: { section:"basic", pretty_name: "Title", index:true, pretty_key:"true"}, 
    body: { section:"basic",  pretty_name: "Description", data_type: "string"},
    url: { section:"basic",  pretty_name: "You Tube URL", data_type: "string", input_type:'string',  you_tube:true},
    image: { section:"basic",  pretty_name: "Image", data_type: "image", input_type: "image"},
    core_role: { section:"basic", pretty_name: "Role Type", references:"core_role", index:true, pretty_key:"true"},
    status: { section:"admin",grid_col:6, pretty_name: "Status", data_type: "string", valid_values:"Active, Inactive", default:"Active"},
  },
  nwn_project_video: {
    id: { section:"basic",  pretty_name: "Id", data_type: "integer", required:true, key:true},
    nwn_project: { section:"basic", pretty_name: "Project", references:"nwn_project", index:true}, 
    name: { section:"basic", pretty_name: "Title", index:true, pretty_key:"true"}, 
    description: { section:"basic",  pretty_name: "Description", data_type: "string"},
    url: { section:"basic",  pretty_name: "URL", data_type: "string", you_tube:true},
    primary_video: { section:"admin",grid_col:6, pretty_name: "Primary", data_type: "boolean", default:true},
    status: { section:"admin",grid_col:6, pretty_name: "Status", data_type: "string", valid_values:"Active, Inactive", default:"Active"},
  },
  nwn_project_document: {
    id: { section:"basic",  pretty_name: "Id", data_type: "integer", required:true, key:true},
    nwn_project: { section:"basic", pretty_name: "Project", references:"nwn_project", index:true}, 
    name: { section:"basic", pretty_name: "Title", index:true, pretty_key:"true"}, 
    description: { section:"basic",  pretty_name: "Description", data_type: "string"},
    url: { section:"basic",  pretty_name: "URL", data_type: "string"},
  },
  nwn_project_need: {
    id: { section:"basic",  pretty_name: "Id", data_type: "integer", required:true, key:true},
    role_name: { section:"basic", pretty_name: "Role Type", references:"core_role", index:true, pretty_key:"true"},
    nwn_project: { section:"basic", pretty_name: "Project", references:"nwn_project", index:true}, 
    description: { section:"basic",  pretty_name: "Description", data_type: "string"},
    status: { section:"admin",grid_col:6, pretty_name: "Status", data_type: "string", valid_values:"Recruiting, Filled", default:"Recruiting"},
  },
nwn_project_volunteer: {
  name: { section:"basic", pretty_name: "Volunteer"}, 
  leader_notes: { section:"admin", grid_col:6, pretty_name: "Leader Notes", data_type: "string"},
  status: { section:"basic",grid_col:6, pretty_name: "Status", data_type: "string", valid_values:"Applied,Accepted,Denied,Retired", default:"Applied"},

},
nwn_project: {
  type: { section:"basic",grid_col:6, pretty_name: "Project Type", references:"nwn_project_type", index:true},
  leader: { section:"basic", pretty_name:"Project Leader", references:"core_user", index:true},
  summary: { section:"basic", grid_col:6, pretty_name: "Short Summary", data_type: "string"},
  description: { section:"basic", grid_col:12, pretty_name: "Project Description", size:"large", data_type: "string"},
  street_address: { section:"location", grid_col:12, pretty_name: "Street Address",  data_type: "string"},
  city: { section:"location", grid_col:6, pretty_name: "City",  data_type: "string"},
  country: { section:"location", pretty_name: "Country", references:"core_country"}, 
  state: { section:"location", pretty_name: "State or Province", references:"core_state_province"},
  zip_code: { section:"location", grid_col:6, pretty_name: "Zip Code",  data_type: "string"},
  latitude: { section:"location", pretty_name: "Latitude", data_type: "string"},
  longitude: { section:"location", pretty_name: "Longitude", data_type: "string"},
// image field will store an object with height
// width and alt tag.  Images themselves will
// be stored in a core images object.
// For now, this will be in the database.  Later,
// this object type can be expanded to store in S3
// or file system
  thumbnail: { section:"more", pretty_name: "Thumbnail Image", data_type: "image", input_type: "image"},
  project_needs: { section:"needs", referenced_by:"nwn_project_need", pretty_name:"Project Needs", grid_col:12},
  project_videos: { section:"videos", referenced_by:"nwn_project_video", pretty_name:"Project Videos", grid_col:12},
  project_documents: { section:"documents", referenced_by:"nwn_project_document", pretty_name:"Project Documents", grid_col:12},
  status: { section:"admin",grid_col:6, pretty_name: "Status", data_type: "string", valid_values:"Preparation, OnGoing, Success, OnHold", default:"Applied"},
},
nwn_project_type: {
  id: { section:"basic", pretty_name: "Id", data_type: "integer", required:true, key:true},
  name: { section:"basic", grid_col:12, pretty_name: "Project Type", data_type: "string", pretty_key:true},
  thumbnail: {  grid_col:12, section:"thumbnail", pretty_name: " ", data_type: "image", input_type: "image"},
},
}

export default metadata_fields
