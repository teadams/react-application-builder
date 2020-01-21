const metadata_object_types = [
    {name:"system_groups", pretty_name: "System Group", pretty_plural: "System Groups"},
    {name:"systems", pretty_name: "System", pretty_plural:"Systems"},
    {name:"field_lists", pretty_name: "Field List", pretty_plural:"Field Lists"},
    {name:"apis", pretty_name: "ResRent API", pretty_plural: "ResRent APIs", create_form_message:"To create an interface, enter the information below"},
    {name:"messages", pretty_name: "Message", pretty_plural:"Messages (Tar35B)",post_insert_query:"sync_mappings"},
    {name:"fields", pretty_name:'Fields', pretty_plural:"Fields", post_insert_query:"sync_mappings"},
    {name:"mappings", pretty_name: "Mapping (Tar40)", pretty_plural:"Mappings (Tar40)"}
]
export default metadata_object_types
