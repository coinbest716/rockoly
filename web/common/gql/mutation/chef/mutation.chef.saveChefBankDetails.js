export const saveChefBankDetailsGQLTAG = `mutation saveChefBankDetails($chefId: String!, $token: String!) {
    saveChefBankDetails(chefId: $chefId, token: $token) {
      data
    }
  }
   
  `

  /*
  {
  "chefId": "23fe20cc-6097-4526-9536-5068c1b36b93",
  "token": "ac_G5MnjEepWqglwr3qf9b8y9PMQkQIfmr1"
} */

/*
USE IN HEADERS:
{
  "token":"eyJhbGciOiJSUzI1NiIsImtpZCI6ImEwYjQwY2NjYmQ0OWQxNmVkMjg2MGRiNzIyNmQ3NDZiNmZhZmRmYzAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcm9ja29seS1kZXYiLCJhdWQiOiJyb2Nrb2x5LWRldiIsImF1dGhfdGltZSI6MTU3MjQxMzIwOSwidXNlcl9pZCI6IldSdHZFVkZBODVmSm9KNDVHWmsxWDZ1czdjUDIiLCJzdWIiOiJXUnR2RVZGQTg1ZkpvSjQ1R1prMVg2dXM3Y1AyIiwiaWF0IjoxNTcyNDE5ODA3LCJleHAiOjE1NzI0MjM0MDcsImVtYWlsIjoia2lydXRoaWthQG5lb3NtZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsia2lydXRoaWthQG5lb3NtZS5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.e9_0F0rO7GUh51g5NIOHMp_eGv_d8foDyrepg7OGjm-ePC7pCeEM3i3MxEyr-ktz3zWotWmKeFbqqpEBHQXzqCAQvXvyDXy8OFutCXCmRASXl36JYyRR1IlD34Js8-Vl0RO_nrizL1YQVkDV3MHUSAnGoUas0aTjOL1FKcCpwqiD8Lbf1XONmM-GJ5VsECLMARaQD7IPzJ0ReVq0wl-N2Rottk9bf3pzLA_eGdWj0rLHEiUyrQvBnJVidaDl0zEUuWrh0QjSdKcr4o8oB0NbF-muS30e37oRflwnDn3rB-lDkl1wtbtZW7KQG2CJGAL7xB6ovzm9JHrIHKNTwdLkzA"
} */