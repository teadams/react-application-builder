const rab_component_models = {
  empty: {
    list: {
      names:{},
      components:{},
      default_mode:"",  
      props:{}
    },
    row: {
      names:{},
      components:{},
      default_mode:"",
      props:{}
    },
    field:{
      names:{},
      components:{},
      default_mode:"",
      props:{}
    }
  },
  shell: {
    list: {
      names:{
        body_wrap:"Fragment",
        list_body_wrap:"Fragment",
        list_container:"Fragment",
        list_pagination:"Fragment"
    },
      components:{},
      defaut_mode:"view",  
      props:{
        pagination:false
      }
    },
    row: {
      names:{
        row_wrap:"Fragment",
        row_body:"Fragment"
      },
      components:{},
      default_mode:"view",
      props:{}
    },
    field:{
      names:{
        field_wrap:"Fragment",
      },
      components:{},
      default_mode:"click_to_edit",
      props:{}
    }
  },
  list: {
    list: {
      names:{
        header_wrap:"Fragment",
        header:"RABObjectTypePrettyPlural",
        list_container:"TableContainer",
        list_wrap:"Table",
        list_header_wrap:"Fragment",
        list_header:"Fragment",
        list_pagination:"TablePagination",
        body_wrap:"TableBody",
        footer_wrap:"Fragment",
        footer:"Fragment"
      },
      components:{}, 
      props:{
          num_columns:"all",
          mode:"list",
          pagination:true
      }
    },
    row: {
      names:{
        header_wrap:"RABVoid",
        header:"Fragment",
        row_body:"Fragment",
        section_wrap:"Fragment",
        section_header:"RABVoid",
        section_body_wrap:"Fragment",
        row_wrap:"TableRow",
        field_chunk_wrap:"Fragment"
    },
      components:{},
      default_mode:"view",
      props:{
          num_columns:"all"
      }
    },
    field:{
      names:{
        field_wrap:"TableCell",
    },
      components:{},
      default_mode:"click_to_edit",
      props:{
        field_display:"field"
      }
    }
  },
  table_list: {
    list: {
      names:{
        header_wrap:"Fragment",
        header:"RABObjectTypePrettyPlural",
        list_container:"TableContainer",
        list_wrap:"Table",
        list_header_wrap:"Fragment",
        list_header:"Fragment",
        list_pagination:"TablePagination",
        body_wrap:"TableBody",
        footer_wrap:"Fragment",
        footer:"Fragment"
      },
      components:{}, 
      props:{
          num_columns:"all",
          mode:"list",
          pagination:true
      }
    },
    row: {
      names:{
        header_wrap:"RABVoid",
        header:"Fragment",
        row_body:"Fragment",
        section_wrap:"Fragment",
        section_header:"RABVoid",
        section_body_wrap:"Fragment",
        row_wrap:"TableRow",
        field_chunk_wrap:"Fragment"
    },
      components:{},
      default_mode:"view",
      props:{
          num_columns:"all"
      }
    },
    field:{
      names:{
        field_wrap:"TableCell",
    },
      components:{},
      default_mode:"click_to_edit",
      props:{
        field_display:"field"
      }
    }
  },
  tag_list: {
    list: {
      names:{
        header_wrap:"RABVoid",
        header:"RABVoid",
        list_container:"ACSTagWrap",
        list_wrap:"Fragment",
        list_header_wrap:"Fragment",
        list_header:"Fragment",
        list_pagination:"RABVoid",
        body_wrap:"Fragment",
        footer_wrap:"Fragment",
        footer:"Fragment"
      },
      components:{}, 
      props:{
          num_columns:"all",
          mode:"list",
          pagination:false,
          list_container:{tag:"div",
            tag_style:{padding:30}}/// ul, div}
      }
    },
    row: {
      names:{
        header_wrap:"RABVoid",
        header:"RABVoid",
        row_body:"Fragment",
        section_wrap:"Fragment",
        section_header:"RABVoid",
        section_body_wrap:"Fragment",
        row_wrap:"ACSTagWrap",
        field_chunk_wrap:"Fragment"
    },
      components:{},
      default_mode:"view",
      props:{
          num_columns:"all",
          tag:"div", // li, div
          tag_style:{padding:5},
      }
    },
    field:{
      names:{
        field_wrap:"Fragment",
    },
      components:{},
      default_mode:"click_to_edit",
      props:{
        field_display:"field"
      }
    }
  },
  row: {
    list: {
      names:{},
      components:{},
      default_mode:"view",  
      props:{}
    },
    row: {
      names:{
        header_wrap:"Fragment",
        header:"RABObjectPrettyName",
        row_body:"",
        section_wrap:"Fragment",
        section_header:"Fragment",
        row_wrap:"Fragment",
        field_chunk_wrap:"TableRow"
      },
      components:{},
      default_mode:"view",
      props:{
        align:"left",
        num_columns:2,
        no_stripe:true
      }
    },
    field:{
      names:{
        field_wrap:"TableCell"
      },
      components:{
      },
      default_mode:"click_to_edit",
      props:{
        field_display:"name_value_wrapped"
        //field_display:"name_above_value"
        //field_display:"name_value"
      }
    }
  },
  field: {
    list: {
      names:{},
      components:{},
      defaut_mode:"view",  
      props:{}
    },
    row: {
      names:{},
      components:{},
      default_mode:"view",
      props:{}
    },
    field:{
      names:{},
      components:{},
      default_mode:"click_to_edit",
      props:{}
    }
  },
  tab: {
      list: {
        names:{
          header_wrap:"Fragment",
          header:"Fragment",
          list_wrap:"Fragment",
          list_header_wrap:"Fragment",
          list_header:"Fragment",
          body_wrap:"Fragment",
          footer_wrap:"Fragment",
          footer:"Fragment",
          list:"Fragment",
          list_pagination:"Fragment"
        },
        components:{},
        defaut_mode:"view",  
        props:{}
      },
      row: {
        names:{
          row_wrap:"Fragment",
          row:"Fragment"
      },
        components:{},
        default_mode:"view",
        props:{}
      },
      field:{
        names:{
          field_wrap:"Fragment",
          field:"Fragment"
      },
        components:{},
        default_mode:"view",
        props:{}
      }
    },

}

export default rab_component_models