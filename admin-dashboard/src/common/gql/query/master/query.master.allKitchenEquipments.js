export const allKitchenEquipmentsGQLTAG = `query allKitchenEquipmentTypeMasters {
  allKitchenEquipmentTypeMasters(orderBy: CREATED_AT_DESC) {
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

