export const updateAttachmentGQLTag=`mutation updateChefAttachment(
  $pChefId: String!
  $pAttachmentAreaSection: String!
  $pChefAttachments: JSON!
) {
  updateChefAttachment(
    input: {
      pChefId: $pChefId
      pAttachmentAreaSection: $pAttachmentAreaSection
      pChefAttachments: $pChefAttachments
    }
  ) {
    chefAttachmentProfiles {
      chefId
      chefAttachmentDesc
      chefAttachmentType
      chefAttachmentUrl
      chefAttachmentsAreaSection
    }
  }
}

`;

// pChefAttachments need to passed as json stringify, then only it will work
// pAttachmentType = IMAGE / DOCUMENT /VIDEO
// pAttachmentUrl = firebase image url
// pAttachmentAreaSection = GALLERY/LICENSE/CERTIFICATION/OTHERS
/*
{
  "pChefId": "5d4c99c6-1ff4-4dc3-a4f7-a1afad8af26e",
  "pChefAttachments":"[\n  {\n    \"pAttachmentType\": \"IMAGE\",\n    \"pAttachmentUrl\": \"rffff\",\n     \"pAttachmentAreaSection\": \"LICENCE\"\n   },\n  {\n    \"pAttachmentType\": \"IMAGE\",\n    \"pAttachmentUrl\": \"33333r333\"\n  },\n  {\n    \"pAttachmentType\": \"IMAGE\",\n    \"pAttachmentUrl\": \"vfrvrvrvrv\"\n  },\n  {\n    \"pAttachmentType\": \"IMAGE\",\n    \"pAttachmentUrl\": \"frfrfrfr\"\n  },\n  {\n    \"pAttachmentType\": \"IMAGE\",\n    \"pAttachmentUrl\": \"frfrfrfrf\"\n  }\n]"
}
*/