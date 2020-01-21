const metadata_queries = {
  
  mappings: {select_text:"select mappings.id as id, all_fields.message as message_name, all_fields.message_id as filter_column, resrent_api_name, \
all_fields.field as field_name, xpath as field_xpath, description as field_description,\
data_type as field_data_type, data_length as field_data_length,\
default_values as field_default_value, mandopt as field_mandopt,\
sample_data as field_sample_data, comments as field_comments, \
mappings.name as name, mappings.transform as transform \
from  (select messages.name as message, apis.name as resrent_api_name, apis.field_list as field_list, \
fields.id as field_id, fields.name as field, fields.*, messages.id as message_id \
from messages, apis, fields where fields.field_list = apis.field_list and messages.api = apis.id) all_fields left \
join mappings on  (all_fields.field_id = mappings.field and all_fields.message_id = mappings.message) ", 
filter_transform:{mappins:"all_fields.message_id"}},

mappings_1_row: {select_text:"select mappings.id as id, all_fields.message as message,  resrent_api_name, \
all_fields.field, xpath as field_xpath, description as field_description,\
data_type as field_data_type, data_length as field_data_length,\
default_values as field_default_value, mandopt as field_mandopt,\
sample_data as field_sample_data, comments as field_comments, \
mappings.name as name, mappings.transform as transform \
from  (select messages.id as message, apis.name as resrent_api_name, apis.field_list as field_list, \
fields.id as field_id, fields.id as field, fields.*, messages.id as message_id \
from messages, apis, fields where fields.field_list = apis.field_list and messages.api = apis.id) all_fields left \
join mappings on  (all_fields.field_id = mappings.field and all_fields.message_id = mappings.message)  ", 
filter_transform:{id:"mappings.id"}},


mappings_field_dependent_query:"select fields.id, fields.name from fields, apis, messages  where fields.field_list = apis.field_list and apis.id=messages.api ",
mappings_field_where_pretty:" and messages.name = $1 ",
mappings_field_where_id: "  and messages.id = $1",

sync_mappings: " insert into mappings (message, field) select messages.id, fields.id from messages, fields, field_lists, \
apis where messages.api = apis.id and apis.field_list = field_lists.id and field_lists.id  = fields.field_list \
and not exists (select 1 from  mappings where mappings.message = messages.id and mappings.field  = fields.id)"

}

module.exports = {
  metadata_queries
}
