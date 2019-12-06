export const checkEmailAndMobileNoExistsUsingUserIdGQLTAG = `query checkEmailAndMobileNoExists(
  $pEmail: String
  $pMobileNo: String
  $pUserId: String
) {
  checkEmailAndMobileNoExists(
    pEmail: $pEmail
    pMobileNo: $pMobileNo
    pUserId: $pUserId
  ) {
    success
    message
    json
  }
}
  `

  /*
    {
    "pEmail": "",
    "pMobileNo": "",
	"pUserId":""
  } */