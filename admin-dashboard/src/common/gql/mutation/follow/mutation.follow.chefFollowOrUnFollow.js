export const chefFollowOrUnFollowGQLTAG = `mutation followOrUnfollowChef(
  $pChefId: String!
  $pCustomerId: String!
  $pType: String!
) {
  followOrUnfollowChef(
    input: { 
      pChefId: $pChefId, 
      pCustomerId: $pCustomerId, 
      pType: $pType 
    }
  ) {
    customerFollowChefs {
      nodeId
      chefId
    }
  }
}
`;


/*
{
  "pChefId":"07fe580f-416c-4125-b6a3-6a0aa589a1ad",
  "pCustomerId":"824373e4-46aa-459c-a819-5d76bede77b7",
  "pType":"FOLLOW" / "UNFOLLOW"
}
*/