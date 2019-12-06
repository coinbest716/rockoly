export const changeLocationGQLTag = `mutation updateCustomerProfileExtendedByCustomerProfileExtendedId(
  $customerProfileExtendedId: String!
  $customerLocationAddress: String
  $customerLocationLat: String
  $customerLocationLng: String
  $customerAddrLine1: String
  $customerAddrLine2: String
  $customerCity: String
  $customerState: String
  $customerCountry: String
  $customerPostalCode: String
) {
  updateCustomerProfileExtendedByCustomerProfileExtendedId(
    input: {
      customerProfileExtendedId: $customerProfileExtendedId
      customerProfileExtendedPatch: {
        customerLocationAddress: $customerLocationAddress
        customerLocationLat: $customerLocationLat
        customerLocationLng: $customerLocationLng
        customerAddrLine1: $customerAddrLine1
        customerAddrLine2: $customerAddrLine2
        customerCity: $customerCity
        customerState: $customerState
        customerCountry: $customerCountry
        customerPostalCode: $customerPostalCode
      }
    }
  ) {
    customerProfileExtended {
      customerProfileExtendedId
      customerLocationAddress
      customerLocationLat
      customerLocationLng
      customerAddrLine1
      customerAddrLine2
      customerCity
      customerState
      customerCountry
      customerPostalCode
    }
  }
}

`;

/*
{
  "customercustomerProfileExtendedId":"",
  "customerLocationAddress":"",
  "customerLocationLat":"",
  "customerLocationLng":"",
  "customerAddrLine1":"",
  "customerAddrLine2":"",
  "customerPostalCode":""
}
*/