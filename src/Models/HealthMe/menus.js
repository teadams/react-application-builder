import framework_menus from "../../Test/field-framework.js"

framework_menus.app_menu = [{index:"0", label: "List", component:"ACSField",
              data:{first_name:"Tracy", last_name:"Adams", mom_first:"Jane", mom_last:"Belmont"}}]
 

const metadata_menus = {
  app_menu: framework_menus.app_menu
}

export default metadata_menus;