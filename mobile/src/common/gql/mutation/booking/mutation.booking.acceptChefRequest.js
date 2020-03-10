export const acceptChefRequestGQLTAG = `mutation customerAcceptChefBookingRequestedChanges($pData: JSON) {
  customerAcceptChefBookingRequestedChanges(input: { pData: $pData }) {
    procedureResult {
      success
      message
      json
    }
  }
}`


/**
{
  pData :{
    "bookingHistId": "693b2811-f6d9-4fc4-85e8-258f2aa824ee",
    "bookingPriceValue": 60,
    "bookingCommissionPriceValue": 1.25,
    "bookingTotalPriceValue": 61.25,
    "bookingNoOfPeople": 2,
    "bookingComplexity": 3,
    "bookingAdditionalServices": [
      {
        "service": "CLEANING",
        "price": 12
      }
    ]
  }
}
*/