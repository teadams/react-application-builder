const app_params =    {
  name:"Now We Act",
  prefix:"nwa",
  context_default_object:"4" , // must be a string
  footer: "",
  // the statuses that count as full members (ie - users with a core_user_subsite_role
  // status as rejected and applied would not typically be considered as members)
  subsite_member_role_statuses: "[Accepted]",
  hamburger_menu_auth_scope:"site",
  hamburger_meny_auth_priv:"admin",
  auth_action_privs: {    
      // default for site
      site: { read: "public", admin:"admin", create:"admin", edit:"admin",creation_user_can_edit:true},
      // default for context
      context: { read: "public", admin:"admin", create:"admin", edit:"create", creation_user_can_edit:true},
      //  custom, as specificied in authorization_privs key of the object type
      users_can_create: { read: "public", admin:"admin", create:"user", edit:"create", creation_user_can_edit:true},
  }
}

export default app_params
