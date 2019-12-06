export const messsageHistoryGQLTAG = `subscription messageHistory($conversationHistId:String!){
    messageHistory(conversationHistId:$conversationHistId){
      data
    }
  }`

  