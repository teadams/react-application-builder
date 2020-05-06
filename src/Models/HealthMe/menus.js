
const rab_menu_model = {
  menus:{
    // thing about implications with merging with lodash.  Perhaps we want this to be a comma separated value
    hamburger: ["Olist", "Menu","DrillSubsite"],
    app_menu: ["Text", "HOlist","HMenu", "DrillSubsite", "DrillSubsiteSale", "Sales", "RoleGroup", "RoleNoGroup"]
  },
  menu_items:{
    "Text": {label: "Text", menu_component_name:"Text", rab_component_model_name:"test"},
    "Olist": {label: "OtList", menu_component_name:"ObjectView", test_case:"View one object", object_type:"core_user", layout:"list", id:1},
    "Menu": { label: "Menu", menu_component_name:"NavMenu", test_case:"Menu of items", object_type:"core_user"},
    "HOlist":{label: "HList", menu_component_name:"ObjectView", test_case:"View one object", object_type:"core_user", id:1
    },
    "HMenu": {label: "Menu", menu_component_name:"NavMenu", test_case:"Menu of items", object_type:"core_user"
    },
    "DrillSubsiteSale": {label: "DrillSubsiteSale", menu_component_name:"DrillDown", test_case:"DrillDown", object_type:"core_subsite",  api_options:{parent_field:"parent_subsite"}, target_menu_name:"DrillSale", target_filter_field:"core_subsite"}, 
    "DrillSubsite": {label: "DrillSubsite", menu_component_name:"DrillDown", test_case:"DrillDown", object_type:"core_subsite",  api_options:{parent_field:"parent_subsite"}
    },
    "DrillSale": {label: "DrillSales", menu_component_name:"ObjectTypeView", test_case:"Context Viewing", object_type:"test_sale", filter_field:"core_subsite"
    },
    "Sales": {label: "SalesAN", menu_component_name:"ObjectTypeView", test_case:"Context Viewing", object_type:"test_sale",  api_options:{num_rows:1, expand_hierarchy:"true"}
    },        
    "RoleGroup": { label: "Role Group", menu_component_name:"DrillDown", test_case:"DrillDown", object_type:"core_role", api_options:{grouping_field:"privilege"}
    },
    "RoleNoGroup": {label: "RoleNoGroup", menu_component_name:"DrillDown", test_case:"DrillDown", object_type:"core_role"
    }
  }
}

export default rab_menu_model;