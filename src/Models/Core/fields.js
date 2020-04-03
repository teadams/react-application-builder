
const metadata_fields = {
  // fields that are added to every table
  core_fields: [
    {name:"creation_date", pretty_name:"Creation Date", data_type: "timestamp", default:"now()", required:true, index:true},
    {name:"last_updated_date", pretty_name:"Last Updated Date", data_type: "timestamp", default:"now()", required:true, index:true},
    {name:"creation_user", pretty_name:"Creation User", data_type:"integer", references:"core_user"}
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
    {name:"password", section:"basic",grid_col:6, pretty_name: "Password", required:true, data_type: "string", input_type:"password"},
    {name:"password_confirm", section:"basic",grid_col:6, pretty_name: "Confirm Password", required:true, data_type: "string", input_type:"password"},
    {name:"full_name", pretty_key:true, derived:"{first_name}  {last_name}",  section:"basic", pretty_name: "Full Name", data_type: "string"},
    {name:"thumbnail", section:"thumbnail", pretty_name: "Thumbnail", data_type: "image", input_type: "image"},
    {name:"email", section:"basic", pretty_name: "Email", required:true, data_type: "string"},
    {name:"country", section:"location", grid_col:6, pretty_name: "Country", references:"core_country"},  
    {name:"state", section:"location", grid_col:6,  pretty_name: "State or Province", references:"core_state_province"},  
    {name:"twitter", section:"additional", pretty_name: "Twitter Handle",  data_type: "string"},
    {name:"phone", section:"additional", pretty_name: "Phone",  data_type: "string"},
  ],
}

//module.exports = {
//  metadata_fields
//}
//export default metadata_fields

export default  metadata_fields

