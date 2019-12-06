export const accountDetailsGQLTAG = `query stripeGetAccountDetails($accountId:String!){
    stripeGetAccountDetails(accountId:$accountId){
      data
    }
  }`

  /*
  {
"accountId":"acct_1FZH0CEGlttdcTZk"
} */