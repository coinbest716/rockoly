export const attachmentGQLTAG = `subscription chefAttachmentProfile($chefId: String!) {
    chefAttachmentProfile(chefId: $chefId) {
      data
    }
  }
  `