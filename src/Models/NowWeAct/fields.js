nwn_project_volunteer: {
  leader_notes: { section:"admin",grid_col:6, pretty_name: "Leader Notes", data_type: "string"}
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
