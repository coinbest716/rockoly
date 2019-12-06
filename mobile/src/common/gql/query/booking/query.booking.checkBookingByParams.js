export const checkBookingByParamsGQLTAG = `query checkBookingByParams(
  $pChefId: String!
  $pFromTime: Datetime!
  $pToTime: Datetime!
  $pGmtFromTime: Datetime!
  $pGmtToTime: Datetime!
  $pBookingId: String
) {
  checkBookingByParams(
    pChefId: $pChefId
    pFromTime: $pFromTime
    pToTime: $pToTime
    pBookingId: $pBookingId
    pGmtFromTime: $pGmtFromTime
    pGmtToTime: $pGmtToTime
  ) {
    success
    message
    json
  }
}

  ` 

  /*{
  "pChefId": "23fe20cc-6097-4526-9536-5068c1b36b93",
  "pFromTime": "2019-11-01 09:00:00",
  "pToTime":"2019-11-01 10:00:00",
  "pGmtFromTime": "2019-11-01 09:00:00",
  "pGmtToTime": "2019-11-01 10:00:00"
} */