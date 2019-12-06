export const updateDishTypeGQLTAG = `mutation updateDishTypeMasterByDishTypeId(
    $dishTypeId: String!
    $statusId: String!
  ) {
    updateDishTypeMasterByDishTypeId(
      input: {
        dishTypeId: $dishTypeId
        dishTypeMasterPatch: { statusId: $statusId }
      }
    ) {
      dishTypeMaster {
        isAdminApprovedYn
      }
    }
  }
  
    `

    /*
    {
 	"dishTypeId": "",
  "statusId": "APPROVED" / "REJECTED"
} */