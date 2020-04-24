const metadata_menus = {
  app_menu: [
    {index:"0", label: "AwesomeTest", component:"NewDrillDown", 
      sections: {first_section: 
                  {field_list:["first_name", "first_name", "first_name"],name:"Section one"},
                  sectond_section: 
                  {field_list:["last_name", "last_name", "last_name"],name:"Section one"}
                }, 
      data:{first_name:"Tracy", last_name:"Adams"}
   },
//    {index:"0", label: "Subsites", object_type: "core_subsite", component:"FDrillDown",  parent_field:"parent_subsite", order_by:"id", order_by_direction:"asc"},
    {index:"1", label: "Customers", object_type: "core_subsite", component:"FDrillDown", filter_field:"level", filter_id:"1"},
    {index:"2", label: "Users", object_type: "core_user", component:"FDrillDown"},
    {index:"3", label: "Subsite Members", grouping_field:"core_subsite", object_type: "core_subsite_role", component:"FDrillDown"},
    {index:"4", label: "Debug", component:"Debug", show_debug:true},

 ],
  hamburger: [
    {index:"1", label: "Roles by Privilege", object_type: "core_role", component:"FDrillDown", grouping_field:"privilege"},
    {index:"2", label: "Site Administrators", object_type: "core_subsite", component:"DrillDown"}
  ]
} 

export default metadata_menus;