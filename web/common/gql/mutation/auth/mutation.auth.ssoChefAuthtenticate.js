export const ssoChefAuthtenticateGQLTAG = `mutation ssoAuthenticateChef(
    $pEmail: String!
    $pSsoUid: String!
    $pSsoType: String!
    $pType: String!
    $pFirstName: String
    $pLastName: String
  ) {
    ssoAuthenticateChef(
      input: {
        pEmail: $pEmail
        pSsoUid: $pSsoUid
        pSsoType: $pSsoType
        pType: $pType
        pFirstName: $pFirstName
        pLastName: $pLastName
      }
    ) {
      chefProfile {
        chefId
        fullName
        chefEmail
        chefStatusId
        chefProfileExtendedsByChefId{
          totalCount
          nodes{
            chefProfileExtendedId
          }
        }
        chefSpecializationProfilesByChefId{
          totalCount
          nodes{
            chefSpecializationId
          }
        }
      }
    }
  }
  `;

/*
{
  "pEmail": "naa@gmail.com",
  "pSsoUid": "111",
  "pSsoType": "GOOGLE" ,
  "pType": "REGISTER",
  "pFirstName": null,
  "pLastName": null
}
*/
