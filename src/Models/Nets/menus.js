const metadata_menus = {
  app_menu: [
    {index:"0", label: "Prospect Search", object_type:"prospect"},
    {index:"1", label: "Prospect Detail", object_type: "prospect", component:"DrillDown"},
    {index:"2", label: "Reports", object_type: "report", component:"DrillDown", grouping_field_name:"prospect"
      },
 ],
  hamburger: [
      {index:"0", label: "Team", object_type: "team"},
      {index:"1", label: "Agent", object_type: "agent"},
      {index:"2", label: "Scout", object_type: "scout"},
      {index:"3", label: "Coach", object_type: "coach"},
      {index:"4", label: "League", object_type: "league"},
      {index:"5", label: "College", object_type: "college"},
      {index:"6", label: "Nationality", object_type: "nationality"},
      {index:"7", label: "Report Type", object_type: "report_type"},
      {index:"8", label: "Conference", object_type: "conference"},
      {index:"9", label: "Division", object_type: "division"},
      {index:"10", label: "Agency", object_type: "agency"},
    ]
} 

export default metadata_menus;