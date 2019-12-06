export const questionsByAreaTypeGQLTAG = `
    query allQuestionMasters($areaType: String!) {
        allQuestionMasters(
        filter: { questionAreaType: { eq: $areaType } }
        orderBy: QUESTION_ORDER_ASC
        ) {
        totalCount
        nodes {
            questionId
            questionDesc
            questionAreaType
            questionOrder
            questionScreenNo
            questionMode
            questionOptionMastersByQuestionId(orderBy: QUESTION_OPTION_ORDER_ASC) {
            totalCount
            nodes {
                questionOptionId
                questionOptionDesc
                questionOptionOrder
            }
            }
        }
        }
    }  
`;

// Query Variables
/*
{
  "areaType": "CHEF_REGISTER"
}
*/