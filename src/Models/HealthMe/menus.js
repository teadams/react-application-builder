const metadata_menus = {
  app_menu: [
    {index:"0", label: "RawField", component:"Field", 
                 field_name:"creation_user",
                 field_list:["first_name", "last_name"],
                 sections: {first_section: 
                 {field_list:["first_name", "last_name",],name:"Section one"},
                 sectond_section: 
                 {field_list:["mom_first", "mom_last"],name:"Section one"}
                }, object_type:"core_user", id:"1",
      data_t:{first_name:"Tracy", last_name:"Adams", mom_first:"Jane", mom_last:"Belmont"}
   },
   {index:"1", label: "RawField2", component:"Field",
                field_name:"first_name",
                field_list:["first_name", "last_name"],
                sections: {first_section: 
                {field_list:["first_name", "last_name",],name:"Section one"},
                sectond_section: 
                {field_list:["mom_first", "mom_last"],name:"Section one"}
               }, object_type:"core_user", id:"2",
     data_t:{first_name:"Tracy", last_name:"Adams", mom_first:"Jane", mom_last:"Belmont"}
  },
   {index:"2", label: "RawListList", component:"RenderFieldList",
                field_name:"first_name",
                field_list:["first_name", "last_name"],
                sections: {first_section: 
                {field_list:["first_name", "last_name",],name:"Section one"},
                sectond_section: 
                {field_list:["mom_first", "mom_last"],name:"Section one"}
               }, 
     data:{first_name:"Tracy", last_name:"Adams", mom_first:"Jane", mom_last:"Belmont"}
  },
  {index:"3", label: "RawListList", component:"RenderFieldListList",
               field_name:"first_name",
               field_list:["first_name", "last_name"],
               sections: {first_section: 
               {field_list:["first_name", "last_name",],name:"Section one"},
               sectond_section: 
               {field_list:["mom_first", "mom_last"],name:"Section one"}
              }, 
    data:{first_name:"Tracy", last_name:"Adams", mom_first:"Jane", mom_last:"Belmont"}
 },
//    {index:"0", label: "Subsites", object_type: "core_subsite", component:"FDrillDown",  parent_field:"parent_subsite", order_by:"id", order_by_direction:"asc"},
    {index:"4", label: "Customers", object_type: "core_subsite", component:"FDrillDown", filter_field:"level", filter_id:"1"},
    {index:"5", label: "Users", object_type: "core_user", component:"FDrillDown"},
    {index:"6", label: "Subsite Members", grouping_field:"core_subsite", object_type: "core_subsite_role", component:"FDrillDown"},
    {index:"7", label: "Debug", component:"Debug", show_debug:true},

 ],
  hamburger: [
    {index:"1", label: "Roles by Privilege", object_type: "core_role", component:"FDrillDown", grouping_field:"privilege"},
    {index:"2", label: "Site Administrators", object_type: "core_subsite", component:"DrillDown"}
  ]
} 

export default metadata_menus;