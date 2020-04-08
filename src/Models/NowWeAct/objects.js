const metadata_object_types = [
  {name:"nwn_project_type", pretty_name:"Project Type", pretty_plural:"Project Types"},
  {name:"nwn_role_type", pretty_name:"Role Type", pretty_plural:"Role Types", create_priv:"SiteAdmin"},
  {name:"nwn_project" ,pretty_name:"Project", pretty_plural:"Projects"},
  {name:"nwn_project_need", pretty_name:"Project Need", pretty_plural:"Project Needs"},
  {name:"nwn_project_video", pretty_name:"Project Video", pretty_plural:"Project Video"},
  {name:"nwn_project_document", pretty_name:"Project Document", pretty_plural:"Project Document"},
  {name:"nwn_project_message", pretty_name:"Project Message", pretty_plural:"Project Messages", create_priv:"User"},
  {name:"nwn_project_volunteer", pretty_name:"Project Volunteer", pretty_plural:"Project Volunteers", create_priv:"User"},
  {name:"nwn_project_post", pretty_name:"Project Post", pretty_plural:"Project Posts", create_priv:"User"},
]

export default metadata_object_types
