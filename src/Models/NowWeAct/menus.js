const metadata_menus = {
  app_menu: [
    {index:"0", label: "Map", object_type: "nwn_project", component:"GoogleMap", title:"Projects Across the World", text:"Click on a pin to learn more about a project", object_type:"nwn_project"},
    {index:"1", label: "Projects", object_type:"nwn_project", component:"DrillDown"},
    {index:"2", label: "Learning Library", component:"Text", text:"Zac and Jesse will teach you what you need", title:"Learning Library"}, 
 ],
  hamburger: [
      {index:"0", label: "Projects", object_type: "nwn_project", component:"DrillDown"},
      {index:"1", label: "Users", object_type: "nwn_user", component:"DrillDown" },
      {index:"2", label: "Countries", object_type: "nwn_country"},
      {index:"3", label: "States", object_type: "nwn_state_province"},
      {index:"4", label: "Project Types", object_type: "nwn_project_type"},
      {index:"5", label: "Role Types", object_type: "nwn_role_type"},
      {index:"6", label: "Needs", object_type: "nwn_project_need"},
      {index:"7", label: "Video", object_type: "nwn_project_video"},
      {index:"8", label: "Documents", object_type:"nwn_project_document"}
    ]
} 

export default metadata_menus;