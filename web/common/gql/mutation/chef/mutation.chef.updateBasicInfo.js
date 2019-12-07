export const updateBasicInfoGQLTag = `mutation updateChefProfileByChefId(
  $chefId: String!
  $chefSalutation: String
  $chefFirstName: String!
  $chefLastName: String
  $chefGender: String
  $chefDob: Datetime
  $chefMobileCountryCode:String
  $chefMobileNumber: String
  $chefPicId: String
) {
  updateChefProfileByChefId(
    input: {
      chefId: $chefId
      chefProfilePatch: {
        chefSalutation: $chefSalutation
        chefFirstName: $chefFirstName
        chefLastName: $chefLastName
        chefGender: $chefGender
        chefDob: $chefDob
        chefMobileCountryCode:$chefMobileCountryCode
        chefMobileNumber: $chefMobileNumber
        chefPicId: $chefPicId
      }
    }
  ) {
    chefProfile {
      chefSalutation
      chefFirstName
      chefLastName
      chefGender
      chefDob
      chefMobileCountryCode
      chefMobileNumber
      chefPicId
      createdAt
      updatedAt
    }
  }
}
  `;

   /*
    {
  "chefId":"5e0661ac-9dd0-4f7e-bde4-ea0d4312d355",
  "chefSalutation":"MR",
  "chefFirstName":"Saravana",
  "chefLastName":"Kannan",
  "chefGender": "MALE",
  "chefDob": "1994-04-19T13:53:14.263854",
  "chefMobileNumber": "9442639487",
  "chefPicId": "https://firebasestorage.googleapis.com/v0/b/rockoly-dev.appspot.com/o/profile%2Fcooking-775503_1920.jpg?alt=media&token=85a7b12e-d5d8-44be-a825-86455921b2b7"
}
  */