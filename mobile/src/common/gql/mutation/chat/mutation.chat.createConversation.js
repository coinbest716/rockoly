export const createConversationGQLTAG = `mutation createConversationHistByParams(
  $pChefId: String!
  $pCustomerId: String!
  $pMsgText: String!
) {
  createConversationHistByParams(
    input: { pChefId: $pChefId, pCustomerId: $pCustomerId, pMsgText: $pMsgText }
  ) {
    conversationHistory {
      conversationHistId
    }
  }
}
`;
