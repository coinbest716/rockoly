  export const profileByIdGQLTAG = `query adminProfileByAdminId(
    $adminId: String!
    $pFromTime: Datetime
    $pToTime: Datetime
  ) {
    adminProfileByAdminId(adminId: $adminId) {
      adminId
      adminSalutation
      adminFirstName
      adminLastName
      adminMobileNumber
      adminMobileCountryCode
      mobileNoWithCountryCode
      commissionEarnedHisStartDate
      fullName
      latestCommissionValue
      adminDob
      adminGender
      adminPicId
      adminEmail
      adminMobileNumber
      adminRoleTypeIds
      adminStatusId
      entityId
      createdAt
      totalCommissionEarned(pFromTime: $pFromTime, pToTime: $pToTime)
    }
  }  
  `;
  
  // Query Variables
  /*
  {
    "adminId": "4c425664-79e6-46d6-867f-1c4f4b9932c7",
    "pFromTime":"2019-09-01 00:00:00"
    "pToTime":"2019-09-30 23:59:59"
  }
  */