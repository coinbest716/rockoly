export const checkUserAdminGQLTAG = `query checkUserIsAdmin($pAdminEmail: String!) {
    checkUserIsAdmin(pEmail: $pAdminEmail)
  }
  `

  /*{
  "pAdminEmail": "surendran@neosme.com"
} */