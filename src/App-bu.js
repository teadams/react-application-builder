import React, { Component, Fragment} from 'react';
import {Grid, Paper} from 'material-ui'
import {Header,Footer, MenuBar, CrudTable, Text} from './Components/Layouts';
import * as meta from './Utils/meta.js'
import * as log from './Utils/log.js'
import axios from 'axios';


class App extends Component {
  constructor(props) {
      super(props);
      log.func(' Menu constructor');
      this.state = {
          selected_menu: 0,
          filter_id: ""

      }
      this.handleMenuChange = this.handleMenuChange.bind(this);
  }

  handleMenuChange(event, selected_menu, link_filter_id, link_filter_field, link_field_object_type, menu_link_reference_field) {
      log.func("handle menu change"," selected_menu, filter_id, filter_field, field object type, menu_link_reference_field",
        selected_menu, link_filter_id, link_filter_field, link_field_object_type, menu_link_reference_field )
      const meta_menu = meta.get_selected_menu(selected_menu)
      log.val("resulting menu", meta_menu)
      var filter_id = ""
      if (link_filter_field) {
          if (menu_link_reference_field) {
            log.func("need to navigate to another table", "menu_link_reference_field", menu_link_reference_field)
            var urltext = '/api/v1/reference/' + link_field_object_type + '/'+ menu_link_reference_field + '/' + link_filter_id;            
          } else {

            log.func("Need to get the filter field here","filter field, filter_id, field_object_type", 
              link_filter_field, link_filter_id, link_field_object_type)
              var urltext = '/api/v1/' + link_field_object_type + '/'+ link_filter_id;
          }
          log.val("url text", urltext);
          axios({
           method: 'get',
           url: urltext,
         }).then(results => {
           log.val("results", results.data[0])
           filter_id = results.data[0][link_filter_field]
           log.val("filter id, filter_field", filter_id, link_filter_field)
           this.setState({selected_menu: selected_menu,
                         filter_id : filter_id?filter_id:""
                       });
         })

      } else {
        log.func("changing menu", "filter_id, meta_menu", link_filter_id, meta_menu)
          // look at the object field in the filter field_ and get the references
          
          if (meta_menu.require_filter_id && !link_filter_id) {
            
            const filter_object_type = meta.field(meta_menu.object_type, meta_menu.filter_field).references
            const filter_key_id = meta.keys(filter_object_type).key_id
            log.val('filter object type, filter key id ', filter_object_type, filter_key_id)
            var urltext = '/api/v1/' + filter_object_type;
            axios({
             method: 'get',
             url: urltext,
           }).then(results => {
             log.val("results", results.data[0])
             filter_id = results.data[0][filter_key_id]
             log.val("filter id, filter_field", filter_id, link_filter_field)
             this.setState({selected_menu: selected_menu,
                           object_type : meta_menu.object_type,
                           filter_id : filter_id
                         });
           }).catch(error => {
              console.log("error")
           })
    
        } else {
          this.setState({selected_menu: selected_menu,
                        filter_id : link_filter_id?link_filter_id:""
                      });
          }
      }               
  }
    
  render() {    
    const meta_menu = meta.get_selected_menu(this.state.selected_menu)
//    alert ('menu ' + JSON.stringify(meta_menu))
    const filter_field = meta.field(meta_menu.object_type, meta_menu.filter_field);
    return <Fragment>
     <Paper style={{ padding:10, marginTop:10, marginBottom:0}}>
         <Header
            value={this.state.selected_menu}
            onChange={this.handleMenuChange}
          />
      
            {meta_menu.component == "Text" &&
              <Text  
                title = {meta_menu.title}
                text = {meta_menu.text}
              />
            }  
            {(!meta_menu.component || meta_menu.component == "CrudTable") &&
            <Grid container>
            <Grid item sm style={{margin:20}}>
             <CrudTable
                object_type={meta_menu.object_type}
                object_attributes={meta.object(meta_menu.object_type)}
                object_fields={meta.fields(meta_menu.object_type)}
                filter_field = {meta_menu.filter_field}
                filter_object_type = {meta_menu.references}
                filter_label = {meta_menu.pretty_name}
                filterOnChange = {this.handleMenuChange}
                filter_id = {this.state.filter_id}/>
            </Grid>
            </Grid>
          }
            
         <Footer/>
     </Paper>
    </Fragment>
  }
}

export default App;
