export const getConversationListGQLTAG = `query getConversationList($pEntityId: String!, $first: Int!, $offset: Int!) {
  getConversationList(pEntityId: $pEntityId, first: $first, offset: $offset) {
    nodes {
      conversationId
      conversationName
      conversationPic
      conversationRefTableName
      conversationRefTablePkId
      conversationDate
      conversationLastMessage
      conversationLastMessageTimestamp
      conversationDetails
    }
  }
}`

  /*
  {
  "pEntityId": "",
  "first": 0,
  "offset":1
} */