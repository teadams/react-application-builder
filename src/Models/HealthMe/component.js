const rab_component_models = {
  test: {
    list: {
      component_names:{
        body_wrap:"Text"
      },
      components:{},
      defaut_mode:"view",  
      props:{}
    },
    row: {
      component_names:{},
      components:{},
      default_mode:"view",
      props:{}
    },
    field:{
      component_names:{},
      components:{},
      default_mode:"click_to_edit",
      props:{}
    }
  },
  shell: {
    list: {
      component_names:{
        body_wrap:"Fragment",
        list_body_wrap:"Fragment",
        list: "RenderACSList"
    },
      components:{},
      defaut_mode:"view",  
      props:{}
    },
    row: {
      component_names:{
        row_wrap:"Fragment",
        row:"RenderACSRow"
      },
      components:{},
      default_mode:"view",
      props:{}
    },
    field:{
      component_names:{
        field_wrap:"Fragment",
        field:"RenderField"
      },
      components:{},
      default_mode:"click_to_edit",
      props:{}
    }
  },
  list: {
    list: {
      component_names:{
        list_wrap:"Table",
        body_wrap:"Fragment",
      },
      components:{},
      defaut_mode:"view",  
      props:{}
    },
    row: {
      component_names:{
        row_wrap:"TableRow",
    },

      components:{},
      default_mode:"view",
      props:{}
    },
    field:{
      component_names:{
        field_wrap:"TableCell"
    },
      components:{},
      default_mode:"click_to_edit",
      props:{}
    }
  },
  field: {
    list: {
      component_names:{},
      components:{},
      defaut_mode:"view",  
      props:{}
    },
    row: {
      component_names:{},
      components:{},
      default_mode:"view",
      props:{}
    },
    field:{
      component_names:{},
      components:{},
      default_mode:"click_to_edit",
      props:{}
    }
  },
  row: {
    list: {
      component_names:{},
      components:{},
      defaut_mode:"view",  
      props:{}
    },
    row: {
      component_names:{},
      components:{},
      default_mode:"view",
      props:{}
    },
    field:{
      component_names:{},
      components:{},
      default_mode:"click_to_edit",
      props:{}
    }
  }
}

export default rab_component_models