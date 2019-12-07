export const updateChefExperienceDetailsGQLTAG = `mutation updateChefExperienceDetails(
    $chefProfileExtendedId: String!
    $chefAwards: JSON
    $chefCertificateType: [String]
  ) {	
    updateChefProfileExtendedByChefProfileExtendedId(
      input: {
        chefProfileExtendedId: $chefProfileExtendedId
        chefProfileExtendedPatch: {
          chefAwards: $chefAwards
          chefCertificateType: $chefCertificateType
        }
      }
    ) {
      chefProfileExtended {
        chefAwards
        certificationsTypes {
          nodes {
            certificateTypeId
            certificateTypeName
            certificateTypeDesc
            createdAt
          }
        }
      }
    }
  }
  `

  /*
  {
  "chefProfileExtendedId": "",
  "chefAwards": "",
  "chefCertificateType": ""
} */