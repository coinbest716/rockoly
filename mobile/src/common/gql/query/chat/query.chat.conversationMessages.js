export const conversationMessagesGQLTAG = `query allMessageHistories($conversationHistId: String! $first:Int! $offset:Int!) {
  allMessageHistories(
    first:$first
    offset:$offset
    orderBy: CREATED_AT_DESC
    filter: { conversationHistId: { eq: $conversationHistId } }
  ) {
    nodes {
      messageHistoryId
      fromEntityId
      conversationHistId
      msgText
      fromEntityDetails
      createdAt
      msgType
    }
  }
}`

// Query Variables
/*
{
  "conversationHistId": "a6666772-ff7b-41a0-91e8-75ea3d7c5aef"
}
*/