export const updateAllGQLTAG = ` mutation updateCustomerDetails(
    $customerId: String!
    $customerProfileExtendedId: String!

    # Basic Info
    $customerSalutation: String
    $customerFirstName: String!
    $customerLastName: String
    $customerGender: String
    $customerDob: Datetime
    $customerMobileNumber: String!

    # Location
    $customerLocationAddress: String
    $customerLocationLat: String
    $customerLocationLng: String
    $customerAddrLine1: String
    $customerAddrLine2: String
    $customerState: String
    $customerCountry: String
    $customerCity: String
    $customerPostalCode: String
  ) {
    
    updateCustomerProfileByCustomerId(
        input: {
          customerId: $customerId
          customerProfilePatch: {
            customerSalutation: $customerSalutation
            customerFirstName: $customerFirstName
            customerLastName: $customerLastName
            customerGender: $customerGender
            customerDob: $customerDob
            customerMobileNumber:$customerMobileNumber
          }
        }
      ) {
        customerProfile {
            customerId
            customerSalutation
            customerFirstName
            customerLastName
            customerGender
            customerDob
            customerMobileNumber
            createdAt
        }
    }

    updateCustomerProfileExtendedByCustomerProfileExtendedId(
        input: {
            customerProfileExtendedId: $customerProfileExtendedId
            customerProfileExtendedPatch: {
                customerLocationAddress: $customerLocationAddress
                customerLocationLat: $customerLocationLat
                customerLocationLng: $customerLocationLng
                customerAddrLine1: $customerAddrLine1
                customerAddrLine2: $customerAddrLine2
                customerState: $customerState
                customerCountry: $customerCountry
                customerCity: $customerCity
                customerPostalCode:$customerPostalCode
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
            customerState
            customerCountry
            customerCity
            customerPostalCode
        }
    }
  }  
`;
// chefAttachments need to passed as json stringify, then only it will work
/*
{
    "customerId":"07fe580f-416c-4125-b6a3-6a0aa589a1ad",
    "customerProfileExtendedId":"ee84b5e8-9521-44c8-8ebd-7cd78ff658f1",
    "customerSalutation":null,
    "customerFirstName":null,
    "customerLastName":null,
    "customerGender":null,
    "customerDob":null,
    "customerMobileNumber":null,
    "customerLocationAddress":null,
    "customerLocationLat":null,
    "customerLocationLng":null,
    "customerAddrLine1":null,
    "customerAddrLine2":null,
    "customerState":null,
    "customerCountry":null,
    "customerCity":null,
    "customerPostalCode":null
}
*/