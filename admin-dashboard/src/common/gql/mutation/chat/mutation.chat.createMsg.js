export const createMsgGQLTAG = `mutation createMessageHistory(
  $fromEntityId: String!
  $conversationHistId: String!
  $msgText: String!
) {
  createMessageHistory(
    input: {
      messageHistory: {
        fromEntityId: $fromEntityId
        conversationHistId: $conversationHistId
        msgText: $msgText
      }
    }
  ) {
    messageHistory {
      messageHistoryId
      fromEntityId
      conversationHistId
      msgText
      fromEntityDetails
      createdAt
    }
  }
}
`

/*{
  "fromEntityId": "",
  "conversationHistId": "",
  "msgText": ""
} */