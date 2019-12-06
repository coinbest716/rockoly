export const allCuisinesGQLTAG = `query allCuisineTypeMasters {
    allCuisineTypeMasters(orderBy: CREATED_AT_DESC) {
      totalCount
      nodes {
        cuisineTypeId
        cusineTypeName
        cuisineTypeDesc
        isManuallyYn
        isAdminApprovedYn
        chefId
        chefProfileByChefId{
          fullName
          chefGender
          chefPicId
        }
      }
    }
  }
  `

