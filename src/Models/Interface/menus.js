const metadata_menus = {
    app_menu: [
      {index:"0", label:"System Groups", object_type:"system_groups", component:"DrillDown"},
      {index:"1", label: "Systems", object_type: "systems", component:"DrillDown", grouping_field_name:"system_group", filter_field:"system_group",
     manage_object_types:"system_groups"},
       {index:"2", label: "Field Lists", object_type: "field_lists",
        component:"DrillDown"},
      {index:"3", label: "APIs", object_type: "apis", filter_field: "field_list", },
      {index:"4", label: "Messages (Tar35B)", object_type: "messages", filter_field: "api"},
  //     {index:"5", label: "ResRent Fields", object_type: "fields", filter_field: "field_list", filter_required:true},
      {index:"5", label: "Mappings", object_type: "mappings", filter_field: "message", filter_required:true},
//      {index:"6", label: "Mappings", object_ty"pe: "mappings"},

    ]
}


export default metadata_menus
