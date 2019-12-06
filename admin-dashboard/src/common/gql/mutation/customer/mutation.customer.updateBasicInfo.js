export const updateBasicInfoGQLTag = `mutation updateCustomerProfileByCustomerId(
  $customerId: String!
  $customerSalutation: String
  $customerFirstName: String!
  $customerLastName: String
  $customerGender: String
  $customerDob: Datetime
  $customerMobileCountryCode:String
  $customerMobileNumber: String
  $customerPicId:String
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
        customerMobileCountryCode:$customerMobileCountryCode 
        customerMobileNumber: $customerMobileNumber
        customerPicId:$customerPicId
      }
    }
  ) {
    customerProfile {
      customerSalutation
      customerFirstName
      customerLastName
      customerGender
      customerDob
      customerMobileCountryCode
      customerMobileNumber
      customerPicId
      createdAt
      updatedAt
    }
  }
}


  `
  
  /*
  {
  "customerId":"824373e4-46aa-459c-a819-5d76bede77b7",
  "customerSalutation":"MR",
  "customerFirstName": "Saravana",
  "customerLastName": "Kannan", 
  "customerGender":  "MALE",
  "customerDob": "1994-04-19T13:53:14.263854",
  "customerMobileNumber": '9442639487'
  "customerPicId": "https://firebasestorage.googleapis.com/v0/b/rockoly-dev.appspot.com/o/profile%2Fcooking-775503_1920.jpg?alt=media&token=85a7b12e-d5d8-44be-a825-86455921b2b7"
}
  */