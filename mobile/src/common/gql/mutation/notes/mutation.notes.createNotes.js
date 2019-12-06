export const createNotesGQLTAG=`mutation createNotesHistory(
    $notesDescription: String!
    $tablePkId: String!
    $chefId: String
    $customerId: String
  ) {
    createNotesHistory(
      input: {
        notesHistory: {
          notesDescription: $notesDescription
          tableName: "chef_booking_history"
          tablePkId: $tablePkId
          chefId: $chefId
          customerId: $customerId
        }
      }
    ) {
      notesHistory {
        notesHistId
        notesDescription
        tableName
        tablePkId
        chefId
        customerId
        createdAt
      }
    }
  }
  `

  /*
  {
  "notesDescription": "Test",
  "tablePkId": "f7e99d4f-f744-42ab-a4c4-ae6b13adb9d4",
  "chefId": "38f3741a-d661-457a-8313-3ea61ca40870"
} */