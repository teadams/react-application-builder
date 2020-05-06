
const rab_menu_model = {
  menus:{
    hamburger: ["Olist", "Menu","DrillSubsite"],
    app_menu: ["Text", "HOlist","HMenu", "DrillSubsite", "DrillSubsiteSale", "Sales", "RoleGroup", "RoleNoGroup"]
  },
  menu_items:{
    "Text": {label: "Text", rab_component_name:{menu:"Text"}},
    "Olist": {label: "OtList", rab_component_name:{menu:"ObjectView"}, test_case:"View one object", object_type:"core_user", layout:"list", id:1},
    "Menu": { label: "Menu", rab_component_name:{menu:"NavMenu"}, test_case:"Menu of items", object_type:"core_user"},
    "HOlist":{label: "HList", rab_component_name:{menu:"ObjectView"}, test_case:"View one object", object_type:"core_user", id:1
    },
    "HMenu": {label: "Menu", rab_component_name:{menu:"NavMenu"}, test_case:"Menu of items", object_type:"core_user"
    },
    "DrillSubsiteSale": {label: "DrillSubsiteSale", rab_component_name:{menu:"DrillDown"}, test_case:"DrillDown", object_type:"core_subsite",  api_options:{parent_field:"parent_subsite"}, target_menu_name:"DrillSale", target_filter_field:"core_subsite"}, 
    "DrillSubsite": {label: "DrillSubsite", rab_component_name:{menu:"DrillDown"}, test_case:"DrillDown", object_type:"core_subsite",  api_options:{parent_field:"parent_subsite"}
    },
    "DrillSale": {label: "DrillSales", rab_component_name:{menu:"ObjectTypeView"}, test_case:"Context Viewing", object_type:"test_sale", filter_field:"core_subsite"
    },
    "Sales": {label: "SalesAN", rab_component_name:{menu:"ObjectTypeView"}, test_case:"Context Viewing", object_type:"test_sale",  api_options:{num_rows:1, expand_hierarchy:"true"}
    },        
    "RoleGroup": { label: "Role Group", rab_component_name:{menu:"DrillDown"}, test_case:"DrillDown", object_type:"core_role", api_options:{grouping_field:"privilege"}
    },
    "RoleNoGroup": {label: "RoleNoGroup", rab_component_name:{menu:"DrillDown"}, test_case:"DrillDown", object_type:"core_role"
    }
  }
}

export default rab_menu_model;