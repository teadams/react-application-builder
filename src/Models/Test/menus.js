const metadata_menus = {
  app_menu: [
    {index:"0", label: "Schedule", component:"ResourceSchedule", title:"Schedule", text:"Schedule will go here", resource_object:"employee"},
    {index:"1", label: "Clients", object_type: "client"},
    {index:"2", label:"Today", component:"Text", title:"Today's highlights", text:"Today's highlights including birthday's that are close to this day, appointent tickers, high spenders "},
    {index:"3", label:"Unattached", component:"Text", title:"Unattached appointments", text:"Appointments that are unattached due to stylist schedule changes or other reasons"},
    {index:"4", label:"FollowUps", component:"Text", title:"Followups", text:"Followups needed including confirmation, appointments that were cancelled and not rescheduled, rescheduling reminders"}
 ],
  hamburger: [
     {index:"0", label: "Services", object_type: "service", grouping_field_name:"service_category", 
      component:"DrillDown", create_form_sections:"basic", expand_contract:true, manage_object_types:'service_category'},
      {index:"1", label:"Employees", object_type: "employee", component:"DrillDown"},
      {index:"2", label: "Locations", object_type: "location"}
    ]
} 

export default metadata_menus;