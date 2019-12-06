export const updateStatusByReviewIdGQLTAG = `mutation updateStatusByReviewId($pStatusId: String!, $pData: JSON!) {
  updateStatusByReviewId(input: { pStatusId: $pStatusId, pData: $pData }) {
    procedureResult {
      message
      success
    }
  }
}`

/*
{
  "pStatusId": "BLOCKED",
  "pData": "[{\"pId\":\"8393af57-2e32-4140-9d41-53152f09f3c2\",\"pReason\":null},{\"pId\":\"aa75d9fd-0743-432e-bc16-7008a9c6ae9c\",\"pReason\":null}]"
}
*/