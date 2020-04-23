const metadata_menus = {
  app_menu: [
    {index:"0", label: "Subsites", object_type: "core_subsite", component:"ObjectList"},
    {index:"1", label: "Roles", object_type: "core_role", component:"ObjectList"},
    {index:"2", label: "Users", object_type: "core_user", component:"ObjectList"}
 ],
  hamburger: [
    {index:"0", label: "Subsites", object_type: "core_subsite", component:"DrillDown"}
  ]
} 

export default metadata_menus;