const metadata_object_types = [
  {name:"nwn_user", pretty_name:"User", pretty_plural:"Users"},
  {name:"nwn_project_type", pretty_name:"Project Type", pretty_plural:"Project Types", create_priv:"SiteAdmin"},
  {name:"nwn_role_type", pretty_name:"Role Type", pretty_plural:"Role Types", create_priv:"SiteAdmin"},
  {name:"nwn_project" ,pretty_name:"Project", pretty_plural:"Projects", create_priv:"User"},
  {name:"nwn_country", pretty_name:"Country", pretty_plural:"Countries", create_priv:"SiteAdmin"},
  {name:"nwn_state_province", pretty_name:"State or Province", pretty_plural:"States/Provinces", create_priv:"SiteAdmin"},
  {name:"nwn_project_need", pretty_name:"Project Need", pretty_plural:"Project Needs"},
  {name:"nwn_project_video", pretty_name:"Project Video", pretty_plural:"Project Video"},
  {name:"nwn_project_document", pretty_name:"Project Document", pretty_plural:"Project Document"},
  {name:"nwn_project_message", pretty_name:"Project Message", pretty_plural:"Project Messages", create_priv:"User"},
  {name:"nwn_project_volunteer", pretty_name:"Project Volunteer", pretty_plural:"Project Volunteers", create_priv:"User"}
]

export default metadata_object_types
