export const conversationHistoryGQLTAG = `subscription conversationHistory(
  $tableName: String
  $tablePkId: String
  $tablePkId2: String
) {
  conversationHistory(
    tableName: $tableName
    tablePkId: $tablePkId
    tablePkId2: $tablePkId2
  ) {
    data
  }
}`;
