export const saveIntroTourGQLTAG = `mutation createQuestionAnswerHistory(
    $questionId: String!
    $questionOptionId: String!
    $chefId: String!
  ) {
    createQuestionAnswerHistory(
      input: {
        questionAnswerHistory: {
          questionId: $questionId
          questionOptionId: $questionOptionId
          chefId: $chefId
        }
      }
    ) {
      questionAnswerHistory {
        questionAnswerHistId
        questionId
        questionOptionId
        chefId
      }
    }
  }
  `;

/*
{
 "questionId":"fb055465-d87e-492e-817b-557817dfc3b2",
 "questionOptionId":"fad72efc-669f-4c9b-b4a7-13ab5826b289",
 "chefId":"07fe580f-416c-4125-b6a3-6a0aa589a1ad"
}
*/