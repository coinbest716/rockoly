export const createOrSaveBookingGQLTAG = `mutation createOrSaveBooking(
  $stripeCustomerId: String
  $cardId: String
  $chefId: String!
  $customerId: String!
  $fromTime: String
  $toTime: String
  $notes: String
  $dishTypeId: [String]
  $summary: String
  $allergyTypeIds: [String]
  $otherAllergyTypes: JSON
  $dietaryRestrictionsTypesIds: [String]
  $otherDietaryRestrictionsTypes: JSON
  $kitchenEquipmentTypeIds: [String]
  $otherKitchenEquipmentTypes: JSON
  $storeTypeIds: [String]
  $otherStoreTypes: JSON
  $noOfGuests: Int
  $complexity: Float
  $additionalServices: [additionalServicesType]
  $locationAddress: String
  $locationLat: String
  $locationLng: String
  $addrLine1: String
  $addrLine2: String
  $state: String
  $country: String
  $city: String
  $postalCode: String
  $isDraftYn: Boolean
  $bookingHistId: String
) {
  createOrSaveBooking(
    stripeCustomerId: $stripeCustomerId
    cardId: $cardId
    chefId: $chefId
    customerId: $customerId
    fromTime: $fromTime
    toTime: $toTime
    notes: $notes
    dishTypeId: $dishTypeId
    summary: $summary
    allergyTypeIds: $allergyTypeIds
    otherAllergyTypes: $otherAllergyTypes
    dietaryRestrictionsTypesIds: $dietaryRestrictionsTypesIds
    otherDietaryRestrictionsTypes: $otherDietaryRestrictionsTypes
    kitchenEquipmentTypeIds: $kitchenEquipmentTypeIds
    otherKitchenEquipmentTypes: $otherKitchenEquipmentTypes
    storeTypeIds: $storeTypeIds
    otherStoreTypes: $otherStoreTypes
    noOfGuests: $noOfGuests
    complexity: $complexity
    additionalServices: $additionalServices
    locationAddress: $locationAddress
    locationLat: $locationLat
    locationLng: $locationLng
    addrLine1: $addrLine1
    addrLine2: $addrLine2
    state: $state
    country: $country
    city: $city
    postalCode: $postalCode
    isDraftYn: $isDraftYn
    bookingHistId: $bookingHistId
  ) {
    data
  }
}`
/*
{
  "stripeCustomerId":"cus_G81Ncl2ZEC44Tb",
  "cardId":"card_1FgmUzAZeKBPGDhHUBSA3afr",
  "chefId":"9f749de7-dbc7-47f4-92d3-9c013e1788cf",
  "customerId":"115be931-9b10-4982-acf1-b13d4a8a9b34",
  "fromTime":"2019-11-10 11:00:00",
  "toTime":"2019-11-10 12:00:00",
  "notes":null,
  "dishTypeId": null,
  "summary": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  "allergyTypeIds": ["WHEAT                               ","EGGS                                "],
  "otherAllergyTypes": "tomato,potato,rice",
  "dietaryRestrictionsTypesIds": ["PEANUT_ALLERGIES                    ","DIABETIC                            "],
  "otherDietaryRestrictionsTypes": "tomato,potato,rice",
  "kitchenEquipmentTypeIds": ["SLOW_COOKER                         ","HAND_JUICER                         "],
  "otherKitchenEquipmentTypes": "tomato,potato,rice",
  "storeTypeIds": ["WHOLE_FOODS                         ","PRICE_RITE                          "],
  "otherStoreTypes": "tomato,potato,rice",
  "noOfGuests": 3,
  "complexity": 2,
  "additionalServices": [{"service": "CLEANING","price": 100}],
  "locationAddress":"",
"locationLat":"",
"locationLng":"",
"addrLine1":"",
"addrLine2":"",
"state":"",
"country":"",
"city":"",
"postalCode":""
"isDraftYn":false
"bookingHistId":null
}
*/
/*PASS IN HEADERS:
{
  "token":"eyJhbGciOiJSUzI1NiIsImtpZCI6ImEwYjQwY2NjYmQ0OWQxNmVkMjg2MGRiNzIyNmQ3NDZiNmZhZmRmYzAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcm9ja29seS1kZXYiLCJhdWQiOiJyb2Nrb2x5LWRldiIsImF1dGhfdGltZSI6MTU3MjMyNzQwNiwidXNlcl9pZCI6IldSdHZFVkZBODVmSm9KNDVHWmsxWDZ1czdjUDIiLCJzdWIiOiJXUnR2RVZGQTg1ZkpvSjQ1R1prMVg2dXM3Y1AyIiwiaWF0IjoxNTcyMzQxMTUyLCJleHAiOjE1NzIzNDQ3NTIsImVtYWlsIjoia2lydXRoaWthQG5lb3NtZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsia2lydXRoaWthQG5lb3NtZS5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.PzvFa4HIUBd5F9Tj29HIjhUeKcX-d5ARh8epwmNHq9XtoRLJKQrdAFF9cUlvMdF2P0WCWAB0Wk7qN6SO3i_A1YXRHRrXziQbjL7OEOj1pTW1icapf7WT65NLMVNmqws15_RMFnNYX31WwY80JjoA7syRQH8Oz5QGkPUjenzwRhm_n5hNVyYpFRTeQOmpHJ-xlkLh0iHMIUzB0v45ti84uE1UKnEgTkudH7Gp7N6jDJMy821a1wnSHPY3se9mXmw2_U0A4crn8nEinA7_mdKbG7oflRgY1bInk0xSZ36DMTVTaiVYYz2GcESBO3BXmvoa5FpfiKGA7FGfTsKyuPf3Ig"
}
*/