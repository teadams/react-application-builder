const metadata_menus = {
  app_menu: [
    {index:"0", label: "Subsites", object_type: "core_subsite", component:"ObjectList",  parent_field:"parent_subsite", order_by:"id", order_by_direction:"asc"},
    {index:"1", label: "Roles", object_type: "core_role", component:"ObjectList", grouping_field:"privilege"},
    {index:"2", label: "Users", object_type: "core_user", component:"ObjectList", custom_display_field:"full_name"},
    {index:"3", label: "Hierarchy", object_type: "core_subsite_hierarchy", component:"ObjectList", order_by:"ancestor_subsite,leaf_subsite", order_by_direction:"asc,asc", display_value:"leaf_subsite"}
 ],
  hamburger: [
    {index:"0", label: "Subsites", object_type: "core_subsite", component:"DrillDown"}
  ]
} 

export default metadata_menus;