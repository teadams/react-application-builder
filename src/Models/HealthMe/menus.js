
const rab_menu_model = {
  menus:{
    // thing about implications with merging with lodash.  Perhaps we want this to be a comma separated value
    hamburger: ["Olist", "DrillSubsite"],
    app_menu: ["Text","EOlist","COlist", "Users", "RoleNoGroup",  "DrillSubsite",  "Sales" ]
  },
  // Think of this like a "component imputs" library
  // dynamic overrides of model
  menu_items:{
    "Text": {label: "Welcome", header_text:"The beginning", body_text:"Hello World", menu_component_name:"RABHeaderAndBodyText"}, //title_variant:"h5"

    "Users": {label: "AllUsers", menu_component_name:"ObjectTypeView", test_case:"View an Object", object_type:"core_user", field_mouseover_to_edit:false, click_to_edit:true},        

    "RoleNoGroup": {label: "Roles", menu_component_name:"DrillDown",  test_case:"DrillDown", object_type:"core_role", 
    },

    "Olist": {label: "OtList", menu_component_name:"ObjectView", test_case:"View one object", object_type:"core_user", layout:"list", id:1},
    "Menu": { label: "Menu", menu_component_name:"NavMenu", test_case:"Menu of items", object_type:"core_user"},
    "COlist":{label: "CreateF", menu_component_name:"ObjectView", test_case:"View one object", object_type:"core_user",   row_mode:"create", row_form:true, 
    },
    "EOlist":{label: "EditF", menu_component_name:"ObjectView", test_case:"View one object", object_type:"core_user", id:1, row_mode:"edit", row_form:true
    },
    "HMenu": {label: "Menu", menu_component_name:"NavMenu", test_case:"Menu of items", object_type:"core_user"
    },
    "DrillSubsiteSale": {label: "DrillSubsiteSale", menu_component_name:"DrillDown", test_case:"DrillDown", object_type:"core_subsite",  api_options:{parent_field:"parent_subsite"}, target_menu_name:"DrillSale", target_filter_field:"core_subsite", auth_scope:"site", auth_priv:"member"}, 
    "DrillSubsite": {label: "DrillSubsite", menu_component_name:"DrillDown", test_case:"DrillDown", object_type:"core_subsite",  api_options:{parent_field:"parent_subsite"}, auth_scope:"site", auth_priv:"member"
    },
    "DrillSale": {label: "DrillSales", menu_component_name:"ObjectTypeView", test_case:"Context Viewing", object_type:"test_sale", filter_field:"core_subsite", auth_scope:"site", auth_priv:"admin"
    },
    "Sales": {label: "Sales", menu_component_name:"ObjectTypeView", test_case:"Context Viewing", object_type:"test_sale", auth_scope:"site", auth_priv:"admin", api_options:{ expand_hierarchy:"true"}
    },        
    "RoleGroup": { label: "Role Group", menu_component_name:"DrillDown", test_case:"DrillDown", object_type:"core_role", api_options:{grouping_field:"privilege"}
    },

  }
}

export default rab_menu_model;