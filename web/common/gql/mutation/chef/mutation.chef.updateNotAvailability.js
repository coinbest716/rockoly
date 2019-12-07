export const updateNotAvailabilityGQLTAG = `mutation updateChefNotAvailability(
  $pChefId: String!
  $pDate: Date
  $pFromTime: Time!
  $pToTime: Time!
  $pType: String!
  $pChefNotAvailId: String
  $pNotes: String
  $pFrequency: String
) {
  updateChefNotAvailability(
    input: {
      pChefId: $pChefId
      pDate: $pDate
      pFromTime: $pFromTime
      pToTime: $pToTime
      pType: $pType
      pChefNotAvailId: $pChefNotAvailId
      pNotes: $pNotes
      pFrequency: $pFrequency
    }
  ) {
    chefNotAvailabilityProfile {
      chefNotAvailId
      chefId
      chefNotAvailDow
      chefNotAvailDate
      chefNotAvailFromTime
      chefNotAvailToTime
      chefNotAvailNotes
      createdAt
    }
  }
}
  `

  /**
   {
  "pChefId": "d0d6e768-195e-4b03-8bcb-d8200ddd1d8b",
  "pDate": "2019-09-20",
  "pFromTime": "10:00:00",
  "pToTime": "17:00:00",
  "pType": "DELETE",
  "pChefNotAvailId": "",
  "pNotes":null,
  "pFrequency": null
}
   */