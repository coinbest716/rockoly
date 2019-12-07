export const attachCardToCustomerTAG = `mutation stripeAttachCardToCustomer(
  $email: String
  $customerId: String, 
  $cardToken: String!
  ) {
  stripeAttachCardToCustomer(
    email:$email
    customerId: $customerId, 
    cardToken: $cardToken
    ) {
    data
  }
}`;


/*
{
  // If firebase has no email in 
  "email":null,
  "customerId":null,
  "cardToken":"tok_visa"
}
*/

// Add token in headers
/*
{
  "token":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjI5NGNlMzNhNWQ3MmI0NjYyNzI3ZGFiYmRhNzVjZjg4Y2Y5OTg4MGUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcm9ja29seS1kZXYiLCJhdWQiOiJyb2Nrb2x5LWRldiIsImF1dGhfdGltZSI6MTU3MDI4MTc0MSwidXNlcl9pZCI6IldSdHZFVkZBODVmSm9KNDVHWmsxWDZ1czdjUDIiLCJzdWIiOiJXUnR2RVZGQTg1ZkpvSjQ1R1prMVg2dXM3Y1AyIiwiaWF0IjoxNTcwMjgxNzQxLCJleHAiOjE1NzAyODUzNDEsImVtYWlsIjoia2lydXRoaWthQG5lb3NtZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsia2lydXRoaWthQG5lb3NtZS5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.bvaYHeL0AUGTW5HDwXPXRCtVZ23ODOqOSZ2y2GJqdMIMvWSpkmOmTNTGHOLqDolFCDskoYs6P0Yv8lEXizEaONB3zn6tTzFxmcf3HJQLn91KaU1nLd5up2-fKbThT0P3oUbrOUuplVp8kcDB7Lu6qUkrrQeRaJILSD0slA3ALzUUlK9BwyVW_nqNjyjnmWBtluwV_kb0qS7I-S9OrOJb7yMKSr_QM81er5Ydpx4XQLntu4ROWl6VgA3f-DF3Ls9LF1xtjhQ7Gr3vtMiBqISWWOZ98GGucxEqECXeZcJ1gyJIF_4ZudcOYXUOzhFfd00WmR67WxC-ebfr2p79BsgVdw"
}
*/