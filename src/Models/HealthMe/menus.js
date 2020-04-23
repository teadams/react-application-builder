const metadata_menus = {
  app_menu: [
    {index:"0", label: "Subsites", object_type: "core_subsite", component:"ObjectList"},
    {index:"1", label: "Roles", object_type: "core_role", component:"ObjectList"},
    {index:"2", label: "Users", object_type: "core_user", component:"ObjectList"},
    {index:"3", label: "Hierarchy", object_type: "core_subsite_hierarchy", component:"ObjectList", order_by:"leaf_subsite,leaf_subsite", order_by_direction:"asc,asc", grouping_field:"leaf_subsite_name"}
 ],
  hamburger: [
    {index:"0", label: "Subsites", object_type: "core_subsite", component:"DrillDown"}
  ]
} 

export default metadata_menus;