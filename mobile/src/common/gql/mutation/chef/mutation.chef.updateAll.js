export const updateAllGQLTAG =`
mutation updateChefDetails(
    $chefId: String!
    $chefSpecializationId: String!
    $chefProfileExtendedId: String!
    $chefSalutation: String
    $chefFirstName: String!
    $chefLastName: String
    $chefGender: String
    $chefDob: Datetime
    $chefDesc: String
    $chefExperience: String
    $chefDrivingLicenseNo: String
    $chefFacebookUrl: String
    $chefTwitterUrl: String
    $chefPricePerHour: Float
    $chefPriceUnit: String
    $minimumNoOfMinutesForBooking:Int
    $chefCuisineTypeId: [String]
    $chefDishTypeId: [String]
    $chefBusinessHoursFromTime:Time
    $chefBusinessHoursToTime:Time
    $chefAttachments:JSON
    $pAttachmentAreaSection:String
    $ingredientsDesc: JSON
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
        }
      }
    ) {
      chefProfile {
        chefSalutation
        chefFirstName
        chefLastName
        chefGender
        chefDob
        createdAt
        updatedAt
      }
    }
    updateChefProfileExtendedByChefProfileExtendedId(
      input: {
        chefProfileExtendedId: $chefProfileExtendedId
        chefProfileExtendedPatch: {
          chefDesc: $chefDesc
          chefExperience: $chefExperience
          chefDrivingLicenseNo: $chefDrivingLicenseNo
          chefFacebookUrl: $chefFacebookUrl
          chefTwitterUrl: $chefTwitterUrl
          chefPricePerHour: $chefPricePerHour
          chefPriceUnit: $chefPriceUnit
          chefBusinessHoursFromTime:$chefBusinessHoursFromTime
          chefBusinessHoursToTime:$chefBusinessHoursToTime
          minimumNoOfMinutesForBooking:$minimumNoOfMinutesForBooking
        }
      }
    ) {
      chefProfileExtended {
        chefDesc
        chefExperience
        chefDrivingLicenseNo
        chefFacebookUrl
        chefTwitterUrl
        chefPricePerHour
        chefPriceUnit
        chefBusinessHoursFromTime
        chefBusinessHoursToTime
        isIntroSlidesSeenYn
        minimumNoOfMinutesForBooking
      }
    }
    updateChefSpecializationProfileByChefSpecializationId(
      input: {
        chefSpecializationId: $chefSpecializationId
        chefSpecializationProfilePatch: {
          chefCuisineTypeId: $chefCuisineTypeId
          chefDishTypeId: $chefDishTypeId
          ingredientsDesc: $ingredientsDesc
        }
      }
    ) {
      chefSpecializationProfile {
        chefCuisineTypeId
        chefDishTypeId
        chefCuisineTypeDesc
        chefDishTypeDesc
        ingredientsDesc
      }
    }
    updateChefAttachment(
      input: {  pChefId: $chefId
        pAttachmentAreaSection: $pAttachmentAreaSection
        pChefAttachments: $chefAttachments }
    ) {
      chefAttachmentProfiles {
        chefId
        chefAttachmentDesc
        chefAttachmentType
        chefAttachmentUrl
      }
    }
  }  
`;

// chefAttachments need to passed as json stringify, then only it will work
/*
{
  "chefId":"07fe580f-416c-4125-b6a3-6a0aa589a1ad",
  "chefProfileExtendedId":"ee84b5e8-9521-44c8-8ebd-7cd78ff658f1",
  "chefSpecializationId": "0a5319d9-9e7a-4247-a85e-99ed8d56371d",
  "chefSalutation":null,
  "chefFirstName":"Naaziya",
  "chefLastName":"Nayeem",
  "chefGender": "FEMALE",
  "chefDob": "1994-04-19T13:53:14.263854",
  "chefDesc":null,
  "chefExperience":null,
  "chefDrivingLicenseNo":null,
  "chefFacebookUrl":null,
  "chefTwitterUrl":null,
  "chefPricePerHour":0,
  "chefPriceUnit":null,
  "chefBusinessHoursFromTime":null,
  "chefBusinessHoursToTime":null,
  "chefCuisineTypeId": ["LATVIAN_FOOD                        ","LATVIAN_FOOD                        "],
  "chefDishTypeId": ["TWINKIES                            "],
  "chefAttachments":"[\n  {\n    \"pAttachmentType\": \"IMAGE\",\n    \"pAttachmentUrl\": \"rffff\"\n  },\n  {\n    \"pAttachmentType\": \"IMAGE\",\n    \"pAttachmentUrl\": \"33333r333\"\n  },\n  {\n    \"pAttachmentType\": \"IMAGE\",\n    \"pAttachmentUrl\": \"vfrvrvrvrv\"\n  },\n  {\n    \"pAttachmentType\": \"IMAGE\",\n    \"pAttachmentUrl\": \"frfrfrfr\"\n  },\n  {\n    \"pAttachmentType\": \"IMAGE\",\n    \"pAttachmentUrl\": \"frfrfrfrf\"\n  }\n]",
}
*/