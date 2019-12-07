export const cuisineGQLTAG = `query allCuisineTypeMasters {
    allCuisineTypeMasters(
      filter: { isAdminApprovedYn: { eq: true } }
      orderBy: CUSINE_TYPE_NAME_ASC
    ) {
      totalCount
      nodes {
        cuisineTypeId
        cusineTypeName
        cuisineTypeDesc
        isManuallyYn
        chefId
        isAdminApprovedYn
      }
    }
  }
  `;