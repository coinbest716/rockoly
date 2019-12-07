export const updateCuisineTypeGQLTAG = `mutation updateCuisineTypeMasterByCuisineTypeId(
    $cuisineTypeId: String!
    $statusId: String!
  ) {
    updateCuisineTypeMasterByCuisineTypeId(
      input: {
        cuisineTypeId: $cuisineTypeId
        cuisineTypeMasterPatch: { statusId: $statusId }
      }
    ) {
      cuisineTypeMaster {
        statusId
      }
    }
  }
  `

  /*
  {
  "cuisineTypeId": "fec272fd-38e2-42a3-8495-f83fa174eff1",
  "statusId": "APPROVED" / "REJECTED"
} */