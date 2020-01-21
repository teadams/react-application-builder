const metadata_sections = {
  service: [
      {name:"basic", title:"Basic Information"},
      {name:"transaction", title:"Transaction Information"},

      {name:"group", title:"Service Group"},
      {name:"employee", title:"Stylists"},
      {name:"color", title:"Color", text:"Pick a color"},
      {name:"future", title:"Future"}
    ],
    employee: [
        {name:"basic", title:"Basic Information"},
        {name:"services", title:"Services Supported"},
        {name:"schedule", title:"Base Schedule", text:"Shifts employee typically works"},
        {name:"contact", title:"Contact Information"},
        {name:"emergency", title:"Emergency Contact Information"},

      ],

}

export default metadata_sections
