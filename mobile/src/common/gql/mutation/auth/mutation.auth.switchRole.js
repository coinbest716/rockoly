export const switchRoleGQLTAG = `mutation switchUserByRole(
    $pEmail: String
    $pSwitchFrom: String!
    $pSwitchTo: String!
  ) {
    switchUserByRole(
      input: { pEmail: $pEmail, pSwitchFrom: $pSwitchFrom, pSwitchTo: $pSwitchTo }
    ) {
      json
    }
  }`

  /*
    {
  "pEmail": "",
  "pSwitchFrom": "CHEF / CUSTOMER",
  "pSwitchTo":  "CHEF / CUSTOMER"
} */