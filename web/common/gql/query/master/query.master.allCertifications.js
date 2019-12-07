export const allCertificateTypeMastersGQLTAG = `query allCertificateTypeMasters {
    allCertificateTypeMasters(orderBy: CREATED_AT_DESC) {
      totalCount
      nodes {
        certificateTypeId
        certificateTypeName
        certificateTypeDesc
        createdAt
      }
    }
  }
  `