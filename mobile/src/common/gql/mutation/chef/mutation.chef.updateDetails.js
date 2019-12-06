export const updateDetailsGQLTag = `mutation updateChefProfileExtendedByChefProfileExtendedId(
  $chefProfileExtendedId: String!
  $chefDesc: String
  $chefExperience: String
  $chefDrivingLicenseNo: String
  $chefFacebookUrl: String
  $chefTwitterUrl: String
  $chefPricePerHour: Float
  $chefPriceUnit: String
  $chefBusinessHoursFromTime:Time
  $chefBusinessHoursToTime:Time
  $isIntroSlidesSeenYn:Boolean
  $minimumNoOfMinutesForBooking:Int
) {
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
        
        isIntroSlidesSeenYn:$isIntroSlidesSeenYn

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
      minimumNoOfMinutesForBooking
    }
  }
}
`;

/*
{
  "chefProfileExtendedId":"",
  "chefDesc":"",
  "chefExperience":"",
  "chefDrivingLicenseNo":"",
  "chefFacebookUrl":"",
  "chefTwitterUrl":"",
  "chefPricePerHour":0,
  "chefPriceUnit":"",
  "chefBusinessHoursFromTime":""
  "chefBusinessHoursToTime":""
  "chefAvailableAroundRadiusInValue":""
  "chefAvailableAroundRadiusInUnit":""
  "isIntroSlidesSeenYn": true
}
*/