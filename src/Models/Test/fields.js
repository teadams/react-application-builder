
const metadata_fields = {
    location: [
      {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
      {name:"name",  pretty_name: "Location", data_type: "string", required:true, pretty_key:true},
    ],
    employee: [
      {name:"id", section:"basic", pretty_name: "Id", data_type: "integer", required:true, key:true},
      {name:"employee_id",  section:"basic", pretty_name: "Employee Id", data_type: "string", required:true, unique:true, index:true},
      {name:"first_name",section:"basic",  pretty_name: "First Name", data_type: "string"},
      {name:"last_anme", order_by:"true", section:"basic", pretty_name: "Last Name", data_type: "string"},
      {name:"full_name", pretty_key:true, derived:"{first_name}  {last_anme}",  section:"basic", pretty_name: "Full Name", data_type: "string"},
      {name:"full_name2",  derived:"{first_name}  {last_anme}",  section:"basic", pretty_name: "Full Name", data_type: "string"},
      {name:"sex",  section:"basic", pretty_name: "Sex", valid_values:"Male,Female"},
      {name:"birthday", section:"basic", pretty_name: "Birthday", data_type:"date"},
      {name:"start_date", section:"basic", pretty_name: "Start Date", data_type:"date"},
      {name:"active",  section:"basic", pretty_name: "Active", data_type:"boolean"},
      {name:"terminated_date", section:"basic", pretty_name: "Terminated Date", data_type:"date"},

      {name:"services", mapping_include_additional_fields:"true", section:"services", pretty_name: "Services Supported", mapping:"service_employee", mapped_field:"employee", pretty_name: "Service Supported", grouping_field_name:"service_category"},
      {name:"schedule", referenced_by:"schedule_resource_base", section:"schedule",grid_col:12,pretty_name:"Base Schedule" },
      {name:"address_1",  section:"contact", pretty_name: "Address 1"},
     {name:"address_2",  section:"contact", pretty_name: "Address 2"},
      {name:"city",  section:"contact", pretty_name: "City"},
      {name:"state",  section:"contact", pretty_name: "State"},
      {name:"country",  section:"contact", pretty_name: "Country"},
      {name:"zip_code", section:"contact", pretty_name: "Zip Code"},
      {name:"phone_1",  section:"contact", pretty_name: "Phone 1"},
      {name:"phone_2",  section:"contact", pretty_name: "Phone 2"},
      {name:"email",  section:"contact", pretty_name: "Email"},

      {name:"emergency_contact_name",  section:"emergency", pretty_name: "Emergenc Contat Name"},
      {name:"emergency_contact_number",  section:"emergency", pretty_name: "Emergency Contact Number"},

    ],
    client: [
      {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
      {name:"first_name",  pretty_name: "First Name", data_type: "string"},
      {name:"last_name",  pretty_name: "Last Name", data_type: "string", pretty_key:true, unique:false},
      {name:"email",  pretty_name: "Email", data_type: "string"},
    ],
    service_category: [  
      {name:"id", pretty_name: "Id", data_type: "integer", required:true, key:true},
      {name:"name", pretty_name: "Service Class Name", data_type: "string", required:true, pretty_key:true},
      {name:"active_p", grid_col:2,  pretty_name: "Active?", data_type: "boolean", default:true},
    ],
    service: [
      {name:"id",  section:"basic", pretty_name: "Id", data_type: "integer", required:true, key:true},
      {name:"code", section:"basic",  pretty_name: "Code", data_type: "string", required:true, pretty_key:true},
      {name:"service_category", order_by:true,  section:"basic", pretty_name: "Category", references:"service_category", data_type: "string"},
      //{name:"service_cat_active", edit_p:true, section:"basic", field_object_type:"service_category", field_field_name:"active_p"},
     //{name:"service_cat_name", edit_p:true, section:"basic", field_object_type:"service_category", field_field_name:"name"},
      {name:"description", section:"basic",  pretty_name: "Description", data_type: "string"},
      {name:"group_p", default:false, section:"group",  pretty_name: "Service Group?", data_type: "boolean"},
      {name:"services_in_group", grid_col:8, dependent_field:"group_p", dependent_action:"visible", section:"group", mapping:"service_group_service", mapped_field:"service_group", grouping_field_name:"service_category",  pretty_name: "Services In Group"},
      {name:"price",  grid_col:2, section:"transaction",  pretty_name: "Base Price", data_type: "string"},
     {name:"taxable", grid_col:2,  default:true, section:"transaction",  pretty_name: "Taxable?", data_type: "boolean"},
      {name:"base_time",  grid_col:2, section:"transaction",  pretty_name: "Base Time", helper_text:"minutes", data_type: "integer",  start_value:0, end_value:90, increment:5},
      {name:"gap_time",  grid_col:2,section:"transaction",  pretty_name: "Gap Time", helper_text:"minutes", data_type: "integer", start_value:0, end_value:90, increment:5},
     
      {name:"rebook_suggestion", dependent_field:"gap_time", grid_col:2, section:"transaction", pretty_name: "Rebook Suggestion", helper_text:"weeks", data_type: "integer", start_value:0, end_value:30},
      {name:"on_line_book_p",  grid_col:2, default:false, section:"transaction", pretty_name: "Book Online?", data_type: "boolean"},
      {name:"color", default:"red", section:"color", pretty_name: "Color", input_type:"color_picker", data_type: "string"},
      {name:"employees", grid_col:12, mapping_include_additional_fields:"true",  section:"employee", mapping:"service_employee", mapped_field:"service", pretty_name: "Available Stylists"},
      {name:"active_p",  section:"basic", pretty_name: "Active?", data_type: "boolean", default:true},
    ],
    service_group_service: [
          {name:"id",  pretty_name: "Id", data_type: "integer", required:true, key:true},
          {name:"service_group", map_field:true, pretty_name: "Service Group", references:"service", index:true},
          {name:"service", map_field:true, pretty_name:"Service", references:"service", index:true}
    ],
    service_employee: [
          {name:"id",  pretty_name: "Id", data_type: "integer", required:true, key:true},
          {name:"service", map_field:true, pretty_name: "Service", references:"service", index:true},
          {name:"employee", map_field:true, pretty_name:"Employee", references:"employee", index:true},
          {name:"service_base_time", field_object_type:"service", field_field_name:"base_time"},
          {name:"employee_base_time", pretty_name:"Employee Time",  helper_text:"minutes", data_type: "integer", start_value:0, end_value:90, increment:5},
          {name:"service_base_price",  field_object_type:"service", field_field_name:"price"},
          {name:"employee_price", pretty_name:"Employee Price"},
    ],

    schedule_resource_base: [
      {name:"id",  pretty_name: "Id", data_type: "integer", required:true, key:true},
      {name:"employee", pretty_name:"Employee", references:"employee", pretty_key:true, index:true},
      {name:"day_of_week", pretty_name:"Day of Week", valid_values:"0;Sunday,1;Monday,2;Tuesday,3;Wednesday,4;Thursday,5;Friday,6;Saturday", order_by:true, data_type:"integer"},
      {name:"start_hour", pretty_name:"Start Hour", data_type: "integer",  start_value:1, end_value:12, increment:1},
      {name:"start_minute", pretty_name:"Start Minute", data_type: "integer",  start_value:0, end_value:60, increment:5},
      {name:"start_am_pm", pretty_name:"Start AM/PM", valid_values:"AM,PM"},
      {name:"end_hour", pretty_name:"End Hour", data_type: "integer",  start_value:0, end_value:12, increment:1},
      {name:"end_minute", pretty_name:"End Minute", data_type: "integer",  start_value:0, end_value:60, increment:5},
      {name:"end_am_pm", pretty_name:"End AM/PM", valid_values:"AM,PM"},
    ]
}


export default metadata_fields
