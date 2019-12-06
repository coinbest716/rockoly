export const ssoCustomerAuthtenticateGQLTAG = `mutation ssoAuthenticateCustomer(
    $pEmail: String!
    $pSsoUid: String!
    $pSsoType: String!
    $pType: String!
    $pFirstName: String
    $pLastName: String
  ) {
    ssoAuthenticateCustomer(
      input: {
        pEmail: $pEmail
        pSsoUid: $pSsoUid
        pSsoType: $pSsoType
        pType: $pType
        pFirstName: $pFirstName
        pLastName: $pLastName
      }
    ) {
      customerProfile{
        customerId
        fullName
        customerEmail
        customerStatusId
        customerProfileExtendedsByCustomerId{
          nodes{
            customerProfileExtendedId
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
