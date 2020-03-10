export const transferAmountGQLTAG = `mutation stripeTransferAmt(
    $chefStripeUserId: String!
    $bookingHistId: String!
    $adminId: String
    $chefId: String!
  ) {
    stripeTransferAmtTest(
      chefStripeUserId: $chefStripeUserId
      bookingHistId: $bookingHistId
      adminId: $adminId
      chefId: $chefId
    ) {
      data
    }
  }`

  /*
  {
"amount":1,
"currency": "USD",
"chefStripeUserId": "acct_1FW0LOFNoi5XElNk",
"bookingHistId": "8e996fac-1d5f-4988-b572-84c0bd9cfa3b",
"adminId": "8298d543-6ede-491a-a0b6-13e2f7531719",
"chefId":"9f749de7-dbc7-47f4-92d3-9c013e1788cf"
} */

/*
USE IN HEADERS:
{
  "token":"eyJhbGciOiJSUzI1NiIsImtpZCI6ImEwYjQwY2NjYmQ0OWQxNmVkMjg2MGRiNzIyNmQ3NDZiNmZhZmRmYzAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcm9ja29seS1kZXYiLCJhdWQiOiJyb2Nrb2x5LWRldiIsImF1dGhfdGltZSI6MTU3MjMyNzQwNiwidXNlcl9pZCI6IldSdHZFVkZBODVmSm9KNDVHWmsxWDZ1czdjUDIiLCJzdWIiOiJXUnR2RVZGQTg1ZkpvSjQ1R1prMVg2dXM3Y1AyIiwiaWF0IjoxNTcyMzQxMTUyLCJleHAiOjE1NzIzNDQ3NTIsImVtYWlsIjoia2lydXRoaWthQG5lb3NtZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsia2lydXRoaWthQG5lb3NtZS5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.PzvFa4HIUBd5F9Tj29HIjhUeKcX-d5ARh8epwmNHq9XtoRLJKQrdAFF9cUlvMdF2P0WCWAB0Wk7qN6SO3i_A1YXRHRrXziQbjL7OEOj1pTW1icapf7WT65NLMVNmqws15_RMFnNYX31WwY80JjoA7syRQH8Oz5QGkPUjenzwRhm_n5hNVyYpFRTeQOmpHJ-xlkLh0iHMIUzB0v45ti84uE1UKnEgTkudH7Gp7N6jDJMy821a1wnSHPY3se9mXmw2_U0A4crn8nEinA7_mdKbG7oflRgY1bInk0xSZ36DMTVTaiVYYz2GcESBO3BXmvoa5FpfiKGA7FGfTsKyuPf3Ig"
} */
