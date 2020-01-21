
const metadata_fields = {
    system_groups: [
      {name:"id", section:"basic", pretty_name: "Id", data_type: "integer", required:true, key:true},
      {name:"name", section:"basic",  pretty_name: "System Group Name", data_type: "string", required:true, pretty_key:true},
          {name:"systems", section:"basic", not_in_db:true,  restrict_from_view:true, pretty_name:"Systems", menu_link:"1"},
      {name:"description",grid_col:12, size:"large", section:"basic", pretty_name: "Description", long:true, data_type: "string"},
      {name:"referencing_systems",grid_col:12,  section:"systems", pretty_name:"Systems", referenced_by:"systems"}
    ],
    systems: [
      {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
      {name:"name",  pretty_name: "System Name", data_type: "string", required:true, pretty_key:true},
      {name:"system_group", pretty_name:"System Group", references:"system_groups"},
      {name:"description",grid_col:12, size:"large", pretty_name: "Description",long:true, data_type: "string"},
  //    {name:"start_date", data_type:"date", pretty_name:"Start Date"}

    ],
    field_lists: [
      {name:"id", section:"basic", pretty_name: "Id", data_type: "integer", required:true, key:true},
        {name:"api", section:"basic", not_in_db:true,restrict_from_view:true, pretty_name:"APIs", menu_link:"3"},
        {name:"fields",section:"basic",  not_in_db:true,restrict_from_view:true, pretty_name:"Fields", menu_link:"5"},
      {name:"name",  section:"basic", pretty_name: "Field List Name", data_type: "string", required:true, pretty_key:true},
      {name:"description",section:"basic",  grid_col:12, pretty_name: "Description", size:"large", data_type: "string"},
      {name:"referencing_apis",grid_col:12,  section:"apis", pretty_name:"APIs", referenced_by:"apis", restricted_from_crud_fields:"fields,messages,field_list"},
      {name:"referencing_fields",grid_col:12,  section:"fields", pretty_name:"Fields", referenced_by:"fields", restricted_from_crud_fields:"apis,field_list"}
    ],
    apis: [
      {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
      {name:"name", pretty_name: "ResRent API name" , data_type: "string",  required:true, pretty_key:true},
      {name:"field_list", pretty_name: "Field List", data_type: "string", references:"field_lists"},
        {name:"direction", pretty_name: "Direction", data_type: "string", valid_values:"inbound,outbound", required:true},
        {name:"fields",grid_col:2, not_in_db:true  ,pretty_name:"Fields", menu_link_field:"field_list", menu_link:"2"},
        {name:"messages", grid_col:2, not_in_db:true  ,pretty_name:"Messages", menu_link:"4"},

    ],
    messages: [
      {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
      {name:"api", pretty_name: "API", data_type: "string", references:"apis",  required:true},
      {name:"name", pretty_name: "Name", data_type: "string", required:true, pretty_key:true},
        {name:"mapping", not_in_db:true  ,pretty_name:"Mapping", menu_link:"5"},
        {name:"resrent_fields", not_in_db:true  ,pretty_name:"ResRent Fields", menu_link:"2", menu_link_field:"api_field_list"},
      {name:"source", pretty_name: "Source", data_type: "string", references:"systems", required:true},
      {name:"target", pretty_name: "Target", data_type: "string", references:"systems", required:true},
      {name:"sync_async", pretty_name: "Sync/Async", data_type: "string", valid_values:"sync,async", required:true},
      {name:"infact_id", pretty_name: "Infact ID", data_type: "string", required:true},
      {name:"notes", pretty_name: "Notes", data_type: "string", size:"1000", required:true},
      {name:"mulesoft_transformation", pretty_name: "MuleSoft Transformation Notes", data_type: "string", size:"1000", required:true}
    ],
    fields: [
      {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
      {name:"field_list", pretty_name: "Field List", data_type: "string", references:"field_lists", required:true},
          {name:"apis", not_in_db:true  ,pretty_name:"APIs", menu_link_field:"field_list", menu_link:"3"},
      {name:"name", pretty_name: "Field" , data_type: "string",  required:true, pretty_key:true},
      {name:"active_p", pretty_name: "Active?",  data_type: "boolean", default:true},
      {name:"xpath", pretty_name: "ResRent Schema XPath" , data_type: "string",  required:true},
      {name:"description", grid_col:12, pretty_name: "Description" , data_type:"string", size:"large",  required:true},
      {name:"data_type", grid_col:12, pretty_name: "Data Type" , data_type: "string",  valid_values:"text,data,boolean,integer", required:true},
      {name:"data_length", pretty_name: "Data Length" , data_type: "string",  required:true},
      {name:"default_values", pretty_name: "Default Values" , data_type: "string",  required:true},
      {name:"mandopt", pretty_name: "Mandatory/Optional" , data_type: "string", valid_values:"mandatory,optional",  required:true},
      {name:"sample_data", pretty_name: "Sample Data" , data_type: "string"},
      {name:"comments", pretty_name: "Comments" , data_type: "string"}
    ],
    mappings: [
      {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
      {name:"message", prevent_edit:true , pretty_name: "Message", data_type: "string", references:"messages", required:true},
      {name:"resrent_api_name", prevent_edit:true , not_in_db:true  , pretty_name: "ResRent API Name", data_type: "string"},
      {name:"field", pretty_name: "Field", data_type: "string", references:"fields", 
                  required:true, 
                  dependent_field: "message", dependent_query:"mappings_field_dependent_query", 
                  where_pretty:"mappings_field_where_pretty", where_id: "mappings_field_where_id"},

        {name:"field_xpath", prevent_edit:true , not_in_db:true  , pretty_name: "Field XPath", data_type: "string"},
        {name:"field_description", prevent_edit:true , not_in_db:true  , pretty_name: "Field Description", data_type: "string"},
        {name:"field_data_type", crud_hide_column:true, prevent_edit:true , not_in_db:true  , pretty_name: "Field Data Type", data_type: "string"},
        {name:"field_data_length", crud_hide_column:true, prevent_edit:true , not_in_db:true  , pretty_name: "Field Data Length", data_type: "string"},
        {name:"field_default_value", prevent_edit:true , not_in_db:true  , pretty_name: "Field Default Value", data_type: "string"},
        {name:"field_mandopt", prevent_edit:true , not_in_db:true  , pretty_name: "Field Mandatory or Optional", data_type: "string"},
        {name:"field_sample_data", crud_hide_column:true, prevent_edit:true , not_in_db:true  , pretty_name: "Sample Data", data_type: "string"},
        {name:"field_comments", crud_hide_column:true, prevent_edit:true , not_in_db:true  , pretty_name: "Field XComments", data_type: "string"},

  
      {name:"name", edit:true, pretty_name: "External Field name", data_type: "string", required:true, pretty_key:true, index:false},
      {name:"transform", pretty_name: "Mulesoft Transformation", data_type: "string", size:"1000", required:true}
    ]
}

export default metadata_fields
