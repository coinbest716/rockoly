export const changeLocationGQLTag = `mutation updateChefProfileExtendedByChefProfileExtendedId(
  $chefProfileExtendedId: String!
  $chefLocationAddress: String
  $chefLocationLat: String
  $chefLocationLng: String
  $chefAddrLine1: String
  $chefAddrLine2: String
  $chefPostalCode: String
  $chefCity: String
  $chefState: String
  $chefCountry: String
  $chefAvailableAroundRadiusInValue: Float
  $chefAvailableAroundRadiusInUnit: String
) {
  updateChefProfileExtendedByChefProfileExtendedId(
    input: {
      chefProfileExtendedId: $chefProfileExtendedId
      chefProfileExtendedPatch: {
        chefLocationAddress: $chefLocationAddress
        chefLocationLat: $chefLocationLat
        chefLocationLng: $chefLocationLng
        chefAddrLine1: $chefAddrLine1
        chefAddrLine2: $chefAddrLine2
        chefCity: $chefCity
        chefState: $chefState
        chefCountry: $chefCountry
        chefPostalCode: $chefPostalCode
        chefAvailableAroundRadiusInValue: $chefAvailableAroundRadiusInValue
        chefAvailableAroundRadiusInUnit: $chefAvailableAroundRadiusInUnit
      }
    }
  ) {
    chefProfileExtended {
      chefProfileExtendedId
      chefLocationAddress
      chefLocationLat
      chefLocationLng
      chefAddrLine1
      chefAddrLine2
      chefPostalCode
      chefCity
      chefState
      chefCountry
      chefAvailableAroundRadiusInValue
      chefAvailableAroundRadiusInUnit
    }
  }
}

`;

/*
{
  "chefProfileExtendedId":"",
  "chefLocationAddress":"",
  "chefLocationLat":"",
  "chefLocationLng":"",
  "chefAddrLine1":"",
  "chefAddrLine2":"",
  "chefPostalCode":"",
  "chefAvailableAroundRadiusInValue:"",
  "chefAvailableAroundRadiusInUnit:"MILES"
}
*/