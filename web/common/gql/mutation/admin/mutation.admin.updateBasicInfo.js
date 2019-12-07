export const updateBasicInfoGQLTag = `mutation updateAdminProfileByAdminId(
    $adminId: String!
    $adminSalutation: String
    $adminFirstName: String!
    $adminLastName: String
    $adminDob: Datetime
    $adminGender: String
    $adminMobileNumber: String
  ) {
    updateAdminProfileByAdminId(
      input: {
        adminId: $adminId
        adminProfilePatch: {
          adminSalutation: $adminSalutation
          adminFirstName: $adminFirstName
          adminLastName: $adminLastName
          adminDob: $adminDob
          adminGender: $adminGender
          adminMobileNumber: $adminMobileNumber
        }
      }
    ) {
      adminProfile {
        adminId
        adminSalutation
        adminFirstName
        adminLastName
        adminDob
        adminGender
        adminPicId
        adminEmail
        adminMobileNumber
        adminRoleTypeIds
      }
    }
  }
  `;