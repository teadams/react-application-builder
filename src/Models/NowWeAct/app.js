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
}

export default app_params
