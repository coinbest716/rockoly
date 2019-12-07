export const updatePriceForBookingGQLTAG = `mutation updatePriceForBooking(
  $chefProfileExtendedId: String!
  $chefPricePerHour: Float
  $chefGratuity: Float
  $noOfGuestsMin: Int
  $noOfGuestsMax: Int
  $noOfGuestsCanServe: Int
  $discount: Float
  $personsCount: Int
) {
  updateChefProfileExtendedByChefProfileExtendedId(
    input: {
      chefProfileExtendedId: $chefProfileExtendedId
      chefProfileExtendedPatch: {
        chefPricePerHour: $chefPricePerHour
        chefGratuity: $chefGratuity
        noOfGuestsMin: $noOfGuestsMin
        noOfGuestsMax: $noOfGuestsMax
        noOfGuestsCanServe: $noOfGuestsCanServe
        discount: $discount
        personsCount: $personsCount
      }
    }
  ) {
    chefProfileExtended {
      chefPricePerHour
      chefGratuity
      noOfGuestsMin
      noOfGuestsMax
      noOfGuestsCanServe
      discount
      personsCount
    }
  }
}
`


  /*
{
  "chefProfileExtendedId": "",
  "chefPricePerHour": 100,
  "chefGratuity": 2.5,
  "noOfGuestsMin": 1,
  "noOfGuestsMax": 2,
  "noOfGuestsCanServe": 2
}
 */