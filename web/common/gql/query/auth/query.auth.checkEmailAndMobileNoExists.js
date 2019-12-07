export const checkEmailAndMobileNoExistsGQLTAG = `query checkEmailAndMobileNoExists($pEmail: String, $pMobileNo: String) {
    checkEmailAndMobileNoExists(pEmail: $pEmail, pMobileNo: $pMobileNo) {
      success
      message
      json
    }
  }
  `

  /*
    {
    "pEmail": "",
    "pMobileNo": ""
  } */