export const kitchenEquipmentsByCustomerIdGQLTAG = `query getKitchenEquipmentTypes($pCustomerId: String) {
  getKitchenEquipmentTypes(pChefId: null, pCustomerId: $pCustomerId) {
    totalCount
    nodes {
      kitchenEquipmentTypeId
      kitchenEquipmentTypeName
      kitchenEquipmentTypeDesc
      createdAt
      updatedAt
      chefId
      customerId
      isManuallyYn
      statusId
    }
  }
}
`
  /**
   {
  "pCustomerId": "db4b6464-196b-47c9-ac8b-8c5d0b9d4da1"
}
   */