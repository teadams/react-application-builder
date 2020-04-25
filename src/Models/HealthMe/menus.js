const metadata_menus = {
  app_menu: [
      // expect TracyOne
    {index:"0", label: "RawField", component:"Field", 
                 field_name:"first_name",
                 field_list:["first_name", "last_name"],
                 sections: {first_section: 
                 {field_list:["first_name", "last_name",],name:"Section one"},
                 sectond_section: 
                 {field_list:["mom_first", "mom_last"],name:"Section one"}
                },
      data:{first_name:"TracyOne", last_name:"Adams", mom_first:"Jane", mom_last:"Belmont"}
   },
    // expect TracyTWO
   {index:"1", label: "RawField2", component:"Field",
                field_name:"first_name",
                field_list:["first_name", "last_name"],
                sections: {first_section: 
                {field_list:["first_name", "last_name",],name:"Section one"},
                sectond_section: 
                {field_list:["mom_first", "mom_last"],name:"Section one"}
               }, object_type:"core_user", id:"3",
     data:{first_name:"TracyTWO", last_name:"Adams", mom_first:"Jane", mom_last:"Belmont"}
  },
    // expect John
  {index:"2", label: "APIField1",  component:"Field",
               field_name:"first_name",
               object_type:"core_user", id:"2",
  },
  // expect Michael
  {index:"3", label: "APIField2", component:"Field",
               field_name:"first_name",
               object_type:"core_user", id:"3",
  },
    // expect Office Administrator
  {index:"4", label: "APIField3", component:"Field",
               field_name:"name",
               object_type:"core_role", id:"2",
  },
   {index:"5", label: "RawListList", component:"RenderFieldList",
                field_name:"first_name",
                field_list:["first_name", "last_name"],
                sections: {first_section: 
                {field_list:["first_name", "last_name",],name:"Section one"},
                sectond_section: 
                {field_list:["mom_first", "mom_last"],name:"Section one"}
               }, 
     data:{first_name:"Tracy", last_name:"Adams", mom_first:"Jane", mom_last:"Belmont"}
  },
  {index:"6", label: "RawListListList", component:"RenderFieldListList",
               field_name:"first_name",
               field_list:["first_name", "last_name"],
               sections: {first_section: 
               {field_list:["first_name", "last_name",],name:"Section one"},
               sectond_section: 
               {field_list:["mom_first", "mom_last"],name:"Section one"}
              }, 
    data:{first_name:"Tracy", last_name:"Adams", mom_first:"Jane", mom_last:"Belmont"}
 }],
  hamburger: [
    {index:"1", label: "Roles by Privilege", object_type: "core_role", component:"FDrillDown", grouping_field:"privilege"},
    {index:"2", label: "Site Administrators", object_type: "core_subsite", component:"DrillDown"}
  ]
} 

export default metadata_menus;