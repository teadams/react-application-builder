const metadata_menus = {
  app_menu: [
    {index:"0", label: "Map", object_type: "nwn_project", component:"GoogleMap", title:"Projects Across the World", text:"Click on a pin to learn more about a project", object_type:"nwn_project"},
    {index:"1", label: "Help Out", object_type: "nwn_project_volunter",  object_type:"nwn_project_volunteer"},
    {index:"2", label: "Projects", object_type:"nwn_project", component:"DrillDown"},
    {index:"3", label: "Learn Library", component:"Text", text:"Zac and Jesse will teach you what you need", title:"Learning Library"}, 
    {index:"4", label: "My Messages", component:"ProjectMessages",  object_type:"nwn_project_message"}, 
    {index:"5", label: "One Project",  object_type:"nwn_project", component:"ProjectView", project_id:1},
    {index:"6", label: "Volunteer",  object_type:"nwn_project", component:"Volunteer", project_id:2},
 ],
  hamburger: [
      {index:"0", label: "Projects", object_type: "nwn_project", component:"DrillDown"},
      {index:"1", label: "Users", object_type: "core_user", component:"DrillDown" },
      {index:"2", label: "Countries", object_type: "core_country"},
      {index:"3", label: "States", object_type: "core_state_province"},
      {index:"4", label: "Project Types", object_type: "nwn_project_type", },
      {index:"6", label: "Needs", object_type: "nwn_project_need"},
      {index:"7", label: "Video", object_type: "nwn_project_video"},
      {index:"8", label: "Documents", object_type:"nwn_project_document"},
      {index:"9", label: "Volunteers", object_type:"nwn_project_volunteer"},
      {index:"10", filter_field:"nwn_project", label: "Messages", object_type:"nwn_project_message"},
      {index:"11", label: "Announcements", object_type:"nwn_project_post", component:"DrillDown"},
      {index:"12", label: "Site Wide Adminsitrators", object_type:"core_site_admin", component:"DrillDown"},
      {index:"13", label: "Roles", object_type:"nwn_role", component:"DrillDown"},
      {index:"14", label: "Subsite", object_type:"core_subsite", component:"DrillDown"},
      {index:"15", label: "Subsite Role", object_type:"core_subsite_role", component:"DrillDown"},
      {index:"16", label: "Subsite Context Map", object_type:"core_context_subsite_map", component:"DrillDown"},
      {index:"17", label: "SiteAdmin", object_type:"nwn_project", component:"ProjectView", auth_scope:"site", auth_priv:"admin"},
      {index:"18", label: "SiteMember", object_type:"nwn_project", component:"ProjectView", auth_scope:"site", auth_priv:"member"},
      {index:"19", label: "ContextAdmin", object_type:"nwn_project", component:"ProjectView", auth_scope:"context", auth_priv:"admin"},
      {index:"20", label: "ContextCreate", object_type:"nwn_project", component:"ProjectView", auth_scope:"context", auth_priv:"create"},
      {index:"21", label: "ContextRead", object_type:"nwn_project", component:"ProjectView", auth_scope:"context", auth_priv:"read"},
      {index:"22", label: "ContextMember", object_type:"nwn_project", component:"ProjectView", auth_scope:"context", auth_priv:"member"},
    ]
} 

export default metadata_menus;