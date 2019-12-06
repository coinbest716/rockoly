export const dishGQLTAG = `query allDishTypeMasters {
    allDishTypeMasters(
      filter: { isAdminApprovedYn: { eq: true } }
      orderBy: DISH_TYPE_NAME_ASC
    ) {
      totalCount
      nodes {
        dishTypeId
        dishTypeName
        dishTypeDesc
        isManuallyYn
        chefId
      }
    }
  }
  `;
