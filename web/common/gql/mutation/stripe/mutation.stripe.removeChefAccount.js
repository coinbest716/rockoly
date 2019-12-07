export const removeChefAccountGQLTAG = `mutation stripeRemoveChefAccount($chefId: String!, $accountId: String!) {
    stripeRemoveChefAccount(chefId: $chefId, accountId: $accountId) {
      data
    }
  }`

  /*
  {
  "chefId": "",
  "accountId":""
} */