const rab_component_models = {
  empty: {
    list: {
      names:{},
      components:{},
      defaut_mode:"",  
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
        list: "RenderACSList"
    },
      components:{},
      defaut_mode:"view",  
      props:{}
    },
    row: {
      names:{
        row_wrap:"Fragment",
        row:"RenderACSRow"
      },
      components:{},
      default_mode:"view",
      props:{}
    },
    field:{
      names:{
        field_wrap:"Fragment",
        field:"RenderACSField"
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
        header:"Fragment",
        list_wrap:"Table",
        list_header_wrap:"Fragment",
        list_header:"Fragment",
        body_wrap:"TableBody",
        footer_wrap:"Fragment",
        footer:"Fragment"
      },
      components:{},
      defaut_mode:"view",  
      props:{}
    },
    row: {
      names:{
        row_wrap:"TableRow",
    },

      components:{},
      default_mode:"view",
      props:{}
    },
    field:{
      names:{
        field_wrap:"TableCell"
    },
      components:{},
      default_mode:"click_to_edit",
      props:{}
    }
  },
  row: {
    list: {
      names:{},
      components:{},
      defaut_mode:"view",  
      props:{}
    },
    row: {
      names:{
        header_wrap:"Fragment",
        header:"Fragment",
        section_wrap:"Table",
        section_header:"Fragment",
        row_wrap:"TableBody",
        field_chunk_wrap:"TableRow"
      },
      components:{},
      default_mode:"view",
      props:{
        align:"left"
      }
    },
    field:{
      names:{
        field_wrap:"TableCell"
      },
      components:{
      },
      default_mode:"click_to_edit",
      props:{}
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


}

export default rab_component_models