let framework_menus = {}

framework_menus.app_menu = [
    {index:"0", label: "List 1", component:"ACSList", test_case:"props supplied data", list_component:"ACSViewMenu",
              data:[{first_name:"Tracy", last_name:"Adams"},
              {first_name:"Jane", last_name:"Belmonht"},
              {first_name:"Laurel", last_name:"Hyche"}],
    },
    {index:"1", label: "List 2", component:"ACSList", test_case:"props supplied data, changing from D-List 1",
              data:[{first_name:"John", last_name:"Robinson"},
              {first_name:"Dawn", last_name:"Hunter"},
              {first_name:"00", last_name:"Adams"}],
    },
    {index:"2", label: "API-List 2", component:"ACSList", object_type:"core_role", test_case:"From API"
    },
    {index:"3", label: "API-List 2", component:"ACSList", object_type:"core_user", test_case:"Switching Object Type"
    }

]
 
framework_menus.field_and_set_menu = [
  {index:"0", label: "Change", component:"ACSFieldSet",
                 field_name:"first_name",
                 field_list:["first_name", "last_name"],
                data:{first_name:"Tracy", last_name:"Adams", mom_first:"Jane", mom_last:"Belmont"}
   },
  {index:"1", label: "APIObject", component:"ACSFieldSet",
                    object_type:"core_user", id:6
  },
  {index:"2", label: "APIObject2", component:"ACSFieldSet",
                     object_type:"core_user", id:2
     },
  {index:"3", label: "APIObject3", component:"ACSFieldSet",
                      object_type:"core_role", id:1
    // expect TracyOne
 },
  {index:"4", label: "RawField", component:"ACSField", 
                 field_name:"first_name",
                 field_list:["first_name", "last_name"],
                 sections: {first_section: 
                 {field_list:["first_name", "last_name",],name:"Section one"},
                 sectond_section: 
                 {field_list:["mom_first", "mom_last"],name:"Section one"}
                },
      data:{first_name:"TracyOne", last_name:"Adams", mom_first:"Jane", mom_last:"Belmont"}
   },
  //   // expect TracyTWO
   {index:"5", label: "RawField2", component:"ACSField",
                field_name:"first_name",
                field_list:["first_name", "last_name"],
                sections: {first_section: 
                {field_list:["first_name", "last_name",],name:"Section one"},
                sectond_section: 
                {field_list:["mom_first", "mom_last"],name:"Section one"}
               }, object_type:"core_user", id:"3",
     data:{first_name:"TracyTWO", last_name:"Adams", mom_first:"Jane", mom_last:"Belmont"}
 },
//
  {index:"6", label: "APIField1",  component:"ACSField",
               field_name:"first_name",
               object_type:"core_user", id:"2",
  },
  // expect Michael
  {index:"7", label: "APIField2", component:"ACSField",
               field_name:"first_name",
               object_type:"core_user", id:"3",
  },
    // expect Office Administrator
  {index:"8", label: "APIField3", component:"ACSField",
               field_name:"name",
               object_type:"core_role", id:"2",
  },
]


export default framework_menus;