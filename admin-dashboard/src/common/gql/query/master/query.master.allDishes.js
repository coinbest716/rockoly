export const allDishesGQLTAG = `query allDishTypeMasters{
    allDishTypeMasters(orderBy: CREATED_AT_DESC) {
      totalCount
      nodes {
        dishTypeId
        dishTypeName
        dishTypeDesc
        isManuallyYn
        isAdminApprovedYn
        chefId
        customerId
        chefProfileByChefId {
          fullName
          chefGender
          chefPicId
        }
        customerProfileByCustomerId {
          fullName
          customerGender
          customerPicId
        }
      }
    }
  }
  `

