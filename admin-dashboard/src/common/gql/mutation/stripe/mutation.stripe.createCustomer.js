export const createCustomerGQLTAG = `mutation stripeCreateCustomer(
    $name: String!
    $email: String!
    $personChefId: String
    $personCustomerId: String
  ) {
    stripeCreateCustomer(
      name: $name
      email: $email
      personChefId: $personChefId
      personCustomerId: $personCustomerId
    ) {
      data
    }
  }`;


  /*
  {
  "name":"Naaziya1",
  "email":"naaziya1@neosme.com",
  "personChefId": "5d4c99c6-1ff4-4dc3-a4f7-a1afad8af26e",
  "personCustomerId": "3abc04c2-1633-4578-a348-74ce9951f4f5"
   }
  */